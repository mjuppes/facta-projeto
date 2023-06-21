import React, { Component } from 'react';
import { Col, Container, Row, FormGroup, Button, Modal, ModalBody, ModalHeader, Card, CardBody } from 'reactstrap';
import InputMask from 'react-input-mask';

import axios from 'axios';

class Index extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Carregando...</div>

  constructor(props) {
    super(props);
    this.state = {
      cpf : '',
      autorizacao : [],
      margem_nova: props.margem_nova,
      id_simulador: 0,
      carregando: false
    };

    this.cpf = React.createRef();
    this.toggleDanger = this.toggleDanger.bind(this);
    localStorage.setItem("_margem_nova", props.margem_nova);

  }

  componentDidMount() { }

  toggleDanger() {
    this.setState({
      danger: !this.state.danger,
    });
  }

  getListaCidadesBase = async () => {
    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/get_lista_cidades',
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
        this.setState({ carregando: false, cidades: response.data });
    }.bind(this))
    .catch(function (response) {
        this.setState({ carregando: false, cidades: [] });
    }.bind(this));

  }

  validaCpfCliente(strCPF) {

    var Soma;
    var Resto;
    var i = 1;
    Soma = 0;

    if (strCPF === "00000000000") return false;

    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;

  }

  getUsers = async () => { };

  validaUsuario = async () => {

    var cpf = this.state.cpf;
    cpf = cpf.replaceAll("_", "");
    cpf = cpf.replaceAll(".", "");
    cpf = cpf.replaceAll("-", "");

    if (cpf === '' || cpf.length < 11) {
      this.toggleDanger();
      return false;
    }

    if (this.validaCpfCliente(cpf) === false) {
      this.toggleDanger();
      return false;
    }

    this.setState({ carregando: true });

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    formData.set('cpf', this.state.cpf);
    formData.set('etapa', 'index');

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/grava_dados_etapa_simulador',
      data: formData,
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
      console.log("SUCESSO", "ETAPA 1");
      // console.log(response);
      this.setState({id_simulador : response.data[0]})
    }.bind(this))
    .catch(function (response) {
      console.log("ERRO", "ETAPA 1");
      console.log(response);
    });

    this.props.history.push({
      pathname: '/dados-orgao',
      search: '',
      state: { autorizacao : this.state.autorizacao, cpf : this.state.cpf, margem_nova: this.state.margem_nova, id_simulador: this.state.id_simulador },
      props: { margem_nova: this.state.margem_nova }
    });

  }

  updateInputValue = (evt) => {
    this.setState({
      cpf: evt.target.value
    });
  }

  handleOnSearch = (string, cached) => { }

  handleOnSelect = item => { }

  handleOnFocus = () => { }

  render() {

    const appHeightAuto = {
      "height": "auto",
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
    };
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px'
    };

    return (
      <div className='app align-items-center' style={appHeightAuto} >

      { this.state.carregando
        ? (
          <>
            <Container className="flex-row align-items-center m-auto">
              <Row className="text-center">
                <Col md="12" lg="12" xl="12">
                  <div className="spinner-border text-white">
                    <span className="sr-only">Carregando...</span>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        )
        : <>
          <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
            <Row>
              <Col md="12">
                <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" />
                <p className="text-white mb-3" style={{marginTop: '-10px'}}><i className="fa fa-lock"></i> | Site seguro</p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={{size: 6, offset: 3}}>
                <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                  <CardBody>
                    <Row className="mt-3 text-justify">
                      <Col xs="12" sm="12">
                        <h3 className="font-weight-bold" style={{color: '#3498DB'}}>Olá,</h3>
                        <h5 className="mt-3">ficamos contentes em ver você por aqui.</h5>
                      </Col>
                    </Row>
                    <Row className="mt-3 text-justify">
                      <Col xs="12" sm="12">
                        <h5>Para iniciarmos a simulação, informe o número do seu CPF.</h5>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs="12">
                        <FormGroup>
                          <InputMask mask="999.999.999-99" value={this.state.cpf} onChange={this.updateInputValue} className="form-control text-center" style={{fontSize : '22px'}} type="text" name="numero_cpf" placeholder="000.000.000-00"/>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs="12" sm="12">
                        <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={this.validaUsuario}>
                          { this.state.carregando === false
                            ? 'CONTINUAR'
                            : <>
                                <Col className="spinner-grow text-light" role="status"><span className="sr-only">...</span></Col>
                              </>
                          }
                        </Button>
                      </Col>
                    </Row>

                  </CardBody>

                </Card>
              </Col>
            </Row>


            <Modal isOpen={this.state.danger} toggle={this.toggleDanger} className='modal-danger'>
              <ModalHeader toggle={this.toggleDanger}>Aviso</ModalHeader>
              <ModalBody>
                Por favor, informe um CPF válido!
              </ModalBody>
            </Modal>

          </Col>
        </>

      }

      </div>
    );
  }
}

export default Index;
