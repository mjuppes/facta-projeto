import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
//import LayoutFactaHeader from './LayoutFactaHeader';
class DadosDoClienteTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px'
    };

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }

    var CLIENTE = this.props.cliente;

    return(
      <>
      <Card className="border-white shadow" style={{borderRadius: '8px'}} id="bloco_DadosDoCliente">
        <CardBody className="text-left">
          <h5 className="text-center pb-4 border-bottom">Cédula de Crédito Bancário</h5>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>Emitente</label>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Nome</label>
              <p className="font-weight-bold text-capitalize"> { CLIENTE.DESCRICAO.toLowerCase() } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>CPF / MF</label>
              <p className="font-weight-bold"> { CLIENTE.CPF } </p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>RG</label>
              <p className="font-weight-bold"> { CLIENTE.RG } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Data Emissão</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{CLIENTE.EMISSAORG}</Moment></p>
            </Col>
            <Col xs="12" sm="12" xm="12">
              <label>Data Nascimento</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{CLIENTE.DATANASCIMENTO}</Moment></p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>Estado Civil</label>
              <p className="font-weight-bold text-capitalize"> { CLIENTE.ESTADO_CIVIL.toLowerCase() } </p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Nacionalidade</label>
              <p className="font-weight-bold text-capitalize"> { CLIENTE.NACIONALIDADE === "1" ? "Brasileira" : "Estrangeira" } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>Sexo</label>
              <p className="font-weight-bold text-capitalize"> { CLIENTE.SEXO === "M" ? "Masculino" : "Feminino" } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Endereço</label>
              <p className="font-weight-bold text-capitalize"> { CLIENTE.ENDERECO.toLowerCase() } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Bairro</label>
              <p className="font-weight-bold text-capitalize"> { CLIENTE.BAIRRO.toLowerCase() } </p>
            </Col>
            <Col xs="12" sm="12" xm="12">
              <label>Cidade</label>
              <p className="font-weight-bold text-capitalize"> { CLIENTE.NOME_CIDADE.toLowerCase() } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>Estado</label>
              <p className="font-weight-bold"> { CLIENTE.ESTADO } </p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>CEP</label>
              <p className="font-weight-bold"> { CLIENTE.CEP } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Telefone</label>
              <p className="font-weight-bold"> { CLIENTE.FONE !== '' ? CLIENTE.FONE : ' - ' } </p>
            </Col>
            <Col xs="12" sm="12" xm="12">
              <label>Celular</label>
              <p className="font-weight-bold"> { CLIENTE.CELULAR !== '' ? CLIENTE.CELULAR : ' - ' } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>E-mail</label>
              <p className="font-weight-bold"> { CLIENTE.EMAIL !== '' ? CLIENTE.EMAIL : ' - ' } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Nome da Mãe</label>
              <p className="font-weight-bold text-capitalize">{ CLIENTE.NOMEMAE.toLowerCase() }</p>
            </Col>
          </Row>
        </CardBody>
      </Card>
      </>
    )
  }
}
export default DadosDoClienteTemplate;
