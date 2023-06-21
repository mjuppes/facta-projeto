import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import {isMobile} from 'react-device-detect';
import FadeIn from 'react-fade-in';
class CardRG extends Component {

render() {

    
        const tamanhoImgMobile = {
            'width' : '60%',
            'height' : '50%'
        }
        
        const tamanhoImgDesk = {
            'width' : '70%',
            'height' : '50%'
        }

        let isRgFrente = (this.props.clicouRgVerso === false) ? true : false;//'rg_frente.jpg' : 'rg_verso.jpg';
        let objRgCard = {};

        if(this.props.tipoDocumento === 'RG') {
            objRgCard = (isRgFrente) ?  {imagem : 'rg_frente.jpg', descricao : 'da FRENTE'} : {imagem : 'rg_verso.jpg', descricao : 'do VERSO'};
        }

        if(this.props.tipoDocumento === 'RGNOVO') {
            objRgCard = (isRgFrente) ?  {imagem : 'rg_novo_frente.jpg', descricao : 'da FRENTE'} : {imagem : 'rg_novo_verso.jpg', descricao : 'do VERSO'};
        }

        return (    
              <div>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody>
                      <Row className="mt-3">
                        <FadeIn>
                            <h5 className="text-center mt-3 mb-3"><span className="font-weight-bold">
                                Agora, precisamos que você tire uma foto {objRgCard.descricao} do seu RG.</span> </h5>
                            <h5 className="text-center mt-3 mb-3"><span className="font-weight-bold">
                                Veja o posicionamento adequado para captura:</span> </h5>

                            <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                <img src={ require('../../../assets/img/'+objRgCard.imagem) } alt="Selfie" className="w-40" style={ isMobile === true ? tamanhoImgMobile : tamanhoImgDesk}/>
                            </Col>
                            <Col>
                                <Row className="mt-3">
                                    <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                        <i className="fa fa-camera align-self-center h4"></i>
                                    </Col>
                                    <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                        <p className="align-self-center">Deverá ser enviada apenas a foto {objRgCard.descricao} do documento.</p>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                        <i className="fa fa-lightbulb-o align-self-center h4"></i>
                                    </Col>
                                    <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                        <p className="align-self-center">Retire o documento do plástico.</p>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                        <i className="fa fa-lightbulb-o align-self-center h4"></i>
                                    </Col>
                                    <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                        <p className="align-self-center">Após, confira se o documento ficou com os dados legíveis.</p>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col xs="12" sm="12" className="text-center">
                                    <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" 
                                    onClick={() =>  (this.props.clicouRgVerso === false ? this.props.getTipoDocumento(this.props.tipoDocumento) : this.props.enableVerso()) }
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

export default CardRG;