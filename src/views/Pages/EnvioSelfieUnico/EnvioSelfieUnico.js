import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import Spinner from '../../Spinner';
import CameraUnico from '../CameraUnico/CameraUnico';

import axios from 'axios';

const URL_API = 'https://app.factafinanceira.com.br/api3';
const URL_API_BIO = 'https://app.factafinanceira.com.br/API3PROD';
let imagemTeste = ``;



class EnvioSelfieUnico extends Component {
    constructor(props) {
      super(props);

      this.state = {
        imagem : '',
        id_unico: false,
        id_tabela_unico: '',
        access_token: '',
        loadSpinner: false,
        tipoDocumento: '',
        showCamera: true,
        errorUnico: false
      };
    }

    getImagemUnico = (imagem) => {
      this.setState({ imagem : 'data:image/jpeg;base64,' + imagem.base64, encrypted : imagem.encrypted}); //retirar comentario
      this.handleCredencial();
    }

    showMessageErrorUnico = (message) => {
      this.setState({showCamera : false, errorUnico : true, modalDados : true, msgErroUnico : message});
    }

    handleCredencial() {
      this.setState({loadSpinner : true, showCamera : false, mensagem : 'Enviando imagem selfie aguarde...'})

      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('CODIGO_AF', this.props.codigoAF);
      axios.post(URL_API + "/get_token_acesso_unico_homol",
      formData).then(async (response) => {

        this.setState({ access_token : response.data.access_token });

        if(this.props.id_inclusao === false) {
          this.getIdUser(response.data.access_token, this.state.imagem);
        } else {
            let reTokenBio = await this.getTokenBiometrico();
            let setResponseToken = await this.gravaReponseTokenBio();

            if (this.state.authenticated === false || this.state.authenticated === undefined) { //se não existir na unico
                this.getIdUser(response.data.access_token, this.state.imagem);
            } else {
                this.setState({loadSpinner : false, sucessUnico: true});
            }
        }



      })
      .catch((error) => {
        console.log(error)
      });
    }

    getTokenBiometrico = async (access_token) => {
      const FormData = require('form-data');
      const formData = new FormData();

      formData.append('processId', this.props.id_inclusao); //Valida se o mesmo id existe na base da Unico
      formData.append('imagem', this.state.imagem);
      formData.append('encrypted', this.state.encrypted);
      formData.append('token', this.state.access_token);

      await axios.post(
        URL_API_BIO + "/get_token_biometrico",
        formData).then((response) => {
          this.setState({ authenticated : response.data.authenticated });

          
        })
        .catch((error) => {
          console.log(error);
          console.log('error', error+' teste agora')
        });
    }

    
    gravaReponseTokenBio = async () => {
      const FormData = require('form-data');
      const formData = new FormData();

      formData.append('id_inclusao', this.props.id_inclusao); //Valida se o mesmo id existe na base da Unico
      formData.append('codigoAF', this.props.codigoAF);
      formData.append('authenticated', this.state.authenticated);

      await axios.post(
        URL_API_BIO + "/set_token_biometrico",
        formData).then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          console.log('error', error+' teste agora');
        });
    }

    getIdUser = async (access_token, imagem) => {
      const FormData = require('form-data');
      const formData = new FormData();

      formData.append('token', access_token);
      formData.append('CODIGO_AF', this.props.codigoAF);

      if(this.props.isRepresentanteLegal === false) { //Se for diferente tipo operação 35 então segue normal se não valida nome e cpf do representante legal
        formData.append('cpf', this.props.cpf);
        formData.append('nome', this.props.nome);
      } else {
        formData.append('cpf', this.props.cpfRepresentanteLegal);
        formData.append('nome', this.props.nomeRepresentanteLegal);
      }

      formData.append('nascimento', this.props.nascimento);
      formData.append('img', imagem);
      formData.append('encrypted', this.state.encrypted);

      await axios.post(
        URL_API + "/get_id_user_unico",
        formData).then((response) => {
          let msgErroUnico = (response.data.msg != undefined) ? response.data.msg.replaceAll('Erro API -', '') : 'Erro ao tirar Selfie tente novamente';
          if (response.data.error === true || Number.isInteger(response.data.id_tabela_unico) !== true || parseInt(response.data.id_tabela_unico) === 0) {
              this.setState({errorUnico :  true, loadSpinner : false, modalDados : true, msgErroUnico : msgErroUnico});
              return;
          }

          this.setState({id_unico : response.data.id_unico, id_tabela_unico : response.data.id_tabela_unico, access_token : access_token});
          this.getProcessoUnico()
        })
        .catch((error) => {
          console.log(error);
          console.log('error', error+' teste agora');
        });
    }

    getProcessoUnico = async () => {
      this.setState( { mensagem : 'Aguarde ainda estamos processando...' } );

      const FormData = require('form-data');
      const formData = new FormData();

      formData.append('id_unico',this.state.id_unico);
      formData.append('token', this.state.access_token);
      formData.append('id_tabela_unico', this.state.id_tabela_unico);
      formData.append('tipo_operacao', this.props.tipo_operacao);
      formData.append('codVinculado', this.props.codVinculado);

      await  axios.post(
        URL_API + "/get_processo_unico",
        formData).then((response) => {

            if (parseInt(response.data.liveness) === 2 || parseInt(response.data.ocrcode) === 2) {
              this.setState({
                loadSpinner: false, mensagem: '', 
                errorProcessoUnico: true,
                msgErroUnico : 'Houve erro ao processar Selfie, por favor enviar novamente!'});
            } else {
              this.setState({loadSpinner : false, sucessUnico: true});
            }
      })
      .catch((error) => {
      console.log('error', error);
      });

      
    }

    toggleMdlDados = () => {
      (this.state.modalDados === false) ? this.setState({modalDados: true}) : this.setState({modalDados: false});
    }

    getCredencialOiti = () => {
      let url = URL_API + "/get_credencial";
      const FormData = require('form-data');
      const formData = new FormData();

      //formData.append('token_face', token_face);
      formData.append('cpf', this.state.cpf);
      formData.append('nome', this.state.nome);
      formData.append('nascimento', this.state.nascimento);

      if (this.state.passouPelaOITI === true) {
        formData.append('operacao', 'liveness');
      } else {
        formData.append('operacao', this.state.tipoOperacaoOiti);
      }

     /*
      await axios.post(url, formData, {
          headers: headers_1
        }).then((response) => {

          if (typeof response.data === "string" && response.data.indexOf('Sorry, the page you requested is not available') !== -1) {
          }
          else if (response.data.erro !== undefined && response.data.erro === true) {
          }
          else {
            this.setState({ appkey : response.data.appkey });
            this.startCapture();
          }
        });
    */
    }

    render() {
        const containerStyle = {
            "width": "400px",
            "height": "600px",
        };

        const tamanhoImgMobile = {
          'width' : '75%'
        }
        
        const tamanhoImgDesk = {
          'width' : '100%'
        }

        const containerStyleSpinner = {
          'margin-top' : '50%',
        };

        return (
              <div>
                  {this.state.loadSpinner  == true &&
                    <div>
                      <div style={containerStyleSpinner}>
                        <Spinner 
                          mensagem = {this.state.mensagem}
                        />
                      </div>
                    </div>
                  }

                  
                  {(this.state.showCamera  ===  true) &&
                    <div style={containerStyle}>
                        <CameraUnico
                            tipoDocumento = 'SELFIE'
                            showMessageErrorUnico = {this.showMessageErrorUnico}
                            getImagemUnico = {this.getImagemUnico}
                        />
                    </div>
                  }

                  {(this.state.errorUnico === true) &&
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
                                    onClick={() => this.props.voltarInicioUnicoSelfie(this.props.tentativaUnico)}
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
                            <img src={ this.state.imagem } alt="Selfie" style={ isMobile === true ? tamanhoImgMobile : tamanhoImgDesk} />
                          </Col>
                          <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                              <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                onClick={() => this.props.getStateSelfie(this.state.access_token, this.state.id_unico, this.state.imagem, this.state.id_tabela_unico)}
                                to="#">
                                Ir para próxima etapa
                              </Link>
                          </Col>
                        </Row> 
                      </CardBody>
                    </Card>
                  }
               </div>
        );
    }
}

export default EnvioSelfieUnico;