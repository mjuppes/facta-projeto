import React, { Component } from 'react';
import {Button} from 'antd';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import md5 from 'md5';
import './FaceApiCamera.css';

const URL_FACE = 'https://comercial.certiface.com.br:443/facecaptcha/service';
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

class FaceApiCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cpf: '01112634096',
      nome : 'CRISTOFER ARAUJO',
      nascimento : '01/06/1986',
        image : null,
        canContinue: true,
        fcvarFirstSnap : '',
        imgChallenge : '',
        imgMsg : '',
        fcvarSnaps : '',
        carregando: false,
        heightVideoContent: '',
        rectsContentContainer: '',
        heightImagem: '',
        buttonIni: false
    };
}

handleCredencial = async () => {
    let url = URL_API+"/get_credencial";

    this.setState({ buttonIni : true });

    _fcvarSnaps = '';
    document.getElementById("texto").innerHTML = "";

    const FormData = require('form-data');
    const formData = new FormData();

    formData.append('token_face', token_face);
    formData.append('cpf', this.state.cpf);
    formData.append('nome', this.state.nome);
    formData.append('nascimento', this.state.nascimento);

    const headers =  {'Content-Type': 'multipart/form-data' };

    await axios.post(url, formData, {
          headers: headers
    }).then((response) => {
            //console.log(response.data.appkey);
            this.setState({
                appkey : response.data.appkey
            });
            this.startCapture();
    })
    .catch((error) => {
        console.log('Error getToken: Status cod: ' + error + ', Confira o login e senha.');
    })
}

startCapture() {
    if (!this.state.canContinue) {
        console.log('erro captura');
        return false;
    }

    this.startChallenge();
}

startChallenge = async (param) => {
    let url = URL_FACE+"/captcha/challenge";

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

    fcvarIntervalChallege = setTimeout(() => {
        this.showChallengeTick(challenges, ++i)
    },  challenges[i].tempoEmSegundos * 1000 );
}

//prepara captura de imagem
snapTick() {
    let snapb64 = this.snap();

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
    let url = URL_FACE+"/captcha?nc=" + new Date().getTime();

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

        if (response.valid) {
            // passou no prova de vida e biometria
            this.checkAnimStart();
        } else {
            // reprovou no prova de vida ou na biometria
            let msg = this.crossAnimStart(response);
            console.log(msg);
        }

        //informa resltados
        this.onFinishFaceCaptcha(response);
    })
    .catch((error) => {
        console.log('erro');
    });
}

onFinishFaceCaptcha = async (response) => {
    let url = URL_API+"/get_result";

    const headers =  {'Content-Type': 'multipart/form-data' };
    const FormData = require('form-data');

    const formData = new FormData();
    formData.append('appkey', this.state.appkey);
    formData.append('token_face', token_face);

    await axios.post(url, formData, {
          headers: headers
    }).then((response) => {
        document.getElementById("imgChallenge").src = "";
        document.getElementById("imgMsg").src = "";

        let msg = (response.data.valid) ? 'FUNCIONOU' : this.crossAnimStart(response);
        document.getElementById("texto").innerHTML = "<font color='red' style='font-size:20px'>TERMINOU "+msg+"</font>";

        setTimeout(() => {
            document.getElementById("texto").innerHTML = "";
            this.setState({buttonIni : false});
        },  3000);

        console.log(response);
    })
    .catch((error) => {
        console.log('Error getToken: Status cod: ' + error + ', Confira o login e senha.');
    })
}

checkAnimStart() {
    window.location.reload(false);
}

crossAnimStart = (responseCaptcha) => {
    let msg = '';

    switch (responseCaptcha.codID) {
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

    this.setState({
        image : this.snap()
    });

    let canvas = document.getElementById('image_canvas');
    let ctx = canvas.getContext("2d");

    let img = new Image();
    img.onload = function() {
		// Desenha a imagem capturada no centro do canvas
        ctx.drawImage(img,
            canvas.width / 2 - img.width / 2,
            canvas.height / 2 - img.height / 2);
    };

    //img.src = this.state.image;

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
    //ctx.drawImage(video, startX, startY, widthReal, heightReal, 0, 0, ctx.canvas.width, ctx.canvas.height); comentado para n�o aparecer

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

    let constraints = "";

	// se mobile, ajusta configurações de video para mobile
	if (this.isMobile()) {

		 constraints = {
			audio: false,
			video: {
				/*width: { exact: 1280 },
                height: { exact: 720 },
                */
                width: { exact: 320 },
                height: { exact: 480 },
				facingMode: 'user' // câmera frontal
			}
		};
	}

	// verifica suporte a getUserMedia
	if (_navigator.getUserMedia) {

		// tenta abrir a câmera de video
        _navigator
			.getUserMedia(constraints)
			.then(function success(stream) {
                video.srcObject = stream;
                video.onloadedmetadata = function(e) {
                    video.play();
                };

				// cria metodo stopCamera()
				window.stopCamera = function stopCamera() {
					//stopCameraInternal(stream); //ver com ricardo
				};
			}).catch(function(err) {
               // this.setState({canContinue : false});

               console.log('erro: '+err);
				//addMessage('No camera! ' + err);
			});
	}
}
stopCameraInternal = (stream) => {
    stream.getVideoTracks().forEach(function (track) {
        track.stop();
    });
}

componentDidMount() {
    this.startCamera();
}

render() {

    const contentStyle = {
        "height": "100%",
        "padding": "0px",
        "backgroundPositionX": "20px",
        "backgroundPositionY": "20px",
        "backgroundRepeat": "no-repeat",
        "textAlign": "-webkit-center",
        "backgroundSize": "100px",
        "backgroundColor": "black"
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
        "min-height": "100%",
        "bottom": "0",
        "top": "0",
        "position": "absolute",
        "left": "0",
        "right": "0",
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
        "backgroundColor": "initial",
        "backgroundRepeat": "round"
    }

    let display = (this.state.buttonIni) ? "none" : "";

    const divBtnStyle = {
        "bottom": "15px",
        "position": "absolute",
        "width": "100%",
        "z-index": "1",
        "display": display
    }

    const divMsg = {
        "position": "absolute",
        "top":  "50%",
        "left": "50%",
        "transform": "translate(-50%,-50%)",
        "color": "white",
        "font-size": "30px",
        "text-shadow": "0 1px 0 rgba(0,0,0,.9)",
        "width": "100%",
        "zIndex": "2"
    }

    const divSorriso = {
        "position": "absolute",
        "top": "58%",
        "left": "70px",
        "width": "58%"
    }

    const divBody = {
        "padding": "0px",
        "margin": "0px",
        "height": "100%",
        "min-height": "100%",
        "overflow": "hidden",
        "backgroundColor": "black"
    }


    const btnStyle = (this.state.buttonIni) ? {"display":"none", "position": "absolute"} : {};

   return (
       <div style={divBody} >
            <div id="content" style={contentStyle}>
                <div id="container" style={containerStyle}>
                    <div style={outerStyle}>
                        <div id="inner" style={innerStyle}>
                            <div id="overlay" style={overLayStyle}></div>
                            <div id="content-video" style={contentVideo}>
                                <video id="player"  autoplay playsinline></video>
                            </div>
                            <div id="divMsg" style={divMsg} >
                                <img id="imgMsg"   src={this.imgMsg}/>
                                <span id="texto" ></span>
                            </div>
                            <div id="divSorriso" style={divSorriso}>
                                <img id="imgChallenge"   src={this.imgChallenge}/>
                            </div>
                            <div id="divButton" style={divBtnStyle}>
                                <Button  className="btn btn-outline-primary btn-block btn-lg font-weight-bold"  onClick={this.handleCredencial.bind(this)}>
                                Iniciar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <canvas id="fc_canvas"></canvas>
        </div>
    );
  }
}

export default FaceApiCamera;
