import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
//import LayoutFactaHeader from './LayoutFactaHeader';
class DadosDoCorretorTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    var CORRETOR = this.props.corretor;

    return(
      <>
      <Card className="border-white shadow" style={{borderRadius: '8px'}} id="bloco_DadosDoCorretor">
        <CardBody className="text-left">
          <h5 className="text-center pb-4 border-bottom border-light">Dados do Corretor</h5>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Razão Social</label>
              <p className="font-weight-bold text-capitalize"> { CORRETOR.DESCRICAO.toLowerCase() } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>CNPJ / CPF</label>
              <p className="font-weight-bold"> { CORRETOR.CPF } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Endereço</label>
              <p className="font-weight-bold text-capitalize"> { CORRETOR.ENDERECO.toLowerCase() } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Bairro</label>
              <p className="font-weight-bold text-capitalize"> { CORRETOR.BAIRRO.toLowerCase() } </p>
            </Col>
            <Col xs="12" sm="12" xm="12">
              <label>Cidade</label>
              <p className="font-weight-bold text-capitalize"> { CORRETOR.NOME_CIDADE.toLowerCase() } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>CEP</label>
              <p className="font-weight-bold"> { CORRETOR.CEP } </p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Estado</label>
              <p className="font-weight-bold"> { CORRETOR.UF } </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
      </>
    )
  }
}
export default DadosDoCorretorTemplate;
