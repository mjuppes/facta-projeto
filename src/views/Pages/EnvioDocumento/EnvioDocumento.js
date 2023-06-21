import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import Spinner from '../../Spinner';
import CameraUnico from '../CameraUnico/CameraUnico';
import './EnvioDocumento.css';
class EnvioDocumento extends Component {
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
        errorProcessoUnico: false
      };

    }

    setDocumentoUnico = (imagem) => {
      this.setState({ imagem : imagem, showCamera : false, sucessUnico: true });

      if(this.props.showBtnnewExtract === true) { //adiciona no array
        this.props.addImagemExtrato(this.state.imagem);
      }
    }

    showMessageErrorUnico = (message) => {
      this.setState({errorUnico:  true, modalDados : true, msgErroUnico: message});
    }
    
    toggleMdlDados = () => {
      (this.state.modalDados === false) ? this.setState({modalDados: true}) : this.setState({modalDados: false}); 
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
                          tipoDocumento = {this.props.tipo}
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
                                  <h5 className="text-center mb-3 font-weight-bold">{ this.props.titulo }</h5>
                                  <p className="text-center">Veja abaixo como ficou a imagem</p>
                              </Col>
                              <Col xs="12" sm="12" md="12">
                                <img src={ this.state.imagem } alt="Selfie"  style={ isMobile === true ? tamanhoImgMobile : tamanhoImgDesk} />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                {(this.props.showBtnnewExtract === true ) && 
                                  <div>
                                    <Button className="btn btn-outline-success btn-block btn-lg font-weight-bold mt-2" color="outline-success" /*onClick={this.props.showBtnNewExtract()}*/ 
                                      onClick={() => this.props.newExtract()} 
                                      to="#" > 
                                      <i className="fa fa-plus"></i> Adicionar nova foto

                                  </Button>
                                  <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger"
                                    onClick={() => this.props.deleteExtract()}> <i className="fa fa-trash"></i> 
                                      Remover
                                  </Button>
                                </div>

                                }
                                {(this.props.showBtnnewExtract !== true ) && 
                                  <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" color="outline-danger" onClick={this.props.onClick}> <i className="fa fa-trash"></i> 
                                    Remover
                                  </Button>
                                }
                                <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                  onClick={() => this.props.setDocContraCheque(this.props.tipo, this.state.imagem)}
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

export default EnvioDocumento;