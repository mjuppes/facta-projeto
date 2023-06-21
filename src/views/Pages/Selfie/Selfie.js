import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import MediaCapturer from 'react-multimedia-capture';
import {isMobile} from 'react-device-detect';
//import Camera, { FACING_MODES } from 'react-html5-camera-photo';

import CameraFaceAPI from '../Camera/Camera';
import 'react-html5-camera-photo/build/css/index.css';
import '../../../scss/fotos.css';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import TimelineProgresso from '../../TimelineProgresso';

/** Integração com API OITI **/
import axios from 'axios';
import CryptoJS from 'crypto-js';
import md5 from 'md5';

//const URL_FACE = 'https://comercial.certiface.com.br:443/facecaptcha/service';

const URL_FACE = 'https://certiface.com.br:443/facecaptcha/service';
const URL_API = 'https://app.factafinanceira.com.br/api';
const qs = require('querystring');

let fcvarIntervalChallege = "";
let _fcvarSnaps = "";
let coigo_retorno = "";

let dia = new Date().getDate();
dia = ("0" + dia).slice(-2);
let mes = new Date().getMonth()+1;
mes = ("0" + mes).slice(-2);
let ano = new Date().getFullYear();

let token_face = md5('api_fac_' + ano + '-' + mes + '-' + dia);
let snapImagem = [];
/**************/

class Selfie extends Component {

  constructor(props) {

    super(props);
    this.state = {
      timeout: 300,
      tipoPendencia: props.tipo,
      exibeCamera: false,
      etapa: 'instrucao',
      dataUriFrente: '',
      carregando: false,
      clicouInicio: false,
      modalOk: false,
      clicouModalInfo: false,

      modalDados: false,

      contaTentativasSelfie : 0,
      int_averbador : 0,

      codigoAFOriginal: this.props.match.params.propostaId,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      proximoLink: '',

      base64Video: '',
      base64VideoURL: '',
      base64Ccb: '',

      base64SelfieIni: '', //aqui
      base64SelfieDir: '',
      base64SelfieEsq: '',
      base64SelfieFim: '', //aqui

      erroNaGravacao: '',

      contador: 0,
      contadorParado: 5,
      contadorFotos: 60,

      srcVideo: '',

      base64SelfieFotos: [],

      capturing: false,
      setCapturing: false,

      mostraTempo: false,
      recordedChunks: [],
      setRecordedChunks: [],

      videoAtivo: true,

      audioSrc: '',

      granted: false,
			rejectedReason: '',
			recording: false,
			paused: false,
      permissaoVideo: true,
      exibeVideo: false,
      liberaBotaoInstrucao: true,

      widthVideo: '',
      heightVideo: '',
      propostaSelfie: false,
      labelBotao: '',
      textoDigPre: '',

      aceitouSeguro: '',
      dataHoraAceitouSeguro: '',

      aceitouConta: '',
      dataHoraAceitouConta: '',

      aceitouConsultaDataprev: '',
      dataHoraAceitouDataprev: '',

      aceitouAutTransferencia: '',
      dataHoraAceitouAutTransferencia: '',

      aceitouAutBoletos: '',
      dataHoraAceitouAutBoletos: '',

      exibePreview: false,

      posicaoX: 0,

      tipoAnaliseAtualizar: 11,
      codigoAtualizacao: 'AD',

      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      propostaPendente: false,
      propostaFinaliza: true,
      cliente_cpf: '',
      cliente_nascimento: '',
      cameraDisponivel: true,
      corretoresRosa: [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760],

      selfieEtapa_1_Status: '',
      selfieEtapa_2_Status: '',

      /* Integração API OITI */
      cpf: '',
      nome : '',
      nascimento : '',
      image : null,
      canContinue: true,
      fcvarFirstSnap : '',
      imgChallenge : '',
      imgMsg : '',
      fcvarSnaps : '',
      carregando: false,
      buttonIni: false,
      erroAPI : false,
      gravaAudio : false,

      iOS: false,
      logTeste : '- LOG -',
      tipoOperacaoOiti : 'liveness+biometria',
      mensagemErroUnico : '',
      passouPelaOITI : false,
      responseOITI : []
    };

    this.toggleDanger = this.toggleDanger.bind(this);
    this.toggleInfoInicial = this.toggleInfoInicial.bind(this);
    this.toggleOk = this.toggleOk.bind(this);

    this.handleRequest = this.handleRequest.bind(this);
		this.handleGranted = this.handleGranted.bind(this);
		this.handleDenied = this.handleDenied.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleStop = this.handleStop.bind(this);
		this.handlePause = this.handlePause.bind(this);
		this.handleResume = this.handleResume.bind(this);
		this.handleStreamClose = this.handleStreamClose.bind(this);
		this.setStreamToVideo = this.setStreamToVideo.bind(this);
		this.releaseStreamFromVideo = this.releaseStreamFromVideo.bind(this);
		this.downloadVideo = this.downloadVideo.bind(this);
    this.carregouVideo = this.carregouVideo.bind(this);

    this._finalizaFormalizacao = this._finalizaFormalizacao.bind(this);

    this.video = React.createRef();

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

      var _nav = this.props.location.state;

      if (_nav.obj_pendencias !== undefined && _nav.obj_pendencias !== [] && _nav.obj_pendencias.CLIENTE !== undefined &&_nav.obj_pendencias.CLIENTE !== [] && _nav.obj_pendencias.CLIENTE.DESCRICAO !== undefined) {
        _nav.obj_proposta.CLIENTE = _nav.obj_pendencias.CLIENTE;
      }

    
      let excecao_inss = []
      
      _nav.obj_proposta.EXCECAO_INSS.map(function(num) {
        excecao_inss.push(num.corretor.toString());
      });




      this.state.nome = _nav.obj_proposta.CLIENTE.DESCRICAO;
      this.state.cpf = _nav.obj_proposta.CLIENTE.CPF;
      this.state.nascimento = _nav.obj_proposta.CLIENTE.DATANASCIMENTO.substr(0, 10).split('-').reverse().join('/');

      this.state.obj_proposta = _nav.obj_proposta;



      if (_nav.obj_proposta.OPERACAOOITI !== undefined && _nav.obj_proposta.OPERACAOOITI.operacao !== undefined) {
        this.state.tipoOperacaoOiti = _nav.obj_proposta.OPERACAOOITI.operacao;
      }

      this.state.dataHoraPrimeiraTela = _nav.dataHoraPrimeiraTela;
      this.state.dataHoraTermo = _nav.dataHoraTermo;
      this.state.dataHoraCcb = _nav.dataHoraCcb;

      this.state.geoInicial = _nav.geoInicial;
      this.state.geoTermo = _nav.geoTermo;
      this.state.geoCcb = _nav.geoCcb;

      this.state.fotoDocumentoFrente  = _nav.fotoDocumentoFrente !== undefined ? _nav.fotoDocumentoFrente : '';
      this.state.fotoDocumentoVerso   = _nav.fotoDocumentoVerso !== undefined ? _nav.fotoDocumentoVerso : '';

      this.state.fotoExtrato = _nav.fotoExtrato !== undefined ? _nav.fotoExtrato : '';
      this.state.fotoOptante = _nav.fotoOptante !== undefined ? _nav.fotoOptante : '';

      this.state.consultaDataprev_opcao     = _nav.aceitouConsultaDataprev !== undefined ? _nav.aceitouConsultaDataprev : '';
      this.state.consultaDataprev_datahora  = _nav.dataHoraAceitouDataprev !== undefined ? _nav.dataHoraAceitouDataprev : '';

      this.state.aberturaDeConta_opcao    = _nav.aceitouConta !== undefined ? _nav.aceitouConta : '';
      this.state.aberturaDeConta_datahora = _nav.dataHoraAceitouConta !== undefined ? _nav.dataHoraAceitouConta : '';

      this.state.valorSeguro_opcao    = _nav.aceitouSeguro !== undefined ? _nav.aceitouSeguro : '';
      this.state.valorSeguro_datahora = _nav.dataHoraAceitouSeguro !== undefined ? _nav.dataHoraAceitouSeguro : '';

      this.state.contaQuitacao_opcao    = _nav.aceitouAutBoletos !== undefined ? _nav.aceitouAutBoletos : '';
      this.state.contaQuitacao_datahora = _nav.dataHoraAceitouAutBoletos !== undefined ? _nav.dataHoraAceitouAutBoletos : '';

      this.state.contaTransferencias_opcao    = _nav.aceitouAutTransferencia !== undefined ? _nav.aceitouAutTransferencia : '';
      this.state.contaTransferencias_datahora = _nav.dataHoraAceitouAutTransferencia !== undefined ? _nav.dataHoraAceitouAutTransferencia : '';

      this.state.base64SelfieIni = _nav.base64SelfieIni !== undefined ? _nav.base64SelfieIni : '';
      // this.state.base64SelfieDir = _nav.base64SelfieDir !== undefined ? _nav.base64SelfieDir : '';
      // this.state.base64SelfieEsq = _nav.base64SelfieEsq !== undefined ? _nav.base64SelfieEsq : '';
      this.state.base64SelfieFim = _nav.base64SelfieFim !== undefined ? _nav.base64SelfieFim : '';

      this.state.base64Ccb = _nav.base64Ccb;

      this.state.obj_pendencias = _nav.obj_pendencias;
      this.state.cliente_cpf = this.state.tipoPendencia !== "normal" && _nav.obj_pendencias !== undefined && _nav.obj_pendencias !== [] ? _nav.obj_pendencias.CLIENTE.CPF : _nav.obj_proposta.CLIENTE.CPF;
      this.state.cliente_nascimento = this.state.tipoPendencia !== "normal" && _nav.obj_pendencias !== undefined && _nav.obj_pendencias !== [] ? _nav.obj_pendencias.CLIENTE.DATANASCIMENTO : _nav.obj_proposta.CLIENTE.DATANASCIMENTO;

      this.state.tipoAnaliseAtualizar = this.state.tipoPendencia !== "normal" && _nav.obj_pendencias !== undefined && _nav.obj_pendencias !== [] ? _nav.obj_pendencias.statusOcorrenciaAtualizar : this.state.tipoAnaliseAtualizar;
      this.state.codigoAtualizacao = this.state.tipoPendencia !== "normal" && _nav.obj_pendencias !== undefined && _nav.obj_pendencias !== [] ? 'AD3' : this.state.codigoAtualizacao;
      if (this.state.tipoPendencia === "regularizacao") {
        this.state.tipoAnaliseAtualizar = this.state.obj_proposta.TIPOANALISE;
      }

      this.state.int_averbador = parseInt(_nav.obj_proposta.Averbador);

      if (this.state.tipoPendencia !== "normal" && _nav.obj_pendencias !== undefined && _nav.obj_pendencias !== []) {
        this.canvas = React.createRef();
        this.webcamRef = React.createRef();
        this.state.propostaPendente = true;
        this.state.propostaSelfie = true;
        this.state.textoDigPre = 'tire uma selfie';
        this.state.labelBotao = 'Tirar Selfie';
        if (_nav.obj_pendencias.pendencia_de_audio === true) {
          this.state.proximoLink = '/'+this.state.tipoPendencia+'-gravacao-de-audio/'+this.props.match.params.propostaId;
          this.state.propostaFinaliza = false;
    		}
        else {
          this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
        }

      }
      else {
        // Corretor da normativa 4027 (RB)
        var CORRETOR = this.state.obj_proposta.CORRETOR;
        var int_averbador = parseInt(_nav.obj_proposta.Averbador);
        var int_tipoOperacao = parseInt(_nav.obj_proposta.Tipo_Operacao);
        this.state.gravaAudio = false;

        if ((int_averbador === 1 || int_averbador === 30) && this.state.obj_proposta.codigotabela === 'PRE' && int_tipoOperacao === 14) {
          this.state.propostaSelfie = false;
          this.state.textoDigPre = 'grave um vídeo';
          this.state.labelBotao = 'Gravar Vídeo';
          this.videoPlayer = React.createRef();
          this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
        }
        // Se for proposta de CORRETOR (que não seja um dos irmãos) E FRANQUIA
        // E o AVERBADOR 1 (TESOURO), 30 (IPE) ou 100 (PODER JUDICIARIO)
        else if ((int_averbador === 1 || int_averbador === 30 || int_averbador === 100)) {
          this.state.gravaAudio = true;
          this.state.propostaSelfie = true;
          this.state.textoDigPre = 'tire uma selfie';
          this.state.labelBotao = 'Tirar Selfie';
          this.audio_etapa_1 = React.createRef();
          this.audio_etapa_2 = React.createRef();
          this.audio_etapa_3 = React.createRef();
          this.audio_etapa_4 = React.createRef();
          this.state.proximoLink = '/audio/'+this.props.match.params.propostaId;
        }
        // Se for proposta de corretor do NORTE ou NORDESTE
        // Manda gravar um vídeo
        /*else if (int_averbador === 3 &&
                (parseInt(this.state.obj_proposta.Tipo_Operacao) === 13 || parseInt(this.state.obj_proposta.Tipo_Operacao) === 27) &&
                (['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE'].indexOf(CORRETOR.UF) !== -1) &&
                parseInt(CORRETOR.Classificacao) === 1 &&
                this.state.obj_proposta.codigotabela === 'PRE' && excecao_inss.indexOf(CORRETOR.CODIGO) === -1
        ) {

          
          this.state.propostaSelfie = false;
          this.state.textoDigPre = 'grave um vídeo';
          this.state.labelBotao = 'Gravar Vídeo';
          this.videoPlayer = React.createRef();
          this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
        }*/
        // SE FOR PROPOSTA DE LOJA, OU SE FOR UM DOS IRMÃOS
        // OU AVERBADOR 390, SEGUE O FLUXO NORMAL
        else if ((parseInt(CORRETOR.Classificacao) === 2 || this.state.corretoresRosa.indexOf(parseInt(CORRETOR.CODIGO)) !== -1) && parseInt(this.state.int_averbador) !== 20095) {
          // PROPOTA NÃO PRESENCIAL
          if (this.state.obj_proposta.codigotabela === 'DIG') {
            this.state.gravaAudio = true;
            this.state.propostaSelfie = true;
            this.state.textoDigPre = 'tire uma selfie';
            this.state.labelBotao = 'Tirar Selfie';
            this.audio_etapa_1 = React.createRef();
            this.audio_etapa_2 = React.createRef();
            this.audio_etapa_3 = React.createRef();
            this.audio_etapa_4 = React.createRef();
            this.state.proximoLink = '/audio/'+this.props.match.params.propostaId;
          }
          // PROPOSTA PRESENCIAL
          else {
            this.state.propostaSelfie = false;
            this.state.textoDigPre = 'grave um vídeo';
            this.state.labelBotao = 'Gravar Vídeo';
            this.videoPlayer = React.createRef();
            this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
          }

        }
        else {
          // PROPOSTAS DE CORRETORES
          // PROPOSTAS PRESENCIAIS
          if (this.state.obj_proposta.codigotabela === 'PRE') {
            // SE CLIENTE FOR ANALFABETO, APENAS GRAVA UM VÍDEO
            // A SELFIE DO CLIENTE JÁ VAI TER SIDO TIRADA NO PreSelfie.js
            if (this.state.obj_proposta.ANALFABETO === 'S') {
              this.state.propostaSelfie = false;
              this.state.textoDigPre = 'grave um vídeo';
              this.state.labelBotao = 'Gravar Vídeo';
              this.videoPlayer = React.createRef();
              this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
            }
            // CASO NÃO SEJA ANALFABETO, TIRA A SELFIE
            // E GRAVA ÁUDIO SE FOR CARTÃO MAGNÉTICO
            else {
              this.state.propostaSelfie = true;
              this.state.textoDigPre = 'tire uma selfie';
              this.state.labelBotao = 'Tirar Selfie';
              this.audio_etapa_1 = React.createRef();
              this.audio_etapa_2 = React.createRef();
              this.audio_etapa_3 = React.createRef();
              this.audio_etapa_4 = React.createRef();

              if (parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) === 2 && this.state.obj_proposta.AVDPC === 'SIM') {
                this.state.gravaAudio = true;
                this.state.proximoLink = '/audio/'+this.props.match.params.propostaId;
              }
              else if (parseInt(_nav.obj_proposta.Averbador) === 10) {
                this.state.gravaAudio = true;
                this.state.proximoLink = '/audio/'+this.props.match.params.propostaId;
              }
              else {
                this.state.gravaAudio = false;
                this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
              }

            }

          }
          // PROPOSTA NÃO PRESENCIAIS
          else {
            // TIRA A SELFIE E GRAVA ÁUDIO SE FOR CARTÃO MAGNÉTICO
            this.state.propostaSelfie = true;
            this.state.textoDigPre = 'tire uma selfie';
            this.state.labelBotao = 'Tirar Selfie';
            this.audio_etapa_1 = React.createRef();
            this.audio_etapa_2 = React.createRef();
            this.audio_etapa_3 = React.createRef();
            this.audio_etapa_4 = React.createRef();

            if (parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) === 2) {
              this.state.gravaAudio = true;
              this.state.proximoLink = '/audio/'+this.props.match.params.propostaId;
            }
            else if (parseInt(_nav.obj_proposta.Averbador) === 10) {
              this.state.gravaAudio = true;
              this.state.proximoLink = '/audio/'+this.props.match.params.propostaId;
            }
            else if (parseInt(_nav.obj_proposta.Averbador) === 390) {
              this.state.gravaAudio = true;
              this.state.proximoLink = '/audio/'+this.props.match.params.propostaId;
            }
            else {
              this.state.gravaAudio = false;
              this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
            }
          }

        }

        var RETORNO_OITI_LOG = localStorage.getItem('@app-factafinanceira-formalizacao/RETORNO_OITI_LOG');
        if (RETORNO_OITI_LOG !== "" && RETORNO_OITI_LOG !== undefined && parseFloat(RETORNO_OITI_LOG) === 1.1) {
          this.state.passouPelaOITI = true;
        }

      }

      var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      this.state.iOS = iOS;

      if (this.state.iOS === true) {
        // alert("ios!");
      }

      setTimeout(function (){
        this.toggleInfoInicial();
      }.bind(this), 1000);

    }

    
    if (parseInt(this.state.int_averbador) === 20095) {
        this.state.propostaFinaliza = false;
        this.state.propostaPendente = true;
         this.state.gravaAudio = false;
        //this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
    }

  }

  // _tirarSelfieSeria = (dataUri) => {
  //   window.scrollTo(0, 3);
  //   if (this.state.infoModal) {
  //     this.toggleInfoInicial();
  //   }
  //   this.setState({base64SelfieIni: dataUri });
  //   setTimeout(() => {this.setState({exibePreview : true, contador : 0})}, 1000);
  //   setTimeout(function (){
  //     this.setState({exibePreview : false});
  //     this.toggleDanger();
  //   }.bind(this), 4000);
  //   this.setState({ selfieEtapa_1_Status : '' });
  //   // console.log('Foto séria', dataUri);
  // }
  //
  // _tirarSelfieSorrindo = (dataUri) => {
  //   window.scrollTo(0, 3);
  //   this.setState({base64SelfieFim: dataUri });
  //   if (this.state.danger) {
  //     this.toggleDanger();
  //   }
  // }

  updateDimensions = () => {
    //var videoEffect = document.getElementById('videoUsuario');
    //var rects = videoEffect.getBoundingClientRect();
    //this.setState({ heightVideo: this.webcamRef.current.video.clientHeight, widthVideo: this.webcamRef.current.video.clientWidth, posicaoX: rects.x});
  };

  toggleOk = () => {
    this.setState({
      contador: 0,
      modalOk: !this.state.modalOk,
      clicouModalInfo: true
    });
  }

  toggleMdlDados = () => {
    this.setState({modalDados: !this.state.modalDados});
  }

  toggleDanger() {
    this.setState({
      danger: !this.state.danger,
    });
  }

  toggleInfoInicial() {
    this.setState({
      infoModal: !this.state.infoModal,
      exibePreview: false
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    window.scrollTo(0, 3);
    if (!navigator.mediaDevices){
      navigator.mediaDevices = navigator;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  handleRequest() {
		console.log('Request Recording...');
	}

	handleGranted() {
		this.setState({ granted: true });
	}

	handleDenied(err) {
		this.setState({ rejectedReason: err.name });
	}

	handleStart(stream) {
		this.setState({
			recording: true,
      base64Video: '',
      exibeVideo: true
		});
		this.setStreamToVideo(stream);
		console.log('Recording Started.');
    // console.log(stream);
	}

	handleStop(blob) {
    console.log('Recording Stopped.');
		this.setState({
			recording: false,
      exibeVideo: false
		});
    // console.log(blob);
		//this.releaseStreamFromVideo();
		this.downloadVideo(blob);
	}

	handlePause() {
		this.releaseStreamFromVideo();
		this.setState({
			paused: true
		});
	}

	handleResume(stream) {
		this.setStreamToVideo(stream);
		this.setState({
			paused: false
		});
	}

	handleError(err) {
		console.log(err);
	}

	handleStreamClose() {
		this.setState({ granted: false });
	}

	setStreamToVideo(stream) {
		//let video = this.videoPlayer.current;
    let video = document.getElementById("videoPlayerPlugin");
		if(window.URL) {
			video.srcObject = stream;
		}
		else {
			video.src = stream;
		}
	}

	releaseStreamFromVideo() {
    let video = document.getElementById("videoPlayerPlugin");
		video.src = '';
	}

  capture = (el) => {
    const imageSrc = this.webcamRef.current.getScreenshot();
    if (el === 'array') {
      this.state.base64SelfieFotos.push(imageSrc);
    }
    else {
      this.setState({ [el]: imageSrc });
    }
  };

  handleStartCaptureClick = () => {
    this.setState({ setCapturing: true });
    this.setState({ erroNaGravacao: "Preparando para inciar a gravação" });
    this.mediaRecorderRef.current = new MediaRecorder(this.webcamRef.current.stream);
    this.setState({ erroNaGravacao: "Carregou o MediaRecorder" });
    this.mediaRecorderRef.current.ondataavailable = function(e) {
      this.state.recordedChunks.push(e.data);
      this.downloadVideo();
    }.bind(this);
    this.setState({ erroNaGravacao: "Criou função ondataavailable" });

    this.mediaRecorderRef.current.onstart = function(e) {
        this.setState({ erroNaGravacao: "Entrou no onstart" });
    }.bind(this);
    this.mediaRecorderRef.current.start();
  }

  handleDataAvailable(data) {
    if (data.size > 0) {
      this.setState({ setRecordedChunks : ((prev) => prev.concat(data)) });
    }
  }

  handleStopCaptureClick = () => {
    this.mediaRecorderRef.current.stop();
    this.setState({ setCapturing: false });
  }

  handleDownload = () => {
    if (this.state.recordedChunks.length) {
      const blob = new Blob(this.state.recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      this.state.setRecordedChunks([]);
    }
  }

  /** Integração API OITI **/
  handleCredencial = async () => {
    let url = URL_API + "/get_credencial";
    this.setState({ logTeste : 'Iniciando a validação da credencial - 1.1' });
    _fcvarSnaps = '';
    document.getElementById("divButton").style.display = "none";
    document.getElementById("texto").innerHTML = "";

    if (document.getElementById("player") !== undefined) {
      document.getElementById("player").style.display = "block";
      document.getElementById("overlay").style.display = "block";
    }

    const FormData = require('form-data');
    const formData = new FormData();

    formData.append('token_face', token_face);
    formData.append('cpf', this.state.cpf);
    formData.append('nome', this.state.nome);
    formData.append('nascimento', this.state.nascimento);
    if (this.state.passouPelaOITI === true) {
      formData.append('operacao', 'liveness');
    }
    else {
      formData.append('operacao', this.state.tipoOperacaoOiti);
    }
    // formData.append('operacao', 'liveness');
    // formData.append('homol', true);

    // if (this.state.passouPelaOITI === true) {
    //   // console.log("Passar direto das validações da OITI, usar response antigo 1");
    //   this.prepareChallenge();
    // }
    // else {

      this.setState({ logTeste : 'Preparando para o envio - 1.2'});
      const headers =  {'Content-Type': 'multipart/form-data' };
      await axios.post(url, formData, {
        headers: headers
      }).then((response) => {
        if (typeof response.data === "string" && response.data.indexOf('Sorry, the page you requested is not available') !== -1) {
          console.log("Serviço");
          this.toggleMdlDados();
          document.getElementById("divButton").style.display = "block";
        }
        else if (response.data.erro !== undefined && response.data.erro === true) {
          console.log("Erro");
          this.toggleMdlDados();
          document.getElementById("divButton").style.display = "block";
        }
        else {
          this.setState({ appkey : response.data.appkey });
          this.startCapture();
        }
      })
      .catch((error) => {
        console.log(error);
        this.toggleMdlDados();
        document.getElementById("divButton").style.display = "block";
      })

    // }

  }

  startCapture() {
    if (!this.state.canContinue) {
        console.log('erro captura');
        return false;
    }
    this.startChallenge();
  }

  startChallenge = async (param) => {
    let url = URL_FACE + "/captcha/challenge";
    this.setState({ logTeste : 'Preparando para o envio dos desafios - 2.1'});
    let data = qs.stringify({
        '?nc' : new Date().getTime(),
        'appkey' : this.state.appkey,
        'p' : param
    });

    const headers = {
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    this.setState({ logTeste : 'Envio para o endpoint - 2.2'});

    await axios.post(url, data, {
        headers: headers
    })
    .then((response) => {
        response = JSON.parse(this.decChData(response.data));
        this.setState({ logTeste : 'Desafios carregados com sucesso - 2.3'});
        this.setState({
            fcvarChkey : response.chkey,            // chave da requisição
            fcvarChallenge : response.challenges,   // desafios da requisição   [2]
            fcvarTime : response.totalTime,         // tempo total de todos os desafios (seg)   [8]
            fcvarSnapFrequenceInMillis : response.snapFrequenceInMillis,    // tempo para cada snap (mseg)  [1990]
        });

        this.prepareChallenge();
    })
    .catch((error) => {
        console.log(error);
        this.setState({ logTeste : '2 - Erro ao buscar os desafios - ' + error});
        return false;
    });
  }

  prepareChallenge() {

    //Intervalo de captura de image do video
    let fcvarIntervalSnap = setInterval(() => {
        this.snapTick()
    }, this.state.fcvarSnapFrequenceInMillis);

    let fcvarIntervalTimer = setInterval(() => {
        clearInterval(fcvarIntervalSnap);
        clearInterval(fcvarIntervalChallege);
        clearInterval(fcvarIntervalTimer);
        this.stopChallenge();
    }, this.state.fcvarTime * 1000 );

    //exibe os desafios na tela
    this.showChallengeTick(this.state.fcvarChallenge, 0);
  }

  //Exibir desafios
  showChallengeTick = (challenges, i) => {
    this.setState({
        fcvarCurCha : challenges[i],
        imgMsg : 'data:image/png;base64,' + challenges[i].mensagem,
        imgChallenge : 'data:image/png;base64,' + challenges[i].tipoFace.imagem
    });

    document.getElementById("imgMsg").style.display = "";
    document.getElementById("imgChallenge").style.display = "";

    document.getElementById("imgMsg").src = this.state.imgMsg;
    document.getElementById("imgChallenge").src = this.state.imgChallenge;

    fcvarIntervalChallege = setTimeout(() => {
        this.showChallengeTick(challenges, ++i)
    },  challenges[i].tempoEmSegundos * 1000 );
  }

  //prepara captura de imagem
  snapTick() {
    let snapb64 = this.snap();
    snapImagem.push(snapb64);

    if (this.state.fcvarFirstSnap === '') {
        this.setState({fcvarFirstSnap : snapb64})
    }

    // necessario adicionar o codigo do tipoFace entre o 'data:image/jpeg' e o snapb64
    snapb64 = snapb64.split('data:image/jpeg;base64,');
    snapb64 = 'data:image/jpeg;base64,' + snapb64[0] + 'type:' + this.state.fcvarCurCha.tipoFace.codigo + ',' + snapb64[1];

    _fcvarSnaps += snapb64;

    this.setState({
        fcvarSnaps  :  _fcvarSnaps
    });
  }

  // finaliza desafios
  stopChallenge = async () =>  {

    console.log(this.state.responseOITI);
    console.log(this.state.responseOITI.length);
    console.log(this.state.responseOITI.data);

    // if (this.state.passouPelaOITI === true && this.state.responseOITI.data !== undefined) {
    //   console.log("Passar direto das validações da OITI, usar response antigo 2");
    //   this.onFinishFaceCaptcha(this.state.responseOITI);
    // }
    // else {

      let url = URL_FACE + "/captcha?nc=" + new Date().getTime();

      // encripta as imagens
      let data = qs.stringify({
          'appkey': this.state.appkey,
          'chkey': this.state.fcvarChkey,
          'images': this.encChData(this.state.fcvarSnaps)
      });

      const headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }

      await axios.post(url, data, {
          headers: headers
      })
      .then((response) => {

          console.log("stopChallenge", response);
          response.data.snap =  this.state.fcvarFirstSnap;
          this.gravaRetorno(response.data.codID, response.data.cause, response.data.protocol, response.data.score);

          // Passou no prova de vida e biometria
          if (response.valid) {
              this.checkAnimStart();
          }

          // Informa resltados
          this.onFinishFaceCaptcha(response);

      })
      .catch((error) => {
          console.log('erro');
      });

    // }

  }

  onFinishFaceCaptcha = async (response) => {

    document.getElementById("imgChallenge").style.display = "none";
    document.getElementById("imgMsg").style.display = "none";
    document.getElementById("imgChallenge").src = " ";
    document.getElementById("imgMsg").src = " ";
    document.getElementById("texto").innerHTML = "";
    // document.getElementById("texto").style = "";
    this.state.mensagemErroUnico = "";

    
    if (response.data.valid) {

      if (response.data.codID === 1.1 || this.state.passouPelaOITI === true) {

        this.state.passouPelaOITI = true;
        // this.state.responseOITI = response;

        document.getElementById("texto").innerHTML = "Realizando a validação das informações...";
        document.getElementById("player").style.display = "none";
        document.getElementById("overlay").style.display = "none";

        await axios.post(URL_API + "/get_token_acesso_unico")
        .then(async (response) => {
          console.log(response);
          if (response !== "" && response.data !== "" && response.data.access_token !== undefined) {
            document.getElementById("texto").innerHTML = "Validando as imagens enviadas...";
            const FormData = require('form-data');
            const formData = new FormData();
            formData.append('token', response.data.access_token);
            formData.append('CODIGO_AF', atob(this.state.codigoAFOriginal));
            formData.append('cpf', this.state.cpf);
            formData.append('nome', this.state.nome);
            formData.append('img', snapImagem[0]);
            // formData.append('ext', 'jpeg');

            await axios.post(
              URL_API + "/send_cliente_validacao_unico",
              formData
            )
            .then((response) => {
              console.log(response);
              // {"Error":{"Code":500,"Description":"Centralize o rosto na área de captura!"}}
              if (response !== "") {
                if (response.data.erro !== undefined && response.data.erro === true) {
                  var msg_erro_unico = "Não foi possível validar as imagens. Por favor, tente novamente e atente-se as dicas de como tirar a selfie.";
                  if (response.data.msg !== undefined && response.data.msg === "unico") {
                    var retorno_unico = response.data.dados;
                    if (retorno_unico.Error !== undefined && ([500, 502, 503, 504, 505, 507, 508, 511, 512, 514].indexOf(parseInt(retorno_unico.Error.Code)) !== -1)) {
                      msg_erro_unico = retorno_unico.Error.Description;
                      this.state.mensagemErroUnico = retorno_unico.Error.Description;
                    }
                  }
                  document.getElementById("texto").innerHTML = msg_erro_unico;
                  var incrementaDesafios = this.state.contaTentativasSelfie;
                  incrementaDesafios++;
                  if (incrementaDesafios >= 5) {
                    snapImagem = [];
                    this.setState({ erroAPI : true });
                  }
                  else {
                    snapImagem = [];
                    this.setState({ etapa : "instrucao", modalOk : true, contaTentativasSelfie : incrementaDesafios});
                  }
                }
                else if (response.data.erro !== undefined && response.data.erro === false) {
                  var retorno_unico = response.data.dados;
                  if (retorno_unico.Score !== undefined && (retorno_unico.Score >= 10 || retorno_unico.Score === -1)) {
                    this.setState({ base64SelfieIni: snapImagem[0], base64SelfieFim: snapImagem[3] });
                    document.querySelector("body").style.backgroundColor = "#fff";
                  }
                  else {
                    snapImagem = [];
                    this.setState({ erroAPI : true });
                  }
                }
                else {
                  this.setState({ base64SelfieIni: snapImagem[0], base64SelfieFim: snapImagem[3] });
                  document.querySelector("body").style.backgroundColor = "#fff";
                }
              }
              else {
                // Houve algum problema na UNICO, então liberamos o cliente para não ficar travado
                document.getElementById("texto").innerHTML = "";
                this.setState({ base64SelfieIni: snapImagem[0], base64SelfieFim: snapImagem[3] });
                document.querySelector("body").style.backgroundColor = "#fff";
              }
            })
            .catch((error) => {
              console.log('error', error);
              // Houve algum problema na UNICO, então liberamos o cliente para não ficar travado
              document.getElementById("texto").innerHTML = "";
              this.setState({ base64SelfieIni: snapImagem[0], base64SelfieFim: snapImagem[3] });
              document.querySelector("body").style.backgroundColor = "#fff";
            });
          }
          else {
            // Houve algum problema na UNICO, então liberamos o cliente para não ficar travado
            document.getElementById("texto").innerHTML = "";
            this.setState({ base64SelfieIni: snapImagem[0], base64SelfieFim: snapImagem[3] });
            document.querySelector("body").style.backgroundColor = "#fff";
          }
        })
        .catch((error) => {
            console.log('error', error);
            // Houve algum problema na UNICO, então liberamos o cliente para não ficar travado
            document.getElementById("texto").innerHTML = "";
            this.setState({ base64SelfieIni: snapImagem[0], base64SelfieFim: snapImagem[3] });
            document.querySelector("body").style.backgroundColor = "#fff";
        });

      }
      else {
        this.setState({ base64SelfieIni: snapImagem[0], base64SelfieFim: snapImagem[3] });
        document.querySelector("body").style.backgroundColor = "#fff";
      }

    }
    else {
      /* Para erro 200.2 ou 300.1 - Cliente não realizou corretamente os desafios. Joga para a tela das instruções e exibe mensagem */
      if (response.data.codID === parseFloat(200.2) || response.data.codID === parseFloat(300.1)) {
        var incrementaDesafios = this.state.contaTentativasSelfie;
        incrementaDesafios++;
        if (incrementaDesafios >= 5) {
          snapImagem = [];
          this.setState({ erroAPI : true });
        }
        else {
          snapImagem = [];
          this.setState({ etapa : "instrucao", modalOk : true, contaTentativasSelfie : incrementaDesafios});
        }
      }
      /* Para erro 200.1 (e demais) - Quer dizer que o cadastro do cliente possui algum problema junto à OITI (jogar para tela de pendência) */
      else {
        snapImagem = [];
        this.setState({ erroAPI : true });
      }
    }
  }

  mtel(v) {
    v=v.replace(/\D/g,"");
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2");
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");
    return v;
  }

  checkAnimStart() {
    window.location.reload(false);
  }

  crossAnimStart = (codID) => {
    let msg = '';

    switch (codID) {
        case 1:
          msg = 'Sucesso (Cadastro com sucesso ou Certificação positiva).';
          break;
        case 100.1:
            msg = 'Face não encontrada.';
            break;
        case 100.2:
            msg = 'Posicionamento não frontal.';
            break;
        case 100.3:
            msg = 'Você está muito próximo a câmera.';
            break;
        case 100.4:
            msg = 'Você esta muito longe da câmera.';
            break;
        case 100.5:
            msg = 'Existe mais de uma face nas imagens.';
            break;
        case 100.6:
            msg = 'Iluminação inadequada.';
            break;
        case 200.1:
            msg = 'Face enviada não é a face cadastrada, ou tem similar com cpf diferente.';
            break;
        case 300.1:
            msg = 'Você não executou os desafios de forma adequada.';
            break;
        case 400.1:
            msg = 'Dados Inválidos (depreciado).';
            break;
        default:
            msg = 'Não foram detectados movimentos corretos. Vamos repetir o processo.';
    }

    coigo_retorno = codID;
    //msg = this.gravaRetorno(codID, msg);

    return msg;
  }

gravaRetorno = (codID, cause, protocol, score)  => {
    let url = URL_API+"/ApiOITI";
    //let url = "https://app.factafinanceira.com.br/WhatsApp/ApiWhatsApp";

    const FormData = require('form-data');
    const formData = new FormData();

    formData.append('CODIGO', codID);
    formData.append('MENSAGEM', '');
    formData.append('CAUSE', cause);
    formData.append('PROTOCOL', protocol);
    formData.append('SCORE', score);
    formData.append('CODIGO_AF', atob(this.state.codigoAFOriginal));

    const headers =  {'Content-Type': 'multipart/form-data' };

    let mensagem = "";

    axios.post(url, formData, {
      headers: headers
    }).then((response) => {
      mensagem = response;
    })
    .catch((error) => {
        console.log('Error:'+error);
    });

}

  encChData = (data) => {
    let key = CryptoJS.enc.Latin1.parse(this.padKey(this.state.appkey));
    let iv  = CryptoJS.enc.Latin1.parse(this.padKey(this.state.appkey.split('').reverse().join('')) );
    let result = CryptoJS.AES.encrypt(this.padMsg(data), key,
        { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC}).toString();
    return encodeURIComponent(result);
  }

  padKey = (source) => {
    if(source.length > 16){
        return source.substring(0, 16);
    }
    return this.padMsg(source);
  }

  /* SECURITY */
  padMsg = (source) => {
    let paddingChar = ' ';
    let size = 16;
    let x = source.length % size;
    let padLength = size - x;
    for (var i = 0; i < padLength; i++) source += paddingChar;
    return source;
  }

  decChData = (data) => {
    var key = CryptoJS.enc.Latin1.parse(this.padKey(this.state.appkey));
    var iv  = CryptoJS.enc.Latin1.parse(this.padKey(this.state.appkey.split('').reverse().join('')) );
    var decripted2 = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(data, key,
        { iv: iv, padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.CBC}));
    decripted2 = decripted2.substring(0, decripted2.lastIndexOf('}')+1);
    decripted2 = decripted2.trim();
    return decripted2;
  }

  // Capturar imagem da camera
  handleCapturar() {
    // Guarda imagem em base64 na variavel image
    let canvas = document.getElementById('image_canvas');
    let ctx = canvas.getContext("2d");
    /*
    let img = new Image();
    img.onload = function() {
    // Desenha a imagem capturada no centro do canvas
        ctx.drawImage(img,
            canvas.width / 2 - img.width / 2,
            canvas.height / 2 - img.height / 2);
    };
    */
    //img.src = this.state.image;

  }

  snap() {
    let video = document.querySelector('video');
    let canvas = document.getElementById('fc_canvas');
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = 480;
    ctx.canvas.height = 640;

    // verifica proporção da imagem para fazer o Crop
    let ratio = video.videoWidth / video.videoHeight;
    let widthReal, heightReal = 0;
    let startX, startY = 0;

    if (ratio >= 1) {
      // paisagem
      widthReal = video.videoHeight / 1.5;
      heightReal = video.videoHeight;

      startX = (video.videoWidth - widthReal) / 2;
      startY = 0;
    } else {
      // retrato
      ratio = video.videoHeight / video.videoWidth;

      // verifica proporção
      if (ratio > 1.5) {
        widthReal = video.videoWidth;
        heightReal = video.videoWidth * 1.5;

        startX = 0;
        startY = (video.videoHeight - heightReal) / 2;
      } else {
        widthReal = video.videoHeight / 1.5;
        heightReal = video.videoHeight;

        startX = (video.videoWidth - widthReal) / 2;
        startY = 0;
      }
    }

    // Crop image video
    ctx.drawImage(video, startX, startY, widthReal, heightReal, 0, 0, ctx.canvas.width, ctx.canvas.height);

    var img = new Image();
    img.src = canvas.toDataURL('image/jpeg');
    return img.src;

  }

  // verifica se o navegador é um dispositivo mobile
  isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
	  this.mediaChunk = [];
	}

  downloadVideo(blob) {
    //console.log('blob');
    var reader = new FileReader();
    //console.log(blob);
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      this.setState({ base64Video: reader.result });
    }.bind(this);
	}

  proximaEtapa = (etapa) => {
    this.setState({etapa: etapa});
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
  }

  _iniciarInstrucoes = () => {

    this.setState({contadorParado: 0, liberaBotaoInstrucao: false, base64SelfieFim: ''});

    setTimeout(function() {
      this.audio_etapa_1.current.play();
    }.bind(this), 1000);

    setTimeout(function() {
      this.audio_etapa_2.current.play();
      this.capture('base64SelfieIni');
    }.bind(this), 9000);

    setTimeout(function() {
      this.audio_etapa_3.current.play();
      this.capture('base64SelfieDir');
    }.bind(this), 15000);

    setTimeout(function() {
      this.audio_etapa_4.current.play();
      this.capture('base64SelfieEsq');
    }.bind(this), 22000);

    setTimeout(function() {
      this.setState({ mostraTempo: true });
      let interval = setInterval(() => {
        this.setState({ contadorParado: this.state.contadorParado - 1 })
        if (this.state.contadorParado === 0) {
          this.capture('base64SelfieFim');
          this.setState({ mostraTempo: false, liberaBotaoInstrucao: true });
          clearInterval(interval);
        }
      }, 1000);
    }.bind(this), 26000);

  }

  _finalizaFormalizacao = async () => {

    if ( this.state.obj_proposta.codigotabela === 'PRE' ||
         (this.state.propostaPendente === true && this.state.propostaFinaliza === true) ||
         ( parseInt(this.state.obj_proposta.CORRETOR.Classificacao) === 1 &&
           parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) !== 2 &&
           this.state.corretoresRosa.indexOf(this.state.obj_proposta.CORRETOR.CODIGO) === -1
           || parseInt(this.state.int_averbador) === 20095
         )
    ) {

      const FormData = require('form-data');
      const axios = require('axios');
      const formData = new FormData();
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
        formData.append('fotoExtrato', blob_fotoExtrato);
      }

      if (this.state.fotoOptante !== '' && this.state.fotoOptante !== undefined) {
        const blob_fotoOptante = await fetch(this.state.fotoOptante).then(res => res.blob());
        formData.append('fotoOptante', blob_fotoOptante);
      }

      if (this.state.base64SelfieIni !== '' && this.state.base64SelfieIni !== undefined) {
        const blob_base64SelfieIni = await fetch(this.state.base64SelfieIni).then(res => res.blob());
        formData.append('SelfieIni', blob_base64SelfieIni);
      }

      // if (this.state.base64SelfieDir !== '' && this.state.base64SelfieDir !== undefined) {
      //   const blob_base64SelfieDir = await fetch(this.state.base64SelfieDir).then(res => res.blob());
      //   formData.append('SelfieDir', blob_base64SelfieDir);
      // }
      //
      // if (this.state.base64SelfieEsq !== '' && this.state.base64SelfieEsq !== undefined) {
      //   const blob_base64SelfieEsq = await fetch(this.state.base64SelfieEsq).then(res => res.blob());
      //   formData.append('SelfieEsq', blob_base64SelfieEsq);
      // }

      if (this.state.base64SelfieFim !== '' && this.state.base64SelfieFim !== undefined) {
        const blob_base64SelfieFim = await fetch(this.state.base64SelfieFim).then(res => res.blob());
        formData.append('SelfieFim', blob_base64SelfieFim);
      }

      var validaVideo64 = this.state.base64Video;
      validaVideo64 = validaVideo64.replace("data:", "");
      if (this.state.base64Video !== '' && this.state.base64Video !== undefined && validaVideo64 !== '') {
        const blob_base64Video = await fetch(this.state.base64Video).then(res => res.blob());
        formData.append('VideoFormalizacao', blob_base64Video);
      }

      let LOCALIZACOES = "";

      formData.set('proposta', atob(this.state.codigoAFOriginal));

      formData.set('termo_datahora', this.state.dataHoraTermo);
      formData.set('termo_localizacao', this.state.geoTermo);

      if(this.state.tipoPendencia === "normal") {
        LOCALIZACOES += "\r\nTERMO\r\n";
        LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraTermo !== undefined && this.state.dataHoraTermo !== "" ? this.state.dataHoraTermo : "-") +"\r\n";
        LOCALIZACOES += "\r\nLOCALIZAÇAO: "+ (this.state.geoTermo !== undefined && this.state.geoTermo !== "" ? this.state.geoTermo : "-") +"\r\n";

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
      }
      
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
      informacoesDoDispositivo += "\r\nTipo de Formalização: " + (this.state.obj_proposta.codigotabela === 'DIG' ? 'Não Presencial' : 'Presencial') +"\r\n\r\n";
      informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
      informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
      informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
      informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
      informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;
      informacoesDoDispositivo += LOCALIZACOES;

      formData.set('infoDoDispositivo', informacoesDoDispositivo);

      if (parseInt(this.state.obj_proposta.Averbador) === 1) {
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
      if(this.state.obj_pendencias !== undefined) {
        formData.set('pendencia_de_valores', this.state.obj_pendencias.pendencia_de_valores === true ? 1 : 0);  
        formData.set('pendencia_de_documentos', this.state.obj_pendencias.pendencia_de_documentos === true ? 1 : 0);
      }
      await axios({
        method: 'post',
        url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(function (response) {
          // console.log(response);
          this.setState({ carregando: false });
          alert("Proposta formalizada com sucesso!");
          this.props.history.push(this.state.proximoLink);
      }.bind(this))
      .catch(function (response) {
          // console.log(response);
          this.setState({ carregando: false });
          alert("Erro ao realizar a formalização!");
      }.bind(this));

      return false;
    } else {
      //this.props.history.push(this.state.proximoLink);
    }

  }

  abreCamera(){
    var input_file = document.getElementById('webcamCapture');
    input_file.click();
  }

  carregouVideo = (e) => {
    console.log(e);
    alert(e.name + " - " + e.size + " - " + e.type);
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

    const containerPaddingTopMobile = {
      'backgroundColor' : '#000',
      'overflow' : 'hidden'
    }

    const styleContador = {
      fontSize : '96px',
      zIndex : 1000,
      position : 'absolute',
      top: '32%',
      left: this.state.widthVideo === 0 || this.state.widthVideo === '' ? '40%' : (((this.state.widthVideo / 2) - 80) + this.state.posicaoX) + "px",
      border: '3px dashed',
      borderRadius: '100px',
      width: '160px',
      height: '160px',
      display : this.state.contador > 0 ? 'block' : 'none'
    }

    const styleFlash = {
      display : 'block',
      backgroundColor : '#FFFFFF',
      width : this.state.widthVideo,
      height : this.state.heightVideo,
      opacity : 0,
      position : 'absolute',
      top : '0%'
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} >
      { this.state.cameraDisponivel === false
        ? <>
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
              <LayoutFactaHeader />
              <Row className="mt-4">
                <Col md={{size: 8, offset: 2}}>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody>
                      <Row>
                        <Col>
                          <h5 className="text-center mb-3 font-weight-bold">Dispositivo de Vídeo Indisponível</h5>
                          <Row>
                            <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                              <p>Para realizar a formalização digital é necessário o uso de uma câmera. Por favor, certifique-se que ela está conectada e tente novamente.</p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
        </>
      : <>
      { this.state.carregando
        ? <LayoutFactaCarregando />
        : <>
          { this.state.etapa === 'instrucao'
            ? (
                <>
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
                                fotos={this.state.propostaSelfie === true ? "fa fa-square-o" : "fa fa-check-square-o text-success"}
                                audio="fa fa-square-o"
                              />
                          </Col>
                        </>
                      : null
                    }
                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>

                      <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                        <CardBody>
                          <Row className="mt-3">

                            <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                              <img src={ require('../../../assets/img/selfie_template.jpg') } alt="Selfie" className="w-100" />
                            </Col>
                            <Col>
                              <h5 className="text-center mt-3 mb-3">Agora precisamos que você { this.state.textoDigPre }</h5>
                              <Row className="mt-3">
                                <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                  <i className="fa fa-camera align-self-center h4"></i>
                                </Col>
                                <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                  <p className="align-self-center">Na próxima tela, clique em <span className="font-weight-bold">"Permitir"</span> para acessar a câmera do celular.</p>
                                </Col>
                              </Row>

                              <Row className="mt-1">
                                <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                  <i className="fa fa-times-circle-o align-self-center h2"></i>
                                </Col>
                                <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                  <p className="align-self-center">Não é recomendado o uso de óculos, boné ou chapéu.</p>
                                </Col>
                              </Row>

                              <Row className="mt-1">
                                <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                  <i className="fa fa-lightbulb-o align-self-center h4"></i>
                                </Col>
                                <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                  <p className="align-self-center">Fique em frente a câmera em um lugar iluminado.</p>
                                </Col>
                              </Row>

                              <Row className="mt-3">
                                <Col xs="12" sm="12" className="text-center">
                                  <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={ () => { this.proximaEtapa('selfie'); this.setState({ clicouInicio : true, contador : 0 }) } } >
                                    { this.state.labelBotao }
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  <Modal isOpen={this.state.modalOk} toggle={this.toggleOk} className='modal-primary modal-dialog-centered' style={{'zIndex' : 9999}}>
                    <ModalHeader toggle={this.toggleOk}>Atenção</ModalHeader>
                    <ModalBody>

                      { this.state.mensagemErroUnico === ''
                        ? <>
                            <Row className="mt-1">
                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                <i className="fa fa-times-circle-o align-self-center h2"></i>
                              </Col>
                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                <p className="align-self-center">Não foi possível realizar os testes para a detecção facial, pedimos que tente novamente.</p>
                              </Col>
                            </Row>
                            <Row className="mt-1">
                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                <i className="fa fa-lightbulb-o align-self-center h4"></i>
                              </Col>
                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                <p className="align-self-center">Atente-se para as dicas de como realizar a selfie para evitar problemas.</p>
                              </Col>
                            </Row>
                          </>
                        : <>
                            <Row className="mt-1">
                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                <i className="fa fa-times-circle-o align-self-center h2"></i>
                              </Col>
                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                <p className="align-self-center">{ this.state.mensagemErroUnico }</p>
                              </Col>
                            </Row>
                          </>
                      }
                      <Row className="mt-1">
                        <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                          <Button color="success" onClick={this.toggleOk}>Tudo bem, entendi!</Button>
                        </Col>
                      </Row>
                    </ModalBody>
                  </Modal>

                </Col>
                </>
            )
            : (
              this.state.videoAtivo === false
              ? (
                  <>
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
                                  fotos={this.state.propostaSelfie === true ? "fa fa-square-o" : "fa fa-check-square-o text-success"}
                                  audio="fa fa-square-o"
                                />
                            </Col>
                          </>
                        : null
                      }

                      <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                        <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                          <CardBody>
                            <Row className="mt-3">
                              <Col>
                                <h5 className="text-center mb-3 font-weight-bold">Selfie</h5>
                                <Row>
                                  <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                    <p>Houve um erro ao tentar acessar a câmera do dispositivo.</p>
                                    <p>Atualize a tela e certifique-se de aceitar o uso da câmera pelo site.</p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  </>
              )
              : (
                <>
                  { this.state.propostaSelfie === true
                    ? (
                      <>
                      { this.state.base64SelfieFim === ''
                      ? <>
                        { this.state.exibePreview === false
                          ? <>
                              { this.state.erroAPI === false
                                ? <>
                                  <Col className="w-100 p-3 min-vh-100 text-center" style={ isMobile ? containerPaddingTopMobile : containerPaddingTop}>
                                    <Col xs="12" sm="12" md="12" className="text-center p-0">
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
                                                    fotos={this.state.propostaSelfie === true ? "fa fa-square-o" : "fa fa-check-square-o text-success"}
                                                    audio="fa fa-square-o"
                                                  />
                                              </Col>
                                            </>
                                          : null
                                        }

                                        <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                          <CameraFaceAPI onClick={this.handleCredencial.bind(this)} />
                                          <div style={{'fontSize' : '24px', 'color' : 'white', 'fontWeight' : '700', 'display' : 'none'}}>{ this.state.logTeste }</div>
                                        </Col>

                                        <Modal isOpen={this.state.modalDados} toggle={this.modalDados} className='modal-primary modal-dialog-centered' style={{'zIndex' : 9999}}>
                                          <ModalHeader toggle={this.toggleMdlDados}>Atenção</ModalHeader>
                                          <ModalBody>
                                            <Row className="mt-1">
                                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                <i className="fa fa-times-circle-o align-self-center h2"></i>
                                              </Col>
                                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                <p className="align-self-center">Não foi possível iniciar o reconhecimento facial. Por favor, tente novamente.</p>
                                              </Col>
                                            </Row>
                                            <Row className="mt-1">
                                              <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                                                <Button color="success" onClick={this.toggleMdlDados}>Ok</Button>
                                              </Col>
                                            </Row>
                                          </ModalBody>
                                        </Modal>
                                      </Row>
                                    </Col>


                                  </Col>
                                  </>
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
                                                    fotos={this.state.propostaSelfie === true ? "fa fa-square-o" : "fa fa-check-square-o text-success"}
                                                    audio="fa fa-square-o"
                                                  />
                                              </Col>
                                            </>
                                          : null
                                        }
                                        <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                          <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                            <CardBody>
                                              <Row className="mt-3">
                                                <Col xs="12" sm="12">
                                                  <h5 className="text-center"><strong>Problemas na Solicitação</strong></h5>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col xs="12" sm="12">
                                                  <p>Não foi possível realizar os testes para a detecção facial!</p>
                                                  <p>Para a conclusão da sua solicitação, pedimos que entre em contato com o correspondente que fez o seu atendimento, para esclarecimentos:</p>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col xs="12" sm="12">
                                                  <h5>Dados para contato:</h5>
                                                  { this.state.obj_proposta.CORRETOR.FONE !== ''
                                                    ?
                                                      <h4>
                                                        <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                                        <span>{ this.mtel(this.state.obj_proposta.CORRETOR.FONE)}</span>
                                                      </h4>
                                                    : this.state.obj_proposta.CORRETOR.FONE_COMERCIAL !== ''
                                                      ?
                                                        <h4>
                                                          <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                                          <span>{ this.mtel(this.state.obj_proposta.CORRETOR.FONE_COMERCIAL) }</span>
                                                        </h4>
                                                      : this.state.obj_proposta.CORRETOR.CELULAR !== ''
                                                        ?
                                                          <h4>
                                                            <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                                            <span>{ this.mtel(this.state.obj_proposta.CORRETOR.CELULAR) }</span>
                                                          </h4>
                                                        : null
                                                    }
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                        </Col>
                                      </Row>

                                  </Col>
                                </>
                              }
                            </>
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
                                              fotos={this.state.propostaSelfie === true ? "fa fa-square-o" : "fa fa-check-square-o text-success"}
                                              audio="fa fa-square-o"
                                            />
                                        </Col>
                                      </>
                                    : null
                                  }
                                  <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                      <CardBody>
                                        <Row className="mt-3">
                                          <Col>
                                            <h5>Muito bem! Veja abaixo a foto.</h5>
                                          </Col>
                                          <Col xs="12" sm="12" md="12">
                                            <img src={ this.state.base64SelfieIni }  alt="Selfie Final" className="w-100" />
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          }
                        </>
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
                                        fotos={this.state.propostaSelfie === true ? "fa fa-square-o" : "fa fa-check-square-o text-success"}
                                        audio="fa fa-square-o"
                                      />
                                  </Col>
                                </>
                              : null
                            }
                            <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                              <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                <CardBody>
                                  <Row className="mt-3">
                                    <Col>
                                      <h5>Muito bem! Veja abaixo a foto.</h5>
                                    </Col>
                                    <Col xs="12" sm="12" md="12" style={{'display' : this.state.base64SelfieFim === '' ? 'none' : 'block'}}>
                                      <img ref={this.imgSelfieFim} src={ this.state.base64SelfieFim } alt="Selfie Final" className={ isMobile === true ? 'w-100' : 'w-50'} />
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                      { this.state.base64SelfieFim !== ''
                                        ? <>
                                        { this.state.propostaPendente === false || (this.state.propostaPendente === true && this.state.propostaFinaliza === false)
                                          ? <>
                                          { this.state.gravaAudio === false
                                            ? <>
                                              <Button className="font-weight-bold btn-block mt-2" color="outline-primary" size="lg" onClick={ this._finalizaFormalizacao } >
                                                  Confirmar a assinatura
                                              </Button>
                                              </>
                                            : <>
                                              <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" to={{
                                                pathname: this.state.proximoLink,
                                                state: {
                                                  navegacao: true,
                                                  obj_proposta: this.state.obj_proposta,

                                                  dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,

                                                  dataHoraTermo: this.state.dataHoraTermo,
                                                  dataHoraCcb: this.state.dataHoraCcb,

                                                  fotoDocumentoFrente: this.state.fotoDocumentoFrente,
                                                  fotoDocumentoVerso: this.state.fotoDocumentoVerso,

                                                  geoInicial: this.state.geoInicial,
                                                  geoTermo: this.state.geoTermo,
                                                  geoCcb: this.state.geoCcb,

                                                  aceitouSeguro: this.state.aceitouSeguro,
                                                  dataHoraAceitouSeguro: this.state.dataHoraAceitouSeguro,

                                                  aceitouConsultaDataprev: this.state.aceitouConsultaDataprev,
                                                  dataHoraAceitouDataprev: this.state.dataHoraAceitouDataprev,

                                                  aceitouConta: this.state.aceitouConta,
                                                  dataHoraAceitouConta: this.state.dataHoraAceitouConta,

                                                  aceitouAutTransferencia: this.state.aceitouAutTransferencia,
                                                  dataHoraAceitouAutTransferencia: this.state.dataHoraAceitouAutTransferencia,

                                                  aceitouAutBoletos: this.state.aceitouAutBoletos,
                                                  dataHoraAceitouAutBoletos: this.state.dataHoraAceitouAutBoletos,

                                                  base64SelfieIni: this.state.base64SelfieIni,
                                                  //base64SelfieDir: this.state.base64SelfieDir,
                                                  //base64SelfieEsq: this.state.base64SelfieEsq,
                                                  base64SelfieFim: this.state.base64SelfieFim,
                                                  base64Ccb: this.state.base64Ccb
                                                }
                                              }} >
                                                Ir para próxima etapa
                                              </Link>
                                              </>
                                          }
                                            </>
                                          : <>
                                            <Button className="font-weight-bold btn-block mt-2" color="outline-primary" size="lg" onClick={ this._finalizaFormalizacao } >
                                                Confirmar a assinatura
                                            </Button>
                                            </>
                                          }
                                          </>
                                        : null
                                      }
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    }
                    </>
                    )
                    : (
                      <>
                      { this.state.base64Video === ''
                        ? <>
                          <Col className="w-100 p-3 min-vh-100 text-center" style={ isMobile ? containerPaddingTopMobile : containerPaddingTop}>

                            <Col xs="12" sm="12" md="12" className="text-center p-0">
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
                                            fotos="fa fa-square-o"
                                            audio="fa fa-square-o"
                                          />
                                      </Col>
                                    </>
                                  : null
                                }

                                <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'backgroundColor' : '#000', 'height' : (window.screen.height * 0.85) + 'px'}}>
                                  <MediaCapturer
                                    constraints={{ audio: true, video: true }}
                                    timeSlice={10}
                                    onGranted={this.handleGranted}
                                    onDenied={this.handleDenied}
                                    onStart={this.handleStart}
                                    onStop={this.handleStop}
                                    onPause={this.handlePause}
                                    onResume={this.handleResume}
                                    onError={this.handleError}
                                    onStreamClosed={this.handleStreamClose}
                                    render={({ request, start, stop, pause, resume }) =>
                                    <div className="row text-white d-flex m-3">
                                        <div className="col-12 p-0">
                                          <video id="videoPlayerPlugin" autoPlay style={{maxWidth : '100%'}} muted></video>
                                        </div>
                                        <div className="col-12 p-2">
                                          { this.state.granted === false
                                            ? <>
                                              <h5>Você precisa autorizar o uso da câmera</h5>
                                              <button className="btn btn-lg btn-success" onClick={request}>Autorizar o uso da câmera</button>
                                              </>
                                            : <>
                                              { this.state.recording === false
                                                ? <button className="btn btn-lg btn-danger" onClick={start}>Gravar</button>
                                                : <button className="btn btn-lg btn-danger" onClick={stop}>Parar</button>
                                                /*<button onClick={pause}>Pause</button>*/
                                                /*<button onClick={resume}>Resume</button>*/
                                              }
                                              </>
                                          }
                                        </div>
                                    </div>
                                  } />
                                </Col>
                              </Row>
                            </Col>
                          </Col>
                        </>
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
                                          fotos="fa fa-square-o"
                                          audio="fa fa-square-o"
                                        />
                                    </Col>
                                  </>
                                : null
                              }
                              <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                  <CardBody>
                                    <Row className="mt-3">
                                      <Col xs="12" className="mt-3">
                                          <h5 className="text-center mb-3 font-weight-bold">Veja abaixo como ficou o vídeo</h5>
                                      </Col>
                                      <Col className="col-12 text-center">
                                        <video className="col-12 d-block" src={this.state.base64Video} controls></video>
                                      </Col>
                                      <Col xs="12" className="text-center mt-3">
                                        { this.state.selfieFim !== ''
                                          ? <>
                                              <Button className="btn-block font-weight-bold mt-2" color="outline-primary" size="lg" onClick={ this._finalizaFormalizacao }>
                                                Finalizar
                                              </Button>
                                            </>
                                          : null
                                        }
                                      </Col>
                                      <Col xs="12" sm="12" md="12" className="text-center">
                                        <Button className="btn-block font-weight-bold mt-2" color="outline-primary" onClick={() => { this.setState({ base64Video : '' }) }}>Gravar novamente</Button>
                                      </Col>
                                    </Row>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>
                          </Col>
                          </>
                        }
                        </>
                        )
                      }
                    </>
                    )
                  )
                }
          </>
        }
        </>
      }
      </div>
    );
  }
}

export default Selfie;
