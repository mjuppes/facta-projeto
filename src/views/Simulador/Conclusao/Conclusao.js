import React, { Component } from 'react';
import { Col, Container, Row, Button, CardBody, Card } from 'reactstrap';

class Conclusao extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Carregando...</div>

  constructor(props) {
    super(props);
    this.state = {
      carregando    : false,
      enviouProposta : false,
      erroNoCadastro : false,
      cpf         : '',
      autorizacao : [],
      cliente     : [],
      tabelas     : [],
      averbador   : 0,
      ocupacao    : '',
      nascimento  : '',
      renda       : 0,

      contaTabelas: 0,

      valorPmt: 0,
      valorOperacao: 0,
      codigoTabela: 0,
      primeiroVcto: 0,
      taxa: 0,
      escolheuProposta: false,

      dadosProposta : {},
      dadosPessoais : {},
      dadosComplementares : {}

    };

    var _margem_nova = localStorage.getItem('_margem_nova');
    if (_margem_nova === undefined) {
      _margem_nova = 'N';
      localStorage.setItem("_margem_nova", _margem_nova);
    }

    if (this.props.location.state === undefined) {
      if (_margem_nova === "S") {
        this.props.history.push('/margem-nova');
      }
      else {
        this.props.history.push('/emprestimo');
      }
    }
    else {
      var _nav = this.props.location.state;
      this.state.cpf = _nav.cpf;
      this.state.autorizacao = _nav.autorizacao;
      this.state.averbador = _nav.averbador;
      this.state.renda = _nav.renda;
      this.state.nascimento = _nav.nascimento;
      this.state.cliente = _nav.cliente;
      this.state.dadosProposta = Object.assign({}, _nav.dadosProposta);
      this.state.dadosPessoais = Object.assign({}, _nav.dadosPessoais);
      this.state.dadosComplementares = Object.assign({}, _nav.dadosComplementares);
    }

    // console.log(this.state);

  }

  componentDidMount() {
    // this.getTabelasSimulacao();
  }

  concluirSolicitacao = async () => {

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();

    const json_cliente = JSON.stringify(this.state.cliente);
    const json_proposta = JSON.stringify(this.state.dadosProposta);
    const json_pessoais = JSON.stringify(this.state.dadosPessoais);
    const json_complementares = JSON.stringify(this.state.dadosComplementares);

    formData.set('json_cliente', json_cliente);
    formData.set('json_proposta', json_proposta);
    formData.set('json_pessoais', json_pessoais);
    formData.set('json_complementares', json_complementares);
    formData.set('averbador', this.state.averbador);
    formData.set('cpf', this.state.cpf);
    formData.set('origem_simulacao', 'react');

    this.setState({ carregando: true, enviouProposta: true });

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/incluir_proposta',
      data: formData,
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
        console.log(response);
        this.setState({ carregando: false, erroNoCadastro: false });
    }.bind(this))
    .catch(function (response) {
        console.log(response);
        this.setState({ carregando: false, erroNoCadastro: true });
    }.bind(this));

  };

  render() {

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }

    const appHeightAuto = {
      "height": "auto",
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
    };
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',      
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '0px'
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

                      { this.state.enviouProposta === false
                        ? <>
                            <Row className="mt-3">
                              <Col xs="12">
                                <h5 className="text-justify"><span className="font-weight-bold">{ this.state.dadosPessoais.nome }</span>, você confirma a solicitação de empréstimo consignado no valor de <span className="font-weight-bold">{parseFloat(this.state.dadosProposta.valorOperacao).toLocaleString('pt-BR', formatoValor)}</span> em <span className="font-weight-bold">{this.state.dadosProposta.prazo}</span> parcelas de <span className="font-weight-bold">{this.state.dadosProposta.valorPmt !== undefined ? parseFloat(this.state.dadosProposta.valorPmt).toLocaleString('pt-BR', formatoValor) : 'R$ 999,99'}</span> a serem descontadas no seu benefício de número <span className="font-weight-bold">{this.state.dadosComplementares.matricula}</span>?</h5>
                              </Col>
                            </Row>
                            <Row className="mt-5">
                              <Col xs="12">
                                <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this.concluirSolicitacao }>
                                  CONFIRMAR SOLICITAÇÃO
                                </Button>
                              </Col>
                            </Row>
                          </>
                        : (<>
                            <Row className="mt-3">
                              <Col xs="12">
                                <h5>
                                { this.state.erroNoCadastro === true
                                  ? <i className="fa fa-times-circle fa-lg text-danger h1" style={{fontSize: '42px'}}></i>
                                  : <i className="fa fa-check-circle fa-lg text-success h1" style={{fontSize: '42px'}}></i>
                                }
                                </h5>
                                <h5 className="text-justify">
                                { this.state.erroNoCadastro === true
                                  ? 'Ops! Parece que aconteceu algum problema ao tentar cadastrar sua solicitação :('
                                  : 'Legal! Sua solicitação foi cadastrada com sucesso e em breve você deve estar recebendo um SMS com o link para realizar a formalização do seu empréstimo.'
                                }
                                </h5>
                                { this.state.erroNoCadastro === false
                                  ? <h5 className="text-primary">A Facta Financeira agradece a preferência :)</h5>
                                  : null
                                }
                              </Col>
                              { this.state.erroNoCadastro === true
                                ?
                                  <Col xs="12">
                                    <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this.concluirSolicitacao }>
                                      TENTAR NOVAMENTE
                                    </Button>
                                  </Col>
                                : null
                              }
                            </Row>
                        </>)
                      }

                    </CardBody>

                  </Card>
                </Col>
              </Row>
            </Col>
          </>
        }
      </div>
    );
  }
}

export default Conclusao;
