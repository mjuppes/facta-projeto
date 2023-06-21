import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import DOMPurify from 'dompurify';
// import MicRecorder from 'mic-recorder-to-mp3';
// import { ReactMic } from 'react-mic';
import {isMobile} from 'react-device-detect';
import AudioRecorder from 'audio-recorder-polyfill';
import LayoutFactaHeader from '../../../LayoutFactaHeader';
import TimelineProgresso from '../../TimelineProgresso';

var testeiOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

if (testeiOS === true) {
  window.MediaRecorder = AudioRecorder;
}
window.AudioContext = window.AudioContext || window.webkitAudioContext;

class Audio extends Component {

  constructor(props) {
    super(props);

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
    this.state = {

      iOS : false,
      record: false,

      isRecording: false,
      gravouAudio: false,
      tipoPendencia: props.tipo,
      audioSize : 0,
      blobURL: '',
      blobAudio: '',
      base64Audio: '',
      base64Ccb: '',
      isBlocked: false,
      codigoAFOriginal: this.props.match.params.propostaId,
      codigoAF: atob(this.props.match.params.propostaId),
      homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      proximoLink: '',
      _scriptAudio: '',
      erroNaGravacao: '',
      srcVideo: '',
      mostraTempo: false,
      recordedChunks: [],
      setRecordedChunks: [],
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      tipoAnaliseAtualizar: 11,
      codigoAtualizacao: 'AD',
      cliente_cpf: '',
      cliente_nascimento: '',


      chunks : [],
      b : '',
      n : ["start", "stop", "pause", "resume"],
      p : ["audio/webm", "audio/ogg", "audio/wav"],
			k : 1024,
			l : 1 << 20,
      audio_mimetype : '',
    };

    // Função para iniciar a gravação
    this.m = this.m.bind(this);
    // Função que finaliza a gravação
    this.w = this.w.bind(this);

    if (this.props.location.state === undefined) {
      if (window.location.href.indexOf("/pendencias-") !== -1) {
        this.props.history.push(this.state.homeLinkPendencias);
      }
      else if (window.location.href.indexOf("/regularizacao-") !== -1) {
        this.props.history.push(this.state.homeLinkRegularizacao);
      }
      else {
        this.props.history.push(this.state.homeLink);
      }
      this.state.obj_proposta = [];
      return false;
    }
    else {

      var _state = this.props.location.state;
      var scriptAudio = '';
      var nomeCliente = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias.CLIENTE.DESCRICAO : _state.obj_proposta.CLIENTE.DESCRICAO;
      var valorProposta = parseFloat(_state.obj_proposta.VLRAF).toLocaleString('pt-BR', formatoValor);
      var numeroPmt = _state.obj_proposta.NUMEROPRESTACAO;
      var valorPmt = parseFloat(_state.obj_proposta.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor);
      var tipoOperacao = _state.obj_proposta.Tipo_Operacao;
      var averbador = _state.obj_proposta.Averbador;

      var _orgao = "INSS";
      if (averbador === 15) {
        _orgao = "SIAPE";
      }
      else if (averbador === 10) {
        _orgao = " do EXÉRCITO";
      }
      else if (averbador === 1) {
        _orgao = " do TESOURO DO ESTADO";
      }
      else if (averbador === 30) {
        _orgao = " do IPÊ";
      }
      else if (averbador === 100) {
        _orgao = " do PODER JUDICIÁRIO";
      }

      this.state.cliente_cpf = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias.CLIENTE.CPF : _state.obj_proposta.CLIENTE.CPF;
      this.state.cliente_nascimento = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias.CLIENTE.DATANASCIMENTO : _state.obj_proposta.CLIENTE.DATANASCIMENTO;

      scriptAudio = 'Eu, <span class="font-weight-bold">' + nomeCliente + '</span>, ';

      if (averbador === 390) {
        scriptAudio += 'confirmo a contratação do ' + ((tipoOperacao === 1 || tipoOperacao === 13) ? 'empréstimo' : 'refinanciamento do meu contrato') + ' <span class="font-weight-bold">FACTA FÁCIL</span> ';
        scriptAudio += 'no valor de <span class="font-weight-bold">' + valorProposta + '</span>, ';
        scriptAudio += 'a ser pago em <span class="font-weight-bold">' + numeroPmt + '</span> parcelas fixas mensais ';
        scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>, ';
        scriptAudio += 'a ' + (numeroPmt > 1 ? 'serem descontadas' : 'ser descontada') + ' em minha <span class="font-weight-bold">conta corrente</span>.';
      }
      else if (averbador === 20095) { // NOVO DIGITAL 

        scriptAudio += 'confirmo a contratação de antecipação de saque aniversário FGTS contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ';
        scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>. ';
      }
      else if (averbador === 1 || averbador === 30 || averbador === 100) {
        scriptAudio += 'confirmo a contratação do empréstimo consignado, ';
        scriptAudio += 'no valor de <span class="font-weight-bold">' + valorProposta + '</span>, ';
        scriptAudio += 'a ser pago em <span class="font-weight-bold">' + numeroPmt + '</span> parcelas fixas mensais ';
        scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>. <br />';
        if ((averbador === 1 || averbador === 30) && tipoOperacao === 13) {
          scriptAudio += 'Necessito do empréstimo com urgência! Assim, me responsabilizo, ';
          scriptAudio += 'exclusivamente, sob as penas da lei, por realizar autenticação de ';
          scriptAudio += 'assinatura da <span class="font-weight-bold">Autorização/Anexo II</span>, <span class="font-weight-bold">Decreto 43.337/2004</span>, ';
          scriptAudio += 'correspondente ao empréstimos ora contratado, e, ';
          scriptAudio += 'entregar para instituição financeira no prazo máximo de <span class="font-weight-bold">15</span> dias.';
        }
        else if (averbador === 1) {
          scriptAudio += 'Necessito do empréstimo com urgência! Assim, me responsabilizo, ';
          scriptAudio += 'exclusivamente, sob as penas da lei, por realizar autenticação de ';
          scriptAudio += 'assinatura da Autorização de Consignação, e, entregar para ';
          scriptAudio += 'instituição financeira no prazo de <span class="font-weight-bold">30</span> dias após diminuição das ';
          scriptAudio += 'restrições de circulação, impostas pelo <span class="font-weight-bold">Decreto 55.240/2020</span>, atualizado.';
        }
      }
      else {
        if (tipoOperacao === 13) { // NOVO DIGITAL
  				scriptAudio += 'confirmo a contratação do empréstimo consignado ' + (averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
  				scriptAudio += 'no valor de <span class="font-weight-bold">' + valorProposta + '</span>, ';
  				scriptAudio += 'a ser pago em <span class="font-weight-bold">' + numeroPmt + '</span> parcelas fixas mensais ';
  				scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>, ';
  				scriptAudio += 'a ' + (numeroPmt > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>';
          scriptAudio += averbador === 1 || averbador === 30 || averbador === 100 ? ', e autorizo a averbação em 120 meses.' : '.';
  			} else if (tipoOperacao === 14 || tipoOperacao === 18) { // REFIN DIGITAL / REFIN DA PORT DIGITAL
  				scriptAudio += 'confirmo a contratação de refinanciamento do meu empréstimo consignado ' + (averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
  				scriptAudio += 'no valor de <span class="font-weight-bold">' + valorProposta + '</span>, ';
  				scriptAudio += 'a ser pago em <span class="font-weight-bold">' + numeroPmt + '</span> parcelas fixas mensais ';
  				scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>, ';
  				scriptAudio += 'a ' + (numeroPmt > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>';
          scriptAudio += averbador === 1 || averbador === 30 || averbador === 100 ? ', e autorizo a averbação em 120 meses.' : '.';
  			} else if (tipoOperacao === 17) { // PORTABILIDADE CIP
  				scriptAudio += 'confirmo a contratação de portabilidade de crédito do meu empréstimo consignado ' + (averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
  				scriptAudio += 'de número <span class="font-weight-bold">' + _state.obj_proposta.DADOSPORTABILIDADE.contrato + '</span>, ';
  				scriptAudio += 'para a <span class="font-weight-bold">FACTA FINANCEIRA</span>.';
  			} else if (tipoOperacao === 28) { // PORTABILIDADE MANUAL
  				scriptAudio += 'confirmo a contratação de empréstimo consignado ' + (averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
  				scriptAudio += 'no valor de <span class="font-weight-bold">' + valorProposta + '</span>, ';
  				scriptAudio += 'a ser pago em <span class="font-weight-bold">' + numeroPmt + '</span> parcelas fixas mensais ';
  				scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>, ';
  				scriptAudio += 'a ' + (numeroPmt > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>.';
  			} else if (tipoOperacao === 11) { // CARTÃO DIGITAL
  				scriptAudio += 'confirmo a contratação de cartão consignado ' + (averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
  				scriptAudio += 'com saque de <span class="font-weight-bold">' + valorProposta + '</span>, ';
  				scriptAudio += 'a ser pago em <span class="font-weight-bold">' + numeroPmt + '</span> parcelas fixas mensais ';
  				scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>, ';
  				scriptAudio += 'a ' + (numeroPmt > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>.';
        }  else if (tipoOperacao === 29) { // REFIN CARTÃO DIGITAL
          scriptAudio += 'confirmo a contratação de refianciamento de cartão consignado ' +  'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ';
          scriptAudio += 'com saque de <span class="font-weight-bold">' + valorProposta + '</span>, ';
          scriptAudio += 'a ser pago em <span class="font-weight-bold">' + numeroPmt  + '</span> parcelas fixas mensais ';
          scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>, ';
          scriptAudio += 'a ' + (numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>.';
        } else {
  				scriptAudio += 'confirmo a contratação do empréstimo <span class="font-weight-bold">CONSIGNADO</span> ';
  				scriptAudio += 'no valor de <span class="font-weight-bold">' + valorProposta + '</span>, ';
  				scriptAudio += 'em <span class="font-weight-bold">' + numeroPmt + '</span> parcelas fixas mensais ';
  				scriptAudio += 'de <span class="font-weight-bold">' + valorPmt + '</span>, ';
  				scriptAudio += 'a ' + (numeroPmt > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>.';
  			}

        if (averbador === 10) {
          scriptAudio += 'Declaro ainda estar ciente de que não é necessário efetuar depósitos na conta do corretor antes de receber o empréstimo';
        }

      }

      if (_state.obj_proposta.PROPOSTA_VINCULADA !== undefined) {
        var propostaAumentoMargem = false;
        for (var key in _state.obj_proposta.PROPOSTA_VINCULADA) {
            if (!_state.obj_proposta.PROPOSTA_VINCULADA.hasOwnProperty(key)) continue;
            var obj = _state.obj_proposta.PROPOSTA_VINCULADA[key];
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) continue;
                if (prop === "Tipo_Operacao" && obj[prop] === 27) {
                  propostaAumentoMargem = true;
                }
            }
        }

        if (propostaAumentoMargem === true) {
          scriptAudio += '<br />Solicito também a contratação de proposta de aumento de margem utilizando até 35% de minha margem.';
        }

      }

      this.state._scriptAudio = scriptAudio;

      this.state.obj_proposta = _state.obj_proposta;

      this.state.dataHoraPrimeiraTela = _state.dataHoraPrimeiraTela;
      this.state.dataHoraTermo = _state.dataHoraTermo;
      this.state.dataHoraCcb = _state.dataHoraCcb;

      this.state.geoInicial = _state.geoInicial;
      this.state.geoTermo = _state.geoTermo;
      this.state.geoCcb = _state.geoCcb;

      this.state.fotoDocumentoFrente = _state.fotoDocumentoFrente !== undefined ? _state.fotoDocumentoFrente : '';
      this.state.fotoDocumentoVerso = _state.fotoDocumentoVerso !== undefined ? _state.fotoDocumentoVerso : '';

      this.state.fotoExtrato = _state.fotoExtrato !== undefined ? _state.fotoExtrato : '';
      this.state.fotoRenda   = _state.fotoRenda !== undefined   ? _state.fotoRenda   : '';
      this.state.fotoOptante = _state.fotoOptante !== undefined ? _state.fotoOptante : '';

      this.state.consultaDataprev_opcao = _state.aceitouConsultaDataprev !== undefined ? _state.aceitouConsultaDataprev : '';
      this.state.consultaDataprev_datahora = _state.dataHoraAceitouDataprev !== undefined ? _state.dataHoraAceitouDataprev : '';

      this.state.aberturaDeConta_opcao = _state.aceitouConta !== undefined ? _state.aceitouConta : '';
      this.state.aberturaDeConta_datahora = _state.dataHoraAceitouConta !== undefined ? _state.dataHoraAceitouConta : '';

      this.state.valorSeguro_opcao = _state.aceitouSeguro !== undefined ? _state.aceitouSeguro : '';
      this.state.valorSeguro_datahora = _state.dataHoraAceitouSeguro !== undefined ? _state.dataHoraAceitouSeguro : '';

      this.state.contaQuitacao_opcao = _state.aceitouAutBoletos !== undefined ? _state.aceitouAutBoletos : '';
      this.state.contaQuitacao_datahora = _state.dataHoraAceitouAutBoletos !== undefined ? _state.dataHoraAceitouAutBoletos : '';

      this.state.contaTransferencias_opcao = _state.aceitouAutTransferencia !== undefined ? _state.aceitouAutTransferencia : '';
      this.state.contaTransferencias_datahora = _state.dataHoraAceitouAutTransferencia !== undefined ? _state.dataHoraAceitouAutTransferencia : '';

      this.state.aceitouDebitoEmConta = _state.aceitouDebitoEmConta !== undefined ? _state.aceitouDebitoEmConta : '';
      this.state.dataHoraAceitouDebitoEmConta = _state.dataHoraAceitouDebitoEmConta !== undefined ? _state.dataHoraAceitouDebitoEmConta : '';

      this.state.base64SelfieIni = _state.base64SelfieIni;
      this.state.base64SelfieDir = _state.base64SelfieDir;
      this.state.base64SelfieEsq = _state.base64SelfieEsq;
      this.state.base64SelfieFim = _state.base64SelfieFim;

      this.state.base64Ccb = _state.base64Ccb;

      this.state.obj_pendencias = _state.obj_pendencias;

      this.state.tipoAnaliseAtualizar = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias.statusOcorrenciaAtualizar : this.state.tipoAnaliseAtualizar;
      this.state.codigoAtualizacao = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? 'AD3' : this.state.codigoAtualizacao;

    }

    this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;

  }

  TrackAudio = (element) => {
    var curTime = Math.floor(element.currentTime);
    console.log(curTime)   //Value in seconds.
  }

  // Função para ver o tamanho do arquivo de áudio
	q = (e) => {
		var r, $ = Math.abs(e);
		return $ >= this.state.l ? (r = "MB", e /= this.state.l) : $ >= this.state.k ? (r = "KB", e /= this.state.k) : r = "B", e.toFixed(0).replace(/(?:\.0*|(\.[^0]+)0+)$/, "$1") + " " + r
	}


	m(e){

		this.state.chunks = [];
    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    this.state.iOS = iOS;
    this.setState({ record : true, blobURL : '', blobAudio : '', gravouAudio : false });
    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia);

    if (this.state.iOS === true){

      navigator.mediaDevices.getUserMedia({ audio: true, video : false })
      .then(
        // On Success
        function(r) {
          this.state.b = new window.MediaRecorder(r);
          this.state.isRecording = true;
          // Enquanto tiver data disponível vai jogando no array chunks
          this.state.b.addEventListener('dataavailable', function(e) {
            this.state.chunks.push(e.data);
            this.setState({ audio_mimetype : e.data.type });
          }.bind(this));
          // Quando der stop, grava em um blob o chunks
          this.state.b.addEventListener('stop', function(e) {
            var blob = new Blob(this.state.chunks, { 'type' : this.state.audio_mimetype });
            var blobURL = URL.createObjectURL(blob);
            this.setState({ blobURL : blobURL, blobAudio : blob, gravouAudio : true, isRecording : false, audioSize : (blob.size / 1024) });
          }.bind(this));
          this.state.b.start();
    		}.bind(this)
      )
      .catch(
        // On Error
        function(err) {
    			console.log(err);
    			if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
    				//required track is missing
    				alert("Dispositivo de gravação não detectado!");
    			} else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
    				//webcam or mic are already in use
    				alert("Dispositivo de gravação já está sendo usado!");
    			} else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
    				//constraints can not be satisfied by avb. devices
    				alert("Erro na gravação! (2253)");
    			} else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
    				//permission denied in browser
    				alert("A permissão de acesso ao microfone foi negada! Você precisa autorizar para que possamos gravar o áudio.");
    			} else if (err.name === "TypeError" || err.name === "TypeError") {
    				//empty constraints object
    				alert("Erro na gravação! ("+err.message+")");
    			} else {
    				//other errors
    				alert("Erro na gravação! ("+err.message+")");
    			}
  	    }
      );
    }
    else {
      navigator.getUserMedia(
        // Options
        { audio: !0 },
        // On Success
        function(r) {
          this.state.b = new MediaRecorder(r);
          this.state.isRecording = true;
          // Enquanto tiver data disponível vai jogando no array chunks
          this.state.b.addEventListener('dataavailable', function(e) {
            this.state.chunks.push(e.data);
            this.setState({ audio_mimetype : e.data.type });
          }.bind(this));
          // Quando der stop, grava em um blob o chunks
          this.state.b.addEventListener('stop', function(e) {
            var blob = new Blob(this.state.chunks, { 'type' : this.state.audio_mimetype });
            var blobURL = URL.createObjectURL(blob);
            this.setState({ blobURL : blobURL, blobAudio : blob, gravouAudio : true, isRecording : false, audioSize : (blob.size / 1024) });
          }.bind(this));
          this.state.b.start();

        }.bind(this),
        // On Error
        function(err) {
          console.log(err);
          if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            //required track is missing
            alert("Dispositivo de gravação não detectado!");
          } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
            //webcam or mic are already in use
            alert("Dispositivo de gravação já está sendo usado!");
          } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
            //constraints can not be satisfied by avb. devices
            alert("Erro na gravação! (2253)");
          } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            //permission denied in browser
            alert("A permissão de acesso ao microfone foi negada! Você precisa autorizar para que possamos gravar o áudio.");
          } else if (err.name === "TypeError" || err.name === "TypeError") {
            //empty constraints object
            alert("Erro na gravação! (2259)");
          } else {
            //other errors
            alert("Erro na gravação! (2262)");
          }
        }
      );
    }

	}

  // Stop
	s = () => {
		this.state.b.stop();
    if (this.state.iOS === true) {
      this.state.b.stream.getTracks().forEach((s) => {s.stop();});
    }
    else {
      this.state.b.stream.getTracks()[0].stop();
    }
    this.setState({ record : false });
	}

	t = () => {
		this.state.b.pause(); //, f.blur()
	}

	u = () => {
		this.state.b.resume(); //, g.blur()
	}

	v = () => {
		this.state.b.requestData(); //, i.blur()
	}

  // Stop
	w = (e) => {
		this.state.chunks.push(e.data);
		const blob = new Blob(this.state.chunks, { 'type' :  e.data.type });
    this.state.blobURL = URL.createObjectURL(e.data);
	}

  componentDidMount() {
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
    if (!navigator.mediaDevices){
      navigator.mediaDevices = navigator;
    }
  }

  startRecording = () => {
    //this.setState({ record: true });
  }

  stopRecording = () => {
    //this.setState({ record: false });
  }

  start = () => {

    if (navigator.mediaDevices){
      navigator.mediaDevices.getUserMedia({ audio: true },
        () => {
          console.log('Permission Granted');
          this.setState({ isBlocked: false });
        },
        () => {
          console.log('Permission Denied');
          this.setState({ isBlocked: true })
        },
      );
    }
    else{
      navigator.getUserMedia({ audio: true },
        () => {
          console.log('Permission Granted');
          this.setState({ isBlocked: false });
        },
        () => {
          console.log('Permission Denied');
          this.setState({ isBlocked: true })
        },
      );
    }


    if (this.state.isBlocked) {
      console.log('Permission Denied');
      alert('Você não habilitou a permissão de gravação para a aplicação.');
    } else {

    }
  };

  stop = () => {
    this.setState({blobAudio : ''});
  };

  deletar = () => {
    this.setState({gravouAudio : false, blobAudio : '', blobURL : ''});
  };

  _finalizaFormalizacao = async () => {

    if (this.state.audioSize < 5) {
      alert("Áudio muito pequeno! Verifique se você gravou o áudio conforme o texto descrito.");
      return false;
    }

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    var averbador = parseInt(this.state.obj_proposta.Averbador);
    this.setState({ carregando: true });

    if (this.state.fotoDocumentoFrente !== '' && this.state.fotoDocumentoFrente !== undefined) {
        const blob_fotoDocumentoFrente = await fetch(this.state.fotoDocumentoFrente).then(res => res.blob());
        formData.append('fotoDocumentoFrente', blob_fotoDocumentoFrente);
    }

    if (this.state.fotoDocumentoVerso !== '' && this.state.fotoDocumentoVerso !== undefined) {
      const blob_fotoDocumentoVerso = await fetch(this.state.fotoDocumentoVerso).then(res => res.blob());
      formData.append('fotoDocumentoVerso', blob_fotoDocumentoVerso);
    }

    if (this.state.fotoExtrato !== '' && this.state.fotoExtrato !== undefined) {
      const blob_fotoExtrato = await fetch(this.state.fotoExtrato).then(res => res.blob());
      if (averbador === 10) {
        formData.append('fotoCompResidencia', blob_fotoExtrato);
      }
      else {
        formData.append('fotoExtrato', blob_fotoExtrato);
      }
    }

    if (this.state.fotoRenda !== '' && this.state.fotoRenda !== undefined) {
      const blob_fotoRenda = await fetch(this.state.fotoRenda).then(res => res.blob());
      formData.append('fotoCompRenda', blob_fotoRenda);
    }

    if (this.state.fotoOptante !== '' && this.state.fotoOptante !== undefined) {
      const blob_fotoOptante = await fetch(this.state.fotoOptante).then(res => res.blob());
      if (averbador === 10 || averbador === 15) {
        formData.append('fotoCCH', blob_fotoOptante);
      }
      else {
        formData.append('fotoOptante', blob_fotoOptante);
      }
    }

    if (this.state.base64SelfieIni !== '' && this.state.base64SelfieIni !== undefined) {
      const blob_base64SelfieIni = await fetch(this.state.base64SelfieIni).then(res => res.blob());
      formData.append('SelfieIni', blob_base64SelfieIni);
    }

    if (this.state.base64SelfieDir !== '' && this.state.base64SelfieDir !== undefined) {
      const blob_base64SelfieDir = await fetch(this.state.base64SelfieDir).then(res => res.blob());
      formData.append('SelfieDir', blob_base64SelfieDir);
    }

    if (this.state.base64SelfieEsq !== '' && this.state.base64SelfieEsq !== undefined) {
      const blob_base64SelfieEsq = await fetch(this.state.base64SelfieEsq).then(res => res.blob());
      formData.append('SelfieEsq', blob_base64SelfieEsq);
    }

    if (this.state.base64SelfieFim !== '' && this.state.base64SelfieFim !== undefined) {
      const blob_base64SelfieFim = await fetch(this.state.base64SelfieFim).then(res => res.blob());
      formData.append('SelfieFim', blob_base64SelfieFim);
    }

    if (this.state.base64Ccb !== '' && this.state.base64Ccb !== undefined) {
      const blob_base64PrintCcb = await fetch(this.state.base64Ccb).then(res => res.blob());
      formData.append('PrintCCB', blob_base64PrintCcb);
    }

    var print_1 = localStorage.getItem('@app-factafinanceira-formalizacao/print_ccb_1');
    if (print_1 !== '' && print_1 !== undefined) {
      const blob_base64PrintCcb = await fetch(print_1).then(res => res.blob());
      formData.append('PrintCCB_1', blob_base64PrintCcb);
      localStorage.removeItem('@app-factafinanceira-formalizacao/print_ccb_1');
    }

    var print_2 = localStorage.getItem('@app-factafinanceira-formalizacao/print_ccb_2');
    if (print_2 !== '' && print_2 !== undefined) {
      const blob_base64PrintCcb = await fetch(print_2).then(res => res.blob());
      formData.append('PrintCCB_2', blob_base64PrintCcb);
      localStorage.removeItem('@app-factafinanceira-formalizacao/print_ccb_2');
    }

    if (this.state.blobAudio !== '' && this.state.blobAudio !== undefined) {
      formData.append('AUDIO', this.state.blobAudio);
    }

    let LOCALIZACOES = "";

    formData.set('proposta', atob(this.state.codigoAFOriginal));

    formData.set('termo_datahora', this.state.dataHoraTermo);
    formData.set('termo_localizacao', this.state.geoTermo);

    LOCALIZACOES += "\r\nTERMO\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraTermo !== undefined && this.state.dataHoraTermo !== "" ? this.state.dataHoraTermo : "-") +"\r\n";
    LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoTermo !== undefined && this.state.geoTermo !== "" ? this.state.geoTermo : "-") +"\r\n";

    formData.set('ccb_datahora', this.state.dataHoraCcb);
    formData.set('ccb_localizacao', this.state.geoCcb);

    LOCALIZACOES += "\r\nCCB\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraCcb !== undefined && this.state.dataHoraCcb !== "" ? this.state.dataHoraCcb : "-") +"\r\n";
    LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";

    formData.set('assinatura_datahora', [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'));
    formData.set('assinatura_localizacao', this.state.geoCcb);

    LOCALIZACOES += "\r\nASSINATURA\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':') +"\r\n";
    LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";

    if (this.state.consultaDataprev_opcao !== undefined && this.state.consultaDataprev_opcao !== '') {
      formData.set('consultaDataprev_opcao', this.state.consultaDataprev_opcao !== undefined ? (this.state.consultaDataprev_opcao === true ? "S" : "N") : "");
      formData.set('consultaDataprev_datahora', this.state.consultaDataprev_datahora);

      LOCALIZACOES += "\r\nCONSULTA DATAPREV\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.consultaDataprev_datahora !== undefined && this.state.consultaDataprev_datahora !== "" ? this.state.consultaDataprev_datahora : "-") +"\r\n";
      LOCALIZACOES += "\r\nACEITOU: "+ (this.state.consultaDataprev_opcao !== undefined ? (this.state.consultaDataprev_opcao === true ? "S" : "N") : "-") +"\r\n";
    }

    if (this.state.aberturaDeConta_opcao !== undefined && this.state.aberturaDeConta_opcao !== '') {
      formData.set('aberturaDeConta_opcao', this.state.aberturaDeConta_opcao !== undefined ? (this.state.aberturaDeConta_opcao === true ? "S" : "N") : "");
      formData.set('aberturaDeConta_datahora', this.state.aberturaDeConta_datahora);

      LOCALIZACOES += "\r\nABERTURA DE CONTA\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.aberturaDeConta_datahora !== undefined && this.state.aberturaDeConta_datahora !== "" ? this.state.aberturaDeConta_datahora : "-") +"\r\n";
      LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aberturaDeConta_opcao !== undefined ? (this.state.aberturaDeConta_opcao === true ? "S" : "N") : "-") +"\r\n";
    }

    if (this.state.valorSeguro_opcao !== undefined && this.state.valorSeguro_opcao !== '') {
      formData.set('valorSeguro_opcao', this.state.valorSeguro_opcao !== undefined ? (this.state.valorSeguro_opcao === true ? "S" : "N") : "");
      formData.set('valorSeguro_datahora', this.state.valorSeguro_datahora);

      LOCALIZACOES += "\r\nSEGURO\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.valorSeguro_datahora !== undefined && this.state.valorSeguro_datahora !== "" ? this.state.valorSeguro_datahora : "-") +"\r\n";
      LOCALIZACOES += "\r\nACEITOU: "+ (this.state.valorSeguro_opcao !== undefined ? (this.state.valorSeguro_opcao === true ? "S" : "N") : "-") +"\r\n";
    }

    if (this.state.contaQuitacao_opcao !== undefined && this.state.contaQuitacao_opcao !== '') {
      formData.set('contaQuitacao_opcao', this.state.contaQuitacao_opcao !== undefined ? (this.state.contaQuitacao_opcao === true ? "S" : "N") : "");
      formData.set('contaQuitacao_datahora', this.state.contaQuitacao_datahora);

      LOCALIZACOES += "\r\nQUITAÇÃO\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.contaQuitacao_datahora !== undefined && this.state.contaQuitacao_datahora !== "" ? this.state.contaQuitacao_datahora : "-") +"\r\n";
      LOCALIZACOES += "\r\nACEITOU: "+ (this.state.contaQuitacao_opcao !== undefined ? (this.state.contaQuitacao_opcao === true ? "S" : "N") : "-") +"\r\n";
    }

    if (this.state.contaTransferencias_opcao !== undefined && this.state.contaTransferencias_opcao !== '') {
      formData.set('contaTransferencias_opcao', this.state.contaTransferencias_opcao !== undefined ? (this.state.contaTransferencias_opcao === true ? "S" : "N") : "");
      formData.set('contaTransferencias_datahora', this.state.contaTransferencias_datahora);

      LOCALIZACOES += "\r\nTRANSFERÊNCIAS\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.contaTransferencias_datahora !== undefined && this.state.contaTransferencias_datahora !== "" ? this.state.contaTransferencias_datahora : "-") +"\r\n";
      LOCALIZACOES += "\r\nACEITOU: "+ (this.state.contaTransferencias_opcao !== undefined ? (this.state.contaTransferencias_opcao === true ? "S" : "N") : "-") +"\r\n";
    }

    if (this.state.aceitouDebitoEmConta !== undefined && this.state.aceitouDebitoEmConta !== '') {
      formData.set('aceite_debito_conta_opcao', this.state.aceitouDebitoEmConta !== undefined ? (this.state.aceitouDebitoEmConta === true ? "S" : "N") : "");
      formData.set('debito_conta_datahora', this.state.dataHoraAceitouDebitoEmConta);

      LOCALIZACOES += "\r\nAUTORIZAÇÃO DEB. CONTA\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraAceitouDebitoEmConta !== undefined && this.state.dataHoraAceitouDebitoEmConta !== "" ? this.state.dataHoraAceitouDebitoEmConta : "-") +"\r\n";
      LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aceitouDebitoEmConta !== undefined ? (this.state.aceitouDebitoEmConta === true ? "S" : "N") : "-") +"\r\n";
    }

    formData.set('codigoAtualizacao', this.state.codigoAtualizacao);
    formData.set('statusOcorrenciaAtualizar', this.state.tipoAnaliseAtualizar);

    formData.set('cliente_cpf', this.state.cliente_cpf);
    formData.set('cliente_nascimento', this.state.cliente_nascimento);

    var informacoesDoDispositivo = "";
    if (this.state.tipoPendencia !== "normal" && this.state.obj_pendencias !== undefined && this.state.obj_pendencias !== []) {
      informacoesDoDispositivo += "\r\nRESOLUÇÃO DE PENDÊNCIAS\r\n\r\n";
      formData.set('resolucaoPendencias', 1);
      formData.set('gerarNovaCcb', this.state.obj_pendencias.pendencia_de_valores === true ? 1 : 0);
    }
    else {
      formData.set('resolucaoPendencias', 0);
      formData.set('gerarNovaCcb', true);
    }

    informacoesDoDispositivo += "\r\nTipo de Formalização: "+ (this.state.obj_proposta.codigotabela === "DIG" ? "Não Presencial" : "Presencial") +"\r\n\r\n";
    informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
    informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
    informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
    informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
    informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;
    informacoesDoDispositivo += LOCALIZACOES;

    formData.set('infoDoDispositivo', informacoesDoDispositivo);

    if (averbador === 1) {
      var cidade_cartorio = localStorage.getItem('@app-factafinanceira-formalizacao/dados_cartorio/cidade_cartorio');
      var nome_cartorio = localStorage.getItem('@app-factafinanceira-formalizacao/dados_cartorio/nome_cartorio');
      formData.set('cidade_cartorio', cidade_cartorio);
      formData.set('nome_cartorio', nome_cartorio);
    }

    // var erroPrintCCB = localStorage.getItem('@app-factafinanceira-formalizacao/dados_ccb/erro');
    // if (erroPrintCCB !== undefined) {
    //     formData.set('erro_print_ccb', erroPrintCCB);
    // }

    var htmlCCB = localStorage.getItem('@app-factafinanceira-formalizacao/dados_html_ccb');
    if (htmlCCB !== undefined && htmlCCB !== null) {
        formData.set('print_ccb_html', htmlCCB);
    }

    formData.set('ambiente', "prod");

    await axios({
      method: 'post',
      //url: 'https://app.factafinanceira.com.br/proposta/app_react_atualizar_formalizacao',
      url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data' }
    })
    .then(function (response) {
        this.setState({ carregando: false });
        alert("Proposta formalizada com sucesso!");
        this.props.history.push(this.state.proximoLink);
    }.bind(this))
    .catch(function (response) {
        //handle error
        this.setState({ carregando: false });
        alert("Erro ao realizar a formalização!");
    }.bind(this));

    return false;

  }

  render() {
    const appHeightAuto = {
      "height": "auto"
    };
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px'
    };

    return (
      <div className="app align-items-center" style={appHeightAuto} >

      { this.state.carregando
        ? (
          <>
            <Container className="flex-row align-items-center m-auto">
              <Row className="text-center">
                <Col md="12" lg="12" xl="12">
                  <div className="spinner-border text-info">
                    <span className="sr-only">Carregando...</span>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        )
        : <>
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
              <LayoutFactaHeader />
              <Row className="mt-6">
                { isMobile === false
                  ? <>
                      <Col md="5" style={{ 'position' : 'relative' }}>
                          <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                          <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                          <TimelineProgresso
                            bemvindo="fa fa-check-square-o text-success"
                            uso="fa fa-check-square-o text-success"
                            proposta="fa fa-check-square-o text-success"
                            residencia="fa fa-check-square-o text-success"
                            fotos="fa fa-check-square-o text-success"
                            audio="fa fa-square-o"
                          />
                      </Col>
                    </>
                  : null
                }
                <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody>

                      <Row>
                        <Col md="12" lg="12" xl="12">
                          <h5 className="text-center mb-3 font-weight-bold">Confirmação por Áudio</h5>
                          <p className="text-left"><i className="fa fa-microphone fa-lg mr-2 text-success"></i> Agora vamos precisar que você grave um áudio confirmando o contrato.</p>
        									<p className="text-left"><i className="fa fa-lightbulb-o fa-lg mr-2 text-success"></i> Fale próximo ao microfone.</p>
        									<p className="text-left"><i className="fa fa-lightbulb-o fa-lg mr-2 text-success"></i> Fale pausadamente.</p>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12" lg="12" xl="12">
                          <p className="text-justify border border-light p-3" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state._scriptAudio)}}></p>
                        </Col>
                      </Row>
                      <Row>
                        { this.state.isRecording
                          ? <Col className="text-center" md="12" lg="12" xl="12">
                              Gravando
                            </Col>
                          : null
                        }
                        { this.state.blobURL !== ''
                          ? <>
                              <Col md="12" lg="12" xl="12" >
                                <audio id="audioPlayer" className="w-75" src={this.state.blobURL} controls="controls"/>
                              </Col>
                            </>
                          : null
                        }
                      </Row>

                      <Row className="mt-3">
                        <Col md="12" lg="12" xl="12" sm="12" xs="12" className="text-center" style={{'display' : this.state.blobURL ? 'none' : (this.state.record ? 'none' : 'block') }}>
                          <Button color="outline-success" size="lg" className="rounded-circle" style={{'width' : '96px', 'height' : '96px'}} onClick={ () => {this.m(null)} } disabled={this.state.record}>
                            <i className="fa fa-microphone fa-lg m-0" style={{'fontSize' : '36px'}}></i>
                          </Button>
                        </Col>
                        <Col md="12" lg="12" xl="12" sm="12" xs="12" className="text-center" style={{'display' : this.state.blobURL ? 'none' : (!this.state.record ? 'none' : 'block') }}>
                          <Button color="outline-danger" size="lg" className="rounded-circle" style={{'width' : '96px', 'height' : '96px'}} onClick={ () => {this.s()} } disabled={!this.state.record}>
                            <i className="fa fa-microphone-slash fa-lg m-0" style={{'fontSize' : '36px'}}></i>
                          </Button>
                        </Col>
                        <Col md="12" lg="12" xl="12" sm="12" xs="12" className="text-center" style={{'display' : !this.state.blobURL ? 'none' : 'block' }}>
                          <Button color="outline-info" size="lg" className="rounded-circle" style={{'width' : '96px', 'height' : '96px'}} onClick={this.deletar} disabled={!this.state.blobURL}>
                            <i className="fa fa-trash fa-lg m-0" style={{'fontSize' : '36px'}}></i>
                          </Button>
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                          <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this._finalizaFormalizacao } disabled={this.state.gravouAudio === false ? 'disabled' : null}>
                              Confirmar a assinatura
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </>
      }
      </div>
    );
  }
}

export default Audio;
