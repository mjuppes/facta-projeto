import React, { Component } from 'react';
import { Card, CardBody, CardFooter, Col, Container, Row, Button } from 'reactstrap';
import { Link } from "react-router-dom";

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import '../../../scss/fotos.css';

class FotoCnh extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeout: 300,
      exibeCamera: false,
      etapa: 'frente',
      dataUriFrente: '',
      dataUriVerso: '',
      codigoAFOriginal: this.props.match.params.propostaId,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      proximoLink: '',
      averbador: 0,
      enviouDocumentos: true
    };

    if (this.props.location.state === undefined) {
      this.props.history.push(this.state.homeLink);
      this.state.obj_proposta = [];
      return false;
    }
    else {
      this.state.obj_proposta = this.props.location.state.obj_proposta;
    }

    if (this.state.obj_proposta.Averbador === 390 && this.state.obj_proposta.S_DADOSPESSOAIS.documentosEnviados === 0) {
      this.state.enviouDocumentos = false;
    }

    if (this.state.enviouDocumentos === true) {
      if (this.state.obj_proposta.codigotabela === 'PRE') {
        this.state.proximoLink = '/video/'+this.state.codigoAFOriginal;
      }
      else {
        this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
      }
    }
    else {
      this.state.proximoLink = '/comprovantes/'+this.state.codigoAFOriginal;
    }

  }

  onTakePhotoFrente = (dataUri) => {
    console.log('takePhoto');
    this.setState({dataUriFrente: dataUri });
  }

  removeImageFrente = () => {
    console.log('Excluir imagem');
    this.setState({dataUriFrente: '' });
  }

  onTakePhotoVerso = (dataUri) => {
    console.log('takePhoto');
    this.setState({dataUriVerso: dataUri });
  }

  removeImageVerso = () => {
    console.log('Excluir imagem');
    this.setState({dataUriVerso: '' });
  }

  proximaEtapa = (etapa) => {
    console.log('Mudar etapa: ' + etapa);
    this.setState({etapa: etapa});
  }

  render() {

    const appHeightAuto = {
      "height": "auto"
    };
    const containerPaddingTop = {
      "paddingTop": "5%"
    };

    return (
      <div className="app flex-row align-items-center" style={appHeightAuto} >
        <Container style={containerPaddingTop} >
          <Row className="justify-content-center">
            <Col md="12" lg="12" xl="12">
              <Card className="mx-4">
                <CardBody className="p-4">
                  { this.state.etapa === 'frente'
                    ? (
                      this.state.dataUriFrente !== ''
                        ?
                          <>
                            <h1 className="text-center mb-5">Foto da CNH (Frente)</h1>
                            <Row>
                              <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                <img className="d-block w-100" src={ this.state.dataUriFrente } alt='Foto tirada' style={{'maxWidth' : '90%'}} />
                                <Button className="mt-3" color="danger" onClick={ this.removeImageFrente }><i className="fa fa-trash"></i> Remover</Button>
                              </Col>
                            </Row>
                          </>
                        :
                          <>
                            <h1 className="text-center mb-5">Foto da CNH (Frente)</h1>
                            <Camera
                              onTakePhotoAnimationDone={ (dataUri) => { this.onTakePhotoFrente(dataUri); } }
                              idealResolution = {{width: 640, height: 480}}
                              style={{"maxWidth": "90%"}}
                            />
                          </>
                      )
                    : (
                      this.state.dataUriVerso !== ''
                        ?
                          <>
                            <h1 className="text-center mb-5">Foto da CNH (Verso)</h1>
                            <Row>
                              <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                <img className="d-block w-100" src={ this.state.dataUriVerso } alt='Foto tirada' style={{'maxWidth' : '90%'}} />
                                <Button className="mt-3" color="danger" onClick={ this.removeImageVerso }><i className="fa fa-trash"></i> Remover</Button>
                              </Col>
                            </Row>
                          </>
                        :
                          <>
                            <h1 className="text-center mb-5">Foto da CNH (Verso)</h1>
                            <Camera
                              onTakePhotoAnimationDone={ (dataUri) => { this.onTakePhotoVerso(dataUri); } }
                              idealResolution = {{width: 640, height: 480}}
                              style={{"maxWidth": "90%"}}
                            />
                          </>
                      )
                    }
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                      { this.state.dataUriFrente !== ''
                          ? (
                            this.state.etapa === 'frente'
                            ?
                              <>
                                <Button className="btn btn-success" onClick={ () => { this.proximaEtapa('verso') } }>
                                  Prosseguir
                                </Button>
                              </>
                            : (
                              this.state.dataUriVerso !== ''
                              ?
                                <>
                                  <Link className="btn btn-success" to={{
                                    pathname: this.state.proximoLink,
                                    state: {
                                      navegacao: true,
                                      obj_proposta: this.state.obj_proposta
                                    }
                                  }}
                                  >
                                    Prosseguir
                                  </Link>
                                </>
                              : null
                            )
                          )
                        : null
                      }
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default FotoCnh;
