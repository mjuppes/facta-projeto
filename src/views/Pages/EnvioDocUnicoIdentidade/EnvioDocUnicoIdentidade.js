import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import Spinner from '../../Spinner';
import CameraUnico from '../CameraUnico/CameraUnico';
import './EnvioDocUnicoIdentidade.css';

import axios from 'axios';
//const URL_API = 'https://app.factafinanceira.com.br/api2';
const URL_API = 'https://app.factafinanceira.com.br/api3';
//const URL_API = 'https://app.factafinanceira.com.br/api4';
class EnvioDocUnicoIdentidade extends Component {
    constructor(props) {
      super(props);

      this.state = {
        modalDados: false,
        imagem : '',
        errorUnico: '',
        msgErroUnico: '',
        showCamera: true,
        sucessUnico: false,
        loadSpinner: false,
        id_unico:  this.props.id_unico,
        access_token: this.props.access_token,
        mensagem : "Aguarde enviando documentos...",
        codigoAF : this.props.codigoAF,
        tipoDocumento : parseInt(this.props.tipoDocumento),
        tipo : parseInt(this.props.tipo),
        tipoRg : this.props.rg,
        etapaFinalizar : this.props.etapaFinalizar,
        scoreReprovado: false,
        tentativaUnico : this.props.tentativaUnico ,
        isOcr : false,
        isOiti: false,
        labelBtn: '',
        isEncerrar: false,
		    errorOCR: false,
        responseScore: false,
        responseProcess: false,
        retProcesso: false,
        errorProcessoUnico: false,
        isScoreExcep: false
      };


      if(this.props.isPendencia !== 'S') {

        if (parseInt(this.props.corretorClassificacao) === 1 && parseInt(this.props.mesaCreditoTipoBeneficio) === 2) { 
          this.state.labelBtn = 'Ir para próxima etapa';
        } else if (parseInt(this.props.corretorClassificacao) === 1 && parseInt(this.props.mesaCreditoTipoBeneficio) === 1 && this.props.analfabeto === 'S') { 
          this.state.labelBtn = 'Ir para próxima etapa';
        } else if(parseInt(this.props.corretorClassificacao) === 1 && parseInt(this.props.mesaCreditoTipoBeneficio) === 1 && this.props.analfabeto !== 'S' && this.props.vlrseguro > 0) { 
          this.state.labelBtn = 'Ir para próxima etapa';
        } else if (parseInt(this.props.corretorClassificacao) === 1 && parseInt(this.props.mesaCreditoTipoBeneficio) === 1 && this.props.analfabeto !== 'S') { 
          this.state.labelBtn = 'Confirmar a assinatura';
        }
        else {
          this.state.labelBtn = (parseInt(this.props.corretorClassificacao) === 1 && this.props.analfabeto !== 'S') ? 'Confirmar a assinatura' : 'Ir para próxima etapa';
        }
      } else {
        this.state.labelBtn = (this.props.isPendenciaAudio === false && this.props.isPendenciaVideo === false) ? 'Confirmar a assinatura' : 'Ir para próxima etapa';
      }
    }

    showMessageErrorUnico = (message) => {
      this.setState({showCamera: false, errorUnico:  true, modalDados : true, msgErroUnico: message});
    }
	
	  setDocumentoUnico = async (imagem) => {
      this.setState({imagem : imagem, showCamera : false, loadSpinner: true, mensagem : 'Verificando documentos aguarde...'});// trecho original descomentar depois

      if(this.props.isAnalfabetoEnvDoc === false) {
          let ret = await this.props.validaDocumento(this.state.imagem, this.state.tipoRg);

          if(ret) {
              if ((this.state.tipoRg === 'FRENTE' || this.state.tipoRg === 'FRENTE_NOVO') && ret === true) {
                  this.setState({loadSpinner : false, sucessUnico : true});
              }
              else if ((this.state.tipoRg === 'VERSO' || this.state.tipoRg === 'VERSO_NOVO') && ret === true) {

                  let retScore = await this.buscaScoreUnico(this.props.codigoAF, this.props.id_unico);
                  if(retScore) {
                       this.setState({etapaFinalizar : true, sucessUnico: true, loadSpinner: false});
                  }
              }
          } else {
            this.setState({loadSpinner: false, errorOCR:  true, modalDados : true,
              msgErroUnico: ' Não conseguimos realizar a validação do seu documento. Favor, realizar nova captura.'});
          }

        /*
          if(ret) {
            if (this.state.tipoRg == 'VERSO' || this.state.tipoRg == 'VERSO_NOVO') {
              this.getProcessoUnico(this.state.id_unico, this.state.access_token);
            } else {
              this.setState({loadSpinner : false, sucessUnico : true});
            }

          } else {
            this.setState({loadSpinner: false, errorOCR:  true, modalDados : true,
              msgErroUnico: ' Não conseguimos realizar a validação do seu documento. Favor, realizar nova captura.'});
          }
        */
      } else {
        this.setState({loadSpinner : false, sucessUnico : true});
      }

      //VOLTAR PARA O OCR
      //this.enviarDocumentos(this.state.id_unico, this.state.access_token, this.state.tipoDocumento, this.state.imagem, this.state.tipo, this.state.codigoAF);
    }
	

    enviarDocumentos = async (id_unico, access_token, tipoDocumento, imagem, tipoRG, codigoAF) => {
      this.setState({loadSpinner : true});

      const FormData = require('form-data');
      const formData = new FormData();

      formData.append('id_unico', id_unico);
      formData.append('token', access_token);
      formData.append('tipo', tipoRG);
      formData.append('tipoDocumento', tipoDocumento);
      formData.append('imagem', imagem);
      formData.append('codigoAf', codigoAF);

      await axios.post(
      URL_API + "/inserir_documento_unico",
      formData).then((response) => {

        if (this.state.tipoRg == 'VERSO' || this.state.tipoRg == 'VERSO_NOVO') {
          this.executarProcessoUnico(id_unico, access_token);
        } else {
          this.setState({loadSpinner : false, sucessUnico : true});
        }
        /*
          if(response.data.error ==  true || response.data.Typed == 0) {
            let msg = "";

            if (response.data.Typed == 0) {
                msg = "Falha ao tipificar documento";
            } else {
                msg = response.data.msg.replaceAll('Erro API -', '');
            }

            this.setState({errorUnico:  true, loadSpinner: false, modalDados : true, msgErroUnico: msg});
          } else {
            if (this.state.tipoRg == 'VERSO' || this.state.tipoRg == 'VERSO_NOVO') {
                this.executarProcessoUnico(id_unico, access_token);
            } else {
                this.setState({loadSpinner : false, sucessUnico : true});
            }
          }
          */
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
            console.log('TESTE EXECUTAR PROCESSO: '+response);
            this.getProcessoUnico(id_unico, access_token);
        }).catch((error) => {
            console.log('error', error);
        });
    }

    realodProcesso() {
      window.location.reload();
    }

    getDocumentosUnico =  (id_unico, access_token) => {
      const FormData = require('form-data');
      const formData = new FormData();

      this.setState({ mensagem : 'Finalizando...' });

      formData.append('id_unico', id_unico);
      formData.append('token', access_token);

      axios.post(
      URL_API + "/get_documentos_unico",
      formData).then((response) => {
          this.setState({loadSpinner : false, sucessUnico : true});
          if(this.state.tipoRg == 'VERSO' || this.state.tipoRg == 'VERSO_NOVO') {
            this.props.checkedFoto();
          }
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
                /*loadSpinner: false,
                sucessUnico: true,
                etapaFinalizar: true,*/
                sucessUnico : false,
                isScoreExcep: true
              });
          } else {

	          if(response.data.score == 0 || response.data.score == "") {

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

			            /*this.setState({
			              loadSpinner: false,
			              sucessUnico: true,
			              etapaFinalizar: true
			            });*/

			            this.props.checkedFoto();
                  this.state.responseScore = true;
	        	}

	        	
      	  }
      })
      .catch((error) => {
          console.log('error', error);
      });

      return this.state.responseScore;
    }

  	retornaDocumentos = () => {
      this.setState({modalDados : false});
      this.props.setDocumento();
    }


    render() {
            const containerStyleSpinner = {
              'margin-top' : '50%',
            };

            const tamanhoImgMobile = {
              'width' : '75%'
            }

            const tamanhoImgDesk = {
              'width' : '100%'
            }

			      const btn100 = {
              'width' : '100%'
            }

            const colunaBtn = {
              'margin-bottom': '10px'
            };

            return (
                  <div>
                      {(this.state.loadSpinner  == true) &&
                        <div>
                          <div style={containerStyleSpinner}>
                          <Spinner 
                            mensagem = {this.state.mensagem}
                          />
                          </div>
                        </div>
                      }

                      {(this.state.showCamera ==  true) &&
                          <div>
                            <CameraUnico
                              tipoDocumento = {this.props.rg}
                              showMessageErrorUnico = {this.showMessageErrorUnico}
                              setDocumentoUnico = {this.setDocumentoUnico}
                            />
                          </div>
                      }

                      {(this.state.errorUnico === true  || this.state.errorOCR === true) &&
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
								                {(this.state.errorUnico === true)  &&
                                  <Row className="mt-1">
                                    <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                                      <Button color="success" onClick={this.props.onClick}>Ok</Button>
                                    </Col>
                                  </Row>
                                }

                                {(this.state.errorOCR === true)  &&
                                  <Row className="mt-1">
                                      <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center" style={colunaBtn}>
                                        <Button type="submit" color="primary" style={btn100} onClick={
                                          () =>this.props.removeDocumento(this.state.tipoRg) } >Tirar nova foto</Button>
                                      </Col>
                                      <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                                        <Button color="secondary" style={btn100} onClick={() =>
                                          this.retornaDocumentos()}>Escolher outro documento</Button>
                                      </Col>
                                  </Row>
                                }
                              </ModalBody>
                            </Modal>
                        </Col>
                      }

                      {(this.state.errorProcessoUnico === true) &&
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
                                    //onClick={() => this.realodProcesso() }
                                    onClick={() => this.props.voltarInicioUnicoSelfie(this.state.tentativaUnico)}
                                    to="#">
                                    Retornar o processo
                                  </Link>
                                </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      }

                      {(this.state.sucessUnico === true) &&
                            <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                              <CardBody>
                                <Row className="mt-3">
                                  <Col>
                                    <h5>Muito bem! Veja abaixo a foto.</h5>
                                  </Col>
                                  <Col xs="12" sm="12" md="12" style={{'display' : this.state.base64SelfieFim === '' ? 'none' : 'block'}}>
                                    <img src={ this.state.imagem } alt="Selfie" style={ isMobile === true ? tamanhoImgMobile : tamanhoImgDesk} />
                                  </Col>
                                </Row>
                                <Row>
                                {(this.state.etapaFinalizar === false && this.props.isAnalfabetoEnvDoc === false) &&
                                  <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                      <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> Remover</Button>

                                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                        onClick={() => this.props.getStatusDocumento(this.state.tipoRg, this.state.imagem)}
                                        to="#">
                                        Ir para próxima etapa 
                                      </Link>
                                  </Col>
                                }

                                {(this.state.etapaFinalizar === true && this.props.isFgtsAux === true  && this.props.analfabeto !== 'S') && //Caso FGTS e não analfabeto finaliza
                                  <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                      <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> Remover</Button>
                                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                        onClick={() => this.props.getStatusDocumento(this.state.tipoRg, this.state.imagem, this.state.isOcr, this.state.isOiti, this.state.isEncerrar)}
                                        to="#">
                                         Confirmar a assinatura
                                      </Link>
                                  </Col>
                                }

                                {(this.state.etapaFinalizar === true && this.props.isAnalfabetoEnvDoc === false && (this.props.isFgtsAux === false || this.props.analfabeto === 'S')  && this.props.CTRMAG !== 'SIM') && //CASO AVERBADOR 3  INSS e outros ou analfabeto VIDEO OU AUDIO
                                  <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                      <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> Remover</Button>
                                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                       onClick={() => this.props.setEtapaAudioVideo(this.state.tipoRg, this.state.imagem, this.props.codigotabela, this.state.isOcr, this.state.isOiti, this.state.isEncerrar, this.state.isScoreExcep)}
                                        to="#">
                                          {this.state.labelBtn}
                                      </Link>
                                  </Col>
                                }

                                {(this.state.etapaFinalizar === true && this.props.isFgtsAux === false && this.props.isAnalfabetoEnvDoc === false && this.props.CTRMAG === 'SIM') && //CASO AVERBADOR 3 INSS  Regra cartão magnético menor que 90 dias
                                  <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                      <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> Remover</Button>
                                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                       onClick={() => this.props.setEtapaAudioVideo(this.state.tipoRg, this.state.imagem, this.props.codigotabela, this.state.isOcr, this.state.isOiti, this.state.isEncerrar, this.state.isScoreExcep)}
                                        to="#">
                                          {this.props.analfabeto === 'S' ?  'Ir para a próxima etapa' : 'Confirmar a assinatura' } 
                                      </Link>
                                  </Col>
                                }

								                {(this.state.etapaFinalizar === false && this.props.isAnalfabetoEnvDoc === true) &&
                                  <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                      <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> Remover</Button>
                                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                        onClick={() => this.props.getDocumentoTestemunha(this.state.tipoRg, this.state.imagem)}
                                        to="#">
                                          Ir para próxima etapa
                                      </Link>
                                  </Col>
                                }

                                

								                {(this.state.etapaFinalizar === true && this.props.isAnalfabetoEnvDoc === true) && //CASO AVERBADOR 3 INSS VIDEO OU AUDIO
                                    <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                        <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}><i className="fa fa-trash"></i> Remover</Button>
                                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                        onClick={() => this.props.getDocumentoTestemunha(this.state.tipoRg, this.state.imagem)}
                                          to="#">
                                            Confirmar a assinatura
                                        </Link>
                                    </Col>
                                }
                                </Row>
                              </CardBody>
                            </Card>
                      }

                      {(this.state.scoreReprovado === true) &&
                        <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                          <CardBody>
                            <Row>
                              <Col xs="12" sm="12">
                                <p>Ol� <span className="font-weight-bold">{ this.props.nome }</span>!</p>
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

export default EnvioDocUnicoIdentidade;