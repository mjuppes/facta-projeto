import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import {isMobile} from 'react-device-detect';
import * as faceapi from 'face-api.js';
import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import TimelineProgresso from '../../TimelineProgresso';
import '../../../scss/fotos.css';

/** Integração com API OITI **/
import CryptoJS from 'crypto-js';
import CameraFaceAPI from '../Camera/Camera';
import axios from 'axios';
import md5 from 'md5';

const URL_FACE = 'https://certiface.com.br:443/facecaptcha/service';
const URL_API = 'https://app.factafinanceira.com.br/api';
const qs = require('querystring');

let fcvarIntervalChallege = "";
let _fcvarSnaps = "";

let dia = new Date().getDate();
dia = ("0" + dia).slice(-2);
let mes = new Date().getMonth()+1;
mes = ("0" + mes).slice(-2);
let ano = new Date().getFullYear();

let token_face = md5('api_fac_' + ano + '-' + mes + '-' + dia);
let snapImagem = [];
/**************/

class PreSelfie extends Component {

  constructor(props) {

    super(props);
    this.state = {
      timeout: 300,
      exibeCamera: false,
      etapa: 'instrucao',
      dataUriFrente: '',
      carregando: false,
      clicouInicio: false,
      modalOk: false,
      clicouModalInfo: false,
      contaTentativasSelfie : 0,

      codigoAFOriginal: this.props.match.params.propostaId,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      //homeLink: '/totem-facta',
      proximoLink: '',

      base64Video: '',
      base64Ccb: '',

      base64SelfieIni: '',
      base64SelfieDir: '',
      base64SelfieEsq: '',
      base64SelfieFim: '',

      erroNaGravacao: '',

      contador: 0,
      contadorParado: 0,
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
      cameraDisponivel: true,

      selfieEtapa_1_Status: '',
      selfieEtapa_2_Status: '',

      habilitaCamera: false,

      /** Integração API OITI **/
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
      appkey : '',
      tipoOperacaoOiti : 'liveness+biometria',
      mensagemErroUnico : '',
      passouPelaOITI : false,
      responseOITI : []
      /***********************/
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
		this.releaseStreamFromVideo = this.releaseStreamFromVideo.bind(this);

    // this._carregaModels = this._carregaModels.bind(this);
    // this._detectaExpressao = this._detectaExpressao.bind(this);

    if (this.props.location.state === undefined) {
      this.props.history.push(this.state.homeLink);
      this.state.obj_proposta = [];
      return false;
    }
    else {

      var _nav = this.props.location.state;

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

      this.state.fotoDocumentoFrente = _nav.fotoDocumentoFrente !== undefined ? _nav.fotoDocumentoFrente : '';
      this.state.fotoDocumentoVerso = _nav.fotoDocumentoVerso !== undefined ? _nav.fotoDocumentoVerso : '';

      this.state.fotoExtrato = _nav.fotoExtrato !== undefined ? _nav.fotoExtrato : '';
      this.state.fotoOptante = _nav.fotoOptante !== undefined ? _nav.fotoOptante : '';

      this.state.aceitouConsultaDataprev = _nav.aceitouConsultaDataprev !== undefined ? _nav.aceitouConsultaDataprev : '';
      this.state.dataHoraAceitouDataprev = _nav.dataHoraAceitouDataprev !== undefined ? _nav.dataHoraAceitouDataprev : '';

      this.state.aceitouConta = _nav.aceitouConta !== undefined ? _nav.aceitouConta : '';
      this.state.dataHoraAceitouConta = _nav.dataHoraAceitouConta !== undefined ? _nav.dataHoraAceitouConta : '';

      this.state.aceitouSeguro = _nav.aceitouSeguro !== undefined ? _nav.aceitouSeguro : '';
      this.state.dataHoraAceitouSeguro = _nav.dataHoraAceitouSeguro !== undefined ? _nav.dataHoraAceitouSeguro : '';

      this.state.aceitouAutBoletos = _nav.aceitouAutBoletos !== undefined ? _nav.aceitouAutBoletos : '';
      this.state.dataHoraAceitouAutBoletos = _nav.dataHoraAceitouAutBoletos !== undefined ? _nav.dataHoraAceitouAutBoletos : '';

      this.state.aceitouAutTransferencia = _nav.aceitouAutTransferencia !== undefined ? _nav.aceitouAutTransferencia : '';
      this.state.dataHoraAceitouAutTransferencia = _nav.dataHoraAceitouAutTransferencia !== undefined ? _nav.dataHoraAceitouAutTransferencia : '';

      this.state.aceitouDebitoEmConta = _nav.aceitouDebitoEmConta !== undefined ? _nav.aceitouDebitoEmConta : '';
      this.state.dataHoraAceitouDebitoEmConta = _nav.dataHoraAceitouDebitoEmConta !== undefined ? _nav.dataHoraAceitouDebitoEmConta : '';

      this.state.base64Ccb = _nav.base64Ccb;

      var RETORNO_OITI_LOG = localStorage.getItem('@app-factafinanceira-formalizacao/RETORNO_OITI_LOG');
      if (RETORNO_OITI_LOG !== "" && RETORNO_OITI_LOG !== undefined && parseFloat(RETORNO_OITI_LOG) === 1.1) {
        this.state.passouPelaOITI = true;
      }

    }

    this.state.propostaSelfie = true;
    this.state.textoDigPre = 'tire uma selfie';
    this.state.labelBotao = 'Tirar Selfie';
    this.canvas = React.createRef();
    this.audioPlayer = React.createRef();
    this.webcamRef = React.createRef();
    this.mediaRecorderRef = React.createRef();

    this.audio_etapa_1 = React.createRef();
    this.audio_etapa_2 = React.createRef();
    this.audio_etapa_3 = React.createRef();
    this.audio_etapa_4 = React.createRef();

    
    this.state.proximoLink = '/video/'+this.props.match.params.propostaId;
    setTimeout(function (){
      this.toggleInfoInicial();
    }.bind(this), 1000);

  }

  updateDimensions = () => {
    var videoEffect = document.getElementById('videoUsuario');
    var rects = videoEffect.getBoundingClientRect();
    this.setState({ heightVideo: this.webcamRef.current.video.clientHeight, widthVideo: this.webcamRef.current.video.clientWidth, posicaoX: rects.x});
  };

  toggleOk = () => {
    this.setState({
      habilitaCamera: true,
      contador: 5,
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

  async _carregaModels() {
    // const MODEL_URL = 'https://app.factafinanceira.com.br/v2/models';
    // const MODEL_URL = 'http://localhost/models';
		// await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
		// await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    // await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  }

  /*
  async _detectaExpressao() {
    var video = document.getElementById('videoUsuario');
    this.setState({ selfieEtapa_1_Status : 'Iniciou o processo de detecção facial' });
    if (this.state.clicouInicio === true) {
      setInterval(() => {
        if (this.state.contador >= 0) {
          this.setState({ contador : this.state.contador - 1 });
        }
      }, 1000);
      video.addEventListener('play', () => {
        //const displaySize = { width: video.clientWidth, height: video.clientHeight };
        this.intervalDetectionNeutral = setInterval(async () => {
          let tyniOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 });
          const detections = await faceapi.detectSingleFace(video, tyniOptions).withFaceExpressions()
          if (detections !== undefined) {
            this.setState({ selfieEtapa_1_Status : 'Detectando rosto...' });
            if (this.state.contador <= 0 && detections.expressions.neutral >= 0.80 && this.state.base64SelfieIni === '') {
              this.setState({ selfieEtapa_1_Status : 'Rosto detectado... Iniciando para tirar foto neutra' });
              var videoEffect = document.getElementById('videoUsuario');
              var rects = videoEffect.getBoundingClientRect();
              var flash = document.getElementById('flash');
              flash.style.cssText = flash.style.cssText + "; opacity : 0.7; left: " + rects.x + "px;";
              this.capture("base64SelfieIni");
              setTimeout(() => {
                flash.style.cssText = flash.style.cssText + "; opacity : 0;";
              }, 300);
              if (this.state.infoModal) {
                this.toggleInfoInicial();
              }
              setTimeout(() => {this.setState({exibePreview : true, contador : 8})}, 1000);
              setTimeout(function (){
                this.setState({exibePreview : false});
                this.toggleDanger();
              }.bind(this), 4000);
              window.scrollTo(0, 3);
              this.setState({ selfieEtapa_1_Status : '' });
            }
            if (this.state.contador <= 0 && detections.expressions.happy >= 0.80 && this.state.base64SelfieFim === '' && this.state.base64SelfieIni !== '') {
              var videoEffect = document.getElementById('videoUsuario');
              var rects = videoEffect.getBoundingClientRect();
              var flash = document.getElementById('flash');
              setTimeout(() => {
                flash.style.cssText = flash.style.cssText + "; opacity : 0;";
              }, 300);
              this.capture("base64SelfieFim");
              if (this.state.danger) {
                this.toggleDanger();
              }
              window.scrollTo(0, 3);
              clearInterval(this.intervalDetection);
            }
          }
        }, 1000)
      })
    }
  }
  */

  /*
  timerIntervalHappy = () => {
    var video = document.getElementById('videoUsuario');
    this.setState({ selfieEtapa_2_Status : 'Iniciou o processo de detecção facial sorrindo' });
    this.intervalDetectionHappy = setInterval(async () => {
      let tyniOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 });
      const detections = await faceapi.detectSingleFace(video, tyniOptions).withFaceExpressions()
      if (detections !== undefined) {
        this.setState({ selfieEtapa_1_Status : 'Detectando rosto...' });
        if (this.state.contador <= 0 && detections.expressions.happy >= 0.80 && this.state.base64SelfieFim === '' && this.state.base64SelfieIni !== '') {
          this.setState({ selfieEtapa_1_Status : 'Rosto detectado... Iniciando para tirar foto sorrindo' });
          var videoEffect = document.getElementById('videoUsuario');
          var rects = videoEffect.getBoundingClientRect();
          var flash = document.getElementById('flash');
          setTimeout(() => {
            flash.style.cssText = flash.style.cssText + "; opacity : 0;";
          }, 300);
          this.capture("base64SelfieFim");
          if (this.state.danger) {
            this.toggleDanger();
          }
          window.scrollTo(0, 3);
          this.setState({ selfieEtapa_2_Status : '' });
          clearInterval(this.intervalDetectionHappy);
        }
      }
    }, 1000)
  }
  */

  componentDidMount() {
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
    if (!navigator.mediaDevices){
      navigator.mediaDevices = navigator;
    }
    window.addEventListener('resize', this.updateDimensions);
    // this._carregaModels();
    this.setState({ contador : '' })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    this.setState({ contador : '' })
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
	}

	handleStop(blob) {
		this.setState({
			recording: false,
      exibeVideo: false
		});

		this.releaseStreamFromVideo();

		console.log('Recording Stopped.');
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
		this.setState({
			granted: false
		});
	}

	setStreamToVideo(stream) {
		let video = this.videoPlayer.current;

    console.log(video);

		if(window.URL) {
			video.srcObject = stream;
		}
		else {
			video.src = stream;
		}
	}

	releaseStreamFromVideo() {
		this.videoPlayer.current.src = '';
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
    console.log("handleStartCaptureClick");
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

  componentDidUpdate() {
	  this.mediaChunk = [];
	}

  proximaEtapa = (etapa) => {
    this.setState({etapa : etapa, contador : 5});
    window.scrollTo(0, 3);
  }

  _iniciarInstrucoes = () => {

    this.setState({
      contadorParado: 3,
      liberaBotaoInstrucao: false,
      base64SelfieFim: ''
    });

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

/*
 * ##########################
 * ## Integração API OITI ##
 * ##########################
 */

  mtel(v) {
    v=v.replace(/\D/g,"");
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2");
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");
    return v;
  }

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

    await axios.post(url, data, {
        headers: headers
    })
    .then((response) => {
        response = JSON.parse(this.decChData(response.data));

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

    // if (this.state.passouPelaOITI === true && this.state.responseOITI.data !== undefined) {
    //   // console.log("Passar direto das validações da OITI, usar response antigo 2");
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
          response.data.snap =  this.state.fcvarFirstSnap;
          this.gravaRetorno(response.data.codID, response.data.cause, response.data.protocol, response.data.score);
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

      //if (response.data.codID === 1.1 || this.state.passouPelaOITI === true) { //Retornar


        let erro = true;
        if (response.data.codID === 0 && this.state.passouPelaOITI === true && erro == false) {

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

    return msg;
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
  }

  snap() {
    let video = document.querySelector('video');
    let canvas = document.getElementById('fc_canvas');
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = 320;
      ctx.canvas.height = 480;

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
  /*
  isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }
  */

/*
 * ##########################
 * ##########################
 */

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
      zIndex : 10000,
      position : 'absolute',
      top: '32%',
      left: this.state.widthVideo === 0 || this.state.widthVideo === '' ? '40%' : (((this.state.widthVideo / 2) - 80) + this.state.posicaoX) + "px",
      border: '3px dashed',
      borderRadius: '100px',
      width: '160px',
      height: '160px',
      display : (this.state.contador > 0 && this.state.habilitaCamera) ? 'block' : 'none'
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
              <Row className="mt-6">
                <Col md={{size: 10, offset: 1}}>
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
                              <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={ () => { this.proximaEtapa('selfie'); this.setState({ clicouInicio : true, contador : 5 }) } } >
                                { this.state.labelBotao }
                              </Button>
                            </Col>
                          </Row>
                        </Col>

                      </Row>
                    </CardBody>
                  </Card>
                </Col>

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

              </Row>
            </Col>
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
                      {this.state.base64SelfieFim === ''
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
                                                    fotos="fa fa-square-o"
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
                                    <Row>
                                      <Col md="12">
                                        <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" />
                                        <p className="text-white mb-3" style={{marginTop: '-10px'}}><i className="fa fa-lock"></i> | Site seguro</p>
                                      </Col>
                                    </Row>
                                    <Row className="mt-4">
                                        <Col md={{size: 8, offset: 2}}>
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
                                          <Col>
                                            <h5>Muito bem! Veja abaixo a foto.</h5>
                                          </Col>
                                          <Col xs="12" sm="12" md="12">
                                            <img src={ this.state.base64SelfieIni }  alt="Selfie Final" className={ isMobile === true ? 'w-100' : 'w-50'} />
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
                                                base64SelfieFim: this.state.base64SelfieFim,

                                                aceitouDebitoEmConta: this.state.aceitouDebitoEmConta,
                                                dataHoraAceitouDebitoEmConta: this.state.dataHoraAceitouDebitoEmConta,

                                                base64Ccb: this.state.base64Ccb
                                              }
                                            }} >
                                              Ir para próxima etapa
                                            </Link>
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
                    : null
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

export default PreSelfie;
