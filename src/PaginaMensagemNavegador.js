import React, { Component } from 'react';
import { Col, Row, Container, Card, CardBody } from 'reactstrap';
import LayoutFactaHeader from './LayoutFactaHeader';
class PaginaMensagemNavegador extends Component {
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
                    <h3 className="text-center mb-5">Assinatura de Proposta Digital</h3>
                    <p className="text-muted">Olá <span className="font-weight-bold text-dark">{this.state.dadosCliente.DESCRICAO}</span>,</p>
                    <p className="text-muted">Você está utilizando um navegador incompatível com o sistema.</p>
                    <p className="text-muted">Sugerimos que tente utilizar um outro navegador para realizar a assinatura do seu contrato.</p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    )
  }
}
export default PaginaMensagemNavegador;
