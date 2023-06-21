import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import MediaCapturer from 'react-multimedia-capture';
import {isMobile} from 'react-device-detect';
import 'react-html5-camera-photo/build/css/index.css';

class EnviovideoUnico extends Component {
    constructor(props) {
      super(props);

      this.state = {
        base64Video: '',
        setRecordedChunks: [],
        granted: false,
        rejectedReason: '',
        recording: false,
        paused: false,
        permissaoVideo: true,
        exibeVideo: false,
        exibePreview: false,
        posicaoX: 0,
        srcVideo: '',
        base64SelfieFotos: [],
        setCapturing: false,
        mostraTempo: false,
        recordedChunks: [],
        setRecordedChunks: [],
        videoAtivo: true,
      };

  }

  componentDidMount() {
    window.scrollTo(0, 3);
    if (!navigator.mediaDevices){
      navigator.mediaDevices = navigator;
    }
  }

  componentDidUpdate() {
	  this.mediaChunk = [];
	}

  carregouVideo = (e) => {
    console.log(e);
    alert(e.name + " - " + e.size + " - " + e.type);
  }
  handleRequest = () => {
		console.log('Request Recording...');
	}
	handleGranted = () => {
		this.setState({ granted: true });
	}

	handleDenied = (err) => {
		this.setState({ rejectedReason: err.name });
	}

	handleStart = (stream) => {
		this.setState({
			recording: true,
      base64Video: '',
      exibeVideo: true
		});
		this.setStreamToVideo(stream);
		console.log('Recording Started.');
    // console.log(stream);
	}
  
  downloadVideo = (blob) => {
    //console.log('blob');
    var reader = new FileReader();
    //console.log(blob);
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      this.setState({ base64Video: reader.result });
      this.props.showVideo(reader.result);
      this.props.checkedAudioVideo(true);
    }.bind(this);
	}

	handleStop = (blob) => {
    console.log('Recording Stopped.');
		this.setState({
			recording: false,
      exibeVideo: false
		});
    // console.log(blob);
		//this.releaseStreamFromVideo();
		this.downloadVideo(blob);
	}

	handlePause = () =>{
		this.releaseStreamFromVideo();
		this.setState({
			paused: true
		});
	}

	handleResume = (stream) => {
		this.setStreamToVideo(stream);
		this.setState({
			paused: false
		});
	}

	handleError = (err) => {
		console.log(err);
	}

	handleStreamClose = () => {
		this.setState({ granted: false });
	}

	setStreamToVideo = (stream) => {
		//let video = this.videoPlayer.current;
    let video = document.getElementById("videoPlayerPlugin");
		if(window.URL) {

			video.srcObject = stream;
		}
		else {

			video.src = stream;
		}
	}

	releaseStreamFromVideo = () => {
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
    this.setState({ erroNaGravacao: "Preparando para inciar a gravaÃ§Ã£o" });
    this.mediaRecorderRef.current = new MediaRecorder(this.webcamRef.current.stream);
    this.setState({ erroNaGravacao: "Carregou o MediaRecorder" });
    this.mediaRecorderRef.current.ondataavailable = function(e) {
      this.state.recordedChunks.push(e.data);
      this.downloadVideo();
    }.bind(this);
    this.setState({ erroNaGravacao: "Criou funÃ§Ã£o ondataavailable" });

    this.mediaRecorderRef.current.onstart = function(e) {
        this.setState({ erroNaGravacao: "Entrou no onstart" });
    }.bind(this);

    this.mediaRecorderRef.current.start();
  }

  handleDataAvailable = (data) => {
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

  _finalizaFormalizacao = () => {
    this.props._finalizaFormalizacao();
  }
render() {

        return (
              <div>
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
                        <div >
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
                              }
                              </>
                          }
                        </div>
                    </div>
                  } />
              </div>
        );
    }
}

export default EnviovideoUnico;