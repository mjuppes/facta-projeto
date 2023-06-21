import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import Moment from "react-moment";
import domtoimage from 'dom-to-image';
import {isMobile} from 'react-device-detect';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';

import DadosDaPropostaTemplate from '../../../DadosDaPropostaTemplate';
import DadosDaPropostaBlocoTemplate from '../../../DadosDaPropostaBlocoTemplate';
import DadosDaPropostaVinculadaTemplate from '../../../DadosDaPropostaVinculadaTemplate';
import DadosDoClienteTemplate from '../../../DadosDoClienteTemplate';
import DadosDoCorretorTemplate from '../../../DadosDoCorretorTemplate';

import TimelineProgresso from '../../TimelineProgresso';

class CedulaFactaMex extends Component {

  constructor(props) {
    super(props);
    //
    this.state = {
      fadeIn: true,
      timeout: 300,
      tipoPendencia: props.tipo,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      propostaINSS: false,
      base64Ccb: '',
      clicou: false,
      fontSizeControle: '0.875rem',

      aceitouSeguro: true,
      dataHoraAceitouSeguro: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      aceitouConta: true,
      dataHoraAceitouConta: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      aceitouConsultaDataprev: true,
      dataHoraAceitouDataprev: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      aceitouAutTransferencia: true,
      dataHoraAceitouAutTransferencia: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      aceitouAutBoletos: true,
      dataHoraAceitouAutBoletos: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),

      carregando: true,
      proximoLink: '',
      linkPropostaPendente: '/proposta-pendente/'+this.props.match.params.propostaId,
      permissaoLocalizacao: true,
      localizacaoCcb: '',
      diaAtual: new Date().getDate(),
      anoAtual: new Date().getFullYear(),
      mesAtual: new Date().toLocaleString('default', { month: 'long' }),
      labelSeguroSim: 'X',
      labelSeguroNao: '',
      mdlLgConta: false,
      mdlLgSeguro: false,
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      vlrSeguro : 0
    };

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

    this.toggleModalAbertura = this.toggleModalAbertura.bind(this);
    this.toggleModalSeguro = this.toggleModalSeguro.bind(this);

      var _state = this.props.location.state;
      var PRINCIPAL;
      var DADOS_STATE_TERMO;
      if (this.state.tipoPendencia == "normal") {
        PRINCIPAL = _state.DADOS_STATE_TERMO.DADOS_PROPOSTA_DIGITAL;
        DADOS_STATE_TERMO = _state.DADOS_STATE_TERMO;
      }
      else {
        PRINCIPAL = _state.obj_pendencias;
      }

      this.state.obj_proposta   = PRINCIPAL;
      this.state.obj_vinculadas = PRINCIPAL.PROPOSTA_VINCULADA;
      this.state.obj_corretor   = PRINCIPAL.CORRETOR;
      this.state.obj_cliente    = PRINCIPAL.CLIENTE;
      this.state.obj_banco      = PRINCIPAL.BANCO;
      this.state.obj_contratos  = PRINCIPAL.CONTRATOSREFIN;
      this.state.espBeneficio   = PRINCIPAL.ESPECIEBENEFICIO;
      this.state.tipoOperacao   = PRINCIPAL.TIPOOPERACAO;

      this.state.aceitouSeguro = PRINCIPAL.VLRSEGURO !== undefined && parseFloat(PRINCIPAL.VLRSEGURO !== '' && PRINCIPAL.VLRSEGURO !== null ? PRINCIPAL.VLRSEGURO : 0) > 0 ? true : false;
      this.state.vlrSeguro = PRINCIPAL.VLRSEGURO !== undefined && parseFloat(PRINCIPAL.VLRSEGURO !== '' && PRINCIPAL.VLRSEGURO !== null ? PRINCIPAL.VLRSEGURO : 0) > 0 ? PRINCIPAL.VLRSEGURO : 0;

      if (this.state.aceitouSeguro === false) {
        this.state.labelSeguroSim = '';
        this.state.labelSeguroNao = 'X';
      }

      //### DADOS DA PRIMEIRA TELA (Digital.js)
      this.state.dataHoraPrimeiraTela     = _state.dataHoraPrimeiraTela !== undefined     ? _state.dataHoraPrimeiraTela : '';
      this.state.geoInicial               = _state.geoInicial !== undefined               ? _state.geoInicial : '';

      //### DADOS DO TERMO (Termo.js)
      this.state.dataHoraTermo            = _state.dataHoraTermo !== undefined            ? _state.dataHoraTermo : '';
      this.state.geoTermo                 = _state.geoTermo !== undefined                 ? _state.geoTermo : '';

      if (this.state.tipoPendencia !== "normal") {
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

  toggleModalAbertura() {
    this.setState({
      mdlLgConta: !this.state.mdlLgConta,
    });
  }

  toggleModalSeguro() {
    this.setState({
      mdlLgSeguro: !this.state.mdlLgSeguro,
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
    else if (name === 'autorizacao_transferencias') {
      this.setState({
        aceitouAutTransferencia: this.state.aceitouAutTransferencia === true ? false : true,
        dataHoraAceitouAutTransferencia: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':')
      });
    }
    else if (name === 'autorizacao_boletos') {
      this.setState({
        aceitouAutBoletos: this.state.aceitouAutBoletos === true ? false : true,
        dataHoraAceitouAutBoletos: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':')
      });
    }
    else if (name === 'autorizacao_abertura') {
      this.setState({
        aceitouConta: this.state.aceitouConta === true ? false : true,
        dataHoraAceitouConta: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':')
      });
    }

  };

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

  validaPropostaINSS(vinculada) {
    if (vinculada.Averbador === 3) {
      this.state.propostaINSS = true;
    }
  }

  salvaImgCcb = async () => {
    this.setState({clicou: true});

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

      this.setState({ fontSizeControle : '0.650rem' });
      var node = document.getElementById('ccbCliente');
      var timelineRemover = node.querySelector('#divTimeline');
      if (timelineRemover !== undefined && timelineRemover !== null) {
        timelineRemover.remove();
      }
      localStorage.setItem('@app-factafinanceira-formalizacao/dados_html_ccb', node.innerHTML);
      // node.style = null;
      await domtoimage.toPng(node)
      .then(function (dataUrl) {
        this.setState({base64Ccb : dataUrl})
        localStorage.setItem('@app-factafinanceira-formalizacao/print_ccb_2', dataUrl);
      }.bind(this))
      .catch(function (error) {
        console.error('oops, something went wrong!', JSON.stringify(error));
      }).finally(function (){
        this.props.history.push({
          pathname: this.state.proximoLink,
          search: '',
          state: {
            navegacao: true,
            obj_proposta: this.state.obj_proposta,
            base64Ccb: this.state.base64Ccb,
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

            aceitouConta: this.state.aceitouConta,
            dataHoraAceitouConta: this.state.dataHoraAceitouConta,

            aceitouAutTransferencia: this.state.aceitouAutTransferencia,
            dataHoraAceitouAutTransferencia: this.state.dataHoraAceitouAutTransferencia,

            aceitouAutBoletos: this.state.aceitouAutBoletos,
            dataHoraAceitouAutBoletos: this.state.dataHoraAceitouAutBoletos,
            base64Ccb: this.state.base64Ccb,
            obj_pendencias: this.state.obj_pendencias,
            tipoFormalizacao: this.state.tipoFormalizacao
          }
        });
      }.bind(this));
    }

  }

  render() {
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
      "fontSize" : this.state.fontSizeControle
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
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} id="ccbCliente">

      { this.state.carregando
        ? <LayoutFactaCarregando />
        : ( this.state.permissaoLocalizacao === true
          ?
            <>
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

                  {/* COMPONENTE PARA ABSTRAIR OS DADOS DA PROPOSTA */}
                  <DadosDaPropostaTemplate proposta={AF} tipo_operacao={TIPO_OPERACAO} />

                  {/* COMPONENTE PARA ABSTRAIR OS DADOS DO CLIENTE */}
                  <DadosDoClienteTemplate cliente={this.state.obj_cliente} />

                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody className="text-left">
                      <h5 className="text-center pb-4 border-bottom border-light">Dados Funcionais</h5>
                      <Row>
                        <Col xs="12" sm="12" xm="12">
                          <label>Órgão</label>
                          <p className="font-weight-bold">EXÉRCITO</p>
                        </Col>
                        <Col xs="12" sm="12" xm="12">
                          <label>Situação</label>
                          <p className="font-weight-bold">
                          {
                            AF.TIPOBENEFICIO !== null
                            ? AF.TIPOBENEFICIO === 1501
                              ? 'Ativa'
                              : AF.TIPOBENEFICIO === 1502
                                ? 'Pensionista'
                                : 'Inativa'
                            : ' - '
                          }
                          </p>
                        </Col>
                        <Col xs="12" sm="12" xm="12">
                          <label>Nº do Benefício</label>
                          <p className="font-weight-bold">{ AF.MATRICULA }</p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody className="text-left">
                      <h5 className="text-center border-bottom border-light pb-3">Dados Bancários</h5>
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

                  {/* COMPONENTE PARA ABSTRAIR OS DADOS DO CORRETOR */}
                  <DadosDoCorretorTemplate corretor={this.state.obj_corretor} />

                  <DadosDaPropostaBlocoTemplate proposta={AF} tipo_operacao={TIPO_OPERACAO} cod_tipo_operacao={COD_TP_OPERACAO}/>

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

                  { this.state.propostaINSS === true
                    ?
                      <>
        								{ AF.Tipo_Operacao === 28
                          ? (
                            <>
                              <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                <CardBody className="text-left">
                                  <h5 className="text-center border-bottom border-light pb-3">Autorização de Débito</h5>
                                  <Row>
                                    <Col xs="12" sm="12" xm="12">
                                      <FormGroup check className="checkbox">
                                        <Input className="form-check-input" type="checkbox" id="chkBoletos" name="autorizacao_boletos" value="1" defaultChecked onChange={this.handleChange} />
                                        <Label check className="form-check-label text-justify" htmlFor="chkBoletos">
                                          Eu, { this.state.obj_cliente.DESCRICAO }, <span className="font-weight-bold">AUTORIZO</span> a <span className="font-weight-bold">FACTA FINANCEIRA S.A. CFI</span>, inscrita no CNPJ sob o n. 15.581.638/0001-30, sediada na Rua dos Andradas, n. 1409, 7º
                                          andar, em Porto Alegre/RS, CEP: 90020-022, a <span className="font-weight-bold">PAGAR BOLETOS DE COBRANÇA</span> E <span className="font-weight-bold">DEBITAR SEUS RESPECTIVOS VALORES</span> na Conta de Pagamento Facta, de <span className="font-weight-bold">minha titularidade</span>.
                                        </Label>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>

                              <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                <CardBody className="text-left">
                                  <h5 className="text-center border-bottom border-light pb-3">Autorização de Transferência</h5>
                                  <Row>
                                    <Col xs="12" sm="12" xm="12">
                                      <FormGroup check className="checkbox">
                                        <Input className="form-check-input" type="checkbox" id="chkTransferencias" name="autorizacao_transferencias" value="1" defaultChecked onChange={this.handleChange} />
                                        <Label check className="form-check-label text-justify" htmlFor="chkTransferencias">
                                          Eu, { this.state.obj_cliente.DESCRICAO }, <span className="font-weight-bold">AUTORIZO</span> a <span className="font-weight-bold">FACTA FINANCEIRA S.A. CFI</span>, inscrita no CNPJ sob o n. 15.581.638/0001-30, sediada na Rua dos Andradas, n. 1409, 7º
                                          andar, em Porto Alegre/RS, CEP: 90020-022, a efetuar <span className="font-weight-bold">TRANSFERÊNCIAS DE VALORES</span> da Conta de Pagamento Facta, de <span className="font-weight-bold">minha titularidade</span>, para contas de mesma titularidade ou outra titularidade.
                                        </Label>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </>
                          )
                        : null
                      }
                    </>
                  : null
                }

                  {
                    this.state.obj_contratos !== undefined ? (
                        this.state.obj_contratos.map(item => (
                        <>
                        <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                          <CardBody className="text-left">
                            <h5 className="text-center mt-5 border-bottom border-light pb-3">Dados do Contrato { item.PROPOSTA }</h5>
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
                              <Col xs="12" sm="12" xm="12">
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
                              <Col xs="12" sm="12" xm="12">
                                <label>Valor Total de Crédito</label>
                                <p className="font-weight-bold"> {
                                  item.Tipo_Operacao === 2 || item.Tipo_Operacao === 14
                                    ? parseFloat(item.saldoDevedor).toLocaleString('pt-BR', formatoValor)
                                    : parseFloat(item.VLRAF).toLocaleString('pt-BR', formatoValor)
                                  } </p>
                              </Col>
                              <Col xs="12" sm="12" xm="12">
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
                    <CardBody className="text-left pb-5">
                      <h5 className="text-center border-bottom border-light pb-3">CLÁUSULAS E CONDIÇÕES</h5>
                      <Row className="text-justify">
                        <Col xs="12" sm="12" xm="12">
                          <p>1. O Emitente pagará por esta Cédula de Crédito Bancário ("Cédula") ao Credor ou à sua ordem, na(s) data(s) de vencimento indicada(s) no Quadro IV do preâmbulo, em moeda corrente nacional, a quantia nele indicada, acrescida dos juros e demais encargos ajustados nesta Cédula, nos termos da Lei 10.931/04 e das cláusulas e condições enunciadas a seguir:</p>

                          <p><span className="font-weight-bold">DA AUTORIZAÇÃO: </span></p>
                          <p>1.1. Débito em folha de pagamento/benefício: o Emitente autoriza o débito das parcelas nos valores que lhes são devidos a título de salário ou benefício, diretamente junto à empresa ou órgão pagador. </p>
                          <p>1.2. Débito em conta corrente: autoriza, desde já, o débito das parcelas em sua conta corrente informada no QUADRO V, obrigando-se a manter a suficiente provisão de fundos nas datas de vencimento das parcelas, desde a primeira até a última prestação. Em caso de alteração do banco no qual recebe seu salário/benefício ou conta corrente indicada para débito, compromete-se a informar imediatamente ao credor as informações da nova instituição (banco, agência e conta) e desde já autoriza o credor a efetuar os débitos. Caso ocorra alteração bancária e o credor não seja informado, fica desde já o credor autorizado a buscar junto aos bancos os novos dados para que sejam procedidos os débitos. </p>
                          <p>1.3. Boleto Bancário: O emitente efetuará o pagamento através de boleto bancário emitido pelo credor. Fica definido que o não recebimento em tempo hábil do boleto, não exime o emitente de efetuar o pagamento das parcelas nos vencimentos definidos no QUADRO IV. </p>
                          <p>1.4. Cheques: O emitente entrega ao credor, como forma de pagamento cheques correspondente aos vencimentos , ao número de parcelas e aos valores definidos no QUADRO IV. A quitação da obrigação de pagamento do Emitente somente se efetivará após a compensação dos referidos cheques.</p>

                          <p><span className="font-weight-bold">DO PAGAMENTO: </span></p>
                          <p>2. O Emitente suportará todos os tributos, encargos, despesas, ônus e quaisquer outros custos que venham a incidir em razão da presente Cédula, inclusive de registro da alienação fiduciária e tarifas informadas e cobradas conforme as normas do Banco Central do Brasil e o Imposto sobre Operações de Crédito, Câmbio e Seguro (“IOF”), que será deduzido do valor disponibilizado em favor do Emitente, tendo, assim, pleno conhecimento do CET – Custo Efetivo Total da presente operação de crédito e das tarifas de serviços apresentadas. </p>

                          <p><span className="font-weight-bold">DA LIBERAÇÃO DE VALORES: </span></p>
                          <p>3. O Emitente autoriza o credor a efetuar a liberação do valor empréstimo por meio de crédito em conta corrente própria ou de terceiros, por ele indicado, em caso de portabilidade de dívida na conta da instituição financeira credora da operação que está sendo portada. </p>

                          <p><span className="font-weight-bold">DO INADIMPLEMENTO: </span></p>
                          <p>4. Em caso de mora no pagamento  de quaisquer valores devidos nos termos desta Cédula, inclusive principal ou juros, sem prejuízo do disposto nas demais cláusulas da presente, incidirão sobre o saldo devedor devidamente atualizado os seguintes encargos: I) juros de mora à razão de 1% (um por cento) ao mês; II) multa não compensatória de 2% (dois por cento) sobre o montante dos débitos. </p>

                          <p><span className="font-weight-bold">DO VENCIMENTO ANTECIPADO: </span></p>
                          <p>5. O Credor poderá considerar a dívida representada por esta Cédula vencida e exigível de pleno direito, independentemente de interpelação ou notificação judicial ou extrajudicial, quando o Emitente deixar de cumprir as obrigações aqui pactuadas. </p>

                          <p><span className="font-weight-bold">DA LIQUIDAÇÃO ANTECIPADA: </span></p>
                          <p>6. O Emitente poderá amortizar ou liquidar antecipadamente o seu saldo devedor, com redução proporcional dos juros e demais acréscimos, nos termos da legislação aplicável, sendo o valor calculado a partir da taxa de juros pactuada na CCB. </p>

                          <p><span className="font-weight-bold">DOS JUROS: </span></p>
                          <p>7. O valor contratado será acrescido de juros remuneratórios capitalizados mensalmente à taxa de juros estabelecida na proposta, na quantidade de parcelas, valores, data de vencimento, bem como tributos e encargos especificados na Proposta. </p>

                          <p><span className="font-weight-bold">DA CONSULTA DE DADOS: </span></p>
                          <p>8. O Emitente autoriza o Credor a consultar dados pessoais eventualmente encontrados no Sistema de Informações Consolidadas da Central de Riscos do Banco Central - SIC/BACEN e em órgãos de proteção ao credito, tais como Serasa/Experian, SCPC e Associação Comercial, bem como a fornecer seus dados a essas entidades ou a terceiros para fins de cobrança, podendo os dados serem utilizados pelos órgãos de proteção ao crédito aqui mencionados, respeitadas as disposições legais. </p>

                          <p><span className="font-weight-bold">DA CESSÃO: </span></p>
                          <p>9. O Credor poderá emitir Certificado de Cédulas de Crédito Bancário - CCCB com lastro nesta Cédula e negociá-lo livremente no mercado, bem como transferir esta Cédula por endosso ou ceder a terceiros, no todo ou em parte, os direitos destas decorrentes, independentemente de qualquer aviso ou autorização de qualquer espécie. </p>

                          <p><span className="font-weight-bold">DECLARAÇÃO: </span></p>
                          <p>10. O Emitente declara: a) conhecer as normas do Banco Central do Brasil, que dispõem sobre os crimes de lavagem de dinheiro e as suas obrigações; b) comunicar formalmente qualquer mudança de propósito e natureza da relação de negócios com a FACTA; c) não participar direta ou indiretamente, com quaisquer formas de trabalho escravo e infantil, ou práticas danosas ao meio ambiente; d) serem verdadeiras todas as informações prestados, assim como está ciente de todas os termos e condições desta CCB.</p>
                          <p>A presente Cédula é emitida em 3 vias, sendo que apenas a via do credor é negociável.</p>
                          <p>Declaro que li e compreendi todos os termos desta cédula de crédito bancário. Declaro, ainda, que recebi cópia da presente Cédula</p>

                        </Col>
                      </Row>

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
        : <PaginaMensagemLocalizacao />
        )
      }
      </div>
    );
  }
}

export default CedulaFactaMex;
