import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import {isMobile} from 'react-device-detect';
import FadeIn from 'react-fade-in';

class CardCIM extends Component {

render() {

  
  const tamanhoImgMobile = {
    'width' : '60%',
    'height' : '50%'
  }
  
  const tamanhoImgDesk = {
    'width' : '70%',
    'height' : '50%'
  }
        return (
              <div>
                  <Card className="border-white shadow" style={{borderRadius: '8px', width : "fit-content"}}>
                      <CardBody>
                      <Row className="mt-3">
                        <FadeIn>
                            <h5 className="text-center mt-3 mb-3"><span className="font-weight-bold">
                              Siga essa dica para tirar a foto do documento:</span> </h5>
                            <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                <img src={ require('../../../assets/img/carteira_militar.png') } alt="Selfie" className="w-100" />
                            </Col>
                            <Col>
                              <Row className="mt-1">
                                  <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                  <i className="fa fa-camera align-self-center h4"></i>
                                  </Col>
                                  <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                  <p className="align-self-center">
                                    A CIM <span className="font-weight-bold">não</span> poderá estar danificada, a CIM deve estar legível.
                                  </p>
                                  </Col>
                              </Row>
                              <Row className="mt-1">
                                  <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                  <i className="fa fa-lightbulb-o align-self-center h4"></i>
                                  </Col>
                                  <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                    <p className="align-self-center">
                                      Caso aja, retire o documento do plástico.
                                    </p>
                                  </Col>
                              </Row>
                              <Row className="mt-1">
                                  <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                  <i className="fa fa-lightbulb-o align-self-center h4"></i>
                                  </Col>
                                  <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                  <p className="align-self-center">
                                    Confirme se a foto está com os seus dados legíveis.
                                  </p>
                                  </Col>
                              </Row>
                            <Row className="mt-3">
                                <Col xs="12" sm="12" className="text-center">
                                <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" 
                                onClick={() => this.props.getTipoDocumento('CIM')}
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

export default CardCIM;