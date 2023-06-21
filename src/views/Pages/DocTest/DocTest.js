import React, { Component } from 'react';
import { Col } from 'reactstrap';
import MediaCapturer from 'react-multimedia-capture';

import LayoutFactaCarregando from '../../../LayoutFactaCarregando';

import '../../../scss/fotos.css';

class DocTest extends Component {

  constructor(props) {

    super(props);
    this.state = {
      granted : '',
      rejectedReason : '',
      recording : '',
      paused : '',
    };

  }

  updateDimensions = () => {
    //var video = document.querySelector('div.react-html5-camera-photo video');
    //var divDoc = document.getElementById('divFotoExemplo');
    //divDoc.style.top = ((video.clientHeight - divDoc.clientHeight) / 2) + 'px';
  };

  onTakePhotoFrente = (dataUri) => {
    this.setState({dataUriFrente: dataUri });
  }

  removeImageFrente = () => {
    this.setState({dataUriFrente: '' });
  }

  onTakePhotoVerso = (dataUri) => {
    this.setState({dataUriVerso: dataUri });
  }

  removeImageVerso = () => {
    this.setState({dataUriVerso: '' });
  }

  proximaEtapa = (etapa) => {
    this.setState({etapa: etapa});
  }

  componentDidMount () {
    window.addEventListener('resize', this.updateDimensions);
    if (!navigator.mediaDevices){
      navigator.mediaDevices = navigator;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
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
        ? <LayoutFactaCarregando />
        : <>
          <Col className="w-100 p-0 min-vh-100 text-center" style={{'backgroundColor' : '#000'}}>
            <Col xs="12" sm="12" md="12" className="text-white p-3 mt-5">
              <h4>Agora precisamos tirar uma foto do seu documento de identificação (frente).</h4>
            </Col>
            <Col xs="12" sm="12" md="12" className="text-center p-0 mt-5">
              <Col xs="12" sm="12" md="12" className="p-0">
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
                <div>
                  <p>Granted: {this.state.granted.toString()}</p>
                  <p>Rejected Reason: {this.state.rejectedReason}</p>
                  <p>Recording: {this.state.recording.toString()}</p>
                  <p>Paused: {this.state.paused.toString()}</p>

                  {!this.state.granted && <button onClick={request}>Get Permission</button>}
                  <button onClick={start}>Start</button>
                  <button onClick={stop}>Stop</button>
                  <button onClick={pause}>Pause</button>
                  <button onClick={resume}>Resume</button>

                  <p>Streaming test</p>
                  <video autoPlay></video>
                </div>
              } />
              </Col>
            </Col>
          </Col>
          </>
        }
      </div>
    );
  }
}

export default DocTest;
