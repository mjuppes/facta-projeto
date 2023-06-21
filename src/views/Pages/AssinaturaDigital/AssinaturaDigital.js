import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { Link } from "react-router-dom";

import axios from 'axios';

class AssinaturaDigital extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      status: 'Closed',
      fadeIn: true,
      timeout: 300,
    };

    this.state.codigoAF = atob(this.props.match.params.propostaId);
    this.state.codigoAFOriginal = this.props.match.params.propostaId;
    this.state.dadosProposta = [];
    this.state.dadosCliente = [];

  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = async () => {
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta?codigo=' + btoa(this.state.codigoAF))
    .then(response => (this.state.dadosProposta = response.data))
    .catch(error => console.log(error));

    console.log(this.state.dadosProposta);

  }

  onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    console.log('takePhoto');
  }

  render() {
    const appHeightAuto = {
      "height": "auto"
    };
    const containerPaddingTop = {
      "paddingTop": "5%"
    };
    return (
      <div className="app flex-row align-items-center" style={ appHeightAuto } >
        <Container style={ containerPaddingTop } >
          <Row className="justify-content-center">
            <Col md="12" lg="12" xl="12">
              <Card className="mx-4">
                <CardBody className="p-4 text-center">
                  <h1 className="text-center mb-5">Assinatura Digital</h1>
                  <p>Olá <strong>{ this.state.dadosCliente.DESCRICAO }</strong>!</p>
                  <p>Falta pouco para concluirmos a contratação do seu <strong>empréstimo</strong>.</p>
                  <p>Só precisamos confirmar algumas informações antes de fazer a liberação, ok?</p>
                  <p>Ah... já ia esquecendo. Para uma melhor experiência, recomendamos realizar esse processo conectado em uma rede WI-FI :)</p>
                  <Row>
                    <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">

                      <Link className="btn btn-success" to={{
                        pathname: '/termo/'+this.state.codigoAFOriginal,
                        state: { navegacao: true, CLIENTE: this.state.dadosCliente }
                      }} >
                        Eu <strong>li</strong> e <strong>aceito</strong> os termos<i className="cui-arrow-right icons font-2xl d-block"></i>
                      </Link>
                    </Col>
                  </Row>
                </CardBody>

              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default AssinaturaDigital;
