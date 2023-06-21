import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row, FormGroup, Input, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from "react-router-dom";
import Moment from "react-moment";
import domtoimage from 'dom-to-image';
import {isMobile} from 'react-device-detect';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';

import DadosDoClienteTemplate from '../../../DadosDoClienteTemplate';
import DadosDoCorretorTemplate from '../../../DadosDoCorretorTemplate';
import DadosDaPropostaVinculadaTemplate from '../../../DadosDaPropostaVinculadaTemplate';

import TimelineProgresso from '../../TimelineProgresso';

class CedulaFactaFacil extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: true,
      timeout: 300,
      tipoPendencia: props.tipo,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      // homeLink: '/totem-facta',
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      linkPropostaPendente: '/proposta-pendente/'+this.props.match.params.propostaId,
      propostaINSS: false,
      fontSizeControle: '0.875rem',

      base64Ccb: '',
      clicou: false,

      aceitouSeguro: true,
      dataHoraAceitouSeguro: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      aceitouConsultaDataprev: true,
      dataHoraAceitouDataprev: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      aceitouDebitoEmConta: true,
      dataHoraAceitouDebitoEmConta: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      diaAtual: new Date().getDate(),
      anoAtual: new Date().getFullYear(),
      mesAtual: new Date().toLocaleString('default', { month: 'long' }),
      labelSeguroSim: 'X',
      labelSeguroNao: '',

      obj_proposta: [],
      obj_corretor: [],
      obj_cliente: [],
      obj_banco: [],
      obj_contratos: [],
      obj_vinculadas: [],
      tipoOperacao: [],
      espBeneficio: [],
      carregando: true,
      proximoLink: '/tipo-documento/'+this.props.match.params.propostaId,
      permissaoLocalizacao: false,
      localizacaoCcb: '',
      mdlLgSeguro: false,
      mdlDebConta: false,
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      vlrSeguro : 0
    };

    this.toggleModalDebConta = this.toggleModalDebConta.bind(this);
    this.toggleModalSeguro = this.toggleModalSeguro.bind(this);

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
      return false;
    }
    else {

      var _state = this.props.location.state;

      var PRINCIPAL = _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias : _state.obj_proposta;

      this.state.obj_proposta = _state.obj_proposta;
      this.state.obj_corretor = PRINCIPAL.CORRETOR;
      this.state.obj_cliente = PRINCIPAL.CLIENTE;
      this.state.obj_banco = PRINCIPAL.BANCO;
      this.state.obj_contratos = PRINCIPAL.CONTRATOSREFIN;
      this.state.tipoOperacao = PRINCIPAL.TIPOOPERACAO;
      this.state.espBeneficio = PRINCIPAL.ESPECIEBENEFICIO;

      this.state.aceitouSeguro = PRINCIPAL.VLRSEGURO !== undefined && parseFloat(PRINCIPAL.VLRSEGURO !== '' && PRINCIPAL.VLRSEGURO !== null ? PRINCIPAL.VLRSEGURO : 0) > 0 ? true : false;
      this.state.vlrSeguro = PRINCIPAL.VLRSEGURO !== undefined && parseFloat(PRINCIPAL.VLRSEGURO !== '' && PRINCIPAL.VLRSEGURO !== null ? PRINCIPAL.VLRSEGURO : 0) > 0 ? PRINCIPAL.VLRSEGURO : 0;

      if (this.state.obj_proposta.Tipo_Operacao == 14) {
        this.state.aceitouSeguro = 'N';
        this.state.labelSeguroSim = '';
        this.state.labelSeguroNao = 'X';
      }
      else if (isNaN(parseFloat(this.state.obj_proposta.VLRSEGURO)) || parseFloat(this.state.obj_proposta.VLRSEGURO) <= 0) {
        this.state.aceitouSeguro = 'N';
        this.state.labelSeguroSim = '';
        this.state.labelSeguroNao = 'X';
      }

      if (_state.obj_pendencias !== undefined && _state.obj_pendencias !== []) {
        this.state.obj_vinculadas = [];
      }
      else {
        this.state.obj_vinculadas = _state.obj_proposta.PROPOSTA_VINCULADA;
      }

      this.state.dataHoraPrimeiraTela = _state.dataHoraPrimeiraTela;
      this.state.dataHoraTermo = _state.dataHoraTermo;

      this.state.geoInicial = _state.geoInicial;
      this.state.geoTermo = _state.geoTermo;

      if (_state.obj_pendencias !== undefined) {
        this.state.homeLink = '/'+this.state.tipoPendencia+'/'+this.props.match.params.propostaId;
        this.state.tipoFormalizacao = 'pendencias';
        this.state.obj_pendencias = _state.obj_pendencias;
        if (PRINCIPAL.pendencia_de_documentos === true) {
          this.state.proximoLink = '/'+this.state.tipoPendencia+'-tipo-documento/'+this.props.match.params.propostaId;
        }
        else if (PRINCIPAL.pendencia_de_selfie === true) {
          this.state.proximoLink = '/'+this.state.tipoPendencia+'-selfie/'+this.props.match.params.propostaId;
        }
        else if (PRINCIPAL.pendencia_de_audio === true) {
          this.state.proximoLink = '/'+this.state.tipoPendencia+'-gravacao-de-audio/'+this.props.match.params.propostaId;
        }
      }
      else {
        //this.state.proximoLink = '/tipo-documento/'+this.props.match.params.propostaId; // Rota antiga para já tirar foto dos DOCS
        this.state.proximoLink = '/declaracao-de-residencia/'+this.props.match.params.propostaId;
      }

    }

  }

  toggleModalSeguro() {
    this.setState({
      mdlLgSeguro: !this.state.mdlLgSeguro,
    });
  }

  toggleModalDebConta() {
    this.setState({
      mdlDebConta: !this.state.mdlDebConta,
    });
  }

  handleChange = e => {
    const { name, value } = e.target;
    if (name === "rd_seguro_prestamista") {
      this.setState({
        aceitouSeguro: value === "0" ? false : true,
        labelSeguroSim: value === "0" ? '' : 'X',
        labelSeguroNao: value === "0" ? 'X' : '',
        dataHoraAceitouSeguro: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':')
      });
    }
    else if (name === 'autorizacao_dataprev') {
      this.setState({
        aceitouConsultaDataprev: this.state.aceitouConsultaDataprev === true ? false : true,
        dataHoraAceitouDataprev: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':')
      });
    }
    else if (name === 'chkAutDebConta') {
      this.setState({
        aceitouDebitoEmConta: this.state.aceitouDebitoEmConta === true ? false : true,
        dataHoraAceitouDebitoEmConta: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':')
      });
    }
  };

  validaPropostaINSS = (vinculada) => {
    if (vinculada.Averbador === 3) {
      this.state.propostaINSS = true;
    }
  }

  salvaImgCcb = async () => {

    this.setState({clicou: true});
    let corretor = this.state.obj_proposta.CORRETOR;

    if (this.state.aceitouSeguro === false && (this.state.vlrSeguro > 0)) {
      this.props.history.push({
        pathname: this.state.linkPropostaPendente,
        search: '',
        state: {
          navegacao: true,
          obj_proposta: this.state.obj_proposta
        }
      });
      return false;
    }
    else {

      this.setState({ clicou: true, fontSizeControle : '0.650rem' });
      var node = document.getElementById('ccbCliente');
      var timelineRemover = node.querySelector('#divTimeline');
      if (timelineRemover !== undefined && timelineRemover !== null) {
        timelineRemover.remove();
      }
      localStorage.setItem('@app-factafinanceira-formalizacao/dados_html_ccb', node.innerHTML);
      // node.style = null;
      await domtoimage.toPng(node)
      .then(function (dataUrl) {
        this.props.history.push({
          pathname: this.state.proximoLink,
          search: '',
          state: {
            navegacao: true,
            base64Ccb: dataUrl,
            obj_proposta: this.state.obj_proposta,
            dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,
            dataHoraTermo: this.state.dataHoraTermo,
            dataHoraCcb: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
            geoInicial: this.state.geoInicial,
            geoTermo: this.state.geoTermo,
            geoCcb: this.state.localizacaoCcb,
            aceitouSeguro: this.state.aceitouSeguro,
            dataHoraAceitouSeguro: this.state.dataHoraAceitouSeguro,
            aceitouConsultaDataprev: this.state.aceitouConsultaDataprev,
            dataHoraAceitouDataprev: this.state.dataHoraAceitouDataprev,
            aceitouDebitoEmConta: this.state.aceitouDebitoEmConta,
            dataHoraAceitouDebitoEmConta: this.state.dataHoraAceitouDebitoEmConta,
            obj_pendencias: this.state.obj_pendencias,
          }
        });
      }.bind(this))
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
    }

  }

  componentDidMount() {
    this.setState({ carregando : false });
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
    navigator.geolocation.getCurrentPosition(
      function(position) {
        this.setState({ localizacaoCcb: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });
      }.bind(this),
      function(error) {
        this.setState({ permissaoLocalizacao: false });
      }.bind(this)
    );
  }

  render() {
    const iconWarning = {
      "color" : "red"
    }

    const appHeightAuto = {
      "height": "auto",
      "overflowY" : !isMobile ? "hidden" : "unset",
      "overflowX" : !isMobile ? "hidden" : "unset"
    };

    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px',
      "fontSize" : this.state.fontSizeControle,
      "overflow" : "auto",

    };

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }

    // Variáveis da AF principal
    if (this.state.obj_proposta !== undefined) {
      var AF = (this.state.tipoPendencia === "normal") ? this.state.obj_proposta : this.state.obj_pendencias.PROPOSTA;
      var CODIGO = this.state.obj_proposta.CODIGO;
      var COD_TP_OPERACAO = parseInt(this.state.obj_proposta.Tipo_Operacao);
      var TIPO_OPERACAO = this.state.tipoOperacao !== undefined ? this.state.tipoOperacao.nome : '';
      var DATA_INI_PROPOSTA = this.state.obj_proposta.DATAINICIO;
      var DATA_FIM_PROPOSTA = this.state.obj_proposta.DATAFIM;
      var CLIENTE = this.state.obj_cliente;
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} >
      { this.state.carregando
        ? <LayoutFactaCarregando />
        : ( this.state.permissaoLocalizacao === true
          ?
            <>
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop} id="ccbCliente">

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
                              proposta="fa fa-square-o"
                              residencia="fa fa-square-o"
                              fotos="fa fa-square-o"
                              audio="fa fa-square-o"
                            />
                        </Col>
                      </>
                    : null
                  }

                  <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}} style={{ 'height' : (window.screen.height * 0.85), 'overflow' : isMobile ? "unset" : "auto" }}>

                  <Card className="border-white shadow text-left" style={{borderRadius: '8px'}}>

                    <CardBody>
                      <Row className="mt-3">
                        <Col xs="12" sm="12">
                          <h5 className="text-center font-weight-bold">Facta Fácil</h5>
                          <h5 className="text-center font-weight-bold">Proposta { CODIGO }</h5>
                          <h5 className="text-center mb-3 font-weight-bold">{ TIPO_OPERACAO }</h5>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs="12" sm="12" xm="12">
                          <h5 className="text-center pb-3 border-bottom border-light">Custo Efetivo Total</h5>
                          <label>Proposta</label>
                          <p className="font-weight-bold"> { CODIGO } </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="6" sm="6" xm="12">
                          <label>1º Desconto</label>
                          <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{ DATA_INI_PROPOSTA }</Moment></p>
                        </Col>
                        <Col xs="6" sm="6" xm="12">
                          <label>Último Desconto</label>
                          <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{ DATA_FIM_PROPOSTA }</Moment></p>
                        </Col>
                      </Row>

                        {
                          (COD_TP_OPERACAO !== undefined && (COD_TP_OPERACAO === 2 || COD_TP_OPERACAO === 14))
                            ? (
                                <Row>
                                  <Col xs="12" sm="12" xm="12">
                                    <label>Nro. Contrato(s) Refinanciado(s)</label>
                                    <p className="font-weight-bold"> { AF.NUMERO_CONTRATO_REFIN.split("|").join(" ") } </p>
                                  </Col>
                                  <Col xs="6" sm="6" xm="12">
                                    <label>Saldo Devedor</label>
                                    <p className="font-weight-bold"> R$ { AF.saldoDevedor } </p>
                                  </Col>
                                  <Col xs="6" sm="6" xm="12">
                                    <label>Troco</label>
                                    <p className="font-weight-bold"> R$ { AF.VLRAF } </p>
                                  </Col>
                                  <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold">Valor pago no final</p>
                                  </Col>
                                  <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold"> { (AF.NUMEROPRESTACAO * AF.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor) } </p>
                                  </Col>
                                </Row>
                              )
                            : (
                              <>
                                <Row className="border-bottom mb-3">
                                  <Col xs="6" sm="6" xm="12">
                                    <label>Valor Liberado</label>
                                    <p className="font-weight-bold"> { AF !== [] ? parseFloat(AF.VLRAF).toLocaleString('pt-BR', formatoValor) : null } </p>
                                  </Col>
                                  <Col xs="6" sm="6" xm="12">
                                    <label>Parcelas</label>
                                    <p className="font-weight-bold"> { AF.NUMEROPRESTACAO }x { AF !== [] ? parseFloat(AF.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor) : null }</p>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold">Valor Pago no Final</p>
                                  </Col>
                                  <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold"> { (AF.NUMEROPRESTACAO * AF.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor) }</p>
                                  </Col>
                                </Row>
                              </>
                            )
                        }
                      </CardBody>
                    </Card>

                    <DadosDoClienteTemplate cliente={this.state.obj_cliente} />

                    {/*Card Original p/ todos os demais*/}

                    <Card>
                      <CardBody className="text-left">
                        <h5 className="text-center pb-4 border-bottom">Dados Funcionais</h5>
                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <label>Fonte Pagadora</label>
                            <p className="font-weight-bold">{ this.state.obj_proposta.DADOSAVERBADOR_F4.DESCRICAO }</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="4" sm="4" xm="12">
                            <label>Nº do Benefício</label>
                            <p className="font-weight-bold">{ AF.MATRICULA }</p>
                          </Col>
                          <Col xs="8" sm="8" xm="12">
                            <label>Espécie</label>
                            <p className="font-weight-bold">{
                              AF !== [] && AF.TIPOBENEFICIO !== '' && this.state.espBeneficio[0] !== undefined
                              ? AF.TIPOBENEFICIO + ' - ' + this.state.espBeneficio[0].NOME
                              : ' - '
                            }</p>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card> 

                    <Card>
                      <CardBody className="text-left">
                        <h5 className="text-center pb-4 border-bottom">Dados Bancários</h5>
                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <label>Banco</label>
                            <p className="font-weight-bold"> { this.state.obj_banco.CODIGO !== undefined ? this.state.obj_banco.CODIGO.padStart(3, '0') + ' - ' + this.state.obj_banco.DESCRICAO : null }</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="6" sm="6" xm="12">
                            <label>Nº da Agência</label>
                            <p className="font-weight-bold"> { AF.AGENCIA !== undefined ? AF.AGENCIA.padStart(6, '0') : null } </p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <label>Nº da Conta</label>
                            <p className="font-weight-bold"> { AF.CONTA !== undefined ? AF.CONTA.padStart(8, '0') : null } </p>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>

                    <DadosDoCorretorTemplate corretor={this.state.obj_corretor} />

                    <Card>
                      <CardBody className="text-left">
                        <h5 className="text-center pb-4 border-bottom">
                          Dados da Proposta
                          <p><small className="text-muted">({ this.state.tipoOperacao.nome })</small></p>
                        </h5>

                        <Row>
                          <Col xs="6" sm="6" xm="12">
                            <label>Valor Líquido do Crédito</label>
                            <p className="font-weight-bold"> { parseFloat(AF.VLRAF).toLocaleString('pt-BR', formatoValor) } </p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <label>Quantidade de Parcelas</label>
                            <p className="font-weight-bold"> { AF.NUMEROPRESTACAO } parcelas </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="6" sm="6" xm="12">
                            <label>Tarifa de Cadastro</label>
                            <p className="font-weight-bold"> R$ 0,00 </p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <label>Seguro</label>
                            <p className="font-weight-bold"> R$ 0,00 </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="6" sm="6" xm="12">
                            <label>1ª Parcela</label>
                            <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{AF.DATAINICIO}</Moment></p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <label>IOF</label>
                            <p className="font-weight-bold"> R$ 0,00 </p>
                          </Col>
                        </Row>
                        <Row className="border-bottom mb-3">
                          <Col xs="6" sm="6" xm="12">
                            <label>Última Parcela</label>
                            <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{AF.DATAFIM}</Moment></p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <label>IOF</label>
                            <p className="font-weight-bold"> R$ 0,00 </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="6" sm="6" xm="12">
                            <label>Valor Total de Crédito</label>
                            <p className="font-weight-bold"> {
                              AF.Tipo_Operacao !== undefined && (AF.Tipo_Operacao === 2 || AF.Tipo_Operacao === 14)
                                ? parseFloat(AF.saldoDevedor).toLocaleString('pt-BR', formatoValor)
                                : parseFloat(AF.VLRAF).toLocaleString('pt-BR', formatoValor)
                              }
                            </p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <label>Valor Total Devido</label>
                            <p className="font-weight-bold"> {
                              AF.VLRPRESTACAO !== undefined
                                ? (AF.VLRPRESTACAO * AF.NUMEROPRESTACAO).toLocaleString('pt-BR', formatoValor)
                                : ' - '
                              }
                            </p>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>

                    {
                      this.state.obj_vinculadas !== undefined ? (
                          Object.values(this.state.obj_vinculadas).map(item_vinculada => (
                            <>
                              <DadosDaPropostaVinculadaTemplate proposta={item_vinculada} tipo_operacao={item_vinculada.TIPOOPERACAO.nome} cod_tipo_operacao={item_vinculada.Tipo_Operacao}/>
                            </>
                          )
                        )
                      ) : null
                    }

                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody className="text-left">
                        <h5 className="text-center border-bottom border-light pb-3 font-weight-bold"><i className="fa fa-warning" style={iconWarning}></i>  ATENÇÃO <i className="fa fa-warning red-color" style={iconWarning}></i></h5>
                        <Col xs="12" sm="12" xm="12">
                          <Label check className="form-check-label text-justify">
                          A <strong>Facta</strong> NÃO solicita valores antecipados ou quaisquer tipo de pagamentos/transferências para contas que não sejam de titularidade da <strong>FACTA FINANCEIRA</strong> 
                           &nbsp; com CNPJ de inscrição. Antes de realizar depósitos ou pagamentos, entre em contato conosco &nbsp; 0800.942.04.62 &nbsp; ou &nbsp;
                           (51) 3191.7318.
                          </Label>
                        </Col>
                      </CardBody>
                    </Card>
                      

                    { this.state.propostaINSS === true
                      ?
                        <>
                          <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                            <CardBody className="text-left">
                              <h5 className="text-center border-bottom border-light pb-3">Autorização de Consulta de Dados</h5>
                              <Row>
                                <Col xs="12" sm="12" xm="12">
                                  <FormGroup check className="checkbox">
                                    <Input className="form-check-input" type="checkbox" id="checkbox1" name="autorizacao_dataprev" value="1" defaultChecked onChange={this.handleChange} />
                                    <Label check className="form-check-label" htmlFor="checkbox1">
                                      Eu, { this.state.obj_cliente.DESCRICAO }, autorizo a <span className="font-weight-bold">FACTA FINANCEIRA</span> consultar meus dados junto à <span className="font-weight-bold">DATAPREV</span> através da <span className="font-weight-bold">API</span> disponibilizada pela própria <span className="font-weight-bold">DATAPREV</span>.
                                    </Label>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </>
                      : null
                    }

                    { /* CRIAR COMPONENTE DO SEGURO POIS É IGUAL PARA TODOS */}
                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody className="text-left">
                        <h5 className="text-center border-bottom border-light pb-3">Seguro Prestamista</h5>
                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <FormGroup check inline>
                              <Input className="form-check-input" type="radio" id="inline-radio1" name="rd_seguro_prestamista" value="1" onChange={this.handleChange} defaultChecked />
                              <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Input className="form-check-input" type="radio" id="inline-radio2" name="rd_seguro_prestamista" value="0" onChange={this.handleChange} />
                              <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                            </FormGroup>
                          </Col>
                        </Row>

                        { [13, 14, 17, 18, 27].indexOf(COD_TP_OPERACAO) !== -1
                          ? <Row>
                              <Col xs="12" sm="12" xm="12">
                                <label>Seguro Prestamista Proposta { CODIGO }</label>
                                <p className="font-weight-bold">
                                {
                                  parseFloat( isNaN(parseFloat(AF.VLRSEGURO)) ? 0 : AF.VLRSEGURO ).toLocaleString('pt-BR', formatoValor)
                                }
                                </p>

                              </Col>
                          </Row>
                          : null
                        }

                        { this.state.obj_vinculadas !== undefined ? (
                            Object.values(this.state.obj_vinculadas).map(item_vinculadas => (
                              <>
                                { item_vinculadas.Tipo_Operacao === 13 || item_vinculadas.Tipo_Operacao === 14 || item_vinculadas.Tipo_Operacao === 18
                                  ? <>
                                    <Row>
                                      <Col xs="12" sm="12" xm="12">
                                        <label>Seguro Prestamista Proposta { item_vinculadas.CODIGO }</label>
                                        <p className="font-weight-bold">
                                        {
                                          parseFloat( isNaN(parseFloat(item_vinculadas.VLRSEGURO)) ? 0 : (item_vinculadas.VLRSEGURO <= 0 ? 0 : item_vinculadas.VLRSEGURO) ).toLocaleString('pt-BR', formatoValor)
                                          /*parseFloat(item_vinculadas.VLRSEGURO !== '' && item_vinculadas.VLRSEGURO !== null ? item_vinculadas.VLRSEGURO : 0).toLocaleString('pt-BR', formatoValor)*/
                                        }
                                        </p>
                                      </Col>
                                    </Row>
                                    </>
                                  : null
                                }
                              </>
                            ))
                          ) : null
                        }

                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <label>Apólice Nº</label>
                            <p className="font-weight-bold"> - </p>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <label>Razão Social</label>
                            <p className="font-weight-bold">FACTA SEGURADORA S/A MICROSSEGURADORA</p>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <label>SUSEPE Nº</label>
                            <p className="font-weight-bold">15414.99999/2019-99</p>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" sm="12" xm="12" className="text-center">
                            <Button onClick={this.toggleModalSeguro} className="btn-block font-weight-bold mt-2" color="outline-primary">Visualizar o bilhete do seguro</Button>
                          </Col>
                        </Row>

                      </CardBody>
                    </Card>
                    { /* /#> CRIAR COMPONENTE DO SEGURO POIS É IGUAL PARA TODOS */}

                    <Modal isOpen={this.state.mdlLgSeguro} toggle={this.toggleModalSeguro} className={'modal-lg ' + this.props.className}>
                      <ModalHeader toggle={this.toggleModalSeguro}>
                        <img src={ require('../../../assets/img/ass_seguradora_1024.png') } alt="Logo Facta Seguradora" style={{ maxWidth: '256px' }}/>
                      </ModalHeader>
                      <ModalBody>
                        <p>
                        1. Este seguro tem por objetivo garantir o pagamento de indenização ao credor em caso de ocorrência de evento coberto, equivalente ao saldo da dívida ou do compromisso assumido pelo segurado junto ao credor.
                        </p>

                        <p>
                        2. Somente poderão contratar as coberturas oferecidas nos bilhetes deste plano de microsseguro as pessoas com idade mínima de 14 (quatorze) anos e máxima de 80 (oitenta) anos.
                        </p>

                        <p>
                        3. CARÊNCIA - Período, contado a partir da data de início de vigência do seguro, durante o qual, na ocorrência do sinistro, os beneficiários do segurado não terão direito à percepção dos capitais segurados contratados. Não há carência para este Plano de Microsseguro, exceto em caso de suicídio, que deverá ser respeitada uma carência de 24 (vinte e quatro) meses.
                        </p>

                        <p>
                        4. FRANQUIA: Período contínuo, determinado no bilhete, contado a partir da data do sinistro, durante o qual a Seguradora estará isenta de qualquer responsabilidade indenizatória. Não há franquia para este Plano de Microsseguro.
                        </p>

                        <p>
                        5. VIGÊNCIA: O período de vigência do seguro será igual ao prazo do contrato do empréstimo.
                        </p>

                        <p>
                        6. SEGURADO: O capital segurado está na modalidade “vinculado”, pois o capital segurado será durante toda vigência, necessariamente, igual ao valor da obrigação, sendo alterado automaticamente a cada amortização ou reajuste.
                        </p>

                        <p>
                        7. ATUALIZAÇÃO DO CAPITAL SEGURADO: A periodicidade utilizada para o recálculo do valor do Capital Segurado será mensal, refletindo a amortização e/ou reajuste ocorrido no contrato de empréstimo no decorrer do mês anterior.
                        </p>

                        <p>
                        8. RISCOS EXCLUÍDOS - Estão expressamente excluídos de todas as coberturas deste seguro os eventos ocorridos, direta ou indiretamente, em consequência de: a) atos ilícitos dolosos praticados pelo segurado principal ou dependente, pelo beneficiário ou pelo representante legal de qualquer deles; b) suicídio ou sequelas decorrentes da sua tentativa, caso ocorram nos dois primeiros anos de vigência da cobertura; c) epidemia ou pandemia declarada por órgão competente; d) furacões, ciclones, terremotos, maremotos, erupções vulcânicas e outras convulsões da natureza; e) danos e perdas causados por atos terroristas; f) atos ou operações de guerra, declarada ou não, de guerra química ou bacteriológica, guerra civil, guerrilha; revolução, motim, revolta, sedição, sublevação ou outras perturbações da ordem pública e delas decorrentes, exceto a prestação de serviço militar e atos de humanidade em auxílio de outrem.
                        </p>

                        <p>
                        9. "DOCUMENTAÇÃO PARA O RECEBIMENTO DE INDENIZAÇÃO – O prazo máximo para o pagamento da indenização é de 10 (dez) dias corridos contados a partir da data de protocolo de entrega da documentação comprobatória, requerida nos documentos contratuais, junto à Seguradora ou seu representante. Os documentos necessários à liquidação de sinistros são os abaixo listados e deverão ser encaminhados à Seguradora em vias originais ou cópias autenticadas:
                        </p>

                        <p>
                        Cobertura Prestamista - Morte: Contrato entre segurado e credor, contendo descrição das prestações periódicas decorrentes da dívida contraída ou do compromisso assumido pelo segurado junto ao credor;  Extrato ou resumo fornecido pelo credor contendo valor presente das parcelas vincendas que corresponderá ao saldo da dívida ou do compromisso na data do sinistro; Formulário de Aviso de Sinistro fornecido pela Seguradora, devidamente preenchido e assinado pelo representante legal do Segurado; Certidão de Óbito do Segurado; Boletim de Ocorrência Policial, se houver; Carteira Nacional de Habilitação (CNH), na hipótese do sinistro envolver veículo dirigido pelo Segurado; Documento de identificação do(s) beneficiário(s)."
                        </p>

                        <p>
                        10. A contratação do seguro é opcional, sendo facultado ao segurado o seu cancelamento a qualquer tempo, com devolução do prêmio pago referente ao período a decorrer, se houver.
                        </p>

                        <p>
                        11. Na ocorrência de evento coberto, caso o valor da obrigação financeira devida ao credor seja menor do que o valor a ser indenizado no seguro prestamista, a diferença apurada será paga ao segundo beneficiário indicado, conforme dispuserem as condições gerais. O segundo beneficiário poderá ser livremente indicado pelo segurado no Bilhete. Não havendo indicação, a indenização será paga conforme legislação em vigor.
                        </p>

                        <p>
                        12. Em caso de extinção antecipada da obrigação, o seguro estará automaticamente cancelado, devendo a seguradora ser formalmente comunicada, sem prejuízo, se for o caso, da devolução do prêmio pago referente ao período a decorrer.
                        </p>

                        <p>
                        13. SUSEP – Superintendência de Seguros Privados – Autarquia Federal responsável pela fiscalização, normatização e controle dos mercados de seguro, previdência complementar aberta, capitalização, resseguro e corretagem de seguros.
                        </p>

                        <p className="ml-5">
                        O registro do plano deste seguro na SUSEP – Superintendência de Seguros Privados não implica, por parte da referida autarquia, incentivo ou recomendação e sua comercialização.
                        </p>

                        <p className="ml-5">
                        No portal da SUSEP podem ser conferidas todas as informações sobre o(s) plano(s) de seguro do bilhete contratado através do link http://www.susep.gov.br/menu/servicos-ao-cidadao/sistema-de-consulta-publica-de-produtos.
                        </p>

                        <p>
                        Atendimento ao público da SUSEP 0800 021 84 84 (dias úteis, das 9:30 às 17:00).
                        </p>
                        <p>
                        SAC: 0800 942 04 62 ou 51 3191 7318 (segunda à sexta-feira das 10h às 16h), Ouvidoria: 0800 232 22 22 (segunda à sexta-feira das 10h às 16h) ou Acesse: <a href="https://www.factaseguradora.com.br" target="_blank" rel="noopener noreferrer">https://www.factaseguradora.com.br</a>
                        </p>

                      </ModalBody>
                      <ModalFooter>
                        <Button className="btn-block font-weight-bold mt-2" color="outline-secondary" onClick={this.toggleModalSeguro}>Fechar</Button>
                      </ModalFooter>
                    </Modal>

                    { this.state.obj_contratos !== undefined ? (
                          this.state.obj_contratos.map(item => (
                          <>
                          <Card>
                            <CardBody className="text-left">
                              <h5 className="text-center mt-5 pb-4 border-bottom">Dados do Contrato { item.PROPOSTA }</h5>
                              <Row>
                                <Col xs="6" sm="6" xm="12">
                                  <label>Valor Líquido do Crédito</label>
                                  <p className="font-weight-bold"> { parseFloat(item.VLRAF).toLocaleString('pt-BR', formatoValor) }</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                  <label>Quantidade de Parcelas</label>
                                  <p className="font-weight-bold"> { item.NUMEROPRESTACAO } </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs="6" sm="6" xm="12">
                                  <label>Tarifa de Cadastro</label>
                                  <p className="font-weight-bold"> R$ 0,00 </p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                  <label>Seguro</label>
                                  <p className="font-weight-bold"> R$ 0,00 </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs="6" sm="6" xm="12">
                                  <label>1ª Parcela</label>
                                  <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{item.DATAINICIO}</Moment></p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                  <label>IOF</label>
                                  <p className="font-weight-bold"> R$ 0,00 </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs="6" sm="6" xm="12">
                                  <label>Última Parcela</label>
                                  <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{item.DATAFIM}</Moment></p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                  <label>IOF</label>
                                  <p className="font-weight-bold"> R$ 0,00 </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs="6" sm="6" xm="12">
                                  <label>Valor Total de Crédito</label>
                                  <p className="font-weight-bold"> {
                                    item.Tipo_Operacao === 2 || item.Tipo_Operacao === 14
                                      ? parseFloat(item.saldoDevedor).toLocaleString('pt-BR', formatoValor)
                                      : parseFloat(item.VLRAF).toLocaleString('pt-BR', formatoValor)
                                    } </p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                  <label>Valor Total Devido</label>
                                  <p className="font-weight-bold"> { (item.VLRPRESTACAO * item.NUMEROPRESTACAO).toLocaleString('pt-BR', formatoValor) } </p>
                                </Col>
                              </Row>
                              </CardBody>
                            </Card>
                            </>
                          )
                      )) : ( null )
                    }

                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody className="text-left">
                        <h5 className="text-center border-bottom border-light pb-3">Autorização de Débito em Conta</h5>
                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <FormGroup check className="checkbox">
                              <Input className="form-check-input" type="checkbox" id="chkAutDebConta" name="autorizacao_debito_conta" value="1" defaultChecked onChange={this.handleChange} />
                              <Label check className="form-check-label text-justify" htmlFor="chkAutDebConta">
                                Eu, { this.state.obj_cliente.DESCRICAO }, <span className="font-weight-bold">AUTORIZO</span> em caráter irrevogável e irretratável a{" "}
                                <span className="font-weight-bold">FACTA FINANCEIRA S.A. CFI</span>, e/ou terceiro com a qual a mesma tenha firmado convenio e esteja
                                expressamente autorizado, a proceder e efetuar o debito automático na CONTA{" "}
                                <span className="font-weight-bold">BANCÁRIA</span> da minha titularidade acima mencionada.
                              </Label>

                              <Modal isOpen={this.state.mdlDebConta} toggle={this.toggleModalDebConta} className={'modal-lg ' + this.props.className}>
                                <ModalHeader toggle={this.toggleModalDebConta}>AUTORIZAÇÃO DE DÉBITO EM CONTA</ModalHeader>
                                <ModalBody style={{fontSize: '11px'}}>
                                  <Col>
                                    <p className="font-weight-bold" style={{padding: '5px', backgroundColor: '#0063B1', color: '#fff'}}>I - Cliente</p>
                                    <table style={{width: '100%'}}>
                                      <tbody>
                                        <tr>
                                          <td style={{width: '33%'}}>Nome: { CLIENTE.DESCRICAO.toUpperCase() }</td>
                                          <td style={{width: '33%'}}>CPF nº: { CLIENTE.CPF }</td>
                                          <td style={{width: '33%'}}>Data Nasc.: <Moment format="DD/MM/YYYY">{ CLIENTE.DATANASCIMENTO }</Moment></td>
                                        </tr>
                                        <tr>
                                          <td>Estado Civil: { CLIENTE.ESTADO_CIVIL.toUpperCase() }</td>
                                          <td>Nacionalidade: { CLIENTE.NACIONALIDADE === "1" ? "Brasileira" : "Estrangeira" }</td>
                                          <td>Sexo: { CLIENTE.SEXO === "M" ? "Masculino" : "Feminino" }</td>
                                        </tr>
                                        <tr>
                                          <td>Doc. nº: { CLIENTE.RG }</td>
                                          <td>Doc. Emissor: { CLIENTE.ORGAOEMISSOR.toUpperCase() }</td>
                                          <td>Doc. Emissão: <Moment format="DD/MM/YYYY">{CLIENTE.EMISSAORG}</Moment></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Col>
                                  <Col>
                                    <p className="font-weight-bold" style={{padding: '5px', backgroundColor: '#0063B1', color: '#fff'}}>II - Financeira</p>
                                    <p>Facta Financeira S.A Crédito, Financiamento e Investimento</p>
                                    <p>Rua dos Andradas, 1409 - 7º andar - Centro - Porto Alegre - RS - CNPJ: 15.581.638/0001-30</p>
                                  </Col>
                                  <Col>
                                		<p className="font-weight-bold" style={{padding: '5px', backgroundColor: '#0063B1', color: '#fff'}}>III - Proposta de Adesão</p>
                                		<table style={{width: '100%'}}>
                                      <tbody>
                                  			<tr>
                                  				<td style={{width: '50%'}}>Proposta nº.: { CODIGO }</td>
                                  				<td style={{width: '50%'}}></td>
                                  			</tr>
                                      </tbody>
                                		</table>
                                	</Col>
                                  <Col>
                                    <p className="font-weight-bold" style={{padding: '5px', backgroundColor: '#0063B1', color: '#fff'}}>IV - Conta Bancária para Débito</p>
                                    <table style={{width: '100%'}}>
                                      <tbody>
                                        <tr>
                                          <td>Banco: { this.state.obj_banco.CODIGO.padStart(3, '0') + ' - ' + this.state.obj_banco.DESCRICAO }</td>
                                          <td>Agência: { AF.AGENCIA }</td>
                                          <td>Conta: { AF.CONTA }</td>
                                          <td>CPF: { CLIENTE.CPF }</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </Col>
                                  <Col>
                                    <p className="font-weight-bold" style={{padding: '5px', backgroundColor: '#0063B1', color: '#fff'}}>V - Conta Bancária para Débito</p>
                                    <table style={{width: '100%'}}>
                                      <tbody>
                                        <tr>
                                          <td>Banco: { this.state.obj_banco.CODIGO.padStart(3, '0') + ' - ' + this.state.obj_banco.DESCRICAO }</td>
                                          <td>Agência: { AF.AGENCIA }</td>
                                          <td>Conta: { AF.CONTA }</td>
                                          <td>CPF: { CLIENTE.CPF }</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <p>Por este instrumento e na melhor forma de direito, eu, CLIENTE, acima qualificado, AUTORIZO em caráter irrevogável e irretratável a FINANCEIRA, e/ou terceiro com a qual a mesma tenha firmado convenio e esteja expressamente autorizado, a proceder e efetuar o debito automático na CONTA BANCÁRIA da minha titularidade acima mencionada, referente ao (s) valor (es) de toda e qualquer parcela decorrente da proposta de Adesão acima identificada, emitida em favor da FINANCEIRA. Esta autorização é válida até a liquidação integral total das obrigações mencionadas na Proposta de Adesão, inclusive na principal e acessória, decorrentes da referida proposta de adesão. </p>
                                		<p>Comprometo-me, ainda, a manter saldo suficiente em minha CONTA BANCÁRIA para o acolhimento de qualquer débito decorrente dessa autorização, sendo que, tal CONTA BANCÁRIA somente poderá ser cancelada ou alterada com a prévia e expressa concordância da Facta Financeira S.A.</p>
                                		<p>Caso não haja saldo suficiente, o débito poderá ser feito fracionado em minha CONTA BANCÁRIA, a qualquer tempo e em quantas parcelas forem necessárias, até que seja atingido o valor da parcela vencida ou do saldo devedor, somados os encargos e multas previstas na Proposta de Adesão para as hipóteses na inadimplemento, e/ou poderá, ainda, ser excluído do Sistema de Débito Automático após o prazo de (   ) dias da parcela vencida, sendo que tal fato será prontamente informado na Facta Financeira S.A.</p>
                                		<p>Havendo limite de crédito na CONTA BANCÁRIA, AUTORIZO que seja realizado o débito decorrentes das parcelas vencidas, utilizando o referido limite de crédito. </p>
                                		<p>Havendo alteração ou transferência da minha movimentação bancária e/ou CONTA BANCÁRIA para outra agencia ou outro banco, a Facta Financeira fica expressamente autorizada a obter os dados da minha nova CONTA BANCÁRIA, pelo que, neste ato OUTORGO ao mesmo, poderes especiais, em caráter irrevogável e irreparável, nos termos do artigo 684 do Código Civil Brasileiro, para praticar todos os atos necessários a tal fim, inclusive, encaminhar oficio ao meu órgão empregador, para receber os dados da minha nova CONTA BANCÁRIA, de modo que a Facta Financeira S/A e ou terceiro autorizado pela mesma, possa nela promover quaisquer débitos vencidos e vencendo decorrente da Proposta de Adesão, sendo que RECONHEÇO que tais procedimentos não configuram nem configurarão infração ás regras que disciplinam o Sigilo Bancário, previstas na Lei Complementar nº 105 de 10 de janeiro de 2001.</p>
                                  </Col>
                                </ModalBody>
                                <ModalFooter>
                                  <Button color="secondary" onClick={this.toggleModalDebConta}>Fechar</Button>
                                </ModalFooter>
                              </Modal>

                            </FormGroup>

                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" sm="12" xm="12" className="text-center">
                            <Button onClick={this.toggleModalDebConta} className="btn-block font-weight-bold mt-2" color="outline-primary">Clique aqui para visualizar os Termos do Débito em Conta</Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody className="text-left">

                        <h5 className="text-center pb-4 border-bottom">Condições Gerais</h5>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>O <span className="font-weight-bold">CREDOR</span> compromete-se a conceder ao <span className="font-weight-bold">EMITENTE</span> o crédito discriminado no quadro IV, da presente Cédula de Crédito Bancário (CCB). O EMITENTE obriga-se pelo pagamento total desta CCB, em parcelas mensais e consecutivas, conforme quadro IV, <span className="font-weight-bold">autorizando</span> desde já o <span className="font-weight-bold">débito em sua conta bancária, desconto em folha de pagamento ou desconto em benefícios previdenciários</span> das referidas parcelas se for essa a forma de pagamento escolhida e conforme as cláusulas e condições enunciadas a seguir:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p className="font-weight-bold">DA AUTORIZAÇÃO:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                    		    <p>1.1 O EMITENTE autoriza, em caráter, irrevogável e irretratável o CREDOR, e/ou, terceiro com o qual a mesma tenha firmado convênio e esteja expressamente autorizado, a proceder e efetuar o débito automático na CONTA BANCÁRIA de sua TITULARIDADE. 1.2. O EMITENTE autoriza, desde já, em caso de atraso no pagamento, a realização de desconto dos valores em atraso até o limite do saldo disponível em conta corrente ou forma escolhida. Caso o saldo disponível não seja suficiente para saldar o inadimplemento, o EMITENTE autoriza, desde já, a alteração da forma de pagamento escolhida para outra até o limite disponível e em quantas parcelas forem necessárias para quitar os valores em atraso. 1.3. Havendo alteração ou transferência da movimentação bancária e/ou CONTA BANCÁRIA DO EMITENTE para outra agencia ou outro banco, o CREDOR, fica expressamente autorizado a obter os dados da nova conta do EMITENTE, pelo que, neste ato, OUTORGA ao mesmo, poderes especiais, em caráter irrevogável e irreparável, nos termos do artigo 684 do Código Civil Brasileiro, para praticar todos os atos necessários a tal fim, inclusive, encaminhar oficio ao órgão empregador do EMITENTE, para receber os dados da nova CONTA, de modo que o CREDOR ou terceiro autorizado pela mesma, possa nela promover quaisquer débitos vencidos e vencendo decorrente da CCB.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p className="font-weight-bold">DO PAGAMENTO:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p>2.1. O EMITENTE compromete-se, a manter saldo suficiente em sua CONTA BANCÁRIA para o acolhimento de qualquer débito decorrente dessa autorização, sendo que, tal CONTA somente poderá ser cancelada ou alterada com a prévia e expressa concordância do CREDOR. Caso não haja saldo suficiente, o débito poderá ser feito fracionado na CONTA BANCÁRIA do EMITENTE, a qualquer tempo e em quantas parcelas forem necessárias, até que seja atingido o valor da parcela vencida ou do saldo devedor, somados os encargos e multas previstas na CCB para as hipóteses de inadimplemento. Havendo limite de crédito na CONTA BANCÁRIA, AUTORIZO que seja realizado o débito decorrentes das parcelas vencidas, utilizando o referido limite de crédito, quando necessário. 2.2. Na modalidade de pagamento débito em conta bancária, caso haja alteração do Banco no qual recebe seus salários/benefícios, o EMITENTE compromete-se a informar imediatamente ao CREDOR as informações da nova instituição (banco, agência e conta bancária) e, desde já, autoriza o CREDOR a efetuar os débitos na nova conta informada. Caso seja alterado o banco e o EMITENTE não informe a alteração, fica, desde já, a FACTA autorizada a buscar junto aos bancos e órgãos os dados da nova conta bancária e, sucessivamente, a proceder aos débitos na nova conta bancária. Sobre o valor principal financiado, que corresponde ao valor do crédito acrescido dos demais valores financiados, incidirão os juros indicados no preâmbulo (quadro IV). O valor contratado será acrescido de juros remuneratórios capitalizados mensalmente à taxa de juros estabelecida na proposta, na quantidade de parcelas, valores, data de vencimento, bem como tributos e encargos especificados na Proposta.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p className="font-weight-bold">DA CONSULTA DE DADOS:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p>3.1. O EMITENTE autoriza o CREDOR a consultar o SCR do Bacen e as organizações de cadastros sobre seus débitos, bem como a divulgação dos seus dados e obrigações, inclusive cadastrais, para constarem dos bancos de dados da Serasa/SPC e outros, cuja finalidade será o compartilhamento com outras empresas, os quais serão utilizados para subsidiar decisões de crédito e negócios.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p className="font-weight-bold">SEGURO PRESTAMISTA:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p>4.1. O CREDOR disponibiliza ao EMITENTE, integrante do Grupo Segurável, a oferta do Microsseguro Prestamista. Para aceitá-la o EMITENTE deve manifestar a opção “sim” no campo próprio ou “não” caso não deseje contratar. Na hipótese de contratação do Microsseguro Prestamista pelo EMITENTE, integrante do Grupo Segurável, ao assinar a ADESÃO, declara para todos os fins de direito que, teve o acesso prévio, ciência e concorda integralmente com os termos das Condições Gerais e Especiais do Microsseguro contratado, e autoriza, o CREDOR a divulgar as informações constantes desta CCB, bem como cópia da mesma à Seguradora.</p>
                          </Col>
                        </Row>


                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>({ this.state.labelSeguroSim }) - SIM</p>
                            <p>({ this.state.labelSeguroNao }) - NÃO</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p className="font-weight-bold">CLÁUSULA DO SEGURO PRESTAMISTA:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p>Caso o EMITENTE opte pela contratação do Microsseguro CLÁUSULA DO SEGURO PRESTAMISTA:  Caso o EMITENTE opte pela contratação do Microsseguro prestamista, conforme opção assinalada no item “SEGURO PRESTAMISTA” do preâmbulo, fica desde já consignado que o segurado (EMITENTE (s) terá (ão) direito à quitação do saldo devedor oriundo da presente Cédula, nos casos de morte natural ou acidental e de invalidez permanente total por acidente.  1º -  O saldo devedor do empréstimo será apurado na data do sinistro, respeitadas as condições contratuais do Microsseguro; 2º- O prêmio e quaisquer outras despesas correrão por conta do(s) EMITENTE(S), ficando a CREDORA desde logo autorizada a debitar o valor correspondente ao prêmio  do  Microsseguro  do  valor  financiado  na  presente  Cédula; O(s) EMITENTE(S) declara(m) ter ciência e concorda(m)  com  todos  os  termos,  regras  e  condições  do  seguro acima mencionado, inteiramente disciplinadas no Bilhete de Microsseguro, anexo 1, que torna-se parte integrante deste documento.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p className="font-weight-bold">DA TRANSFERÊNCIA:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p>5.1. O EMITENTE declara que reconhece seu direito à portabilidade, podendo solicitar a transferência de seu empréstimo para outra instituição de sua preferência. Declara, ainda, que, em se tratando de empréstimo contratado mediante telefone, dispositivos móveis de comunicação (mobile), caixas eletrônicos, internet ou por correspondentes, poderá o cliente solicitar a desistência do empréstimo ora contratado no prazo de  até   7   (sete)   dias   úteis   a   contar   do   recebimento   da   quantia emprestada, mediante  restituição, à Financeira ou a qualquer instituição financeira adquirente  desta operação, do valor total concedido acrescido de eventuais tributos e juros até a data de efetivação da devolução. Firmam as partes o presente em 2 vias, sendo a 1ª via do CREDOR e a 2ª via do EMITENTE.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p className="font-weight-bold">DECLARAÇÃO:</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                      		  <p>6.1. O EMITENTE declara ter recebido a 2ª via desta CCB, e ter tomado ciência, previamente à contratação da presente operação, dos fluxos considerados no cálculo do CET, assim como solicitar a qualquer momento, segunda via deste documento, ciente de que a disponibilização da segunda via ensejará em cobrança conforme Tabela de tarifas e serviços, disponibilizada no site da instituição financeira. 6.2. O EMITENTE declara, sob as penas da lei, que todas as informações prestadas na presente CCB, bem como todos os documentos apresentados são verdadeiros e, do mesmo modo, RECONHECE que tais procedimentos não configuram e nem configurarão infração às regras que disciplinam o Sigilo Bancário, previstas na Lei Complementar nº 105 de 10 de janeiro de 2001. 6.3. O EMITENTE declara: a) conhecer as normas do Banco Central do Brasil, que dispõem sobre os crimes de lavagem de dinheiro e as suas obrigações; b) comunicar formalmente qualquer mudança de propósito e natureza da relação de negócios com o CREDOR; c) não participar direta ou indiretamente, com quaisquer formas de trabalho escravo e infantil, ou práticas danosas ao meio ambiente; d) responsabilizar-se pela exatidão e veracidade das informações e documentos apresentados, bem como declarar (i) conhecer e respeitar as disposições da Lei 9.613/98, e suas alterações, do Código Penal que versam sobre os crimes de “Lavagem de Dinheiro” e demais normas e regulamentações aplicáveis, sob pena de aplicação das sanções nelas previstas. De forma que são lícitas as origens de seu patrimônio, renda e/ou faturamento, bem como não oculta ou dissimula a natureza, a localização, a disposição ou a movimentação ou propriedade de bens, direitos e/ou valores, ou desvio, envio, patrocínio, apoio ou subvenciono, de qualquer forma, o terrorismo, nos termos da Lei nº 13.260/16 (Lei Antiterrorismo). Os valores tratados à título de empréstimo são compatíveis com seus rendimentos e situação patrimonial, sendo, o EMITENTE, o beneficiário final desta operação; (ii) que não possui recursos originados de atividades ilícitas por atos de corrupção pública ou privada, ora entendidos como aqueles que possam, de qualquer forma, prejudicar a Administração Pública, direta ou indireta, autárquica ou funcional, seja nacional ou estrangeira, a livre concorrência, a livre iniciativa ou os consumidores, nacionais e estrangeiros, nos termos da Lei nº 12.846/13 (Lei Anticorrupção); (iii) conhecer e respeitar as disposições da Lei nº 6.938/81, e suas alterações, da Lei nº 9.605/98, e demais normas e regulamentações aplicáveis, sob pena das sanções nelas previstas. De modo que não possui recursos originados de atividades ilícitas e nocivas ao meio ambiente, de exploração de trabalho forçado ou análogo ao trabalho escravo, ou de exploração irregular de mão-de-obra infantil. Neste sentido, compreende-se como trabalho forçado ou análogo à escravidão aquele que for executado involuntariamente, sob ameaça de força ou punição, e/ou em condições precárias de higiene, liberdade e outros aspectos que violem a dignidade humana. No que tange à exploração irregular de mão-de- obra infantil, entende-se como a contratação de crianças para utilização de sua força de trabalho e/ou para exercer função que interfira na sua educação ou seja prejudicial à sua saúde e desenvolvimento físico, mental, espiritual, moral e/ou social; (iv) conhecer a Lei nº 13.709/18 (Lei Geral de Proteção de Dados) e reconhecer a condição de TITULAR de dados pessoais e as responsabilidades e sanções decorrentes desta função, de modo que o consentimento das disposições previstas nesta Cédula podem, a qualquer tempo, ser revisto e revogado mediante manifestação expressa; (v) compreender o caráter confidencial que será dado aos seus dados pessoais dispostos na presente Cédula, à exceção das ocasiões em que, por atuar em conformidade com a legislação e das normas regulatórias de autoridades competentes, inclusive internacionais, o CREDOR ou qualquer outra instituição financeira adquirente desta operação poderá consultar informações consolidadas em órgãos públicos e de informações cadastrais e de crédito, bem como enviar informações de possíveis irregularidades de operações ocorridas em desacordo com o padrão de conduta ética e de transparência e integridade defendidos e esperados, nada tendo a opor e desde já consentindo quanto a realização deste procedimento, ainda que não haja comunicação prévia sobre este envio; (vi) consentir e autorizar o tratamento e operação dos dados pessoais de sua titularidade pela Financeira ou qualquer outra instituição adquirente desta operação para realização da operação de crédito contratada – envolvendo a coleta das informações ora registradas e outras constantes de demais documentos preenchidos, se for o caso; (vii) consentir e autorizar o CREDOR a negociar esta operação livremente no mercado, transferindo esta Cédula por endosso ou cessão a terceiros, no todo ou em parte, de modo que serão transmitidos juntamente os dados aqui obtidos, nada tendo a opor quanto a este procedimento, independente de comunicação prévia; (viii) concordar que o CREDOR ou qualquer instituição financeira adquirente desta operação poderá solicitar informações sobre a minha capacidade financeira, fato relacionado às cessões realizadas nos termos deste Contrato ou aos CRÉDITOS que viole referidas normas, atividade econômica, operações realizadas e serviços contratados, com o objetivo de atender à legislação relativa às práticas de combate aos crimes de lavagem de dinheiro e à Lei nº 12.846/13, que dispõe sobre atos de corrupção e lesivos contra a administração pública nacional e estrangeira e outras normas correlatas.</p>
                          </Col>
                        </Row>
                        {/*
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>1. A FACTA compromete-se a conceder ao CREDITADO/FINANCIADO o crédito discriminado no quadro IV, da presente proposta.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>2. O CREDITADO/FINANCIADO obriga-se pelo pagamento total da dívida à FACTA, em parcelas mensais e consecutivas, conforme quadro IV, autorizando desde já o débito em sua conta bancária, desconto em folha de pagamento ou desconto em benefícios previdenciários das referidas parcelas se for essa a forma de pagamento escolhida.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>3. O CREDITADO/FINANCIADO autoriza, em caráter, irrevogável e irretratável a FACTA, e/ou, terceiro com o qual a mesma tenha firmado convênio e esteja expressamente autorizado, a proceder e efetuar o débito automático na CONTA BANCÁRIA de sua TITULARIDADE.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>4. O CREDITADO/FINANCIADO autoriza, desde já, em caso de atraso no pagamento, a realização de desconto dos valores em atraso até o limite do saldo disponível em conta corrente ou forma escolhida. Caso o saldo disponível não seja suficiente para saldar o inadimplemento, o CREDITADO/FINANCIADO AUTORIZA, a alteração da forma de pagamento escolhida para outra até o limite disponível e em quantas parcelas forem necessárias para quitar os valores em atraso.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>5. O CREDITADO/FINANCIADO compromete-se, a manter saldo suficiente em sua CONTA BANCÁRIA para o acolhimento de qualquer débito decorrente dessa autorização, sendo que, tal CONTA somente poderá ser cancelada ou alterada com a prévia e expressa concordância da FACTA. Caso não haja saldo suficiente, o débito poderá ser feito fracionado em minha CONTA BANCÁRIA, a qualquer tempo e em quantas parcelas forem necessárias, até que seja atingido o valor da parcela vencida ou do saldo devedor, somados os encargos e multas previstas na Proposta de Adesão para as hipóteses de inadimplemento. Havendo limite de crédito na CONTA BANCÁRIA, AUTORIZO que seja realizado o débito decorrentes das parcelas vencidas, utilizando o referido limite de crédito, quando necessário.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>6. Na modalidade de pagamento débito em conta bancária, caso haja alteração do Banco no qual recebe seus salários/benefícios, o CREDITADO/FINANCIADO compromete-se a informar imediatamente à FACTA as informações da nova instituição (banco, agência e conta bancária) e, desde já, autoriza a FACTA e/ou terceiro a efetuar os débitos na nova conta informada. Caso seja alterado o banco e o CREDITADO/FINANCIADO não informe a alteração, fica, desde já, a FACTA autorizada a buscar junto aos bancos e órgãos os dados da nova conta bancária e, sucessivamente, a proceder aos débitos na nova conta bancária.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>7. Sobre o valor principal financiado, que corresponde ao valor do crédito acrescido dos demais valores financiados, incidirão os juros indicados no preâmbulo (quadro IV).</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>8. O valor contratado será acrescido de juros remuneratórios capitalizados mensalmente à taxa de juros estabelecida na proposta, na quantidade de parcelas, valores, data de vencimento, bem como tributos e encargos especificados na Proposta.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>9. Havendo alteração ou transferência da movimentação bancária e/ou CONTA BANCÁRIA DO CREDITADO/FINANCIADO para outra agencia ou outro banco, a FACTA, fica expressamente autorizada a obter os dados da nova CONTA DO CRÉDITADO/FINANCIADO, pelo que, neste ato, OUTORGA ao mesmo, poderes especiais, em caráter irrevogável e irreparável, nos termos do artigo 684 do Código Civil Brasileiro, para praticar todos os atos necessários a tal fim, inclusive, encaminhar oficio ao órgão empregador do CREDITADO, para receber os dados da nova CONTA, de modo que a FACTA ou terceiro autorizado pela mesma, possa nela promover quaisquer débitos vencidos e vencendo decorrente da Proposta de Adesão.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>10. O CREDITADO/FINANCIADO autoriza a FACTA a consultar o SCR do BACEN e as organizações de cadastros sobre seus débitos, bem como a divulgação dos seus dados e obrigações, inclusive cadastrais, para constarem dos bancos de dados da SERASA/SPC e outros, cuja finalidade será o compartilhamento com outras empresas, os quais serão utilizados para subsidiar decisões de crédito e negócios.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>11. SEGURO PRESTAMISTA: A FACTA disponibiliza ao CREDITADO/FINANCIADO, integrante do Grupo Segurável, a oferta do Microsseguro Prestamista. Para aceitá-la o CREDITADO/FINANCIADO deve manifestar a opção “sim” no campo próprio ou “não” caso não deseje contratar. Na hipótese de contratação do Microsseguro Prestamista pelo CREDITADO/FINANCIADO, integrante do Grupo Segurável, ao assinar a ADESÃO, declara para todos os fins de direito que, teve o acesso prévio, ciência e concorda integralmente com os termos das Condições Gerais e Especiais do Microsseguro contratado, e autoriza, a FACTA a divulgar as informações constantes desta Proposta de Adesão, bem como cópia da mesma à Seguradora.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>(X) - SIM (assinale aqui para confirmar sua opção contratação do Microsseguro Prestamista)</p>
                            <p>( ) - NÃO</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>12. O CREDITADO/FINANCIADO declara ter recebido a 2ª via desta Proposta e das Cláusulas Gerais do Contrato aderidas, e ter tomado ciência, previamente à contratação da presente operação, dos fluxos considerados no cálculo do CET.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>13. O CREDITADO/FINANCIADO, por meio desta proposta, adere integralmente às cláusulas constantes do Contrato de Financiamento registrado no Cartório de Registro de Títulos e Documentos de Porto Alegre, sob n° 1676142, no Livro B-176, às Fls. 56 em 13/10/2014.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>14. O CREDITADO/FINANCIADO declara, sob as penas da lei, que todas as informações prestadas na presente proposta, bem como todos os documentos apresentados são verdadeiros e, do mesmo modo, RECONHECE que tais procedimentos não configuram e nem configurarão infração às regras que disciplinam o Sigilo Bancário, previstas na Lei Complementar nº 105 de 10 de janeiro de 2001.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>15. Firmam as partes o presente em 2 vias, sendo a 1ª via da Financeira e a 2ª via do Creditado/Financiado.</p>
                          </Col>
                        </Row>

                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>16. O CREDITADO/FINANCIADO declara:</p>
                            <p>a) conhecer as normas do Banco Central do Brasil, que dispõem sobre os crimes de lavagem de dinheiro e as suas obrigações; </p>
                            <p>b) comunicar formalmente qualquer mudança de propósito e natureza da relação de negócios com a FACTA; e </p>
                            <p>c) não participar direta ou indiretamente, com quaisquer formas de trabalho escravo e infantil, ou práticas danosas ao meio ambiente.</p>
                          </Col>
                        </Row>
                        */}

                        <Row className="mb-3 mt-3">
                          <Col xs="12" sm="12">
                          { this.state.clicou
                            ? <LayoutFactaCarregando />
                            :
                              <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={this.salvaImgCcb} disabled={this.state.clicou}>
                                Eu <strong>li</strong> e <strong>aceito</strong> os termos
                              </Button>
                          }
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </>
          : <PaginaMensagemLocalizacao nome={AF.CLIENTE.DESCRICAO}/>
        )
      }
      </div>
    );
  }
}

export default CedulaFactaFacil;
