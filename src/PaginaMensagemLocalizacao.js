import React, { Component } from 'react';
import { Col, Row, Container, Card, CardBody } from 'reactstrap';
import { Link } from "react-router-dom";
import FadeIn from 'react-fade-in';
import LayoutFactaHeader from './LayoutFactaHeader';
class PaginaMensagemLocalizacao extends Component {

  constructor(props) {
    super(props);

      this.state = {
         clicouAndroid : false,
         clicouIOS: false
      }
  };
  
  render() {
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px'
    };
    return(
      <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
        <LayoutFactaHeader />
        <Row className="mt-4">
          <Col md={{size: 6, offset: 3}}>
            <Card className="border-white shadow" style={{borderRadius: '8px'}}>
              <CardBody>

                  <Row className="mt-3 text-justify">
                    <Col xs="12" sm="12">
                      <h3 className="text-center mb-5 font-weight-bold">Precisamos de sua autorização</h3>
                      <p className="text-center text-muted">Olá <span className="font-weight-bold text-dark">{ this.props.nome }</span>,</p>
                      <p className="text-center text-muted">Para realizar a assinatura digital do seu contrato, precisamos que você autorize o compartilhamento de sua localização conosco. Caso você não saiba como realizar a autorização, veja abaixo as orientações.</p>
                    </Col>
                  </Row>

                {(this.state.clicouAndroid === false && this.state.clicouIOS === false) &&
                <div>
                  <Row className="mt-1">
                    <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center" >
                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" 
                        onClick={() =>  this.setState({ clicouAndroid : true})  } 
                        to="#"
                        >
                        Android
                      </Link>
                    </Col>
                  </Row>
                  <Row className="mt-1"></Row>
                  <Row className="mt-1">
                    <Col xs="12" sm="12">
                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" 
                          onClick={() =>  this.setState({ clicouIOS : true})  } 
                          to="#"
                          >
                          IOS
                        </Link>
                    </Col>
                  </Row>
                  </div>
                }

                {this.state.clicouAndroid === true &&
                  <FadeIn>
                    <Col xs="12" sm="12">
                      <Row className="mt-3">
                        <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                          <img src={ require('./assets/img/android.png') } alt="Selfie" className="w-100" />
                        </Col>
                      </Row>
                    </Col>
                  </FadeIn>
                }

                {this.state.clicouIOS === true &&
                  <FadeIn>
                    <Col xs="12" sm="12">
                      <Row className="mt-3">
                        <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                          <img src={ require('./assets/img/iphone.png') } alt="Selfie" className="w-100" />
                        </Col>
                      </Row>
                    </Col>
                  </FadeIn>
                }

              {(this.state.clicouAndroid === true || this.state.clicouIOS === true)  &&
                <div>
                  <Row className="mt-1"></Row>
                  <Row className="mt-1">
                    <Col xs="12" sm="12">
                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" 
                          onClick={() =>  this.setState({ clicouAndroid : false, clicouIOS : false})  } 
                          to="#"
                          >
                          Voltar
                        </Link>
                    </Col>
                  </Row>
                  </div>
              }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    )
  }
}
export default PaginaMensagemLocalizacao;
