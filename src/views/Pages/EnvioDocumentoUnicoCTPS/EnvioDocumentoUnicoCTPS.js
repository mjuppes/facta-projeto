import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import Spinner from '../../Spinner';
import CameraUnico from '../CameraUnico/CameraUnico';

import axios from 'axios';
import { isJSXOpeningFragment } from '@babel/types';

const URL_API = 'https://app.factafinanceira.com.br/api3';
class EnvioDocumentoUnicoCTPS extends Component {
    constructor(props) {
      super(props);

      this.state = {
        imagem : '',
        errorUnico: '',
        showCamera: true,
        modalDados: false,
        loadSpinner: false,
        msgErroUnico: '',
        sucessUnico: false,
        id_unico:  this.props.id_unico,
        access_token: this.props.access_token,
        tentativaUnico : this.props.tentativaUnico,
        proximoLink: '',
        mensagem : "Aguarde enviando documentos...",
        liveness : '',
        ocrcode : '',
        codigoAF : this.props.codigoAF,
        errorProcessoUnico: false,
        tipoCTPS : this.props.ctps,
        scoreReprovado: false,
        isOcr: false,
        isOiti: false,
        labelBtn: '',
        isEncerrar: false,
        responseScore: false,
        responseProcess: false,
        retProcesso: false,
        isScoreExcep: false
      };

      if(this.props.isPendencia != 'S') {

        if(parseInt(this.props.corretorClassificacao) == 1 && parseInt(this.props.mesaCreditoTipoBeneficio) === 2) { 
          this.state.labelBtn = 'Ir para próxima etapa';
        }else if(parseInt(this.props.corretorClassificacao) == 1 && parseInt(this.props.mesaCreditoTipoBeneficio) === 1 && this.props.analfabeto === 'S') { 
          this.state.labelBtn = 'Ir para próxima etapa';
        }else if(parseInt(this.props.corretorClassificacao) == 1 && parseInt(this.props.mesaCreditoTipoBeneficio) === 1 && this.props.analfabeto !== 'S') { 
          this.state.labelBtn = 'Confirmar a assinatura';
        }
        else {
          this.state.labelBtn = (parseInt(this.props.corretorClassificacao) == 1 && this.props.analfabeto !== 'S') ? 'Confirmar a assinatura' : 'Ir para próxima etapa';
        }
      } else {
        this.state.labelBtn = (this.props.isPendenciaAudio === false && this.props.isPendenciaVideo === false) ? 'Confirmar a assinatura' : 'Ir para próxima etapa';
      }

    }


showMessageErrorUnico = (message) => {
  this.setState({showCamera: false, errorUnico:  true, modalDados : true, msgErroUnico: message});
}

setDocumentoUnico = async (imagem) => {
  this.setState({loadSpinner : true,  imagem : imagem, showCamera : false });

  if (this.props.ctps == 'CTPS_VERSO') {

    let retScore = await this.buscaScoreUnico(this.props.codigoAF, this.props.id_unico);

  } else {
      this.setState({loadSpinner : false, sucessUnico : true});
  }
  //this.enviarDocumentos(this.state.id_unico, this.state.access_token, this.state.imagem, this.state.codigoAF);
}

enviarDocumentos = async (id_unico, access_token, imagem, codigoAF) => {
  this.setState({loadSpinner : true});

  const FormData = require('form-data');
  const formData = new FormData();
  const tipoCTPS = 4;

  formData.append('id_unico', id_unico);
  formData.append('token', access_token);
  formData.append('tipo', tipoCTPS);
  formData.append('imagem', imagem);
  formData.append('codigoAf', codigoAF);

  await axios.post(
  URL_API + "/inserir_documento_unico",
  formData).then((response) => {
      if(response.data.error ===  true) {
        this.setState({errorUnico:  true, loadSpinner: false, modalDados : true, msgErroUnico: response.data.msg.replaceAll('Erro API -', '')});
        return;
      }
      this.executarProcessoUnico(id_unico, access_token);
  })
  .catch((error) => {
      console.log('error', error);
  });
}

executarProcessoUnico = async (id_unico, access_token) => {
    const FormData = require('form-data');
    const formData = new FormData();

    formData.append('id_unico', id_unico);
    formData.append('token', access_token);

    await axios.post(
    URL_API + "/executar_processo_unico",
    formData).then((response) => {
        console.log(response);
        
    })
    .catch((error) => {
        console.log('error', error);
    });

    await this.getProcessoUnico(id_unico, access_token);
}


getDocumentosUnico =  (id_unico, access_token) => {
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('id_unico', id_unico);
  formData.append('token', access_token);

  this.setState({ mensagem : 'Finalizando...' });

  axios.post(
    URL_API + "/get_documentos_unico",
    formData).then((response) => {
      console.log('Get processo');
      console.log(response);

      this.setState({loadSpinner : false, sucessUnico : true});
      this.props.checkedFoto();
  })
  .catch((error) => {
      console.log('error', error);
  });
}

toggleMdlDados = () => {
  (this.state.modalDados === false) ? this.setState({modalDados: true}) : this.setState({modalDados: false}); 
}

buscaScoreUnico = async (codigoAF, id_unico) => {
  const FormData = require('form-data');
  const formData = new FormData();

  formData.append('codigoAF', codigoAF);
  formData.append('id_unico', id_unico);

  await axios.post(
  URL_API + "/get_score_unico",
  formData).then((response) => {
          if (parseInt(this.props.averbador) === 390 && parseInt(this.props.tipoOperacao) === 14 && response.data.score < 0) { //REGRA REFINS LOJAS
              this.setState({
                loadSpinner: false,
                sucessUnico: true,
                etapaFinalizar: true,
                isScoreExcep: true
              });

              this.props.checkedFoto();
              this.state.responseScore = true;
        } else {
          if(response.data.score == 0) {
              this.setState({
                  loadSpinner: false,
                  mensagem: '',
                  errorProcessoUnico: true,
                  msgErroUnico : 'Houve erro ao processar Selfie e Documento, por favor enviar novamente!', 
                  sucessUnico: false
                });
          } else {
            if (response.data.score < -1) { //REPROVA DIRETO
              this.setState({isEncerrar : true, labelBtn: 'Confirmar a assinatura'});
            }

            if (response.data.score == 10) { //ENVIA PARA OITI
                this.state.isOiti = true;
            }

            this.setState({
              loadSpinner: false,
              sucessUnico: true,
              etapaFinalizar: true
            });

            this.state.responseScore = true;
            this.props.checkedFoto();
        }
        
    }
  })
  .catch((error) => {
      console.log('error', error);
  });

  console.log('Aguardando processo 3...')
  return this.state.responseScore;
}

render() {
        const containerStyle = {
            "width": "400px",
            "height": "600px",
        };

        const containerStyleSpinner = {
          'margin-top' : '50%',
        };

        
        const tamanhoImgMobile = {
          'width' : '75%'
        }
        
        const tamanhoImgDesk = {
          'width' : '100%'
        }

        return (
              <div>
                  {this.state.loadSpinner  === true &&
                  <div>
                    <div style={containerStyleSpinner}>
                    <Spinner 
                      mensagem = {this.state.mensagem}
                    />
                    </div>
                  </div>
                  }

                  {(this.state.showCamera  ===  true) &&
                      <CameraUnico
                      tipoDocumento = {this.props.ctps}
                      showMessageErrorUnico = {this.showMessageErrorUnico}
                      setDocumentoUnico = {this.setDocumentoUnico}
                    />
                  }

                  {(this.state.errorUnico  === true) &&
                    <Col xs="12">
                      <Modal isOpen={this.state.modalDados} toggle={this.modalDados} className='modal-primary modal-dialog-centered' style={{'zIndex' : 9999}}>
                          <ModalHeader toggle={this.toggleMdlDados} onClick={this.props.onClick}>Atenção</ModalHeader>
                          <ModalBody>
                            <Row className="mt-1">
                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                <i className="fa fa-times-circle-o align-self-center h2"></i>
                              </Col>
                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                <p className="align-self-center">{this.state.msgErroUnico}!!</p>
                              </Col>
                            </Row>
                            <Row className="mt-1">
                              <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                                <Button color="success" onClick={this.props.onClick}>Ok</Button>
                              </Col>
                            </Row>
                          </ModalBody>
                        </Modal>
                    </Col>
                  }

                  {(this.state.errorProcessoUnico  === true) &&
                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody>
                        <Row className="mt-3">
                              <Col xs="12" sm="12">
                                <p>{this.state.msgErroUnico}</p>
                                <p><i className="fa fa-meh-o fa-lg h1 text-danger"></i></p>
                              </Col>
                        </Row>
                        <Row>
                            <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                              <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                onClick={() => this.props.voltarInicioUnicoSelfie(this.state.tentativaUnico)}
                                to="#">
                                Retornar o processo
                              </Link>
                            </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  }

                  {(this.state.sucessUnico == true) &&
                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody>
                        <Row className="mt-3">
                          <Col>
                            <h5>Muito bem! Veja abaixo a foto.</h5>
                          </Col>
                          <Col xs="12" sm="12" md="12">
                            <img src={ this.state.imagem } alt="Selfie"  style={ isMobile === true ? tamanhoImgMobile : tamanhoImgDesk} />
                          </Col>
                        </Row>
                        <Row>
                                
                              {(this.props.etapaFinalizar === false  && this.props.isAnalfabetoEnvDoc === false) &&
                              <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                  <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" 
                                    onClick={this.props.onClick}><i className="fa fa-trash"></i> 
                                      Remover
                                  </Button>

                                  <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                    onClick={() => this.props.getStatusDocumento(this.state.tipoCTPS, this.state.imagem)}
                                    to="#">
                                    Ir para próxima etapa
                                  </Link>
                              </Col>
                              }


                              {(this.props.etapaFinalizar === true && this.props.isFgtsAux === true && this.props.analfabeto != 'S') &&
                                  <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                    <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> 
                                    Remover
                                    </Button>

                                    <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                      onClick={() => this.props.getStatusDocumento(this.state.tipoCTPS, this.state.imagem, this.state.isOcr, this.state.isOiti, this.state.isEncerrar)}
                                      to="#">
                                      Confirmar a assinatura 
                                    </Link>
                                  </Col>
                              }
                              {(this.props.isFgtsAux === false || this.props.analfabeto === 'S') && // colocar a condicao para o OITI
                                  <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                      <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> 
                                      Remover
                                      </Button>

                                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                        onClick={() => this.props.setEtapaAudioVideo(this.state.tipoCTPS, this.state.imagem, this.props.codigotabela, this.state.isOcr, this.state.isOiti, this.state.isEncerrar, this.state.isScoreExcep)}
                                        to="#">
                                          {this.state.labelBtn}
                                      </Link>
                                  </Col>
                              }
                        </Row>
                      </CardBody>
                    </Card>
                  }

                  {(this.state.scoreReprovado == true) &&
                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody>
                        <Row>
                          <Col xs="12" sm="12">
                            <p>Olá <span className="font-weight-bold">{ this.props.nome }</span>!</p>
                            <p>Infelizmente sua proposta foi reprovada!</p>
                            <p><i className="fa fa-meh-o fa-lg h1 text-danger"></i></p>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  }
               </div>
        );
    }
}

export default EnvioDocumentoUnicoCTPS;