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

class CedulaFactaPoderJudiciario extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeIn: true,
      timeout: 300,
      tipoPendencia: props.tipo,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
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
      this.state.dataHoraPrimeiraTela     = DADOS_STATE_TERMO.dataHoraPrimeiraTela !== undefined  ? DADOS_STATE_TERMO.dataHoraPrimeiraTela : '';
      this.state.geoInicial               = DADOS_STATE_TERMO.geoInicial !== undefined            ? DADOS_STATE_TERMO.geoInicial : '';

      //### DADOS DO TERMO (Termo.js)
      this.state.dataHoraTermo            = DADOS_STATE_TERMO.dataHoraTermo !== undefined         ? DADOS_STATE_TERMO.dataHoraTermo : '';
      this.state.geoTermo                 = DADOS_STATE_TERMO.geoTermo !== undefined              ? DADOS_STATE_TERMO.geoTermo : '';

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
                          <p className="font-weight-bold">SIAPE</p>
                        </Col>
                        <Col xs="12" sm="12" xm="12">
                          <label>Unidade Pagadora</label>
                          <p className="font-weight-bold">{ this.state.obj_cliente !== undefined ? this.state.obj_cliente.SiglaUPAG + ' - ' + AF.SIGLAUPAG.Descricao : null }</p>
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

                        { AF.contaFactaFinanceira !== undefined && AF.contaFactaFinanceira.id !== undefined
                          ? (
                            <>
                            <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                              <CardBody className="text-left">
                                <h5 className="text-center border-bottom border-light pb-3">Autorização de Abertura de Conta</h5>
                                <Row>
                                  <Col xs="12" sm="12" xm="12">
                                    <FormGroup check className="checkbox">
                                      <Input className="form-check-input" type="checkbox" id="checkbox1" name="autorizacao_abertura" value="1" defaultChecked onChange={this.handleChange} />
                                      <Label check className="form-check-label text-justify" htmlFor="checkbox1">
                                        Eu, { this.state.obj_cliente.DESCRICAO }, <span className="font-weight-bold">AUTORIZO</span> a <span className="font-weight-bold">FACTA FINANCEIRA S.A. CFI</span>, inscrita no CNPJ sob o n. 15.581.638/0001-30, sediada na Rua dos Andradas, n. 1409, 7º andar, em Porto Alegre/RS, CEP: 90020-022, a realizar a abertura de conta de pagamento, para a movimentação dos valores envolvidos nesta operação.
                                      </Label>

                                      <Modal isOpen={this.state.mdlLgConta} toggle={this.toggleModalAbertura} className={'modal-lg ' + this.props.className}>
                                        <ModalHeader toggle={this.toggleModalAbertura}>TERMOS E CONDIÇÕES DE USO DA CONTA DE PAGAMENTO DA FACTA</ModalHeader>
                                        <ModalBody>
                                          <p className="font-weight-bold">INTRODUÇÃO</p>
                                          <p>
                                            Seja bem-vindo(a) à Facta Financeira S.A. CFI (“Facta”)! Estes são os Termos e Condições de Uso da Conta de Pagamento da Facta. Leia este documento com muita atenção, ele é o regulamento que prevê os direitos, obrigações e benefícios atrelados ao serviço que prestamos. Portanto, é muito importante para que o relacionamento iniciado hoje seja longo e próspero. Caso você não concorde com alguma disposição, não assine este contrato.
                                          </p>

                                          <p>
                                            Ao utilizar nossos Serviços, você estará declarando que leu, compreendeu e está de acordo com os Termos e Condições de Uso da Conta de Pagamento da Facta e compromete-se a cumpri-los
                                          integralmente.
                                          </p>

                                          <p>
                                            A FACTA - Os serviços são oferecidos pela FACTA FINANCEIRA S.A. CFI, inscrita no CNPJ sob o n. 15.581.638/0001-30, sediada na Rua dos Andradas, 1409, 7º andar, em Porto Alegre/RS, CEP: 90020-022.
                                          </p>
                                          <p>
                                            ABERTURA DA CONTA - A Conta de Pagamento pode ser aberta em qualquer estabelecimento da Facta, de Agente Credenciado Facta ou de forma exclusivamente digital, através de aplicativo, mediante de preenchimento de cadastro e entrega de documentos comprovantes de identificação, renda e patrimônio.
                                          </p>

                                          <p className="font-weight-bold">CONDIÇÕES DE ABERTURA</p>

                                          <ul>
                                            <li>Pessoa física;</li>
                                            <li>Ter 18 anos ou mais e estar no pleno uso e gozo de sua capacidade legal;</li>
                                            <li>Ser residente e domiciliado no Brasil;</li>
                                            <li>Ter um Smartphone com sistema operacional IOS ou Android, com câmera frontal e acesso à internet banda larga (3G ou 4G).</li>
                                          </ul>

                                          <p className="font-weight-bold">VERACIDADE DAS INFORMAÇÕES PRESTADAS</p>

                                          <p>
                                            Todas as informações prestadas pelo Titular são verídicas, completas e corretas, sendo sua a responsabilidade pela manutenção de todos os seus dados devidamente atualizados perante a Facta.
                                          </p>

                                          <p>
                                            Isso não impede que a Facta, a seu exclusivo critério, a qualquer momento, verifique a veracidade das informações através da solicitação de esclarecimentos e documentação extraordinária para comprovação dos dados levantados no cadastro. Nesse caso, a recusa do Titular ensejará o cancelamento da conta de pagamento e os Termos e Condições de Uso da Conta de Pagamento Facta serão imediatamente rescindidos.
                                          </p>

                                          <p>
                                            A utilização de informações falsas, incompletas, equivocadas, enganosas, fraudulentas ou erradas ensejará a suspensão imediata do cadastro até que a informação seja regularizada – ou, caso não haja como sanear o processo, definitivamente cancelado, sem prejuízo de sanções legais e contratuais, caso a constatação dessa utilização seja em momento posterior à adesão aos Termos e Condições de Uso da Conta de Pagamento Facta.
                                          </p>

                                          <p className="font-weight-bold">ACESSO À CONTA</p>

                                          <p>
                                            O Titular poderá acessar a Conta de Pagamento através da internet, mediante utilização de login e senha cadastrada para este fim. Por isso, o Titular deve conferir os dados pessoais constantes do cartão antes do seu desbloqueio. Caso haja aprovação de cartão físico para utilização dos serviços da Conta de Pagamento, o prazo para o seu envio e recebimento será oportunamente informado ao cliente – e o acompanhamento da entrega poderá se dar através dos Canais de Comunicação. A Facta oferece serviços de qualidade e possui certificados digitais de garantia e segurança que respeitam as regras regulatórias, legais e as boas práticas de governança.
                                          </p>

                                          <p className="font-weight-bold">LOGIN E SENHA</p>

                                          <p>
                                            O Titular deverá cadastrar senha específica para a Conta de Pagamento e para o cartão físico, se for o caso, sendo o único responsável pela sua guarda e confidencialidade, sendo vedado o seu compartilhamento com terceiros.
                                          </p>
                                          <p>
                                            Em caso de roubo, extravio ou furto de login e/ou senha, o titular deverá entrar em contato imediatamente, através dos Canais de Comunicação, inexistindo qualquer tipo de responsabilidade da Facta pelos acessos realizados por terceiros não autorizados pelo Titular à Conta de Pagamento.
                                          </p>

                                          <p>
                                            Recomendam-se, como medidas de segurança, as seguintes:
                                          </p>

                                          <ul>
                                            <li>Utilização de senhas fortes e não relacionadas a datas ou referências pessoais, mantidas em local seguro, sem acesso e/ou permissão de acesso por terceiros – preferencialmente, memorizadas, e nunca anotadas ou guardadas junto com o cartão físico;</li>
                                            <li>Alteração rotineira da senha;</li>
                                            <li>Guarda do cartão em local adequado e seguro, sem acesso e/ou permissão de acesso por terceiros;</li>
                                          </ul>

                                          <p className="font-weight-bold">USO IRREGULAR OU INADEQUADO</p>

                                          <p>
                                            A suspeita de uso irregular e/ou inadequado da conta de pagamento Facta ou a existência de evidências que suportem tal afirmação poderão ensejar o encerramento ou suspensão total ou parcial dos serviços do cartão e/ou Conta de Pagamento, sem prejuízo das demais sanções legais e/ou contratuais.
                                          </p>

                                          <p>
                                            A verificação de operações fora do padrão de uso do Titular podem ensejar pedidos de envio de novos documentos ou fotos para comprovação da sua validade. Em caso de inaptidão à comprovação, será considerado uso irregular do serviço. De igual sorte, é considerada irregular:
                                          </p>

                                          <ul>
                                            <li>A utilização comercial dos serviços ofertados;</li>
                                            <li>A utilização dos serviços ofertados por terceiros alheios à presente contratação;</li>
                                            <li>A utilização dos serviços ofertados com propósito de, sob qualquer aspecto, receber ou dar em pagamento produtos e/ou serviços originados em crimes ou condutas inadequadas de qualquer natureza;</li>
                                            <li>A utilização dos serviços ofertados em desacordo com os padrões descritos neste documento;</li>
                                            <li>A Facta não é responsável pelo uso irregular dos serviços ofertados.</li>
                                          </ul>

                                          <p className="font-weight-bold">SERVIÇOS</p>

                                          <p>
                                            Uma vez aprovado o cadastro e assinado o contrato, o Titular irá receber acesso aos serviços e operações abaixo especificadas, na data aprazada, sempre sujeitas à disponibilidade de saldo na Conta de Pagamento e pagamento das tarifas estipuladas em tabela disponibilizada em aplicativo:
                                          </p>

                                          <p>
                                            Compras em Estabelecimentos – Realizar compra de bens ou serviços em Estabelecimento que aceite pagamentos em cartões da Bandeira;
                                          </p>

                                          <p>
                                            Saque – retirar recursos em terminais eletrônicos habilitados – poderão ser cobradas taxas pelas empresas administradoras dos terminais – até o limite de R$ 1.000,00 (um mil reais) por dia.
                                          </p>

                                          <p>
                                            Transferências entre Contas – Transferência de recursos financeiros da sua Conta de Pagamento para contas de terceiros, podendo ser cobradas taxas e impostos específicos para essas transferências, que serão descontadas do saldo do Titular.
                                          </p>

                                          <p>
                                            Pagamento de boletos e contas de consumo: Poderão ser realizados os pagamentos de boletos e contas de consumo, sujeito às limitações impostas pela legislação brasileira e emissoras dos títulos/boletos objeto da transação;
                                          </p>

                                          <p>
                                            Emissão de boletos: Poderão ser emitidos boletos cujo pagamento direcionará os recursos para sua conta de pagamento;
                                          </p>

                                          <p>
                                            Recarga de celular: Poderão ser realizadas recargas de celular de operadoras cadastradas, sujeitas às regras específicas de cada operadora;
                                          </p>

                                          <p>
                                            Recarga de bilhete de transporte:Poderão ser realizadas recargas dos serviços de bilhetes de transporte, de acordo com as regras específicas da sua utilização.
                                          </p>

                                          <p>
                                            Cada funcionalidade/operação poderá ter limitações técnicas, taxas e especificações definidas em manual próprio e disponível para o Titular digitalmente em aplicativo.
                                          </p>

                                          <p className="font-weight-bold">CUSTOS DA CONTA DE PAGAMENTO</p>

                                          <p>
                                            A remuneração dos serviços varia de acordo com a operação e/ou funcionalidade utilizada, de forma que deve ser consultada a tabela disponibilizada para conhecimento da informação.
                                          </p>
                                          <p>
                                            Os custos de cada operação (remuneração e impostos, se houver) serão preferencialmente debitados da Conta de Pagamento.
                                          </p>
                                          <p>
                                            A Facta reserva o direito de alteração das tarifas relacionadas à utilização da Conta de Pagamento digital, sendo facultado ao Titular a manutenção do seu cadastro. Inclusive, a qualquer tempo, a redefinir preços para oferecimento de determinados Serviços, ainda que inicialmente tenham sido ofertados de forma gratuita, na forma do item 8.
                                          </p>

                                          <p className="font-weight-bold">DO APLICATIVO</p>

                                          <p>
                                            O Titular é responsável pelo download do aplicativo, através das lojas GooglePlay ou AppStore, para utilizar todas as vantagens e facilidades da Conta de Pagamento, de acordo com o sistema operacional do Smartphone do Titular.
                                          </p>
                                          <p>
                                            O Titular poderá receber no e-mail cadastrado as informações referentes à aprovação de seu cadastro.
                                          </p>
                                          <p>
                                            É defeso ao Titular que: Utilize a Conta de Pagamento e/ou cartão físico para divulgação de informações que, de qualquer forma, possa implicar violação de normas aplicáveis no Brasil, de direitos de propriedade da Facta, dos bons costumes, incluindo, sem limitação, a violação de direitos intelectuais, autorais e de privacidade, ou a produção e divulgação de conteúdo ilegal, imoral, inapropriado ou ofensivo;
                                          </p>
                                          <p>
                                            Empregue Malware e/ou Práticas Nocivas com o intuito de utilizar indevidamente o aplicativo para práticas indesejadas, tais como exploits, spamming, flooding, spoofing, crashing e root kits etc;
                                          </p>
                                          <p>
                                            Publique ou transmita qualquer arquivo que contenha vírus, worms, Cavalos de Troia ou qualquer outro programa contaminante ou destrutivo, ou que, de alguma forma, possa interferir no bom funcionamento do site ou do aplicativo;
                                          </p>
                                          <p>
                                            Utilize o aplicativo para finalidade diversa daquela para a qual foi disponibilizado pela Facta;
                                          </p>
                                          <p>
                                            Efetue tentativa ou efetivamente acesse, armazene, divulgue, utilize ou modifique dados de outros Titulares.
                                          </p>
                                          <p>
                                            A Facta reserva o seu direito de suspender, modificar ou encerrar o funcionamento do aplicativo, a seu exclusivo critério, a qualquer tempo, mediante comunicação prévia ao Titular, à exceção de ocorrência de ato de autoridade, caso fortuito ou força maior.
                                          </p>
                                          <p>
                                            O Titular autoriza o envio de mensagens, avisos ou outras correspondências de caráter informativo, comercial e/ou promocional para o endereço de e-mail e/ou residencial indicados no cadastro. Caso o Titular queira cancelar o recebimento dessas informações, deverá fazê-lo expressamente através dos Canais de Comunicação.
                                          </p>

                                          <p className="font-weight-bold">DIREITO DE PROPRIEDADE</p>

                                          <p>
                                            A Facta concede ao Titular uma licença pessoal, limitada, temporária, revogável, não exclusiva e intransferível para uso do aplicativo, durante o período de manutenção da Conta de Pagamento. O Conteúdo e funcionalidades do aplicativo é protegido pela lei de direitos autorais e propriedade industrial, sendo proibido o seu uso, cópia, cessão, reprodução, modificação, tradução, publicação, transmissão, distribuição, execução, exibição, licenciamento, sublicenciamento, venda, dação em garantia ou exploração, para qualquer finalidade distinta da que ora descrita, lícita e autorizada, sem o consentimento prévio da Facta. É expressamente proibida a utilização indevida de qualquer conteúdo e/ou marcas apresentadas no aplicativo. Em nenhuma hipótese, o Titular terá acesso ao código fonte do software.
                                          </p>

                                          <p className="font-weight-bold">DA UTILIZAÇÃO INTERNACIONAL</p>

                                          <p>
                                            Este serviço não está disponível para operações fora do Brasil.
                                          </p>

                                          <p className="font-weight-bold">PERDA DE CARTÃO</p>

                                          <p>
                                            Em caso de roubo, extravio ou furto do cartão físico, a Facta deve ser imediatamente informada, através dos Canais de Comunicação. Após o contato, o uso e acesso da Conta poderá ser temporariamente bloqueado, até que seja cadastrado novo login e senhas de acesso pelo Titular.O novo cartão será preparado e enviado ao Titular para entrega no local indicado, na data aprazada, podendo ser cobradas tarifas adicionais para sua geração, o que será previamente informado ao Titular, e com instruções de desbloqueio previstas em aplicativo.
                                          </p>

                                          <p className="font-weight-bold">NÃO RECONHECIMENTO DE OPERAÇÃO FEITA COM CARTÃO</p>

                                          <p>
                                            Caso o Titular não reconheça um débito na sua Conta de Pagamento e suspeite que ocorreu indevidamente, deverá entrar em contato com a Facta através dos Canais de Comunicação, no prazo máximo de 90 (noventa) dias e seguir as orientações do procedimento de ressarcimento de valores. A responsabilidade pelo ressarcimento é da bandeira emissora do cartão, motivo pelo qual a representação do pedido do Titular, feita através da Facta, deve ser instruída com os documentos necessários à comprovação do erro. Em caso de constatação de culpa exclusiva do Titular sobre o uso irregular ou inadequado, bem como em caso de transações efetuadas com login e senha corretos através de aplicativo, a solicitação não será atendida. Nessa ocasião, o Titular estará sujeito à previsão do item 2.5, bem como às demais cominações legais e contratuais, sendo devido o pagamento das transações realizadas.
                                          </p>

                                          <p className="font-weight-bold">VIGÊNCIA, MODIFICAÇÃO E CANCELAMENTO DE SERVIÇOS</p>

                                          <p>
                                            A partir do aceite do Titular, a vigência deste documento é indeterminada, podendo ser modificado pela Facta ou rescindido unilateralmente por qualquer das partes, a qualquer tempo, sem ônus, mediante comunicação junto aos Canais de Comunicação.
                                          </p>
                                          <p>
                                            A alteração destes Termos e Condições de Uso será informada ao Titular por e-mail, com antecedência mínima de 30 (trinta) dias da efetiva modificação, facultando-lhe a escolha entre manter ou rescindir a relação contratual. A partir do 30º dia, inexistindo manifestação das partes, será considerada a aceitação tácita de todas as alterações promovidas.
                                          </p>

                                          <p className="font-weight-bold">CANCELAMENTO A PEDIDO DO TITULAR</p>

                                          <p>
                                            Em caso de cancelamento da conta, o encerramento definitivo se dará no prazo máximo estabelecido na regulamentação aplicável, sendo facultado o saque do saldo remanescente ou a sua transferência para outra conta. O cancelamento do cartão ensejará o seu bloqueio permanente e o envio de nova via poderá ensejar a cobrança de taxa de confecção e envio.
                                          </p>

                                          <p className="font-weight-bold">CANCELAMENTO A PEDIDO DA FACTA</p>

                                          <p>
                                            A Facta poderá solicitar o cancelamento da prestação dos serviços, mediante comunicação ao Titular com, no mínimo, 30 (trinta) dias de antecedência, à exceção das hipóteses abaixo, quando o contrato poderá ser imediatamente rescindido:
                                          </p>
                                          <p>
                                            Conta inativa e com saldo zerado por mais de 03 (três) meses consecutivos;
                                          </p>

                                          <ul>
                                            <li>Uso irregular pelo Titular;</li>
                                            <li>Falecimento do Titular;</li>
                                            <li>Realização de operações fora do padrão de uso e desídia no atendimento de pedidos de envio de documentos para comprovação da sua regularidade.</li>
                                          </ul>

                                          <p className="font-weight-bold">LIMITES DE RESPONSABILIDADE</p>

                                          <p>
                                            Em nenhuma circunstância, a Facta, seus acionistas, funcionários, agentes, diretores, subsidiárias, afiliadas, sucessores, cessionários, fornecedores ou licenciadores serão responsáveis por quaisquer danos, ao Titular ou a terceiros, decorrentes de, entre outras, de responsabilidade exclusiva de terceiro ou do Titular:
                                          </p>

                                          <ul>
                                            <li>Uso incorreto ou irregular dos serviços disponibilizados via aplicativo e/ou do cartão físico;</li>
                                            <li>Transações regulares de qualquer operação de compra e venda junto a estabelecimentos; e</li>
                                            <li>Quedas de energia ou outras interrupções ou suspensões de serviços de internet, falhas técnicas de navegação, mau funcionamento de eletrônicos, falhas de software ou hardware que não estejam sob controle da Facta, outras falhas humanas provenientes de falha no processamento da informação por conta de falsidades ou fraudes do Titular.</li>
                                          </ul>
                                          <p>
                                            É de responsabilidade exclusiva do Titular, dentre outras:
                                          </p>
                                          <ul>
                                            <li>A veracidade, correção e completude das informações prestadas;</li>
                                            <li>A utilização lícita e regular dos serviços disponíveis;</li>
                                            <li>A realização de transações por meio da Conta de Pagamento;</li>
                                            <li>A emissão e/ou pagamento de boletos;</li>
                                            <li>Manter a segurança dos dispositivos de acesso às aplicações, valendo-se de ferramentas específicas para tanto, tais como antivírus, firewall, entre outras, de modo a contribuir a prevenção de riscos eletrônicos;</li>
                                            <li>Utilizar sistemas operacionais atualizados e eficientes para a plena utilização das aplicações; e</li>
                                            <li>Equipar-se e responsabilizar-se pelos dispositivos de hardware necessários para o acesso ao aplicativo, bem como pelo acesso à internet.</li>
                                          </ul>

                                          <p className="font-weight-bold">POLÍTICA DE PRIVACIDADE</p>

                                          <p>
                                            A Facta dá tratamento sigiloso e confidencial para todos os dados pessoais e operações do cliente, à exceção dos que, dada a sua natureza, para fins de registro, avaliação do risco de crédito e outras medidas pertinentes e necessárias à prestação dos serviços descritos nestes Termos e Condições de Uso. A Facta não guarda as informações coletadas e tratadas por tempo indeterminado e excluirá os dados que deixarem de ser pertinentes ou necessários e/ou houver revogação do consentimento do Titular e/ou por ato administrativo ou judicial competente nesse sentido.
                                          </p>
                                          <p>
                                            O Titular desde já dá autorização para:
                                          </p>

                                          <ul>
                                            <li>Coleta e tratamento de dados pessoais para trafegar nos websites, baixar o aplicativo, solicitar acesso e utilizar os serviços da Facta;</li>
                                            <li>Armazenamento e manutenção de informações e dados para garantia da confiabilidade dos serviços da Facta e cumprimento de determinações legais;</li>
                                            <li>Divulgação, compartilhamento e troca de informações pessoais com terceiros:</li>
                                            <li>Quando necessário às atividades comerciais contratadas e/ou para melhorar a experiência do Titular com os produtos e serviços oferecidos pela Conta de Pagamento, sem com garantido o resguardo e sigilo das informações compartilhadas nesse intuito;</li>
                                            <li>Proteção dos interesses da Facta em casos de conflitos, seja em demandas administrativas e/ou judiciais;</li>
                                            <li>Quando expressamente requisitada por ordem de autoridade administrativa ou judicial competente;</li>
                                            <li>Resguardo do compromisso de ética e transparência da Facta para com os órgãos e entes regulatórios, em caso de suspeita de fraudes ou outras condutas ilícitas;</li>
                                            <li>Inscrição devida em órgão de proteção ao crédito;</li>
                                            <li>Alterações societárias envolvendo a Facta, hipótese em que a transferência de dados será necessária à continuidade dos serviços.</li>
                                            <li>Verificação da autenticidade dos dados fornecidos no cadastro;</li>
                                            <li>Obtenção de informações em empresas de análise e proteção ao crédito;</li>
                                            <li>Consulta ao Sistema de Informação de Crédito (“SCR”) do Banco Central do Brasil, incluindo informações sobre operações de crédito de sua responsabilidade;</li>
                                            <li>Intercâmbio de informações com outras instituições financeiras;</li>
                                            <li>Inscrição de registro junto aos órgãos de proteção de crédito e ao SCR, em caso de inadimplemento de qualquer obrigação assumida.</li>
                                          </ul>

                                          <p className="font-weight-bold">DISPOSIÇÕES GERAIS</p>

                                          <p>
                                            Estes Termos e Condições de Uso não geram contrato de sociedade, franquia ou relação de trabalho entre o Titular e a Facta, seus profissionais, parceiros e/ou anunciantes. Na remota hipótese de qualquer disposição destes Termos e Condições de Uso seja considerada ilegal nula ou inexeqüível por qualquer razão, as disposições restantes não serão afetadas, permanecendo válidas e integralmente aplicáveis e exigíveis de parte a parte.
                                          </p>
                                          <p>
                                            O Titular declara ter lido compreendido e aceito o conteúdo deste documento, bem como ter ciência de todos os direitos e obrigações dele decorrentes. Atos de mera liberalidade das partes não alteram direitos, prerrogativas ou faculdades asseguradas nestes Termos e Condições de Uso ou na legislação aplicável, nem podem ser consideradas renúncias ou criações de novos dispositivos.
                                          </p>
                                          <p>
                                            Estes Termos e Condições de Uso devem ser interpretados de acordo com as leis do Brasil. Fica eleito o foro da Comarca de Porto Alegre/RS para dirimir quaisquer dúvidas oriundas advindas destes Termos e Condições de Uso.
                                          </p>


                                        </ModalBody>
                                        <ModalFooter>
                                          <Button color="secondary" onClick={this.toggleModalAbertura}>Fechar</Button>
                                        </ModalFooter>
                                      </Modal>

                                    </FormGroup>

                                  </Col>
                                </Row>

                                <Row>
                                  <Col xs="12" sm="12" xm="12" className="text-center">
                                    <Button onClick={this.toggleModalAbertura} className="btn-block font-weight-bold mt-2" color="outline-primary">Clique aqui para visualizar os Termos da Abertura de Conta</Button>
                                  </Col>
                                </Row>
                              </CardBody>
                            </Card>
                            </>
                          )
                          : null
                        }

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
                                    parseFloat(AF.VLRSEGURO !== '' && AF.VLRSEGURO !== null ? AF.VLRSEGURO : 0).toLocaleString('pt-BR', formatoValor)
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

export default CedulaFactaPoderJudiciario;
