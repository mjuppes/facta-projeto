import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import { Link } from "react-router-dom";
class DocumentosUnico extends Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidMount() {
    window.scrollTo(0, 3);
    
  }

  render() {

    return (
            <Card className="border-white shadow" style={{borderRadius: '8px'}}>
              <CardBody>
                <Row className="mt-3">
                  <Col xs="12" sm="12">
                    <h5 className="text-center mb-3 font-weight-bold">Envio de Documentos </h5>
                    <p className="text-justify"> Selecione abaixo o tipo de documento de identificação que você tem para enviar </p>
                  </Col>
                  <Col xs="12" sm="12">
                    {(this.props.isEstrangeiro === false  || this.props.isAnalfabetoEnvDoc === true) &&
                      <Row className="mt-3">
                        <Col xs="12" sm="12">
                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold"
                            onClick={() => this.props.setCard('RG')/*this.props.getTipoDocumento('RG')*/}
                              to="#" >
                            Carteira de Identidade
                          </Link>
                        </Col>
                      </Row>
                    }
                    {(this.props.isEstrangeiro === false || this.props.isAnalfabetoEnvDoc === true) &&
                      <Row style={{marginTop: '7px'}}>
                        <Col xs="12" sm="12">
                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" 
                            onClick={() => this.props.setCard('RGNOVO')}/*this.props.getTipoDocumento('RGNOVO')*/
                            to="#" 
                          >
                            Carteira de Identidade Nova
                          </Link>
                        </Col>
                      </Row>
                    }
                    {
                      <Row>
                        <Col xs="12" sm="12">
                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" 
                            onClick={() => this.props.setCard('CNH')}
                            to="#"  >
                            Carteira de Motorista 
                          </Link>
                        </Col>
                      </Row>
                    }
                    {(( /*this.props.averbador === 20095 ||*/  this.props.averbador === 390 || this.props.averbador === 20124) && this.props.isAnalfabetoEnvDoc === false) &&
                      <Row> 
                        <Col xs="12" sm="12">
                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" 
                            onClick={() => this.props.setCard('CTPS')}
                            to="#"  >
                            Carteira de Trabalho (CTPS)
                          </Link>
                        </Col>
                      </Row>
                    }
                    {(this.props.isEstrangeiro === true && this.props.isAnalfabetoEnvDoc === false) &&
                      <Row> 
                        <Col xs="12" sm="12">
                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" 
                            onClick={() => this.props.getTipoDocumento('RNE')}
                            to="#"  >
                              RNE – Documento Estrangeiro
                          </Link>
                        </Col>
                      </Row>
                    }

                     {/*Aqui estamos*/}

                    { (this.props.averbador === 23 || this.props.averbador === 10) &&
                      <Row className="mt-3">
                        <Col xs="12" sm="12">
                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold"
                            onClick={() => this.props.setCard('CIM')/*this.props.getTipoDocumento('CIM')*/}
                              to="#" >
                            Carteira de Identidade Militar
                          </Link>
                        </Col>
                      </Row>
                    } 
              

                  </Col>
              </Row>
            </CardBody>
          </Card>
    );
  }
}

export default DocumentosUnico;
