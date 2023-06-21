import React, { Component } from 'react';
import { Col, Container, Row, FormGroup, Input, Button, Label, Modal, ModalHeader, ModalBody, CardBody, Card } from 'reactstrap';
import InputMask from 'react-input-mask';
import axios from 'axios';

class Confirmacao extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Carregando...</div>

  constructor(props) {
    super(props);
    this.state = {
      carregando : true,
      erroSimulacao: false,
      msgErroForm : '',

      autorizacao : [],
      cliente : [],
      cidades: [],
      dadosProposta : [],

      averbador : 0,
      renda : 0,
      valorPmt: 0,
      valorOperacao: 0,
      codigoTabela: 0,

      cpf : '',
      dataNascimento : '',

      arrDadosPessoais: [],

      nome: '',
      estadoCivil: '',
      sexo: '',
      rg: '',
      tipoDocumento: '',
      dataExpedicao: '',
      orgao: '',
      estadoRg: '',
      nacionalidade: '',
      cidadeNatural: 0,
      valorPatrimonio: 0,
      telefone: '',
      celular: '',
      email: '',
      escolaridade: 0,
      nomeMae: '',
      nomePai: '',
      cpfConjuge: '',
      nomeConjuge: '',
      nascimentoConjuge: '',
      cidadesItens: [],
      id_simulador: 0

    };

    this.toggleDanger = this.toggleDanger.bind(this);

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
      this.state.dataNascimento = _nav.nascimento;
      this.state.cliente = _nav.cliente;
      this.state.dadosProposta = _nav.dadosProposta;
      this.state.id_simulador = _nav.id_simulador;

      if (_nav.cliente.DESCRICAO !== undefined) {
        this.state.arrDadosPessoais.nome = _nav.cliente.DESCRICAO;
        this.state.arrDadosPessoais.estadoCivil = _nav.cliente.ESTADOCIVIL;
        this.state.arrDadosPessoais.sexo = _nav.cliente.SEXO;
        this.state.arrDadosPessoais.rg = _nav.cliente.RG;


        this.state.arrDadosPessoais.orgao = _nav.cliente.ORGAOEMISSOR;
        this.state.arrDadosPessoais.estadoRg = _nav.cliente.ESTADO;
        this.state.arrDadosPessoais.nacionalidade = _nav.cliente.NACIONALIDADE;
        this.state.arrDadosPessoais.cidadeNatural = _nav.cliente.CIDADENATURAL;
        this.state.arrDadosPessoais.valorPatrimonio = _nav.cliente.VALORPATRIMONIO;
        this.state.arrDadosPessoais.telefone = '';
        this.state.arrDadosPessoais.celular = '';
        this.state.arrDadosPessoais.email = _nav.cliente.EMAIL;
        this.state.arrDadosPessoais.escolaridade = _nav.cliente.ESCOLARIDADE;
        this.state.arrDadosPessoais.nomeMae = _nav.cliente.NOMEMAE;
        this.state.arrDadosPessoais.nomePai = _nav.cliente.NOMEPAI;
        this.state.arrDadosPessoais.cpfConjuge = _nav.cliente.CONJUGE_CPF;
        this.state.arrDadosPessoais.nomeConjuge = _nav.cliente.CONJUGE;
        var formatadata = "";
        if (_nav.cliente.DATANASCIMENTO !== null && _nav.cliente.DATANASCIMENTO !== "") {
           formatadata = _nav.cliente.DATANASCIMENTO.substr(0, 10);
          this.state.arrDadosPessoais.dataNascimento = formatadata.substr(8, 2) + formatadata.substr(5, 2) + formatadata.substr(0, 4);
        }
        else {
          this.state.arrDadosPessoais.dataNascimento = "";
        }

        if (_nav.cliente.EMISSAORG !== null && _nav.cliente.EMISSAORG !== "") {
          formatadata = _nav.cliente.EMISSAORG.substr(0, 10);
          this.state.arrDadosPessoais.dataExpedicao = formatadata.substr(8, 2) + formatadata.substr(5, 2) + formatadata.substr(0, 4);
        }
        else {
          this.state.arrDadosPessoais.dataExpedicao = "";
        }

        if (_nav.cliente.CONJUGE_DATANASCIMENTO !== null && _nav.cliente.CONJUGE_DATANASCIMENTO !== "" && _nav.cliente.CONJUGE_DATANASCIMENTO.substr(0, 10) !== "1900-01-01") {
          formatadata = _nav.cliente.CONJUGE_DATANASCIMENTO.substr(0, 10);
          this.state.arrDadosPessoais.nascimentoConjuge = formatadata.substr(8, 2) + formatadata.substr(5, 2) + formatadata.substr(0, 4);
        }
        else {
          this.state.arrDadosPessoais.nascimentoConjuge = "";
        }

      }

    }

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

    var novasCidades = [];
    this.state.cidades.forEach(function (item) {
      novasCidades.push({id: item.CODIGO, name: item.DESCRICAO});
    });
    this.setState({ cidadesItens : novasCidades });

  }

  simuladorDadosComplementares = async () => {

    var d = this.state.arrDadosPessoais;
    if (d.nome === undefined || d.nome === null ||  d.nome === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o seu nome para prosseguir' });
      return false;
    }

    if (d.estadoCivil === undefined || d.estadoCivil === null ||  d.estadoCivil === '' || parseInt(d.estadoCivil) === 9999) {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe um estado civil' });
      return false;
    }

    if (parseInt(d.estadoCivil) === 3) {
      if (d.cpfConjuge === undefined || d.cpfConjuge === null || d.cpfConjuge === "") {
        this.toggleDanger();
        this.setState({ msgErroForm : 'Informe o CPF do seu cônjuge' });
        return false;
      }
      if (d.nomeConjuge === undefined || d.nomeConjuge === null || d.nomeConjuge === "") {
        this.toggleDanger();
        this.setState({ msgErroForm : 'Informe o nome do seu cônjuge' });
        return false;
      }
      if (d.nascimentoConjuge === undefined || d.nascimentoConjuge === null || d.nascimentoConjuge === "") {
        this.toggleDanger();
        this.setState({ msgErroForm : 'Informe a data de nascimento do seu cônjuge' });
        return false;
      }
    }

    if (d.sexo === undefined || d.sexo === null ||  d.sexo === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o seu sexo' });
      return false;
    }

    if (d.rg === undefined || d.rg === null ||  d.rg === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o seu RG' });
      return false;
    }

    if (d.dataNascimento === undefined || d.dataNascimento === null ||  d.dataNascimento === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe sua data de nascimento' });
      return false;
    }

    if (d.dataExpedicao === undefined || d.dataExpedicao === null || d.dataExpedicao === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe a data de expedição do seu documento' });
      return false;
    }

    if (d.orgao === undefined || d.orgao === null ||  d.orgao === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o órgão expedidor do seu documento' });
      return false;
    }

    if (d.estadoRg === undefined || d.estadoRg === null ||  d.estadoRg === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o estado do seu documento' });
      return false;
    }

    if (d.nacionalidade === undefined || d.nacionalidade === null ||  d.nacionalidade === '' || parseInt(d.nacionalidade) === 9999) {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe sua nacionalidade' });
      return false;
    }

    if (d.cidadeNatural === undefined || d.cidadeNatural === null ||  d.cidadeNatural === '' || parseInt(d.cidadeNatural) === 9999) {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe a sua cidade de naturalidade' });
      return false;
    }

    if (d.escolaridade === undefined || d.escolaridade === null ||  d.escolaridade === '' || parseInt(d.escolaridade) === 9999) {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o seu graus de escolaridade' });
      return false;
    }

    if (d.valorPatrimonio === undefined || d.valorPatrimonio === null ||  d.valorPatrimonio === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o seu valor de patrimônio' });
      return false;
    }

    if (d.celular === undefined || d.celular === null || d.celular === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe um celular válido' });
      return false;
    }

    if (d.nomeMae === undefined || d.nomeMae === null || d.nomeMae === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o nome da sua mãe' });
      return false;
    }

    if (d.nomePai === undefined || d.nomePai === null || d.nomePai === '') {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o nome do seu pai' });
      return false;
    }

    let objeto_log = Object.assign({}, this.state.arrDadosPessoais);

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    formData.set('id', this.state.id_simulador);
    formData.set('array_dados_pessoais', JSON.stringify(objeto_log));
    formData.set('etapa', 'dados');

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
      pathname: '/dados-complementares',
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
        dadosPessoais : this.state.arrDadosPessoais,
        id_simulador  : this.state.id_simulador
      }
    });
  }

  updateCampoFormulario = (e) => {

    let {name, value} = e.target;
    let new_state = Object.assign({}, this.state);
    let a = new_state.arrDadosPessoais;
    a[name] = value;
    this.setState({arrDadosPessoais: a});
    this.setState({ [name] : value });

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
                    <CardBody className="text-left">

                      <Row>
                        <Col xs="12">
                          <h4 className="font-weight-bold">Dados Pessoais</h4>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">CPF</Label>
                            <InputMask autoComplete="new-password" className="form-control" mask="999.999.999-99" type="text" name="cpf" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.cpf } readOnly={true} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Nome</Label>
                            <Input style={inputToUpper} autoComplete="new-password" type="text" name="nome" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.nome ?? null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Data de Nascimento</Label>
                            <InputMask autoComplete="new-password" className="form-control" mask="99/99/9999" type="text" name="dataNascimento" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.dataNascimento !== undefined ? this.state.arrDadosPessoais.dataNascimento : null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Estado Civil</Label>
                            <Input autoComplete="new-password" type="select" name="estadoCivil" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.estadoCivil ?? null}>
                              <option value="">Selecione </option>
                              <option value="4">Solteiro</option>
                              <option value="3">Casado</option>
                              <option value="7">Desquitado</option>
                              <option value="2">Divorciado</option>
                              <option value="1">Separado</option>
                              <option value="5">Viúvo</option>
                              <option value="6">Outros</option>
                              <option value="8">Não cadastrado</option>
                              <option value="9999">Não definido</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Sexo</Label>
                            <Input autoComplete="new-password" type="select" name="sexo" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.sexo ?? null}>
                              <option value="">Selecione</option>
                              <option value="F">Feminino</option>
                              <option value="M">Masculino</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Tipo</Label>
                            <Input autoComplete="new-password" type="select" name="tipoDocumento" onChange={e => this.updateCampoFormulario(e)}>
                              <option value="RG">RG</option>
                              <option value="CNH">CNH</option>
                              <option value="CIM">CIM</option>
                              <option value="PASSAPORTE">Passaporte</option>
                              <option value="RNE OU CIE">RNE ou CIE</option>
                              <option value="CIP OU CIPF">CIP ou CIPF</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Número do Documento</Label>
                            <Input autoComplete="new-password" type="text" name="rg" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.rg ?? null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Data de Expedição</Label>
                            <InputMask autoComplete="new-password" className="form-control" mask="99/99/9999" type="text" name="dataExpedicao" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.dataExpedicao !== undefined ? this.state.arrDadosPessoais.dataExpedicao : null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Órgão Emissor</Label>
                            <Input style={inputToUpper} autoComplete="new-password" type="text" name="orgao" onChange={this.updateCampoFormulario.bind(this)} defaultValue={ this.state.arrDadosPessoais.orgao ?? null } />
                          </FormGroup>
                        </Col>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Estado</Label>
                            <Input autoComplete="new-password" type="select" name="estadoRg" onChange={e => this.updateCampoFormulario(e)} defaultValue={this.state.arrDadosPessoais.estadoRg ?? null}>
                              <option value="AC">AC</option>
                              <option value="AL">AL</option>
                              <option value="AP">AP</option>
                              <option value="AM">AM</option>
                              <option value="BA">BA</option>
                              <option value="CE">CE</option>
                              <option value="DF">DF</option>
                              <option value="ES">ES</option>
                              <option value="GO">GO</option>
                              <option value="MA">MA</option>
                              <option value="MT">MT</option>
                              <option value="MS">MS</option>
                              <option value="MG">MG</option>
                              <option value="PA">PA</option>
                              <option value="PB">PB</option>
                              <option value="PR">PR</option>
                              <option value="PE">PE</option>
                              <option value="PI">PI</option>
                              <option value="RJ">RJ</option>
                              <option value="RN">RN</option>
                              <option value="RS">RS</option>
                              <option value="RO">RO</option>
                              <option value="RR">RR</option>
                              <option value="SC">SC</option>
                              <option value="SP">SP</option>
                              <option value="SE">SE</option>
                              <option value="TO">TO</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Nacionalidade</Label>
                            <Input autoComplete="new-password" type="select" name="nacionalidade" onChange={e => this.updateCampoFormulario(e)} defaultValue={this.state.arrDadosPessoais.nacionalidade ?? null}>
                              <option>Selecione </option>
                              <option value="1">Brasileira</option>
                              <option value="2">Estrangeira</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Naturalidade</Label>
                            <Input autoComplete="new-password" type="select" name="cidadeNatural" onChange={e => this.updateCampoFormulario(e)} defaultValue={this.state.arrDadosPessoais.cidadeNatural ?? null}>
                              <option>Selecione</option>
                              {this.state.cidades.map((cidade, index) => (
                                <option value={cidade.CODIGO}>{cidade.DESCRICAO}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Valor Patrimonial</Label>
                            <Input autoComplete="new-password" type="select" name="valorPatrimonio" onChange={e => this.updateCampoFormulario(e)} defaultValue={this.state.arrDadosPessoais.valorPatrimonio ?? null}>
                              <option>Selecione</option>
                              <option value="1.00">R$ 0 a R$ 10.000,00</option>
                              <option value="2.00">R$ 10.000,01 a R$ 100.000,00</option>
                              <option value="3.00">R$ 100.000,01 e R$ 500.000,00</option>
                              <option value="4.00">R$ 500.000,01 e R$ 1.000.000,00</option>
                              <option value="5.00">Acima de R$ 1.000.000,00</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Telefone</Label>
                            <InputMask maskChar=" " autoComplete="new-password" className="form-control" mask="(99) 9999-9999" type="text" name="telefone" onChange={e => this.updateCampoFormulario(e)} />
                          </FormGroup>
                        </Col>
                        <Col xs="12" sm="12" md="6">
                          <FormGroup>
                            <Label htmlFor="orgao">Celular</Label>
                            <InputMask maskChar=" " autoComplete="new-password" className="form-control" mask="(99) 99999-9999" type="text" name="celular" onChange={e => this.updateCampoFormulario(e)} />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">E-mail</Label>
                            <Input autoComplete="new-password" type="email" name="email" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.email ?? null } required/>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Escolaridade</Label>
                            <Input autoComplete="new-password" type="select" name="escolaridade" onChange={e => this.updateCampoFormulario(e)} defaultValue={this.state.arrDadosPessoais.escolaridade ?? null}>
                              <option value="">Selecione </option>
                              <option value="1">Analfabeto</option>
                              <option value="2">Até 4ª série incompleta</option>
                              <option value="3">4ª série completa</option>
                              <option value="4">De 5ª à 8ª série incompleta</option>
                              <option value="5">Ensino fundamental completo</option>
                              <option value="6">Ensino médio incompleto</option>
                              <option value="7">Ensino médio completo</option>
                              <option value="8">Ensino superior incompleto</option>
                              <option value="9">Ensino superior completo</option>
                              <option value="12">Pós-Graduação</option>
                              <option value="10">Mestrado</option>
                              <option value="11">Doutorado</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Nome da Mãe</Label>
                            <Input style={inputToUpper} autoComplete="new-password" type="text" name="nomeMae" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.nomeMae ?? null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Nome do Pai</Label>
                            <Input style={inputToUpper} autoComplete="new-password" type="text" name="nomePai" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.nomePai ?? null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">CPF do Cônjuge</Label>
                            <InputMask autoComplete="new-password" className="form-control" mask="999.999.999-99" type="text" name="cpfConjuge" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.cpfConjuge ?? null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Nome do Cônjuge</Label>
                            <Input style={inputToUpper} autoComplete="new-password" type="text" name="nomeConjuge" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.nomeConjuge ?? null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <Label htmlFor="orgao">Nascimento do Cônjuge</Label>
                            <InputMask autoComplete="new-password" className="form-control" mask="99/99/9999" type="text" name="nascimentoConjuge" onChange={e => this.updateCampoFormulario(e)} defaultValue={ this.state.arrDadosPessoais.nascimentoConjuge !== undefined ? this.state.arrDadosPessoais.nascimentoConjuge : null } />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="mt-5">
                        <Col xs="12 text-center">
                          <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this.simuladorDadosComplementares }>
                            PRÓXIMO
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

export default Confirmacao;
