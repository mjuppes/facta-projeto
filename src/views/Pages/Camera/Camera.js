import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import '../FaceApiCamera/FaceApiCamera.css';

import LayoutFactaHeader from '../../../LayoutFactaHeader';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIni : false,
      cameraDisponivel : false,
      canContinue : true,
      marginTopMensagem : ((window.screen.height * 0.9) / 2)
    };
  }


  // verifica se o navegador é um dispositivo mobile
  isMobile() {
  	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  		return true;
  	}
  	return false;
  }

  // start Camera HTML5
  startCamera() {
    let _navigator = "";

    if (navigator.mediaDevices) {
        _navigator = navigator.mediaDevices;
    } else {
        _navigator = navigator;
    }

    _navigator.getUserMedia =
    _navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  	// get video element
    let video = document.getElementById('player');

  	video.setAttribute('autoplay', '');
  	video.setAttribute('muted', '');
  	video.setAttribute('playsinline', '');

    let constraints = {};

    // Removido o IF da validação se
    // era mobile, pois agora realizamos
    // a prova de vida também em propostas
    // Presenciais, sendo assim, poderão utilizar
    // a webcam

  	// se mobile, ajusta configurações de video para mobile
  	// if (this.isMobile()) {
  	 constraints = {
  		audio: false,
  		video: {
        width: { exact: 640 },
        height: { exact: 480 },
        facingMode: 'user' // câmera frontal
  		}
  	};
  	// }

  	// verifica suporte a getUserMedia
  	if (_navigator.getUserMedia) {
  	  // Tenta abrir a câmera de video
      _navigator.getUserMedia(constraints).then(function success(stream) {
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
          this.setState({canContinue : true, cameraDisponivel : true});
          video.play();
        }.bind(this);

  			// Cria metodo stopCamera()
  			window.stopCamera = function stopCamera() { };

        video.onended = () => { console.log('onended') };

  		}.bind(this)).catch(function(err) {
        this.setState({canContinue : false, cameraDisponivel : false});
        console.log(err);
  		}.bind(this));

  	}

  }

  stopCameraInternal = (stream) => {
    stream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
  }

  componentDidMount() {
    this.startCamera();
    document.querySelector("body").style.backgroundColor = "black";
  }

  componentDidUpdate() {
    // console.log("teste");
  }

  detectWebcam = (callback) => {
    let _navigator = "";
    if (navigator.mediaDevices) {
        _navigator = navigator.mediaDevices;
    } else {
        _navigator = navigator;
    }
    _navigator.getUserMedia = _navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    let constraints = {};
  	 constraints = {
  		audio: false,
  		video: {
        width: { exact: 640 },
        height: { exact: 480 },
        facingMode: 'user' // câmera frontal
  		}
  	};

  	if (_navigator.getUserMedia) {

      _navigator.getUserMedia(constraints).then(function success(stream) {
        callback(true);
  		}.bind(this))
      .catch(function(err) {
        console.log(err);
        callback(false);
  		}.bind(this));

  	}

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

    const contentStyle = {
        "height": "100%",
        "padding": "0px",
        "backgroundPositionX": "20px",
        "backgroundPositionY": "20px",
        "backgroundRepeat": "no-repeat",
        "textAlign": "-webkit-center",
        "backgroundSize": "100px",
      };

      const containerStyle = {
        "width": "100%",
        "height": "100%",
        "display": "inline-block",
      };

      const outerStyle = {
        "paddingTop": "0%",
        "height": "100%",
        "minHeight": "100%"
      }

      const innerStyle = {
        "minHeight": "100%",
        "bottom": "0",
        "top": "0",
        "position": "absolute",
        "left": "0",
        "right": "0",
        "backgroundColor" : "#000"
      }

      const overLayStyle =  {
        "backgroundImage": "url('https://app.factafinanceira.com.br/assets/mobile_layer-2.1.svg')",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "100% 100%",
        "height": "100%",
        "minHeight": "100%",
        "width": "100%",
        "position": "absolute",
        "top": "auto",
        "left": "auto",
        "zIndex": "1",
        "opacity": "0.50",
        "borderRadius": "0px"
      }

      const contentVideo =  {
        "borderRadius": "initial",
        "width": "100%",
        "height": "100%",
        // "backgroundColor": "initial",
        "backgroundRepeat": "round"
      }

      const divBtnStyle = {
        "bottom": "15px",
        "position": "absolute",
        "width": "100%",
        "zIndex": "1",
      }

      const divMsg = {
        "position": "absolute",
        "top":  "50%",
        "left": "50%",
        "transform": "translate(-50%,-50%)",
        "color": "white",
        "fontSize": "30px",
        "textShadow": "0 1px 0 rgba(0, 0, 0, 0.9)",
        "width": "80%",
        "zIndex": "2"
      }

      const divSorriso = {
        "position": "absolute",
        "top": "58%",
        "left": "30%",
        "width": "40%"
      }

      const divBody = {
        "padding": "0px",
        "margin": "0px",
        "height": "100%",
        "minHeight": "100%",
        "overflow": "hidden",
        //"backgroundColor": "black"
      }

    return (
      <div>
        { this.state.canContinue === true
          ? <>
            <div id="divVideoCamera" style={divBody}>
              {/*content*/}
              <div id="content" style={contentStyle}>
                {/*container*/}
                <div id="container" style={containerStyle}>
                  <div style={outerStyle}>
                    {/*inner*/}
                    <div id="inner" style={innerStyle}>
                      {/*overlay*/}
                      <div id="overlay" style={overLayStyle}></div>
                      {/*content-video*/}
                      <div id="content-video" style={contentVideo}>
                        <video id="player" autoPlay playsInline style={{"transform" : "rotateY(180deg)"}}></video>
                      </div>
                      {/*divMsg*/}
                      <div id="divMsg" style={divMsg} >
                        <img id="imgMsg"/>
                        <span id="texto"></span>
                      </div>
                      {/*divSorriso*/}
                      <div id="divSorriso" style={divSorriso}>
                        <img id="imgChallenge"/>
                      </div>
                      {/*divButton*/}
                      <div id="divButton" style={divBtnStyle}>
                        <Button className="btn-block btn-lg font-weight-bold w-75 mb-3" color="primary" onClick={this.props.onClick}>
                          Iniciar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*fc_canvas*/}
              <canvas id="fc_canvas" style={{display:"none"}}></canvas>
            </div>
            </>
          : <>
              <div className="app align-items-center" style={appHeightAuto} >
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
                {/*
                <h3 className="text-center" style={{"color" : "crimson", "marginTop" : ((this.state.marginTopMensagem - 60) + "px") }}>Não foi possível iniciar a câmera.</h3>
                <h3 className="text-center" style={{"color" : "crimson"}}>Certifique-se de ter liberado a permissão de acesso à câmera.</h3>
                */}
              </div>
            </>
        }
      </div>
    );
  }
}

export default Camera;
