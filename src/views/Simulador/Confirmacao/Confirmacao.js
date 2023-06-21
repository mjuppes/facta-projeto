import React, { Component } from 'react';
import { Col, Container, Row, FormGroup, Button, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
import axios from 'axios';

class Confirmacao extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Carregando...</div>

  constructor(props) {
    super(props);
    this.state = {
      carregando : true,
      erroSimulacao: false,
      msgPublicoNaoAtendido: '',
      outrosValores: false,
      novaSimulacao: false,
      cpf : '',
      autorizacao : [],
      cliente : [],
      tabelas : [],
      averbador : 0,
      ocupacao : '',
      nascimento : '',
      renda : 0,

      contaTabelas: 0,

      valorPmt: 0,
      valorOperacao: 0,

      valorPmt_original: 0,
      valorOperacao_original: 0,

      codigoTabela: 0,
      primeiroVcto: 0,
      taxa: 0,
      escolheuProposta: false,
      margem_nova: 'N',
      arrDadosProposta: [],
      autorizouDataprev: true,
      tipoOperacao: 13,
      valorMaximoEmprestimo: 50000,
      valorContratoSelecionado: 400,
      id_simulador : 0
    };

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
    }
    else {
      var _nav = this.props.location.state;
      this.state.cpf = _nav.cpf;
      this.state.autorizacao = _nav.autorizacao;
      this.state.averbador = _nav.averbador;
      this.state.renda = _nav.renda;
      this.state.nascimento = _nav.nascimento;
      this.state.cliente = _nav.cliente;
      this.state.id_simulador = _nav.id_simulador;
      if (_nav.averbador === 3) {
        this.state.autorizouDataprev = false;
      }
    }

    if (_margem_nova === "S") {
      this.setState({ tipoOperacao : 27 });
    }

    // console.log(this.state);

  }

  componentDidMount() {

    if (this.state.averbador === 3) {
      this.setState({ carregando : false });
    }
    else {
      this.getTabelasSimulacao();
    }

  }

  _outrasOpcoes(val) {

    this.setState({outrosValores : val});

  }

  _atualizaValorSolicitado = (e) => {
    let {name, value} = e.target;
    this.setState({valorContratoSelecionado : parseFloat(value)});
  }

  getTabelasSimulacao = async () => {

    this.setState({ carregando: true });
    this.state.autorizacao = this.state.autorizacao === [] ? {} : this.state.autorizacao;

    var dadosAutorizacao = '';
    try {
        dadosAutorizacao = JSON.parse(this.state.autorizacao);
    } catch(e) {
        dadosAutorizacao = 'erro';
    }

    var vlrPmt = 0;

    var dtNascimentoSimulacao = '';
    if (dadosAutorizacao[0] !== undefined && dadosAutorizacao[0].dt_nasc !== undefined) {
      var dt = dadosAutorizacao[0].dt_nasc.toString();
      var dia = dt.substr(0, 2);
      var mes = dt.substr(2, 2);
      var ano = dt.substr(4);
      dtNascimentoSimulacao = ano+'-'+mes+'-'+dia;
    }
    else {
      dtNascimentoSimulacao = this.state.nascimento;
    }

    if (this.state.margem_nova === 'S') {
      vlrPmt = this.state.renda * 0.05;
    }
    else {
      if (dadosAutorizacao[0] !== undefined && dadosAutorizacao !== 'erro') {
        vlrPmt = dadosAutorizacao[0].margem_disponivel;
      }
      else {
        vlrPmt = this.state.renda * 0.05;
      }
    }

    this.setState({ valorPmt : vlrPmt, valorPmt_original: vlrPmt });

    if (dadosAutorizacao[0] === undefined) {
      this.setState({ carregando: false, tabelas: [], erroSimulacao: true, msgPublicoNaoAtendido: 'Não foram encontrados nenhum produto que lhe atendem no momento.', autorizouDataprev: true });
    }
    else {

      const FormData = require('form-data');
      const axios = require('axios');
      const formData = new FormData();
      formData.set('cpf', this.state.cpf);
      formData.set('tipoOperacao', this.state.tipoOperacao);
      formData.set('averbador', this.state.averbador);
      formData.set('vlrPmt', vlrPmt);
      formData.set('prazo', 84);
      formData.set('prazo_2', 72);
      formData.set('prazo_3', 60);
      formData.set('nascimento', dtNascimentoSimulacao);
      formData.set('token', 'simulacao_react');
      formData.set('operacoesDigitais', 1);

      axios({
        method: 'post',
        url: 'https://app.factafinanceira.com.br/proposta/get_dados_simulacao',
        data: formData,
        headers: { 'Content-Type' : 'multipart/form-data' }
      })
      .then(function (response) {
          console.log(response);
          if (response.data[0] !== undefined) {
              this.setState({valorMaximoEmprestimo: parseFloat(response.data[0].parcela)});
          }
          this.setState({ carregando: false, tabelas: response.data, erroSimulacao: false });
      }.bind(this))
      .catch(function (response) {
          console.log(response);
          this.setState({ carregando: false, tabelas: [], erroSimulacao: true });
      }.bind(this));

    }

  };

  simulaNovoValor = async () => {

    this.setState({ carregando: true, novaSimulacao: true });
    this.state.autorizacao = this.state.autorizacao === [] ? {} : this.state.autorizacao;

    var dadosAutorizacao = '';
    try {
        dadosAutorizacao = JSON.parse(this.state.autorizacao);
    } catch(e) {
        dadosAutorizacao = 'erro';
    }

    var vlrPmt = 0;

    var dtNascimentoSimulacao = '';
    if (dadosAutorizacao[0] !== undefined && dadosAutorizacao[0].dt_nasc !== undefined) {
      var dt = dadosAutorizacao[0].dt_nasc.toString();
      var dia = dt.substr(0, 2);
      var mes = dt.substr(2, 2);
      var ano = dt.substr(4);
      dtNascimentoSimulacao = ano+'-'+mes+'-'+dia;
    }
    else {
      dtNascimentoSimulacao = this.state.nascimento;
    }

    if (this.state.margem_nova === 'S') {
      vlrPmt = this.state.renda * 0.05;
    }
    else {
      if (dadosAutorizacao[0] !== undefined && dadosAutorizacao !== 'erro') {
        vlrPmt = dadosAutorizacao[0].margem_disponivel;
      }
      else {
        vlrPmt = this.state.renda * 0.05;
      }
    }

    this.setState({ valorPmt : vlrPmt });

    if (dadosAutorizacao[0] === undefined) {
      this.setState({ carregando: false, tabelas: [], erroSimulacao: true, msgPublicoNaoAtendido: 'Não foram encontrados nenhum produto que lhe atendem no momento.', autorizouDataprev: true });
    }
    else {

      const FormData = require('form-data');
      const axios = require('axios');
      const formData = new FormData();
      formData.set('cpf', this.state.cpf);
      formData.set('tipoOperacao', this.state.tipoOperacao);
      formData.set('averbador', this.state.averbador);
      formData.set('vlrPmt', -1);
      formData.set('vlrContrato', this.state.valorContratoSelecionado);
      formData.set('prazo', 84);
      formData.set('prazo_2', 72);
      formData.set('prazo_3', 60);
      formData.set('nascimento', dtNascimentoSimulacao);
      formData.set('token', 'simulacao_react');
      formData.set('operacoesDigitais', 1);

      await axios({
        method: 'post',
        url: 'https://app.factafinanceira.com.br/proposta/get_dados_simulacao',
        data: formData,
        headers: { 'Content-Type' : 'multipart/form-data' }
      })
      .then(function (response) {
        this.setState({ carregando: false, tabelas: response.data, erroSimulacao: false, outrosValores: false });
      }.bind(this))
      .catch(function (response) {
        this.setState({ carregando: false, tabelas: [], erroSimulacao: true, outrosValores: false });
      }.bind(this));

    }

  };

  updateTabelaEscolhida = (e, vlraf, prazo, codigotabela, vcto, taxa, coeficiente, indice) => {

    let new_state = Object.assign({}, this.state);
    let a = new_state.arrDadosProposta;
    a.renda = this.state.renda;

    if (this.state.novaSimulacao === true) {
      a.valorPmt = parseFloat(vlraf);
      a.valorOperacao = parseFloat(this.state.valorContratoSelecionado);
    }
    else {
      a.valorPmt = parseFloat(this.state.valorPmt);
      a.valorOperacao = parseFloat(vlraf);
    }

    a.codigoTabela = codigotabela;
    a.taxa = taxa;
    a.primeiroVcto = vcto;
    a.prazo = prazo;
    a.tipoOperacao = this.state.tipoOperacao;
    a.coeficiente = coeficiente;
    this.setState({arrDadosProposta: a});

    document.getElementById('dados_complementares_'+indice).classList.add('d-flex');
    document.getElementById('botao_proposta_'+indice).classList.add('btn-outline-success');
    //document.querySelectorAll('div.div_dados_complementares:not(#dados_complementares_'+indice+')').classList.remove('d-flex');
    var highlightedItems = document.querySelectorAll('div.div_dados_complementares:not(#dados_complementares_'+indice+')');
    highlightedItems.forEach(function(userItem) {
      userItem.classList.remove('d-flex');
    });
    //document.querySelectorAll('button.btnEscolheProposta:not(#botao_proposta_'+indice+')').classList.remove('btn-outline-success');
    var highlightedItems_p = document.querySelectorAll('button.btnEscolheProposta:not(#botao_proposta_'+indice+')');
    highlightedItems_p.forEach(function(userItem) {
      userItem.classList.remove('btn-outline-success');
    });
    this.setState({ valorOperacao : vlraf, prazo : prazo, codigoTabela : codigotabela, escolheuProposta: false, primeiroVcto: vcto, taxa: taxa });

  }

  updateEscolhaProposta = () => {
    this.setState({ escolheuProposta: false });
  }

  simuladorDadosPessoais = async () => {

    let obj_arrDadosProposta = Object.assign({}, this.state.arrDadosProposta);

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    formData.set('id', this.state.id_simulador);
    formData.set('autorizacao', this.state.autorizacao);
    formData.set('cliente', JSON.stringify(this.state.cliente));
    formData.set('valorPmt', this.state.valorPmt);
    formData.set('valorOperacao', this.state.valorOperacao);
    formData.set('codigoTabela', this.state.codigoTabela);
    formData.set('primeiroVcto', this.state.primeiroVcto);
    formData.set('taxa', this.state.taxa);
    formData.set('dadosProposta', JSON.stringify(obj_arrDadosProposta));
    formData.set('etapa', 'confirmacao');

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/grava_dados_etapa_simulador',
      data: formData,
      headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }
    })
    .then(function (response) {
      console.log("SUCESSO", "ETAPA 3");
      // console.log(response);
    })
    .catch(function (response) {
      console.log("ERRO", "ETAPA 3");
      console.log(response);
    });

    this.props.history.push({
      pathname: '/dados-pessoais',
      search: '',
      state: {
        autorizacao   : this.state.autorizacao,
        cpf           : this.state.cpf,
        renda         : this.state.renda,
        averbador     : this.state.averbador,
        cliente       : this.state.cliente,
        nascimento    : this.state.nascimento,
        valorPmt      : this.state.valorPmt,
        valorOperacao : this.state.valorOperacao,
        codigoTabela  : this.state.codigoTabela,
        primeiroVcto  : this.state.primeiroVcto,
        taxa          : this.state.taxa,
        dadosProposta : this.state.arrDadosProposta,
        id_simulador  : this.state.id_simulador
      }
    });
  }

  autorizaDataprev = async () => {

    this.setState({ carregando: true });
    await axios
    .get('https://app.factafinanceira.com.br/proposta/autoriza_cliente_dataprev?cpf=' + this.state.cpf)
    .then((response) => {
        this.setState({
          autorizacao: response.data,
          autorizouDataprev : true,
          carregando: false
        });
        this.getTabelasSimulacao()
    })
    .catch((error) => {
        console.log(error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the
            // browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
    /*
    .then(res => () => {
      console.log("TESTE");
      console.log(res.data);
      this.setState({
        autorizacao: res.data,
        autorizouDataprev : true,
        carregando: false
      });
      this.getTabelasSimulacao()
    })
    .catch(error => console.log(error));
    */

  }

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

                      { this.state.autorizouDataprev === false
                        ? <>
                          <Row>
                            <Col xs="12">
                              <h5 className="text-justify">Para ver o valor exato que tem disponível, precisamos fazer uma consulta rápida no INSS.</h5>
                            </Col>
                            <Col className="mt-5" xs="12">
                              <Button className="font-weight-bold btn-block" color="outline-primary" onClick={ this.autorizaDataprev }>
                                CONSULTAR VALOR EXATO
                              </Button>
                            </Col>
                          </Row>
                          </>
                        : <>

                        { this.state.erroSimulacao === true
                          ? <>
                              <Row className="mb-3 mt-3" style={{display: this.state.escolheuProposta === false ? 'block' : 'none'}}>
                                <Col xs="12 text-center mt-5 mb-5">
                                  <h4>{ this.state.msgPublicoNaoAtendido === '' ? 'Ops! Algum erro aconteceu e não conseguimos carregar nenhuma opção no momento' : this.state.msgPublicoNaoAtendido }</h4>
                                </Col>
                              </Row>
                            </>
                          : (this.state.tabelas === undefined || this.state.tabelas.length === 0
                            ? <>
                                <Row className="mb-3 mt-3" style={{display: this.state.escolheuProposta === false ? 'block' : 'none'}}>
                                  <Col xs="12 text-center mt-5 mb-5">
                                    <h4>Não existem ofertas disponíveis.</h4>
                                  </Col>
                                </Row>
                              </>
                             : (this.state.outrosValores === false
                               ? <>
                                   <Row className="mt-3 mb-3 text-left" style={{display: this.state.escolheuProposta === false ? 'block' : 'none'}}>
                                     <Col xs="12">
                                       <h5>Selecione uma das ofertas:</h5>
                                     </Col>
                                   </Row>
                                   {this.state.tabelas.map((tabela, index) => (
                                    <>
                                      <Row className="mt-3" style={{display: this.state.escolheuProposta === false ? 'block' : 'none'}}>
                                       <Col xs="12">
                                         <FormGroup>
                                           <Button
                                              id={'botao_proposta_' + index}
                                              style={{display: this.state.escolheuProposta === false ? 'inline-block' : 'none'}}
                                              size="lg"
                                              className="p-2 btn-block btnEscolheProposta"
                                              onClick={event => this.updateTabelaEscolhida(event.target, tabela.parcela, tabela.prazo, tabela.codigoTabela, tabela.primeiro_vencimento, tabela.taxa, tabela.coeficente, index) }
                                            >
                                             <span className="font-weight-bold">{this.state.novaSimulacao === false ? parseFloat(tabela.parcela).toLocaleString('pt-BR', formatoValor) : parseFloat(this.state.valorContratoSelecionado).toLocaleString('pt-BR', formatoValor)}</span> <small>em {tabela.prazo} de {this.state.novaSimulacao === false ? this.state.valorPmt.toLocaleString('pt-BR', formatoValor) : parseFloat(tabela.parcela).toLocaleString('pt-BR', formatoValor)}</small>
                                           </Button>
                                         </FormGroup>
                                       </Col>
                                     </Row>
                                     <Row className="div_dados_complementares m-0 p-0 mt-3" id={'dados_complementares_' + index} style={{display: 'none'}}>

                                       <Col xs="12">
                                        <div style={{display: 'flex', borderBottom: '1px dashed #c1c1c1'}}>
                                          <div className="col-6 p-0 text-left">Valor Liberado:</div>
                                          <div className="font-weight-bold col-6 p-0 text-right">{this.state.novaSimulacao === false ? parseFloat(tabela.parcela).toLocaleString('pt-BR', formatoValor) : parseFloat(this.state.valorContratoSelecionado).toLocaleString('pt-BR', formatoValor)}</div>
                                        </div>
                                       </Col>

                                       <Col xs="12">
                                        <div style={{display: 'flex', borderBottom: '1px dashed #c1c1c1'}}>
                                          <div className="col-6 p-0 text-left">Valor da Parcela:</div>
                                          <div className="font-weight-bold col-6 p-0 text-right">{this.state.novaSimulacao === false ? this.state.valorPmt.toLocaleString('pt-BR', formatoValor) : parseFloat(tabela.parcela).toLocaleString('pt-BR', formatoValor)}</div>
                                        </div>
                                       </Col>

                                       <Col xs="12">
                                        <div style={{display: 'flex', borderBottom: '1px dashed #c1c1c1'}}>
                                          <div className="col-6 p-0 text-left">Prazo:</div>
                                          <div className="font-weight-bold col-6 p-0 text-right">{tabela.prazo}</div>
                                        </div>
                                       </Col>

                                       <Col xs="12">
                                        <div style={{display: 'flex', borderBottom: '1px dashed #c1c1c1'}}>
                                          <div className="col-6 p-0 text-left">1º Vencimento:</div>
                                          <div className="font-weight-bold col-6 p-0 text-right"><Moment format="DD/MM/YYYY">{tabela.primeiro_vencimento}</Moment></div>
                                        </div>
                                       </Col>

                                       <Col xs="12">
                                        <div style={{display: 'flex', borderBottom: '1px dashed #c1c1c1'}}>
                                          <div className="col-6 p-0 text-left">Taxa a.m.:</div>
                                          <div className="font-weight-bold col-6 p-0 text-right">{parseFloat(tabela.taxa).toFixed(2).toLocaleString('pt-BR')} %</div>
                                        </div>
                                       </Col>

                                     </Row>

                                    </>
                                    ))
                                   }
                                   <Button className="btn-block font-weight-bold" color="outline-primary" onClick={() => this._outrasOpcoes(true)}>
                                     Mais opções
                                   </Button>
                                 </>
                               : <>
                                   <Row className="mt-3" style={{display: this.state.escolheuProposta === false ? 'block' : 'none'}}>
                                     <Col xs="12">
                                       <h5 className="font-weight-bold">Outros valores?</h5>
                                     </Col>
                                   </Row>
                                   <Row className="mt-3" style={{display: this.state.escolheuProposta === false ? 'block' : 'none'}}>
                                     <Col xs="12">
                                       <h4 className="font-weight-bold">Valor solicitado: {parseFloat(this.state.valorContratoSelecionado).toLocaleString('pt-BR', formatoValor)}</h4>
                                       <input type="range" className="form-control-range" value={this.state.valorContratoSelecionado} min="400" max={this.state.valorMaximoEmprestimo} onChange={e => this._atualizaValorSolicitado(e) } step="500" />
                                     </Col>
                                     <Col xs="12">
                                      <small className="float-left">Mín.: R$ 400,00</small>
                                      <small className="float-right">Max.: {parseFloat(this.state.valorMaximoEmprestimo).toLocaleString('pt-BR', formatoValor)}</small>
                                     </Col>
                                   </Row>
                                   <Row className="mt-5" style={{display: this.state.escolheuProposta === false ? 'block' : 'none'}}>
                                     <Col xs="12">
                                       <Button className="btn-block" color="outline-primary" onClick={() => this.simulaNovoValor()}>
                                         SIMULAR
                                       </Button>
                                     </Col>
                                   </Row>
                                 </>
                              )
                            )
                        }

                        { this.state.escolheuProposta === false ? null
                          : <>
                              <Row className="mt-5">
                                <Col className="text-left" xs="12">
                                  <h5>Opção escolhida:</h5>
                                </Col>

                                <Col className="text-left" xs="6">
                                  <span>Valor Liberado</span>
                                </Col>
                                <Col className="text-right" xs="6">
                                  <span>{parseFloat(this.state.valorOperacao).toLocaleString('pt-BR', formatoValor)}</span>
                                </Col>

                                <Col className="text-left" xs="6">
                                  <span>Valor da Parcela</span>
                                </Col>
                                <Col className="text-right" xs="6">
                                  <span>{this.state.valorPmt.toLocaleString('pt-BR', formatoValor)}</span>
                                </Col>

                                <Col className="text-left" xs="6">
                                  <span>Qtd. de Parcelas</span>
                                </Col>
                                <Col className="text-right" xs="6">
                                  <span>{this.state.prazo}</span>
                                </Col>

                                <Col className="text-left" xs="6">
                                  <span>1º Vencimento</span>
                                </Col>
                                <Col className="text-right" xs="6">
                                  <span><Moment format="DD/MM/YYYY">{this.state.primeiroVcto}</Moment></span>
                                </Col>

                                <Col className="text-left" xs="6">
                                  <span>Taxa a.m.</span>
                                </Col>
                                <Col className="text-right" xs="6">
                                  <span>{parseFloat(this.state.taxa).toFixed(2).toLocaleString('pt-BR')} %</span>
                                </Col>

                                <Col xs="12" className="mt-2 mb-5 text-left">
                                  <Button className="btn btn-sm btn-warning btn-pill text-white" onClick={ () => this.updateEscolhaProposta() }>
                                    Outras opções
                                  </Button>
                                </Col>
                              </Row>
                            </>
                        }

                        { this.state.codigoTabela === 0 ? null
                          : <>
                            <Row className="mt-5">
                              <Col xs="12">
                                <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this.simuladorDadosPessoais }>
                                  SOLICITAR
                                </Button>
                              </Col>
                            </Row>
                            </>
                        }
                      </>
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

export default Confirmacao;
