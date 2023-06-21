import React, { Component } from 'react';
import { Col, Container, Row, FormGroup, Input, Button, Label, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import IntlCurrencyInput from "react-intl-currency-input"
import InputMask from 'react-input-mask';
import axios from 'axios';

class Valores extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Carregando...</div>

  constructor(props) {
    super(props);
    this.state = {
      carregando : true,
      erroSimulacao: false,
      margem_nova: 'N',
      cpf : '',
      autorizacao : [],
      cliente : [],
      averbador : 0,
      ocupacao : '',
      nascimento : '',
      renda : 0,
      tipoOperacao : 13,
      tabelas : [],
      valorPmt: 0,
      msgErroForm : '',
      id_simulador: 0
    };

    this.toggleDanger = this.toggleDanger.bind(this);

    var _margem_nova = localStorage.getItem('_margem_nova');
    if (_margem_nova === undefined) {
      _margem_nova = 'N';
      localStorage.setItem("_margem_nova", _margem_nova);
    }

    this.state.margem_nova = _margem_nova;

    if (this.props.location.state === undefined) {
      if (_margem_nova === "S") {
        this.props.history.push('/margem-nova');
      }
      else {
        this.props.history.push('/emprestimo');
      }
      return false;
      // this.state.cpf = '02003752021';
      // this.state.autorizacao = {erro: true, msg: "erro na auth", codigo: 101};
    }
    else {
      var _nav = this.props.location.state;
      this.state.cpf = _nav.cpf;
      this.state.id_simulador = _nav.id_simulador;
      // this.state.autorizacao = _nav.autorizacao;
    }

    this.selOrgaoSituacao = React.createRef();
    if (_margem_nova === "S") {
      this.setState({ tipoOperacao : 27 });
    }

    // console.log(this.state);

  }

  componentDidMount() {
    this.getUsers();
  }

  toggleDanger() {
    this.setState({
      danger: !this.state.danger,
    });
  }

  getUsers = async () => {
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_cliente?cpf=' + this.state.cpf)
    .then(res => (
      this.setState({
        cliente: res.data,
        carregando: false
      })
    ))
    .catch(error => console.log(error));
  }

  simuladorEscolharProposta = async () => {

    if (this.state.averbador === 0) {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Selecione o órgão ao qual seu benefício é vinculado' });
      return false;
    }

    if (this.state.ocupacao === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe a sua ocupação' });
      return false;
    }

    if (this.state.nascimento === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe sua data de nascimento' });
      return false;
    }

    if (this.state.renda === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o valor da sua renda' });
      return false;
    }

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    formData.set('id', this.state.id_simulador);
    formData.set('averbador', this.state.averbador);
    formData.set('ocupacao', this.state.ocupacao);
    formData.set('nascimento', this.state.nascimento);
    formData.set('renda', this.state.renda);
    formData.set('etapa', 'valores');

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/grava_dados_etapa_simulador',
      data: formData,
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
      console.log("SUCESSO", "ETAPA 2");
      // console.log(response);
    })
    .catch(function (response) {
      console.log("ERRO", "ETAPA 2");
      console.log(response);
    });

    this.props.history.push({
      pathname: '/dados-proposta',
      search: '',
      state: {
        autorizacao : this.state.autorizacao,
        cpf : this.state.cpf,
        renda : this.state.renda,
        averbador : this.state.averbador,
        cliente : this.state.cliente,
        nascimento : this.state.nascimento,
        tipoOperacao : this.state.tipoOperacao,
        id_simulador : this.state.id_simulador
      }
    });

  }

  updateAverbadorEscolhido = (e) => {
    let {name, value} = e.target;
    this.setState({ averbador : parseInt(value) });
  }

  updateOcupacaoEscolhida = (e) => {
    let {name, value} = e.target;
    this.setState({ ocupacao : value });
  }

  updateValorRenda = (event, value, maskedValue) => {
    event.preventDefault();
    this.state.renda = value;
  }

  updateDataNascimento = (e) => {
    let {name, value} = e.target;
    this.setState({ nascimento : value });
  }

  render() {

    const currencyConfig = {
      locale: "pt-BR",
      formats: {
        number: {
          BRL: {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      },
    };

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
        :  <>
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

                      <Row className="mt-3 text-justify h5">
                        <Col xs="12" sm="12">
                          { this.state.cliente.DESCRICAO !== undefined
                            ? <p>{'Olá '} <span className="font-weight-bold">{this.state.cliente.DESCRICAO}</span>.</p>
                            : null
                          }
                          <p>Selecione o órgão do seu benefício</p>
                        </Col>
                      </Row>

                      <Row className="text-justify h5">
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Órgão</Label>
                            <Input type="select" name="orgao" id="orgao" onChange={this.updateAverbadorEscolhido}>
                              <option value=""> - Selecione - </option>
                              <option value="3">INSS</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="text-justify h5">
                        <Col xs="12">
                          <FormGroup className="mb-0">
                            <Label htmlFor="orgao_situacao">Ocupação</Label>
                          </FormGroup>
                          <FormGroup>
                          { this.state.averbador === 0 || this.state.averbador === 3
                            ? <>
                                <FormGroup check>
                                  <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="Aposentado" onChange={this.updateOcupacaoEscolhida}/>
                                  <Label className="form-check-label" check htmlFor="inline-radio1">Aposentado</Label>
                                </FormGroup>
                              </>
                            : <>
                                <FormGroup check>
                                  <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="Ativo" onChange={this.updateOcupacaoEscolhida}/>
                                  <Label className="form-check-label" check htmlFor="inline-radio1">{ this.state.averbador === 10 ? 'Militar' : 'Servidor' } Ativo</Label>
                                </FormGroup>
                                <FormGroup check>
                                  <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="Inativo" onChange={this.updateOcupacaoEscolhida}/>
                                  <Label className="form-check-label" check htmlFor="inline-radio1">{ this.state.averbador === 10 ? 'Militar' : 'Servidor' } Inativo</Label>
                                </FormGroup>
                              </>
                            }
                              <FormGroup check>
                                <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="Pensionista" onChange={this.updateOcupacaoEscolhida}/>
                                <Label className="form-check-label" check htmlFor="inline-radio2">Pensionista</Label>
                              </FormGroup>
                            </FormGroup>

                        </Col>
                      </Row>

                      <Row className="text-justify h5">
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="nascimento">Data de nascimento</Label>
                            <InputMask className="form-control" mask="99/99/9999" type="text" name="data_nascimento" onChange={this.updateDataNascimento} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="text-justify h5">
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao_renda">Valor da renda</Label>
                            <IntlCurrencyInput className="form-control" currency="BRL" config={currencyConfig} onChange={this.updateValorRenda} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="mt-5">
                        <Col xs="12">
                          <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this.simuladorEscolharProposta }>
                            SIMULAR
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
                  { this.state.msgErroForm }
                </ModalBody>
              </Modal>

            </Col>
          </>
        }
      </div>
    );
  }
}

export default Valores;
