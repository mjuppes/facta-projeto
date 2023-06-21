import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import DOMPurify from 'dompurify';
import axios from 'axios';
class EnvioAudioUnico extends Component {
    constructor(props) {
      super(props);

      this.state = {
        iOS : false,
        record: false,
        isRecording: false,
        gravouAudio: false,
        blobAudio: '', 
        chunks : [],
        b : '',
        n : ["start", "stop", "pause", "resume"],
        p : ["audio/webm", "audio/ogg", "audio/wav"],
        k : 1024,
        l : 1 << 20,
        audio_mimetype : '',
        _scriptAudio: '',
        modalDados : false,
        errorAudio : false
      };
      
      // FunÃ§Ã£o para iniciar a gravaÃ§Ã£o
      this.m = this.m.bind(this);
      // FunÃ§Ã£o que finaliza a gravaÃ§Ã£o
      this.w = this.w.bind(this);

      let _orgao = "INSS";
      if (this.props.averbador === 15) {
        _orgao = "SIAPE";
      }
      else if (this.props.averbador === 10) {
        _orgao = " do EXÉRCITO";
      }
      else if (this.props.averbador === 1) {
        _orgao = " do TESOURO DO ESTADO";
      }
      else if (this.props.averbador === 30) {
        _orgao = " do IPÊ";
      }
      else if (this.props.averbador === 100) {
        _orgao = " do PODER JUDICIÁRIO";
      }

      let scriptAudio = 'Eu, <span class="font-weight-bold">' + ((this.props.tipo_operacao == 35 || this.props.tipo_operacao == 36 || this.props.tipo_operacao == 37) ?  this.props.nomeRepresentanteLegal + ' representante do beneficiário ' : this.props.nomeCliente) + '</span>, ';
      if (this.props.averbador === 20095) { // NOVO DIGITAL 

        scriptAudio += 'confirmo a contratação de antecipação de saque aniversário FGTS contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ';
        scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>. ';
      } else {

          if (this.props.averbador === 390) {
            scriptAudio += 'confirmo a contratação do ' + ((this.props.tipo_operacao === 1 || this.props.tipo_operacao === 13) ? 'empréstimo' : 'refinanciamento do meu contrato') + ' <span class="font-weight-bold">FACTA FÁCIL</span> ';
            scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt + '</span> parcelas fixas mensais';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt  + '</span>, ';
            scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em minha <span class="font-weight-bold">conta corrente</span>.';
          }
          else if (this.props.averbador === 1 || this.props.averbador === 30 || this.props.averbador === 100) {
            scriptAudio += 'confirmo a contratação do empréstimo consignado, ';
            scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>. <br />';
            /*if ((this.props.averbador === 1 || this.props.averbador === 30) && this.props.tipo_operacao === 13) {
              scriptAudio += 'Necessito do empréstimo com urgência! Assim, me responsabilizo, ';
              scriptAudio += 'exclusivamente, sob as penas da lei, por realizar autenticação de ';
              scriptAudio += 'assinatura da <span class="font-weight-bold">Autorização/Anexo II</span>, <span class="font-weight-bold">Decreto 43.337/2004</span>, ';
              scriptAudio += 'correspondente ao empréstimos ora contratado, e, ';
              scriptAudio += 'entregar para instituição financeira no prazo máximo de <span class="font-weight-bold">15</span> dias.';
            }
            else if (this.props.averbador === 1) {
              scriptAudio += 'Necessito do empréstimo com urgência! Assim, me responsabilizo, ';
              scriptAudio += 'exclusivamente, sob as penas da lei, por realizar autenticação de ';
              scriptAudio += 'assinatura da Autorização de Consignação, e, entregar para ';
              scriptAudio += 'instituição financeira no prazo de <span class="font-weight-bold">30</span> dias após diminuição das ';
              scriptAudio += 'restrições de circulação, impostas pelo <span class="font-weight-bold">Decreto 55.240/2020</span>, atualizado.';
            }*/
          } else if (this.props.averbador === 3 && this.props.tipo_operacao === 33) { // CARTÃO BENEFÍCIO
            scriptAudio += 'confirmo a contratação do  <span class="font-weight-bold">CARTÃO</span> ';
            scriptAudio += 'com a opção de saque no valor <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt  + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>, ';
            scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>.';
          }
          else if (this.props.tipo_operacao === 13) { // NOVO DIGITAL
            scriptAudio += 'confirmo a contratação do empréstimo consignado ' + (this.props.averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
            scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>, ';

            if(this.props.averbador == 10) {
                scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em minha  <span class="font-weight-bold">folha de pagamento</span>';  
            } else {
               scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>';
            }

            scriptAudio += this.props.averbador === 1 || this.props.averbador === 30 || this.props.averbador === 100 ? ', e autorizo a averbação em 120 meses.' : '.';
          } else if (this.props.tipo_operacao === 14 || this.props.tipo_operacao === 18) { // REFIN DIGITAL / REFIN DA PORT DIGITAL
            scriptAudio += 'confirmo a contratação de refinanciamento do meu empréstimo consignado ' + (this.props.averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
            scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt  + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>, ';
            scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>';
            scriptAudio += this.props.averbador === 1 || this.props.averbador === 30 || this.props.averbador === 100 ? ', e autorizo a averbação em 120 meses.' : '.';
          } else if (this.props.tipo_operacao === 17) { // PORTABILIDADE CIP
            scriptAudio += 'confirmo a contratação de portabilidade de crédito do meu empréstimo consignado ' + (this.props.averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
            scriptAudio += 'de número <span class="font-weight-bold">' + this.props.contrato + '</span>, ';
            scriptAudio += 'para a <span class="font-weight-bold">FACTA FINANCEIRA</span>.';
          } else if (this.props.tipo_operacao === 28) { // PORTABILIDADE MANUAL
            scriptAudio += 'confirmo a contratação de empréstimo consignado ' + (this.props.averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
            scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt  + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>, ';

            if(this.props.averbador == 10) {
              scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em minha  <span class="font-weight-bold">folha de pagamento</span>';  
            } else {
              scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>';
            }

          } else if (this.props.tipo_operacao === 11) { // CARTÃO DIGITAL
            scriptAudio += 'confirmo a contratação de cartão consignado ' + (this.props.averbador === 10 ? 'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ' : '<span class="font-weight-bold">' + _orgao + '</span> ') + '';
            scriptAudio += 'com saque de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt  + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>, ';

            if(this.props.averbador == 10) {
              scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em minha  <span class="font-weight-bold">folha de pagamento</span>';  
            } else {
              scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>';
            }

          } else if (this.props.tipo_operacao === 29) { // REFIN CARTÃO DIGITAL
            scriptAudio += 'confirmo a contratação de refianciamento de cartão consignado ' +  'contratado junto a <span class="font-weight-bold">FACTA FINANCEIRA</span>, ';
            scriptAudio += 'com saque de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'a ser pago em <span class="font-weight-bold">' + this.props.numeroPmt  + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>, ';
            scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>.';
          } else {
            scriptAudio += 'confirmo a contratação do empréstimo <span class="font-weight-bold">CONSIGNADO</span> ';
            scriptAudio += 'no valor de <span class="font-weight-bold">' + this.props.valorProposta + '</span>, ';
            scriptAudio += 'em <span class="font-weight-bold">' + this.props.numeroPmt  + '</span> parcelas fixas mensais ';
            scriptAudio += 'de <span class="font-weight-bold">' + this.props.valorPmt + '</span>, ';
            scriptAudio += 'a ' + (this.props.numeroPmt  > 1 ? 'serem descontadas' : 'ser descontada') + ' em meu <span class="font-weight-bold">benefício</span>.';
          }

          if (this.props.averbador === 3 && this.props.vlrseguro > 0  && this.props.isComplementar === true) { // SEGURO PRESTAMISTA
            scriptAudio += ' E CONFIRMO a contratação do  Seguro Prestamista  ';
            scriptAudio += 'com direito a Assistência Telemedicina Individual.';
           
          }  else if (this.props.averbador === 3 && this.props.vlrseguro > 0  && this.props.isComplementar === false) { // SOMENTE SEGURO PRESTAMISTA

            scriptAudio = 'Eu, <span class="font-weight-bold">' + this.props.nomeCliente + '</span>, ';
            scriptAudio += 'CONFIRMO a contratação do  Seguro Prestamista  ';
            scriptAudio += 'com direito a Assistência Telemedicina Individual.';
          }

      }
      this.state._scriptAudio = scriptAudio;

  }
  
  TrackAudio = (element) => {
    var curTime = Math.floor(element.currentTime);
    console.log(curTime)   //Value in seconds.
  }

  // FunÃ§Ã£o para ver o tamanho do arquivo de Ã¡udio
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
          // Enquanto tiver data disponÃ­vel vai jogando no array chunks
          this.state.b.addEventListener('dataavailable', function(e) {
            this.state.chunks.push(e.data);
            this.setState({ audio_mimetype : e.data.type });
          }.bind(this));
          // Quando der stop, grava em um blob o chunks
          this.state.b.addEventListener('stop', async function(e) {
            var blob = new Blob(this.state.chunks, { 'type' : this.state.audio_mimetype });
            var blobURL = URL.createObjectURL(blob);
            //this.setState({ blobURL : blobURL, blobAudio : blob, gravouAudio : true, isRecording : false, audioSize : (blob.size / 1024) });
            this.state.blobURL = blobURL;
            this.state.blobAudio  = blob;
            this.state.gravouAudio = true;
            this.state.isRecording = false;
            this.state.audioSize = (blob.size / 1024);

            await this.gravaArquivoAudio();
            this.props.checkedAudioVideo(true, this.state.blobAudio);

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
    				alert("Dispositivo de gravaÃ§Ã£o nÃ£o detectado!");
    			} else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
    				//webcam or mic are already in use
    				alert("Dispositivo de gravaÃ§Ã£o jÃ¡ estÃ¡ sendo usado!");
    			} else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
    				//constraints can not be satisfied by avb. devices
    				alert("Erro na gravaÃ§Ã£o! (2253)");
    			} else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
    				//permission denied in browser
    				alert("A permissÃ£o de acesso ao microfone foi negada! VocÃª precisa autorizar para que possamos gravar o Ã¡udio.");
    			} else if (err.name === "TypeError" || err.name === "TypeError") {
    				//empty constraints object
    				alert("Erro na gravaÃ§Ã£o! ("+err.message+")");
    			} else {
    				//other errors
    				alert("Erro na gravaÃ§Ã£o! ("+err.message+")");
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
          // Enquanto tiver data disponÃ­vel vai jogando no array chunks
          this.state.b.addEventListener('dataavailable', function(e) {
            this.state.chunks.push(e.data);
            this.setState({ audio_mimetype : e.data.type });
          }.bind(this));
          // Quando der stop, grava em um blob o chunks
          this.state.b.addEventListener('stop', async function(e) {
            var blob = new Blob(this.state.chunks, { 'type' : this.state.audio_mimetype });
            var blobURL = URL.createObjectURL(blob);
            //this.setState({ blobURL : blobURL, blobAudio : blob, gravouAudio : true, isRecording : false, audioSize : (blob.size / 1024) });
            this.state.blobURL = blobURL;
            this.state.blobAudio  = blob;
            this.state.gravouAudio = true;
            this.state.isRecording = false;
            this.state.audioSize = (blob.size / 1024);

            await this.gravaArquivoAudio();
            this.props.checkedAudioVideo(true, this.state.blobAudio);
    

          }.bind(this));
          this.state.b.start();

        }.bind(this),
        // On Error
        function(err) {
          console.log(err);

          if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            //required track is missing
            alert("Dispositivo de gravaÃ§Ã£o nÃ£o detectado!");
          } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
            //webcam or mic are already in use
            alert("Dispositivo de gravaÃ§Ã£o jÃ¡ estÃ¡ sendo usado!");
          } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
            //constraints can not be satisfied by avb. devices
            alert("Erro na gravaÃ§Ã£o! (2253)");
          } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            //permission denied in browser
            alert("A permissÃ£o de acesso ao microfone foi negada! VocÃª precisa autorizar para que possamos gravar o Ã¡udio.");
          } else if (err.name === "TypeError" || err.name === "TypeError") {
            //empty constraints object
            alert("Erro na gravaÃ§Ã£o! (2259)");
          } else {
            //other errors
            alert("Erro na gravaÃ§Ã£o! (2262)");
          }
        }
      );
    }

	}

  gravaArquivoAudio = async () => {
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('AUDIO', this.state.blobAudio);
    formData.append('codigoAF', this.props.codigoAF);
    const URL_API = 'https://app.factafinanceira.com.br/gravaArquivo';

    axios.post(
    URL_API + "/gravaAudio",
    formData).then((response) => {
      this.setState({errorAudio : response.data.errorAudio})
     })
    .catch((error) => {
      console.log(error);
      console.log('error', error);
    });

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

    if(this.state.errorAudio === true) {
      this.setState({modalDados : true});
      this.deletar();
    }

    

    //this.props.checkedAudioVideo(true, this.state.blobAudio);
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
      alert('VocÃª nÃ£o habilitou a permissÃ£o de gravaÃ§Ã£o para a aplicaÃ§Ã£o.');
    } else {

    }
  };

  stop = () => {
    this.setState({blobAudio : ''});
  };

  deletar = () => {
    this.setState({gravouAudio : false, blobAudio : '', blobURL : ''});
    this.props.checkedAudioVideo(false, false);
  };

  toggleMdlDados = () => {
    (this.state.modalDados === false) ? this.setState({modalDados: true, errorAudio : false}) : this.setState({modalDados: false, errorAudio : false}); 
  }

render() {

        return (
              <div>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody>
                    {(this.state.errorAudio  === true) &&
                        <Col xs="12">
                          <Modal isOpen={this.state.modalDados} toggle={this.modalDados} className='modal-primary modal-dialog-centered' style={{'zIndex' : 9999}}>
                              <ModalHeader toggle={this.toggleMdlDados} onClick={() => this.toggleMdlDados()}>Atenção</ModalHeader>
                              <ModalBody>
                                <Row className="mt-1">
                                  <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                    <i className="fa fa-times-circle-o align-self-center h2"></i>
                                  </Col>
                                  <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                    <p className="align-self-center">Erro ao gravar Áudio tente novamente!!</p>
                                  </Col>
                                </Row>
                                <Row className="mt-1">
                                  <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                                    <Button color="success" onClick={() => this.toggleMdlDados()}>Ok</Button>
                                  </Col>
                                </Row>
                              </ModalBody>
                            </Modal>
                        </Col>
                      }

                      <Row>
                        <Col md="12" lg="12" xl="12">
                          <h5 className="text-center mb-3 font-weight-bold">Confirmação por áudio</h5>
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
                          <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" disabled={this.state.gravouAudio === false ? 'disabled' : null}
                                onClick={() =>  this.props._finalizaFormalizacao()}
                                to="#">
                                  Confirmar a assinatura
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
              </div>
        );
    }
}

export default EnvioAudioUnico;