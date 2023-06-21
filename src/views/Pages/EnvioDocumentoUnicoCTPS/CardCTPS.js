import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import FadeIn from 'react-fade-in';
import './EnvioDocumentoUnicoCTPS.css';
class CardCTPS extends Component {

render() {
        return (
              <div>
                  <Card className="border-white shadow" style={{borderRadius: '8px', width : "fit-content"}}>
                      <CardBody>
                      <Row className="mt-3">
                        <FadeIn>
                            <h5 className="text-center mt-3 mb-3"><span className="font-weight-bold">
                              Siga essa dica para tirar a foto do documento:</span> </h5>
                            <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                <img src={ require('../../../assets/img/img_ctps.png') } alt="Selfie" className="w-100" />
                            </Col>
                            <Col>
                            <Row className="mt-3">
                                <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                <i className="fa fa-camera align-self-center h4"></i>
                                </Col>
                                <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                <p className="align-self-center"> <span className="font-weight-bold">Foto 1</span>: Dados pessoais.</p>
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                <i className="fa fa-camera align-self-center h4"></i>
                                </Col>
                                <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                <p className="align-self-center"><span className="font-weight-bold">Foto 2</span>: Qualificação civil.</p>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col xs="12" sm="12" className="text-center">
                                <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" 
                                onClick={() => this.props.getTipoDocumento('CTPS')}
                                >
                                   Tirar a foto
                                </Button>
                                </Col>
                            </Row>
                            </Col>
                          </FadeIn>
                        </Row>
                      </CardBody>
                  </Card>
              </div>
        );
    }
}

export default CardCTPS;