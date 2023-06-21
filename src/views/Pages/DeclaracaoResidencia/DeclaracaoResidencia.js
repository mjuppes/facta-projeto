import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import InputMask from 'react-input-mask';
import axios from 'axios';
import md5 from 'md5';
import {isMobile} from 'react-device-detect';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import TimelineProgresso from '../../TimelineProgresso';

import {isHoraMaior} from "../../../config";
class DeclaracaoResidencia extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeout: 300,
      tipoPendencia: props.tipo,
      etapa: 'confirmar',
      codigoAFOriginal: this.props.match.params.propostaId,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      proximoLink: '',
      averbador: 0,
      enviouDocumentos: true,
      labelDocumento: '',
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      propostaPendente: false,
      propostaFinaliza: true,
      cliente_cpf: '',
      cliente_nascimento: '',
      cameraDisponivel: true,
      proximoLink: '/tipo-documento/'+this.props.match.params.propostaId,
      diaAtual: new Date().getDate(),
      anoAtual: new Date().getFullYear(),
      mesAtual: new Date().toLocaleString('default', { month: 'long' }),
      cidades     : [],
      estados     : [],
      dadosCep    : [],
      cep         : '',
      endereco    : '',
      numero      : '',
      bairro      : '',
      cidade      : '',
      nome_cidade : '',
      estado      : '',
      msgErroForm : '',
      danger      : false,
      modal_tipo  : 'modal-danger',
      readonly    : false,
      nome_cartorio : '',
      cidade_cartorio : '',
      cidades_pelo_nome : '',
      geoInicial: '',
      geoTermo: '',
      geoCcb: '',
      base64Ccb: '',
      base64CcbTermos: '',
      lojasLiberar: [],
      codigoCorretor: 0 ,
      classificacao: ''
    };

    this.toggleDanger = this.toggleDanger.bind(this);

    this.nome_bairro = React.createRef();
    this.nome_endereco = React.createRef();

    if (this.props.location.state === undefined) {
      if (window.location.href.indexOf("/pendencias-") !== -1) {
        this.props.history.push(this.state.homeLinkPendencias);
      }
      else if (window.location.href.indexOf("/regularizacao-") !== -1) {
        this.props.history.push(this.state.homeLinkRegularizacao);
      }
      else {
        this.props.history.push(this.state.homeLink);
      }
      this.state.obj_proposta = [];
      return false;
    }
    else {
      this.state.obj_proposta = this.props.location.state.obj_proposta;
    }

    var _state = this.props.location.state;
    var _PROPOSTA = this.state.obj_proposta;
    var _CORRETOR = _PROPOSTA.CORRETOR;
    var _DADOSPESSOAIS = _PROPOSTA.S_DADOSPESSOAIS;
    

    if (_DADOSPESSOAIS !== undefined) {
      if (parseInt(_DADOSPESSOAIS.documentosEnviados) === 0 && (parseInt(_PROPOSTA.Averbador) === 1)) {
        this.state.etapa = "declaracao";
      }
    }

    this.state.obj_pendencias = _state.obj_pendencias;

    this.state.base64Ccb = _state.base64Ccb;
 
    this.state.proximoLink = '/tipo-documento/'+this.props.match.params.propostaId;

    let int_codigo = parseInt(_CORRETOR.CODIGO);

    if( parseInt(_PROPOSTA.Averbador) === 20095 ||  parseInt(_PROPOSTA.Averbador) === 3 )   { 
      
      this.state.averbador = parseInt(_PROPOSTA.Averbador);
      this.state.codigoCorretor = parseInt(_CORRETOR.CODIGO);
      this.state.classificacao = parseInt(_CORRETOR.Classificacao);

    }
      {/*estamos aqui*/}
    if(parseInt(_PROPOSTA.Averbador) === 1 || parseInt(_PROPOSTA.Averbador) === 23 || parseInt(_PROPOSTA.Averbador) === 10 || parseInt(_PROPOSTA.Averbador) === 15 || parseInt(_PROPOSTA.Averbador) === 30 || parseInt(_PROPOSTA.Averbador) === 390 
    || parseInt(_PROPOSTA.Averbador) === 401 || parseInt(_PROPOSTA.Averbador) === 10226 || parseInt(_PROPOSTA.Averbador) === 20124
    ) { 
      this.state.averbador = parseInt(_PROPOSTA.Averbador);
    }



    this.state.labelDocumento = _state.tipoDocumento === 'RG' ? 'do RG' : 'da CNH';
    this.state.modeloDocumento = _state.tipoDocumento;

    if (isHoraMaior(_state.dataHoraPrimeiraTela) === true) {
      this.props.history.push(this.state.homeLink);
      return false;
    }

    this.state.dataHoraPrimeiraTela = _state.dataHoraPrimeiraTela;
    this.state.dataHoraTermo = _state.dataHoraTermo;
    this.state.dataHoraCcb = _state.dataHoraCcb;

    this.state.geoInicial = _state.geoInicial;
    this.state.geoTermo = _state.geoTermo;
    this.state.geoCcb = _state.geoCcb;

    this.state.aceitouSeguro = _state.aceitouSeguro !== undefined ? _state.aceitouSeguro : '';
    this.state.dataHoraAceitouSeguro = _state.dataHoraAceitouSeguro !== undefined ? _state.dataHoraAceitouSeguro : '';

    this.state.aceitouConsultaDataprev = _state.aceitouConsultaDataprev !== undefined ? _state.aceitouConsultaDataprev : '';
    this.state.dataHoraAceitouDataprev = _state.dataHoraAceitouDataprev !== undefined ? _state.dataHoraAceitouDataprev : '';

    this.state.aceitouConta = _state.aceitouConta !== undefined ? _state.aceitouConta : '';
    this.state.dataHoraAceitouConta = _state.dataHoraAceitouConta !== undefined ? _state.dataHoraAceitouConta : '';

    this.state.aceitouAutTransferencia = _state.aceitouAutTransferencia !== undefined ? _state.aceitouAutTransferencia : '';
    this.state.dataHoraAceitouAutTransferencia = _state.dataHoraAceitouAutTransferencia !== undefined ? _state.dataHoraAceitouAutTransferencia : '';

    this.state.aceitouAutBoletos = _state.aceitouAutBoletos !== undefined ? _state.aceitouAutBoletos : '';
    this.state.dataHoraAceitouAutBoletos = _state.dataHoraAceitouAutBoletos !== undefined ? _state.dataHoraAceitouAutBoletos : '';

    this.state.aceitouDebitoEmConta = _state.aceitouDebitoEmConta !== undefined ? _state.aceitouDebitoEmConta : '';
    this.state.dataHoraAceitouDebitoEmConta = _state.dataHoraAceitouDebitoEmConta !== undefined ? _state.dataHoraAceitouDebitoEmConta : '';

    this.state.base64Ccb = _state.base64Ccb;
    this.state.base64CcbTermos = _state.base64CcbTermos;

    localStorage.setItem('@app-factafinanceira-formalizacao/dados_cartorio/cidade_cartorio', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/dados_cartorio/nome_cartorio', '');
  }

  proximaEtapa = (etapa) => {
    this.setState({etapa: etapa});
    window.scrollTo(0, 3);
  }

  componentDidMount () {
    this.getListaCidadesBase();

    if(parseInt(this.state.averbador) === 20095 )   {
        this.state.proximoLink = '/face-api-unico/'+this.props.match.params.propostaId;
        //this.getLiberaV6();
    }

    if(parseInt(this.state.averbador) === 3) {
      this.state.proximoLink = '/face-api-unico/'+this.props.match.params.propostaId;
    }
  

    if(parseInt(this.state.averbador) === 1 || parseInt(this.state.averbador) === 23 || parseInt(this.state.averbador) === 10 || parseInt(this.state.averbador) === 15 || parseInt(this.state.averbador) === 30 ||
     parseInt(this.state.averbador) === 390 || parseInt(this.state.averbador) === 401 || parseInt(this.state.averbador) === 10226 || parseInt(this.state.averbador) === 20124) {
     this.state.proximoLink = '/face-api-unico/'+this.props.match.params.propostaId; //teste
    }
  }
  
  getLiberaV6 =  async () => { 
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_liberaV6')
    .then(res => {  

      console.log('Teste');
      console.log(res.data);
      res.data.map((dados, index) => (
      
       this.state.lojasLiberar.push(dados.CODIGO)
      ));

      this.state.lojasLiberar.push(31276);
      this.state.lojasLiberar.push(19778);

      if((this.state.lojasLiberar.indexOf(this.state.codigoCorretor) != '-1')) {
        this.state.proximoLink = '/face-api-unico/'+this.props.match.params.propostaId;
      }
    })
    .catch(error => console.log(error));
  };


  toggleDanger() {
    this.setState({
      danger: !this.state.danger,
    });
  }

  gravarDadosCartorio = () => {

    // if (this.state.cidade_cartorio === "") {
    //   alert('Selecione a cidade onde fica o cartório');
    //   return false;
    // }
    //
    // if (this.state.nome_cartorio === "") {
    //   alert('Informe o nome do cartório');
    //   return false;
    // }

    localStorage.setItem('@app-factafinanceira-formalizacao/dados_cartorio/cidade_cartorio', this.state.cidade_cartorio);
    localStorage.setItem('@app-factafinanceira-formalizacao/dados_cartorio/nome_cartorio', this.state.nome_cartorio);
    this.setState({etapa : "confirmar"});
    window.scrollTo(0, 0);
  }

  confirmaEndereco = () => {
    this.props.history.push({
      pathname: this.state.proximoLink,
      search: '',
      state: {
        navegacao: true,
        base64Ccb: this.state.base64Ccb,
        base64CcbTermos: this.state.base64CcbTermos,
        obj_proposta: this.state.obj_proposta,
        dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,
        dataHoraTermo: this.state.dataHoraTermo,
        dataHoraCcb: this.state.dataHoraCcb,
        geoInicial: this.state.geoInicial,
        geoTermo: this.state.geoTermo,
        geoCcb: this.state.geoCcb,
        aceitouSeguro: this.state.aceitouSeguro,
        dataHoraAceitouSeguro: this.state.dataHoraAceitouSeguro,
        aceitouConsultaDataprev: this.state.aceitouConsultaDataprev,
        dataHoraAceitouDataprev: this.state.dataHoraAceitouDataprev,
        aceitouDebitoEmConta: this.state.aceitouDebitoEmConta,
        dataHoraAceitouDebitoEmConta: this.state.dataHoraAceitouDebitoEmConta,
        obj_pendencias: this.state.obj_pendencias,
      }
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

  }

  getDadosCepCliente = async () => {

    var cep = this.state.cep.toString();
    cep = cep.replaceAll('-', '');
    cep = cep.replaceAll('_', '');

    if (cep === '' || cep.length < 8) {
      this.toggleDanger();
      this.setState({ msgErroForm : 'Informe o número de CEP válido!', modal_tipo : 'modal-danger' });
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
      if (response.data[0] !== undefined) {
        this.setState({ carregando: false, dadosCep: response.data[0]});
        if (this.state.dadosCep.endereco !== undefined) {

          this.setState({
            endereco: this.state.dadosCep.endereco,
            bairro : this.state.dadosCep.bairro,
            estado : this.state.dadosCep.uf,
            readonly : true
          });

          this.nome_bairro.current.value = this.state.dadosCep.bairro;
          this.nome_endereco.current.value = this.state.dadosCep.endereco;

          var index;
          var a = this.state.cidades;
          for (index = 0; index < a.length; ++index) {
              if (a[index].DESCRICAO === this.state.dadosCep.cidadeDesc.toUpperCase()) {
                this.state.cidade = a[index].CODIGO;
                this.state.nome_cidade = a[index].DESCRICAO;
                break;
              }
          }
          // this.state.readonly = true;
        }
      }
      else {
        this.setState({
          carregando: false,
          dadosCep: [],
          bairro : '',
          endereco : '',
          readonly : false
        });
        this.nome_bairro.current.value = "";
        this.nome_endereco.current.value = "";
      }
    }.bind(this))
    .catch(function (response) {
        this.setState({ carregando: false, dadosCep: [] });
    }.bind(this));

  }

  atualizarEndereco = async () => {

      this.state.obj_proposta.CLIENTE.CEP = this.state.cep;
      this.state.obj_proposta.CLIENTE.ENDERECO = this.state.endereco;
      this.state.obj_proposta.CLIENTE.NUMERO = this.state.numero;
      this.state.obj_proposta.CLIENTE.COMPLEMENTO = this.state.complemento;
      this.state.obj_proposta.CLIENTE.BAIRRO = this.state.bairro;
      this.state.obj_proposta.CLIENTE.NOME_CIDADE = this.state.nome_cidade;
      this.state.obj_proposta.CLIENTE.ESTADO = this.state.estado;

      this.setState({
        etapa : 'confirmar'
      });

      let dia = ("0" + (new Date().getDate())).slice(-2);
      let mes = ("0" + (new Date().getMonth() + 1)).slice(-2);
      let ano = new Date().getFullYear();
      let token_atualiza = md5('api_atualiza_end_cliente_' + ano + '-' + mes + '-' + dia);

      const FormData = require('form-data');
      const axios = require('axios');
      const formData = new FormData();
      formData.set('cep', this.state.cep);
      formData.set('endereco', this.state.endereco);
      formData.set('numero', this.state.numero);
      formData.set('complemento', this.state.complemento);
      formData.set('bairro', this.state.bairro);
      formData.set('cidade', this.state.cidade);
      formData.set('estado', this.state.estado);
      // formData.set('codigo', this.state.obj_proposta.CLIENTE.CODIGO);
      formData.set('codigo', 3315347);
      formData.set('token', token_atualiza);

      await axios({
        method: 'post',
        url: 'https://app.factafinanceira.com.br/proposta/atualiza_dados_endereco',
        data: formData,
        headers: { 'Content-Type' : 'multipart/form-data' }
      })
      .then(function (response) {
        this.toggleDanger()
        this.setState({ msgErroForm : 'Endereço atualizado com sucesso!', modal_tipo : 'modal-success' })
      }.bind(this))
      .catch(function (response) {
        this.toggleDanger()
        this.setState({ msgErroForm : 'Houve um problema ao tentar realizar a atualização!', modal_tipo : 'modal-danger' })
      }.bind(this));

  }

  updateCampoFormulario = (e) => {
    if (e.target.name !== undefined) {
      let {name, value} = e.target;
      let new_state = Object.assign({}, this.state);
      this.setState({ [name] : value });
    }
  }

  filtraCidadePorEstado = (e) => {
    if (e.target.name !== undefined) {
      let {name, value} = e.target;
      this.setState({ cidade_cartorio : "" });
      this.mudaVisibilidadeCidade('[data-uf]', 'block');
      this.state.cidade_cartorio = "Selecione";
      if (value !== undefined && value !== "" && value !== "Selecione") {
        this.mudaVisibilidadeCidade('[data-uf]', 'none');
        this.mudaVisibilidadeCidade('[data-uf="'+value+'"]', 'block');
      }
    }
  }

  mudaVisibilidadeCidade = (atributo, estilo) => {
    var elems = document.querySelectorAll(atributo);
    var index = 0, length = elems.length;

    document.getElementById('ListaCidadesPeloNome').innerHTML = "";
    var ulNovo = document.createElement('ul');
    ulNovo.style["list-style"] = "none";
    ulNovo.style["padding-left"] = "10px";
    ulNovo.style["max-height"] = "150px";
    ulNovo.style["overflow"] = "auto";

    for ( ; index < length; index++) {
      elems[index].style.display = estilo;
      if (estilo === 'block') {
          elems[index].removeAttribute('disabled');
          var liNovo = document.createElement('li');
          liNovo.innerHTML = elems[index].innerHTML;
          liNovo.addEventListener('click', function(e) {
            this.selecionaCidade(e.target.innerHTML);
          }.bind(this));
          ulNovo.appendChild(liNovo);
      }
      else {
        elems[index].setAttribute('disabled', 'disabled');
      }
    }
    document.getElementById('ListaCidadesPeloNome').appendChild(ulNovo);
  }

  selecionaCidade = (nome) => {

    var optionSelecionada = document.querySelector("option[data-nome='"+ nome +"']");
    this.setState({ cidade_cartorio : optionSelecionada.value });
    document.getElementsByName('cidade_auto_complete')[0].value = nome;
    document.getElementById('ListaCidadesPeloNome').innerHTML = "";

  }

  filtraCidadePeloNome = (e) => {
    if (e.target.name !== undefined) {
      let {name, value} = e.target;
      if (value !== undefined && value !== "") {
        this.mudaVisibilidadeCidade('option[data-nome]', 'none');
        this.mudaVisibilidadeCidade('option[data-nome^="'+value.toUpperCase()+'"]', 'block');
      }
    }
  }

  render() {

    const appHeightAuto = {
      "height": "auto"
    };
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px',
      "overflow" : "auto"
    };

    const inputToUpper = { "textTransform" : "uppercase" };

    var CLIENTE = this.state.obj_proposta.CLIENTE ?? null;

    return (
      <div className="app align-items-center" style={appHeightAuto} >
        { CLIENTE !== null
          ? <>
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
              <LayoutFactaHeader />
              <Row className="mt-6">

                { isMobile === false
                  ? <>
                      <Col md="5" style={{ 'position' : 'relative' }}>
                          <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                          <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                          <TimelineProgresso
                            bemvindo="fa fa-check-square-o text-success"
                            uso="fa fa-check-square-o text-success"
                            proposta="fa fa-check-square-o text-success"
                            residencia="fa fa-square-o"
                            fotos="fa fa-square-o"
                            audio="fa fa-square-o"
                          />
                      </Col>
                    </>
                  : null
                }

                <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody>
                      { this.state.etapa === 'declaracao'
                        ? <>
                            <Row>
                              <Col>
                                <h4 className="text-center mb-3 font-weight-bold">Declaração</h4>
                                <Row className="mt-5">
                                  <Col className="text-justify" md="12" lg="12" xs="12" sm="12">
                                    <p>
                                      Declaro para os devidos fins que estou contratando empréstimo consignado com Facta Financeira{' '}
                                      S/A., porém, em razão da Pandemia COVID 19, decretada pelos governos Municipal, Estadual e Federal, estou{' '}
                                      em isolamento social, impedido (a) de me dirigir ao Tabelionato para autenticar Autorização de Desconto,{' '}
                                      Anexo II, Decreto 43.337/2004.
                                    </p>
                                    <p>
                                      Sendo assim, me responsabilizo integralmente sobre as penas da lei, por fazer a correspondente{' '}
                                      autenticação da autorização no prazo de 30 dias, após pagamento da operação e o envio do original para o{' '}
                                      correspondente intermediador da operação.
                                    </p>
                                    <p>INFORMAÇÃO COMPLEMENTAR:</p>
                                    <p>Cartório que possuo registro para autenticidade:</p>

                                    <Row>

                                      <Col xs="12" sm="12" md="12">
                                        <FormGroup>
                                          <Label htmlFor="orgao">Cidade do Cartório</Label>
                                          <input className="form-control" type="text" name="cidade_auto_complete" style={inputToUpper} onChange={e => this.filtraCidadePeloNome(e)}/>

                                          <div id="ListaCidadesPeloNome" style={{maxHeight : '150px', padding : '3px'}}></div>

                                          <select className="form-control" name="cidade_cartorio" multiple="multiple" style={{height : '150px', display: 'none'}} onChange={e => this.updateCampoFormulario(e)}>
                                            {this.state.cidades.map((cidade, index) => (
                                              <option value={cidade.CODIGO} data-nome={cidade.DESCRICAO + ' / ' + cidade.ESTADO}>{cidade.DESCRICAO} / {cidade.ESTADO}</option>
                                            ))}
                                          </select>

                                        </FormGroup>
                                      </Col>
                                      <Col xs="12" sm="12" md="12">
                                        <FormGroup>
                                          <Label htmlFor="orgao">Nome do Cartório</Label>
                                          <Input style={inputToUpper} type="text" name="nome_cartorio" onChange={e => this.updateCampoFormulario(e)} />
                                        </FormGroup>
                                      </Col>

                                    </Row>

                                    <Row>
                                      <Col className="text-center" xs="12">
                                        <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                          <Button color="outline-success" size="lg" className="m-1" onClick={() => {this.gravarDadosCartorio()}}>
                                            Confirmar
                                          </Button>
                                        </Col>
                                      </Col>
                                    </Row>

                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </>
                        : (<>
                          { this.state.etapa === 'confirmar'
                            ? <>
                                <Row>
                                  <Col>
                                    <h4 className="text-center mb-3 font-weight-bold">Declaração de Residência</h4>

                                    {(this.state.obj_proposta.Tipo_Operacao != 35 && this.state.obj_proposta.Tipo_Operacao != 36) && 
                                      <Row className="mt-5">
                                        <Col className="text-justify" md="12" lg="12" xs="12" sm="12">
                                          <h5 style={{"lineHeight" : "30px"}}>
                                            Eu, <span className="font-weight-bold">{  CLIENTE.DESCRICAO }</span>, Brasileiro, 
                                            portador(a) da carteira de{" "} identidade/RG/RNE nº <span className="font-weight-bold">{ CLIENTE.RG}</span>,{" "}
                                            inscrito(a) no CPF sob nº <span className="font-weight-bold">{CLIENTE.CPF}</span>, declaro, nos termos da Lei nº 7.115/83, ser residente e{" "}
                                            domiciliado à <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.ENDERECO}</span>,{" "}
                                            <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.NUMERO}</span>{this.state.obj_proposta.CLIENTE.COMPLEMENTO !== '' ? <>{", "}<span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.COMPLEMENTO}</span></> : null},{" "}
                                            Bairro <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.BAIRRO}</span>,{" "}
                                            Cidade <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.NOME_CIDADE}</span>, Estado <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.ESTADO}</span>,{" "}
                                            CEP <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.CEP}</span>.
                                            <br />
                                            Estou ciente e concordo que a alteração do meu domicílio deverá ser imediatamente comunicada por escrito à <span className="font-weight-bold">FACTA FINANCEIRA S.A</span>.
                                          </h5>
                                          <p>Local e Data:</p>
                                          <p>
                                            <span className="font-weight-bold">{ this.state.obj_proposta.CLIENTE.NOME_CIDADE }</span>,{" "}
                                            <span className="font-weight-bold">{ this.state.diaAtual }</span> de{" "}
                                            <span className="font-weight-bold">{ this.state.mesAtual.toUpperCase() } de { this.state.anoAtual }</span>.
                                          </p>
                                        </Col>
                                      </Row>
                                    }

                                    
                                    {(this.state.obj_proposta.Tipo_Operacao == 35 || this.state.obj_proposta.Tipo_Operacao == 36) && 
                                      <Row className="mt-5">
                                        <Col className="text-justify" md="12" lg="12" xs="12" sm="12">
                                          <h5 style={{"lineHeight" : "30px"}}>
                                            Eu, <span className="font-weight-bold">{ this.state.obj_proposta.NOME_REPRESENTANTE }</span>, Brasileiro, 
                                            inscrito(a) no CPF sob nº <span className="font-weight-bold">{this.state.obj_proposta.CPF_REPRESENTANTE }</span>, declaro, nos termos da Lei nº 7.115/83, ser residente e{" "}
                                            domiciliado à <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.ENDERECO}</span>,{" "}
                                            <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.NUMERO}</span>{this.state.obj_proposta.CLIENTE.COMPLEMENTO !== '' ? <>{", "}<span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.COMPLEMENTO}</span></> : null},{" "}
                                            Bairro <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.BAIRRO}</span>,{" "}
                                            Cidade <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.NOME_CIDADE}</span>, Estado <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.ESTADO}</span>,{" "}
                                            CEP <span className="font-weight-bold">{this.state.obj_proposta.CLIENTE.CEP}</span>.
                                            <br />
                                            Estou ciente e concordo que a alteração do meu domicílio deverá ser imediatamente comunicada por escrito à <span className="font-weight-bold">FACTA FINANCEIRA S.A</span>.
                                          </h5>
                                          <p>Local e Data:</p>
                                          <p>
                                            <span className="font-weight-bold">{ this.state.obj_proposta.CLIENTE.NOME_CIDADE }</span>,{" "}
                                            <span className="font-weight-bold">{ this.state.diaAtual }</span> de{" "}
                                            <span className="font-weight-bold">{ this.state.mesAtual.toUpperCase() } de { this.state.anoAtual }</span>.
                                          </p>
                                        </Col>
                                      </Row>
                                    }
                                  </Col>
                                </Row>
                                <Row>
                                  <Col className="text-center" xs="12">
                                    <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                      <Button color="outline-danger" size="lg" className="rounded-circle m-1" style={{'width' : '64px', 'height' : '64px'}} onClick={() => {this.setState({etapa : 'editar'})}}>
                                        <i className="fa fa-remove fa-lg m-0" style={{'fontSize' : '28px'}}></i>
                                      </Button>
                                      <Button color="outline-success" size="lg" className="rounded-circle m-1" style={{'width' : '64px', 'height' : '64px'}} onClick={this.confirmaEndereco}>
                                        <i className="fa fa-check fa-lg m-0" style={{'fontSize' : '28px'}}></i>
                                      </Button>
                                    </Col>
                                  </Col>
                                </Row>
                              </>
                            : <>
                              <Row>
                                <Col className="text-left">
                                  <h4 className="text-center mb-3 font-weight-bold">Declaração de Residência</h4>

                                  <Row className="mt-3">
                                    <Col xs="12">
                                      <h5 className="font-weight-bold">Dados do Endereço</h5>
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
                                    <Col md="6" lg="6" xs="12" sm="12">
                                      <FormGroup>
                                        <Label htmlFor="orgao">Endereço</Label>
                                        <Input ref={this.nome_endereco} style={inputToUpper} type="text" name="endereco" onChange={e => this.updateCampoFormulario(e)} value={this.state.endereco} readOnly={this.state.readonly}/>
                                      </FormGroup>
                                    </Col>
                                    <Col md="2" lg="2" xs="6" sm="6">
                                      <FormGroup>
                                        <Label htmlFor="orgao">Número</Label>
                                        <Input type="text" name="numero" onChange={e => this.updateCampoFormulario(e)} />
                                      </FormGroup>
                                    </Col>
                                    <Col md="4" lg="4" xs="6" sm="6">
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
                                        <Input ref={this.nome_bairro} style={inputToUpper} type="text" name="bairro" onChange={e => this.updateCampoFormulario(e)} value={this.state.bairro} readOnly={this.state.readonly}/>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col xs="12" sm="12" md="6">
                                      <FormGroup>
                                        <Label htmlFor="orgao">Cidade</Label>
                                        <Input ref={this.selectCidade} type="select" name="cidade" onChange={e => this.updateCampoFormulario(e)} readOnly={this.state.readonly}>
                                          <option>Selecione</option>
                                          {this.state.cidades.map((cidade, index) => (
                                            <option value={cidade.CODIGO} selected={this.state.dadosCep.cidadeDesc !== undefined && this.state.dadosCep.cidadeDesc.toUpperCase() === cidade.DESCRICAO ? 'selected' : null} >{cidade.DESCRICAO}</option>
                                          ))}
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                    <Col xs="12" sm="12" md="6">
                                      <FormGroup>
                                        <Label htmlFor="orgao">Estado</Label>
                                        <Input type="select" name="estado" onChange={e => this.updateCampoFormulario(e)} readOnly={this.state.readonly}>
                                          <option>Selecione</option>
                                          {this.state.estados.map((estado, index) => (
                                            <option value={estado.CODIGO} selected={this.state.dadosCep.uf !== undefined && this.state.dadosCep.uf.toUpperCase() === estado.CODIGO ? 'selected' : null} >{estado.NOME}</option>
                                          ))}
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                  </Row>

                                </Col>
                              </Row>
                              <Row>
                                <Col className="text-center" xs="12">
                                  <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                    <Button color="outline-danger" size="lg" className="m-1" onClick={() => {this.setState({etapa : 'confirmar'})}}>
                                      Voltar
                                    </Button>
                                    <Button color="outline-success" size="lg" className="m-1" onClick={() => {this.atualizarEndereco()}}>
                                      Confirmar
                                    </Button>
                                  </Col>
                                </Col>
                              </Row>
                              <Modal isOpen={this.state.danger} toggle={this.toggleDanger} className={this.state.modal_tipo}>
                                <ModalHeader toggle={this.toggleDanger}>Aviso</ModalHeader>
                                <ModalBody>
                                  { this.state.msgErroForm }
                                </ModalBody>
                              </Modal>
                            </>
                          }
                        </>)
                      }
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
            </>
            : null
          }
      </div>
    );
  }
}

export default DeclaracaoResidencia;
