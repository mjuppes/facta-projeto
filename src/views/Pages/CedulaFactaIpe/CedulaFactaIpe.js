import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import Moment from "react-moment";
import domtoimage from 'dom-to-image';
import md5 from 'md5';
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

class CedulaFactaIpe extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeIn: true,
      timeout: 300,
      tipoPendencia: props.tipo,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      codigoAF64: this.props.match.params.propostaId,
      propostaINSS: true,
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
      }.bind(this))
      .catch(function (error) {
        console.error('oops, something went wrong!', JSON.stringify(error));
        //alert(JSON.stringify(error));
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

    let dia = new Date().getDate();
    dia = ("0" + dia).slice(-2);
    let mes = new Date().getMonth()+1;
    mes = ("0" + mes).slice(-2);
    let ano = new Date().getFullYear();

    let token_ccb = md5('api_gerar_ccb_' + ano + '-' + mes + '-' + dia);

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

                  <DadosDaPropostaTemplate proposta={AF} tipo_operacao={TIPO_OPERACAO} />

                  <DadosDoClienteTemplate cliente={this.state.obj_cliente} />

                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody className="text-left">
                      <h5 className="text-center pb-4 border-bottom border-light">Dados Funcionais</h5>
                      <Row>
                        <Col xs="12" sm="12" xm="12">
                          <label>Órgão</label>
                          <p className="font-weight-bold">INSTITUTO DE PREVIDÊNCIA DO ESTADO DO RIO GRANDE DO SUL</p>
                        </Col>
                        <Col xs="12" sm="12" xm="12">
                          <label>Unidade Pagadora</label>
                          <p className="font-weight-bold">
                            { AF.DADOS_SECRETARIA !== undefined && AF.DADOS_SECRETARIA[0] !== undefined ? AF.DADOS_SECRETARIA[0].Descricao : "-" }</p>
                        </Col>

                        <Col xs="12" sm="12" xm="12">
                          <label>Nº da Identificação</label>
                          <p className="font-weight-bold">{ AF.IDENTIFICACAO_IPE }</p>
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
                                    { parseFloat( isNaN(parseFloat(AF.VLRSEGURO)) ? 0 : AF.VLRSEGURO ).toLocaleString('pt-BR', formatoValor) }
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
                                            parseFloat(item_vinculadas.VLRSEGURO !== '' && item_vinculadas.VLRSEGURO !== null ? item_vinculadas.VLRSEGURO : 0).toLocaleString('pt-BR', formatoValor)
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
                    <CardBody className="text-left">
                      <h5 className="text-center border-bottom border-light pb-3">ASSOCIAÇÃO { AF.TIPO_SERVIDOR }</h5>
                      <Row>
                        <Col xs="12" sm="12" xm="12">
                          <FormGroup check className="checkbox">
                          { AF.TIPO_SERVIDOR === "ABEMOSE"
                          ? <>
                            <p>
                              Eu, <span className="font-weight-bold">{ this.state.obj_cliente.DESCRICAO }</span>, autorizo que sejam descontados de{' '}
                              meus vencimentos em folha de pagamento ou Débito em minha conta corrente, a critério{' '}
                              da Associação, os valores relativos a mensalidade.
                              <br />
                              Autorizo também que sejam debitados os valores correspondentes a outros compromissos que{' '}
		                          venham a assumir com a associação, acrescidos de juros mora na eventualidade de atrasos no{' '}
                              ressarcimento dos referidos valores.
                            </p>
                            </>
                          : <>
                            <p>
                            Eu, <span className="font-weight-bold">{ this.state.obj_cliente.DESCRICAO }</span>, autorizo a consignação, em folha de pagamento no valor de R$ 24,18 (vinte e quatro reais e dezoito centavos){' '}
                            por prazo indeterminado, em favor do SINAPERS, referente à mensalidade social, esta não sendo descontada, {' '}
                            a cobrança será feita por doc. bancário ou débito em conta. A mensalidade social será reajustada {' '}
                            anualmente (em novembro) conforme estatuto do SINAPERS.
                            </p>
                            </>
                          }
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12" sm="12" xm="12" className="text-center">
                          <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_ccb.php?tipo_ccb=associacao_"+ (AF.TIPO_SERVIDOR.toLowerCase()) +"&token=" + token_ccb + "&mostra_assinatura=0&tipo=1&codigo=" + this.state.codigoAF64 } className="btn btn-block font-weight-bold mt-2 btn-outline-primary">
                            Visualizar ficha da associação
                          </a>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  { AF.RECIPROCA === true
                    ? <>
                      <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                        <CardBody className="text-left">
                          <h5 className="text-center border-bottom border-light pb-3">DECLARAÇÃO DE RESPONSABILIDADE RECÍPROCA</h5>
                          <Row>
                            <Col xs="12" sm="12" xm="12">
                              <FormGroup check className="checkbox">
                                <p>
                                Eu, <span className="font-weight-bold">{ this.state.obj_cliente.DESCRICAO }</span>, {' '}
                                autorizo a <span className="font-weight-bold">FACTA FINANCEIRA S.A.</span> consignar em minha{' '}
                                folha de pagamento 120 parcelas mensais e consecutivas, nos termos da Autorização{' '}
                                (Anexo II) prevista no Decreto 43.337/2004.
                                </p>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="12" sm="12" xm="12" className="text-center">
                              <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_ccb.php?tipo_ccb=declaracao_reciproca&token=" + token_ccb + "&mostra_assinatura=0&tipo=1&codigo=" + this.state.codigoAF64 } className="btn btn-block font-weight-bold mt-2 btn-outline-primary">
                                Clique aqui para visualizar a declaração
                              </a>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                      </>
                    : null
                  }

                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody className="text-left pb-5">
                      <h5 className="text-center border-bottom border-light pb-3">CLÁUSULAS E CONDIÇÕES</h5>
                      <Row className="text-justify">
                        <Col xs="12" sm="12" xm="12">
                          <p>O Emitente pagará por esta Cédula de Crédito Bancário ("Cédula") ao Credor ou à sua ordem, na(s) data(s) de vencimento indicada(s) no Quadro IV do preâmbulo, em moeda corrente nacional, a quantia nele indicada, acrescida dos juros e demais encargos ajustados nesta Cédula, nos termos da Lei 10.931/04 e das cláusulas e condições enunciadas a seguir:</p>

                          <p><span className="font-weight-bold">DA AUTORIZAÇÃO: </span></p>
                          <p>1.1. Débito em folha de{" "}
                          pagamento/benefício: o Emitente autoriza o débito das parcelas nos valores que lhes são devidos a título de{" "}
                          salário ou benefício, diretamente junto à empresa ou órgão pagador. Caso ocorra alteração bancária e o credor{" "}
                          não seja informado, fica desde já o credor autorizado a buscar junto aos bancos os novos dados para que sejam{" "}
                          procedidos os débitos. 1.3. Boleto Bancário: O emitente efetuará o pagamento através de boleto bancário{" "}
                          emitido pelo credor. Fica definido que o não recebimento em tempo hábil do boleto, não exime o emitente{" "}
                          de efetuar o pagamento das parcelas nos vencimentos definidos no QUADRO IV. 1.4. Cheques: O{" "}
                          emitente entrega ao credor, como forma de pagamento cheques correspondente aos vencimentos, ao número de{" "}
                          parcelas e aos valores definidos no QUADRO IV. A quitação da obrigação de pagamento do Emitente somente se{" "}
                          efetivará após a compensação dos referidos cheques.</p>

                          <p><span className="font-weight-bold">DO PAGAMENTO: </span></p>
                          <p>2. O Emitente suportará todos os{" "}
                          tributos, encargos, despesas, ônus e quaisquer outros custos que venham a incidir em razão da presente{" "}
                          Cédula, inclusive de registro da alienação fiduciária e tarifas informadas e cobradas conforme as normas do{" "}
                          Banco Central do Brasil e o Imposto sobre Operações de Crédito, Câmbio e Seguro (“IOF”), que será que será{" "}
                          acrescido e financiado conjuntamente, mas não disponibilizado, ao valor liberado ao Emitente, tendo, assim, pleno{" "}
                          conhecimento do CET – Custo Efetivo Total da presente operação de crédito e das tarifas de serviços{" "}
                          apresentadas. </p>

                          <p><span className="font-weight-bold">DA LIBERAÇÃO DE VALORES:</span></p>
                          <p>3. O Emitente autoriza o credor a efetuar a liberação do valor{" "}
                          empréstimo por meio de crédito em conta corrente própria ou de terceiros, por ele indicado, em caso de{" "}
                          portabilidade de dívida na conta da instituição financeira credora da operação que está sendo portada. Em se{" "}
                          tratando de empréstimo contratado mediante telefone, dispositivos móveis de comunicação (mobile), caixas{" "}
                          eletrônicos, internet ou por correspondentes, poderá o cliente solicitar a desistência do empréstimo ora{" "}
                          contratado no prazo de até 7 (sete) dias úteis a contar do recebimento da quantia{" "}
                          emprestada, mediante restituição, à Financeira ou a qualquer instituição financeira adquirente desta{" "}
                          operação, do valor total concedido acrescido de eventuais tributos e juros até a data de efetivação da{" "}
                          devolução. </p>

                          <p><span className="font-weight-bold">DO INADIMPLEMENTO: </span></p>
                          <p>4. Em caso de mora no pagamento de quaisquer valores devidos nos termos{" "}
                          desta Cédula, inclusive principal ou juros, sem prejuízo do disposto nas demais cláusulas da presente, incidirão{" "}
                          sobre o saldo devedor devidamente atualizado os seguintes encargos: I) juros de mora à razão de 1% (um por{" "}
                          cento) ao mês; II) multa não compensatória de 2% (dois por cento) sobre o montante dos débitos. </p>

                          <p><span className="font-weight-bold">DO VENCIMENTO ANTECIPADO: </span></p>
                          <p>5. O Credor poderá considerar a dívida representada por esta Cédula vencida e{" "}
                          exigível de pleno direito, independentemente de interpelação ou notificação judicial ou extrajudicial, quando o{" "}
                          Emitente deixar de cumprir as obrigações aqui pactuadas.</p>

                          <p><span className="font-weight-bold">DA LIQUIDAÇÃO ANTECIPADA: </span></p>
                          <p>6. O Emitente{" "}
                          poderá amortizar ou liquidar antecipadamente o seu saldo devedor, com redução proporcional dos juros e{" "}
                          demais acréscimos, nos termos da legislação aplicável, sendo o valor calculado a partir da taxa de juros{" "}
                          pactuada na CCB.</p>

                          <p><span className="font-weight-bold">DOS JUROS: </span></p>
                          <p>7. O valor contratado será acrescido de juros remuneratórios capitalizados{" "}
                          mensalmente à taxa de juros estabelecida na proposta, na quantidade de parcelas, valores, data de vencimento,{" "}
                          bem como tributos e encargos especificados na Proposta.</p>

                          <p><span className="font-weight-bold">DA CONSULTA DE DADOS: </span></p>
                          <p>8. O Emitente autoriza{" "}
                          o Credor a consultar dados pessoais eventualmente encontrados no Sistema de Informações Consolidadas da{" "}
                          Central de Riscos do Banco Central - SIC/BACEN e em órgãos de proteção ao credito, tais como{" "}
                          Serasa/Experian, SCPC e Associação Comercial, bem como a fornecer seus dados a essas entidades ou a{" "}
                          terceiros para fins de cobrança, podendo os dados serem utilizados pelos órgãos de proteção ao crédito aqui{" "}
                          mencionados, respeitadas as disposições legais.</p>

                          <p><span className="font-weight-bold">DA CESSÃO: </span></p>
                          <p>9. O Emitente declara conhecer seu{" "}
                          direito de portabilidade, podendo solicitar a transferência de sua dívida (portabilidade) para outra instituição de sua{" "}
                          preferência.</p>

                          <p><span className="font-weight-bold">DECLARAÇÃO: </span></p>
                          <p>10. O Credor poderá emitir Certificado de Cédulas de Crédito Bancário - CCCB com{" "}
                          lastro nesta Cédula e negociá-lo livremente no mercado, bem como transferir esta Cédula por endosso ou{" "}
                          ceder a terceiros, no todo ou em parte, os direitos destas decorrentes, independentemente de qualquer aviso{" "}
                          ou autorização de qualquer espécie.</p>


                          <p><span className="font-weight-bold">DECLARAÇÃO: </span></p>
                          <p>11. O Emitente declara: a) conhecer as normas do Banco{" "}
                          Central do Brasil, que dispõem sobre os crimes de lavagem de dinheiro e as suas obrigações; b) comunicar{" "}
                          formalmente qualquer mudança de propósito e natureza da relação de negócios com a FACTA; c) não{" "}
                          participar direta ou indiretamente, com quaisquer formas de trabalho escravo e infantile ou práticas danosas ao{" "}
                          meio ambiente; d) serem verdadeiras todas as informações prestadas como está ciente de todos os termos e{" "}
                          condições desta CCB assim como solicitar a qualquer momento, segunda via deste documento ciente de que{" "}
                          a disponibilização da segunda via ensejará em cobrança conforme Tabela de tarifas e serviços, disponibilizada no{" "}
                          site da instituição financeira.</p>

                          <p><span className="font-weight-bold">SEGURO PRESTAMISTA: </span></p>
                          <p>12. O CREDOR disponibiliza ao EMITENTE, integrante do{" "}
                          Grupo Segurável, a oferta do Microsseguro Prestamista. Para aceitá-la o EMITENTE deve manifestar a opção{" "}
                          “sim” no campo próprio ou “não” caso não deseje contratar. Na hipótese de contratação do Microsseguro{" "}
                          Prestamista pelo EMITENTE, integrante do Grupo Segurável, ao assinar a CCB, declara para todos os fins de{" "}
                          direito que, teve o acesso prévio, ciência e concorda integralmente com os termos das Condições Gerais e{" "}
                          Especiais do Microsseguro contratado, e autoriza, o CREDOR a divulgar as informações constantes desta Cédula{" "}
                          de Crédito Bancário (CCB), bem como cópia da mesma à Seguradora.</p>

                          <p>({ this.state.labelSeguroSim }) - SIM</p>
                          <p>({ this.state.labelSeguroNao }) - NÃO</p>
                          <p>
                            <span className="font-weight-bold">Local e data</span>: <span className="font-weight-bold">{ this.state.obj_cliente.NOME_CIDADE }</span>, <span className="font-weight-bold">{ this.state.diaAtual }</span> de <span className="font-weight-bold">{ this.state.mesAtual.toUpperCase() } de { this.state.anoAtual }</span>.
                          </p>


                          <p><span className="font-weight-bold">CLÁUSULA DO SEGURO PRESTAMISTA: </span></p>
                          <p>Caso o EMITENTE opte pela contratação do Microsseguro{" "}
                          prestamista, conforme opção assinalada no item "SEGURO PRESTAMISTA" do preâmbulo, fica desde já{" "}
                          consignado que o segurado (EMITENTE(s) terá(ão) direito à quitação do saldo devedor oriundo da presente{" "}
                          Cédula, nos casos de morte natural ou acidental e de invalidez permanente total por acidente. </p>
                          <p>1º - O saldo devedor do empréstimo será apurado na data do sinistro, respeitadas as condições contratuais do Microsseguro;</p>
                          <p>2º - O prêmio e quaisquer outras despesas correrão por conta do(s) EMITENTE(S), ficando a CREDORA desde{" "}
                          logo autorizada a debitar o valor correspondente ao prêmio do Microsseguro do valor financiado na presente{" "}
                          Cédula; </p>

                          <p>O(s) EMITENTE(S) declara(m) ter ciência e concorda(m) com todos os termos, regras e condições do{" "}
                          seguro acima mencionado, inteiramente disciplinadas no Bilhete de Microsseguro, Anexo 1, que torna-se parte{" "}
                          integrante deste documento.</p>

                          <p>A presente Cédula é emitida em 03 vias, sendo que apenas a via do credor é negociável. Declaro que li e{" "}
                          compreendi todos os termos desta cédula de crédito bancário. Declaro, ainda, que recebi cópia da presente{" "}
                          Cédula.</p>

                        </Col>
                      </Row>

                      <Row className="mb-3 mt-3">
                        <Col xs="12" sm="12">
                          <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={this.salvaImgCcb} disabled={this.state.clicou}>
                            Eu <strong>li</strong> e <strong>aceito</strong> os termos
                          </Button>
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

export default CedulaFactaIpe;
