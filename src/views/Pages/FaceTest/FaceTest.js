import React, { Component } from 'react';
import { Col, } from 'reactstrap';
import Webcam from "react-webcam";

import LayoutFactaCarregando from '../../../LayoutFactaCarregando';

import * as faceapi from 'face-api.js';

import '../../../scss/fotos.css';

class FaceTest extends Component {

  constructor(props) {

    super(props);
    this.state = {
      exibeCamera: false,
      dataUriFrente: '',
      carregando: false,
      capturing: false,
      setCapturing: false,
      mostraTempo: false,
      contador: 5,
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
      labelExpression: '',
      errorLog: '',
      selfieIni: '',
      selfieSorrindo: '',
      base64SelfieIni: '',
      base64SelfieFim: '',
      posicaoX: 0,
    };

    this._carregaModels = this._carregaModels.bind(this);
    this._detectaExpressao = this._detectaExpressao.bind(this);

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

    this._finalizaFormalizacao = this._finalizaFormalizacao.bind(this);

    this.setState({propostaSelfie : true, textoDigPre: 'tire uma selfie', labelBotao: 'Tirar Selfie'});
    this.canvas = React.createRef();
    this.audioPlayer = React.createRef();
    this.webcamRef = React.createRef();
    this.mediaRecorderRef = React.createRef();

  }

  updateDimensions = () => {
    var videoEffect = document.getElementById('videoUsuario');
    var rects = videoEffect.getBoundingClientRect();
    this.setState({ heightVideo: this.webcamRef.current.video.clientHeight, widthVideo: this.webcamRef.current.video.clientWidth, posicaoX : rects.x});
  };

  async _carregaModels() {
    const MODEL_URL = 'https://app.factafinanceira.com.br/face-recog/models';
    //const MODEL_URL = 'http://localhost/models';
		await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
		await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  }

  async _detectaExpressao() {
    var video = document.getElementById('videoUsuario');
    video.addEventListener('play', () => {
      const displaySize = { width: video.clientWidth, height: video.clientHeight };
      var contaSegundos = 0;
      setInterval(async () => {
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
        if (detections !== undefined) {
          if (this.state.contador <= 0 && detections.expressions.neutral >= 0.80 && this.state.base64SelfieIni === '') {
            console.log(detections.expressions);

            var videoEffect = document.getElementById('videoUsuario');
            var rects = videoEffect.getBoundingClientRect();
            var flash = document.getElementById('flash');

            flash.style.cssText = flash.style.cssText + "; opacity : 0.7; left: " + rects.x + "px;";
            setTimeout(() => {
              flash.style.cssText = flash.style.cssText + "; opacity : 0;";
              this.capture("base64SelfieIni");
            }, 300);
            //
            //
          }
          if (detections.expressions.happy >= 0.80 && this.state.base64SelfieFim === '') {
            console.log(detections.expressions);
            //this.capture("base64SelfieFim");
            var imageFinal = document.getElementById('imagemPrintSorriso');
            imageFinal.src = this.state.base64SelfieFim;
          }
        }

      }, 2000)
    })
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

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this._carregaModels();

    setInterval(() => {
      if (this.state.contador >= 0) {
        this.setState({ contador : this.state.contador - 1 });
      }
    }, 1000);

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

  componentDidUpdate() {
	  this.mediaChunk = [];
	}

  downloadVideo(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      this.setState({ base64Video: reader.result });
    }.bind(this);
	}

  proximaEtapa = (etapa) => {
    this.setState({etapa: etapa});
  }

  _iniciarInstrucoes = () => { }

  _finalizaFormalizacao = async () => { }

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

    const styleContador = {
      fontSize : '96px',
      zIndex : 10000,
      position : 'absolute',
      top: '32%',
      left: (((this.state.widthVideo / 2) - 80) + this.state.posicaoX) + "px",
      border: '3px dashed',
      borderRadius: '100px',
      width: '160px',
      height: '160px',
      display : 'block'
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

      { this.state.carregando
        ? <LayoutFactaCarregando />
        : <>
          <Col className="w-100 p-0 min-vh-100 text-center" style={{'backgroundColor' : '#000'}}>
              <Col xs="12" sm="12" md="12" className="text-white p-3 mt-5">
                { this.state.base64SelfieIni === ''
                  ? <h4>Fique parado na frente da câmera para que possamos tirar uma selfie.</h4>
                  : this.state.base64SelfieFim === ''
                    ? <h4>Legal! Agora precisamos que você sorria para tirarmos outra selfie.</h4>
                    : <h4>Muito bem! Veja abaixo a foto.</h4>
                }
              </Col>
              <Col xs="12" sm="12" md="12" className="text-center p-0 mt-5">
                <Col xs="12" sm="12" md="12" className="p-0" style={{'display' : this.state.base64SelfieFim === '' ? 'block' : 'none'}}>
                  <Webcam
                    id="videoUsuario"
                    audio={false}
                    ref={this.webcamRef}
                    style={{maxWidth: '98%'}}
                    onUserMediaError={() => { this.setState({ videoAtivo: false }) }}
                    onUserMedia={() => {
                      this.setState({ videoAtivo: true });
                      setTimeout(function(){
                        var videoEffect = document.getElementById('videoUsuario');
                        var rects = videoEffect.getBoundingClientRect();
                        this.setState({
                          heightVideo : this.webcamRef.current.video.clientHeight,
                          widthVideo : this.webcamRef.current.video.clientWidth,
                          posicaoX : rects.x})
                      }.bind(this), 300);
                      this._detectaExpressao();
                    }}
                    screenshotFormat={'image/png'}
                    videoConstraints={{facingMode: "user"}}
                    mirrored={true}
                  />

                  <span className="text-white" style={styleContador}>{ this.state.contador }</span>
                  <div id="flash" style={styleFlash}></div>

                </Col>

                <Col xs="12" sm="12" md="12" style={{'display' : this.state.base64SelfieFim === '' ? 'none' : 'block'}}>
                  <img id="imagemPrintSorriso" className="w-100" />
                </Col>
                <Col xs="12" sm="12" md="12">
                  <canvas ref={this.canvas}></canvas>
                </Col>
              </Col>

          </Col>
          </>
        }
      </div>
    );
  }
}

export default FaceTest;
