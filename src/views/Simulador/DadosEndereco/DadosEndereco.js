import React, { Component } from 'react';
import { Col, Container, Row, FormGroup, Input, Button, Label, Modal, ModalHeader, ModalBody, CardBody, Card  } from 'reactstrap';
import InputMask from 'react-input-mask';
import axios from 'axios';

class DadosEndereco extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Carregando...</div>

  constructor(props) {
    super(props);
    this.state = {
      carregando    : true,
      erroSimulacao : false,
      msgErroForm : '',
      cpf         : '',
      autorizacao : [],
      cliente     : [],
      cidades     : [],
      estados     : [],
      bancos      : [],
      especies    : [],
      tabelas     : [],

      averbador   : 0,
      ocupacao    : '',
      nascimento  : '',

      dadosProposta : [],
      dadosPessoais : [],

      renda         : 0,
      valorPmt      : 0,
      valorOperacao : 0,
      codigoTabela  : 0,

      arrDadosComplementares: [],

      dadosCep: [],

      matricula: '',
      tipoBeneficio: '',
      cep: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      tipoResidencia: '',
      tempoMoradia: '',
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: '',
      id_simulador: 0

    };

    this.toggleDanger = this.toggleDanger.bind(this);
    this.selectCidade = React.createRef();

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
      this.state.dadosProposta = _nav.dadosProposta;
      this.state.dadosPessoais = _nav.dadosPessoais;
      this.state.id_simulador = _nav.id_simulador;
    }

    this.state.arrDadosComplementares.matricula = '';
    this.state.arrDadosComplementares.cep = '';
    this.state.arrDadosComplementares.endereco = '';
    this.state.arrDadosComplementares.bairro = '';
    this.state.arrDadosComplementares.cidade = '';
    this.state.arrDadosComplementares.estado = '';
    this.state.arrDadosComplementares.banco = '';
    this.state.arrDadosComplementares.agencia = '';
    this.state.arrDadosComplementares.conta = '';
    this.state.arrDadosComplementares.tipoConta = '';

    this.state.dadosCep.uf = '';
    this.state.dadosCep.endereco = '';
    this.state.dadosCep.bairro = '';
    this.state.dadosCep.cidadeDesc = '';


    // console.log(this.state);

  }

  componentDidMount() {
    this.getListaCidadesBase();
  }

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

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/get_lista_estados',
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
        this.setState({ carregando: false, estados: response.data });
    }.bind(this))
    .catch(function (response) {
        this.setState({ carregando: false, estados: [] });
    }.bind(this));

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/get_lista_bancos',
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
        this.setState({ carregando: false, bancos: response.data });
    }.bind(this))
    .catch(function (response) {
        this.setState({ carregando: false, bancos: [] });
    }.bind(this));

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/get_lista_especie_inss',
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
        this.setState({ carregando: false, especies: response.data });
    }.bind(this))
    .catch(function (response) {
        this.setState({ carregando: false, especies: [] });
    }.bind(this));
  }

  getDadosCepCliente = async () => {

    var cep = this.state.arrDadosComplementares.cep;
    cep = cep.replaceAll('-', '');
    cep = cep.replaceAll('_', '');

    if (cep === '' || cep.length < 8) {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o número de CEP válido!' });
      return false;
    }

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    formData.set('cep', cep);

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/get_dados_cep',
      data: formData,
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
        this.setState({ carregando: false, dadosCep: response.data[0] });
        if (this.state.dadosCep.endereco !== undefined) {
          this.state.arrDadosComplementares.endereco = this.state.dadosCep.endereco;
          this.state.arrDadosComplementares.bairro = this.state.dadosCep.bairro;
          this.state.arrDadosComplementares.estado = this.state.dadosCep.uf;
          var index;
          var a = this.state.cidades;
          for (index = 0; index < a.length; ++index) {
              if (a[index].DESCRICAO === this.state.dadosCep.cidadeDesc.toUpperCase()) {
                this.state.arrDadosComplementares.cidade = a[index].CODIGO;
                break;
              }
          }
        }
    }.bind(this))
    .catch(function (response) {
        this.setState({ carregando: false, dadosCep: [] });
    }.bind(this));

  }

  simuladorConclusao = async () => {

    var d = this.state.arrDadosComplementares;

    if (d.matricula === undefined || d.matricula === null || d.matricula === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o número do seu benefício para prosseguir' });
      return false;
    }

    if (d.cep === undefined || d.cep === null || d.cep === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o seu CEP para prosseguir' });
      return false;
    }

    if (d.endereco === undefined || d.endereco === null || d.endereco === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o seu endereço para prosseguir' });
      return false;
    }

    if (d.bairro === undefined || d.bairro === null || d.bairro === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o bairro para prosseguir' });
      return false;
    }

    if (d.cidade === undefined || d.cidade === null || d.cidade === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe a cidade para prosseguir' });
      return false;
    }

    if (d.estado === undefined || d.estado === null || d.estado === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o estado para prosseguir' });
      return false;
    }

    if (d.tipoResidencia === undefined || d.tipoResidencia === null || d.tipoResidencia === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o tipo de residência para prosseguir' });
      return false;
    }

    if (d.tempoMoradia === undefined || d.tempoMoradia === null || d.tempoMoradia === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o tempo na residência para prosseguir' });
      return false;
    }

    if (d.banco === undefined || d.banco === null || d.banco === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o banco para prosseguir' });
      return false;
    }

    if (d.agencia === undefined || d.agencia === null || d.agencia === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o número da agência para prosseguir' });
      return false;
    }

    if (d.conta === undefined || d.conta === null || d.conta === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o número da conta para prosseguir' });
      return false;
    }

    if (d.tipoConta === undefined || d.tipoConta === null || d.tipoConta === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o tipo da sua conta para prosseguir' });
      return false;
    }

    let objeto_log = Object.assign({}, this.state.arrDadosComplementares);

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    formData.set('id', this.state.id_simulador);
    formData.set('array_dados_complementares', JSON.stringify(objeto_log));
    formData.set('etapa', 'dados_endereco');

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/grava_dados_etapa_simulador',
      data: formData,
      headers: { 'Content-Type' : 'multipart/form-data' }
    })
    .then(function (response) {
      console.log("SUCESSO", "ETAPA 1");
      // console.log(response);
    })
    .catch(function (response) {
      console.log("ERRO", "ETAPA 1");
      console.log(response);
    });

    this.props.history.push({
      pathname: '/conclusao',
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

        dadosProposta : this.state.dadosProposta,
        dadosPessoais : this.state.dadosPessoais,
        dadosComplementares : this.state.arrDadosComplementares

      }
    });
  }

  updateCampoFormulario = (e) => {

    if (e.target.name !== undefined) {
      let {name, value} = e.target;
      let new_state = Object.assign({}, this.state);
      let a = new_state.arrDadosComplementares;
      a[name] = value;
      this.setState({arrDadosComplementares: a});
      this.setState({ [name] : parseInt(value) });
    }

  }

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
    const inputToUpper = { "textTransform" : "uppercase" };

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
                    <CardBody className="text-left">

                      <Row className="mt-3">
                        <Col xs="12">
                          <h4 className="font-weight-bold">Dados do Benefício</h4>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Número</Label>
                            <InputMask maskChar=" " className="form-control" mask="9999999999" type="text" name="matricula" onChange={e => this.updateCampoFormulario(e)} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Espécie</Label>
                            <Input type="select" name="tipoBeneficio" onChange={e => this.updateCampoFormulario(e)}>
                              <option>Selecione</option>
                              {this.state.especies.map((especie, index) => (
                                <option value={especie.CODIGO}>{especie.CODIGO.toString().padStart(2, "0")} - {especie.NOME}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <hr />

                      <Row className="mt-3">
                        <Col xs="12">
                          <h4 className="font-weight-bold">Dados do Endereço</h4>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="orgao">CEP</Label>
                            <InputMask maskChar=" " className="form-control" mask="99999-999" type="text" name="cep" onChange={e => this.updateCampoFormulario(e)} onBlur={() => this.getDadosCepCliente()}/>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Endereço</Label>
                            <Input style={inputToUpper} type="text" name="endereco" onChange={e => this.updateCampoFormulario(e)} defaultValue={this.state.dadosCep.endereco} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Número</Label>
                            <Input type="text" name="numero" onChange={e => this.updateCampoFormulario(e)} />
                          </FormGroup>
                        </Col>
                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Complemento</Label>
                            <Input style={inputToUpper} type="text" name="complemento" onChange={e => this.updateCampoFormulario(e)} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Bairro</Label>
                            <Input style={inputToUpper} type="text" name="bairro" onChange={e => this.updateCampoFormulario(e)} defaultValue={this.state.dadosCep.bairro} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Cidade</Label>
                            <Input ref={this.selectCidade} type="select" name="cidade" onChange={e => this.updateCampoFormulario(e)}>
                              <option>Selecione</option>
                              {this.state.cidades.map((cidade, index) => (
                                <option value={cidade.CODIGO} selected={ this.state.dadosCep.cidadeDesc.toUpperCase() === cidade.DESCRICAO ? "selected" : null} >{cidade.DESCRICAO}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Estado</Label>
                            <Input type="select" name="estado" onChange={e => this.updateCampoFormulario(e)}>
                              <option>Selecione</option>
                              {this.state.estados.map((estado, index) => (
                                <option value={estado.CODIGO} selected={this.state.dadosCep.uf !== '' && this.state.dadosCep.uf.toUpperCase() === estado.CODIGO ? 'selected="selected"' : ''} >{estado.NOME}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Tipo de Residência</Label>
                            <Input type="select" name="tipoResidencia" onChange={e => this.updateCampoFormulario(e)}>
                              <option value="">Selecione </option>
                              <option value="1">Própria</option>
                              <option value="3">Alugada</option>
                              <option value="2">Familiar</option>
                              <option value="6">Funcional</option>
                              <option value="7">Outros</option>
                              <option value="4">Não informado</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Tempo de Residência</Label>
                            <Input type="select" name="tempoMoradia" onChange={e => this.updateCampoFormulario(e)}>
                              <option value="">Selecione </option>
                              <option value="MENOS DE 1 ANO">Menos de 1 ano</option>
                              <option value="DE 1 A 3 ANOS">De 1 a 3 anos</option>
                              <option value="DE 3 A 5 ANOS">De 3 a 5 anos</option>
                              <option value="DE 5 A 10 ANOS">De 5 a 10 anos</option>
                              <option value="MAIS DE 10 ANOS">Mais de 10 anos</option>
                              <option value="NAO INFORMADO">Não informado</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <hr />

                      <Row className="mt-3">
                        <Col xs="12">
                          <h4 className="font-weight-bold">Dados Bancários</h4>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Banco</Label>
                            <Input type="select" name="banco" onChange={e => this.updateCampoFormulario(e)}>
                              <option>Selecione</option>
                              {this.state.bancos.map((banco, index) => (
                                <option value={banco.CODIGO}>{banco.CODIGO.toString().padStart(3, "0")} - {banco.DESCRICAO}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="agencia">Agência</Label>
                            <InputMask style={inputToUpper} maskChar=" " className="form-control" type="text" mask="999999" name="agencia" onChange={e => this.updateCampoFormulario(e)} />
                          </FormGroup>
                        </Col>
                        <Col xs="6">
                          <FormGroup>
                            <Label htmlFor="conta">Conta</Label>
                            <InputMask style={inputToUpper} maskChar=" " className="form-control" type="text" mask="99999999**" name="conta" onChange={e => this.updateCampoFormulario(e)} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Tipo de Conta</Label>
                            <Input type="select" name="tipoConta" onChange={e => this.updateCampoFormulario(e)}>
                              <option>Selecione</option>
                              <option value="C">Conta Corrente</option>
                              <option value="P">Conta Poupança</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="mt-5">
                        <Col xs="12 text-center">
                          <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this.simuladorConclusao }>
                            CONCLUIR SIMULAÇÃO
                          </Button>
                        </Col>
                      </Row>

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Modal isOpen={this.state.danger} toggle={this.toggleDanger} className='modal-danger'>
              <ModalHeader toggle={this.toggleDanger}>Aviso</ModalHeader>
              <ModalBody>
                { this.state.msgErroForm }
              </ModalBody>
            </Modal>
          </>
        }
      </div>
    );
  }
}

export default DadosEndereco;
