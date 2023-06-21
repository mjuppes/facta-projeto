import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';

//import domtoimage from 'dom-to-image';
// import html2canvas from 'html2canvas';
/* ES6 */
import * as htmlToImage from 'html-to-image';
import {isMobile} from 'react-device-detect';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';
import TimelineProgresso from '../../TimelineProgresso';

class FactaSeguroInss extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      fadeIn: true,
      timeout: 300,
      tipoPendencia: props.tipo,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      codigoAF64: this.props.match.params.propostaId,
      codigoAF:  atob(this.props.match.params.propostaId),
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      propostaINSS: true,
      base64Ccb: '',
      base64CcbTermos : '',
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
      mdlLgSeguroPerm: false,
      mdlLgPort: false,
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      corretoresRosa: [1525, 1488, 19564, 19790, 1501, 1408, 10760], // Corretores Irmãos do Dono... são tratados como Loja
      codigoNormativa: 0,
      erroPrintCCB : '',
      etapaFinal : false,
      vlrSeguro : 0,
      showCCB: false
    };

    this.toggleModalAbertura = this.toggleModalAbertura.bind(this);
    this.toggleModalSeguro = this.toggleModalSeguro.bind(this);
    this.toggleModalSeguroPerm = this.toggleModalSeguroPerm.bind(this);
    this.toggleModalPort = this.toggleModalPort.bind(this);

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
      this.state.obj_corretor = [];
      this.state.obj_cliente = [];
      this.state.obj_banco = [];
      this.state.obj_contratos = [];
      this.state.obj_vinculadas = [];
      return false;
    }
    else {

      var _state = this.props.location.state;

      var PRINCIPAL = _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias : _state.obj_proposta;

      this.state.obj_proposta = _state.obj_proposta;
      this.state.obj_vinculadas = _state.obj_proposta.PROPOSTA_VINCULADA;

      let PROPOSTAS_VINCULADAS = this.state.obj_vinculadas;

      this.state.obj_corretor = PRINCIPAL.CORRETOR;
      this.state.obj_cliente = PRINCIPAL.CLIENTE;
      this.state.obj_banco = "";//PRINCIPAL.BANCO;
      this.state.obj_contratos = PRINCIPAL.CONTRATOSREFIN;
      this.state.espBeneficio = PRINCIPAL.ESPECIEBENEFICIO;
      this.state.tipoOperacao = PRINCIPAL.TIPOOPERACAO;

      if (PRINCIPAL.DADOSTABELA !== undefined && PRINCIPAL.DADOSTABELA !== [] && PRINCIPAL.DADOSTABELA.length !== 0) {
        this.state.codigoNormativa = PRINCIPAL.DADOSTABELA[0].CodigoNormativa;
      }

      console.log(PRINCIPAL);

      this.state.aceitouSeguro = _state.aceitouSeguro;
      this.state.vlrSeguro = PRINCIPAL.VLRSEGURO !== undefined && parseFloat(PRINCIPAL.VLRSEGURO !== '' && PRINCIPAL.VLRSEGURO !== null ? PRINCIPAL.VLRSEGURO : 0) > 0 ? PRINCIPAL.VLRSEGURO : 0;
      if (PROPOSTAS_VINCULADAS !== null && PROPOSTAS_VINCULADAS!== undefined) {
        Object.values(PROPOSTAS_VINCULADAS).forEach((item, i) => {
            if (item.VLRSEGURO !== undefined && parseFloat(item.VLRSEGURO !== '' && item.VLRSEGURO !== null ? item.VLRSEGURO : 0) > 0 ) {
              this.state.aceitouSeguro = true;
            }
        });
      }

      if (this.state.aceitouSeguro === false) {
        this.state.labelSeguroSim = '';
        this.state.labelSeguroNao = 'X';
      }

      this.state.dataHoraPrimeiraTela = _state.dataHoraPrimeiraTela !== undefined ? _state.dataHoraPrimeiraTela : '';
      this.state.geoInicial = _state.geoInicial !== undefined ? _state.geoInicial : '';

      this.state.dataHoraTermo = _state.dataHoraTermo !== undefined ? _state.dataHoraTermo : '';
      this.state.geoTermo = _state.geoTermo !== undefined ? _state.geoTermo : '';

      if (_state.obj_pendencias !== undefined && _state.obj_pendencias.length != 0) {

        this.state.homeLink = '/'+this.state.tipoPendencia+'/'+this.props.match.params.propostaId;
        this.state.tipoFormalizacao = 'pendencias';
        this.state.obj_pendencias = _state.obj_pendencias;
        if (PRINCIPAL.pendencia_de_documentos === true) {
          this.state.proximoLink = '/'+this.state.tipoPendencia+'-tipo-documento/'+this.props.match.params.propostaId;
        }
        else if (PRINCIPAL.pendencia_de_selfie === true) {
          this.state.proximoLink = '/'+this.state.tipoPendencia+'-selfie/'+this.props.match.params.propostaId;
        }
        else if (PRINCIPAL.pendencia_valores_somente === true) {
          this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
          this.state.etapaFinal = true;
        }
        else if (PRINCIPAL.pendencia_de_valores === true) {
          this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
          this.state.etapaFinal = true;
        }
        
      }
      else {
        this.state.proximoLink = '/declaracao-de-residencia/'+this.props.match.params.propostaId;
      }
    }

    localStorage.setItem('@app-factafinanceira-formalizacao/dados_ccb/erro', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/print_ccb_1', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/print_ccb_2', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/dados_html_fgts_ccb', '');

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

  toggleModalSeguroPerm() {
    this.setState({
      mdlLgSeguroPerm: !this.state.mdlLgSeguroPerm,
    });
  }

  toggleModalPort() {
    this.setState({
      mdlLgPort: !this.state.mdlLgPort,
    });
  }

  salvaImgCcb = async () => {
    this.setState({clicou: true});
    let corretor = this.state.obj_proposta.CORRETOR;

    this.setState({ fontSizeControle : '0.650rem' });
    var node = document.getElementById('ccbFgtsCliente');
    var timelineRemover = node.querySelector('#divTimeline');
    if (timelineRemover !== undefined && timelineRemover !== null) {
      timelineRemover.remove();
    }

    localStorage.setItem('@app-factafinanceira-formalizacao/dados_html_fgts_ccb', node.innerHTML);

    await htmlToImage.toPng(node)
    .then(function (dataUrl) {
      this.setState({base64Ccb : dataUrl})
      localStorage.setItem('@app-factafinanceira-formalizacao/print_ccb_2', dataUrl);
    }.bind(this))
    .catch(function (error) {
      console.error('oops, something went wrong! (Data)', JSON.stringify(error));
      localStorage.setItem('@app-factafinanceira-formalizacao/dados_ccb/erro', JSON.stringify(error.path));
    }).finally(async function (){

        this.props.history.push({
          pathname: this.state.proximoLink,
          search: '',
          state: {
            navegacao: true,
            base64Ccb: this.state.base64Ccb,
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

            aceitouConta: this.state.aceitouConta,
            dataHoraAceitouConta: this.state.dataHoraAceitouConta,

            aceitouAutTransferencia: this.state.aceitouAutTransferencia,
            dataHoraAceitouAutTransferencia: this.state.dataHoraAceitouAutTransferencia,

            aceitouAutBoletos: this.state.aceitouAutBoletos,
            dataHoraAceitouAutBoletos: this.state.dataHoraAceitouAutBoletos,
            base64Ccb: this.state.base64Ccb,
            base64CcbTermos: this.state.base64CcbTermos,
            obj_pendencias: this.state.obj_pendencias,
            tipoFormalizacao: this.state.tipoFormalizacao
          }
        });

    }.bind(this));
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

    const iconWarning = {
      "color" : "red"
    }

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }

    // Variáveis da AF principal
    if (this.state.obj_proposta !== undefined) {
      var AF =  this.state.obj_proposta;
      var COD_TP_OPERACAO = parseInt(this.state.obj_proposta.Tipo_Operacao);
      var TIPO_OPERACAO = this.state.tipoOperacao !== undefined ? this.state.tipoOperacao.nome : '';
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} >

      { this.state.carregando
        ? <LayoutFactaCarregando />
        : ( this.state.permissaoLocalizacao === true
          ?
            <>
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop} id="ccbFgtsCliente">

                <LayoutFactaHeader />

                <Row className="mt-6">

                  { isMobile === false
                    ? <>
                        <Col md="5" style={{ 'position' : 'relative' }} id="divTimeline">
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
                  {
                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody className="text-left">
                          <div className='text-center'>
                            <img src={ require('../../../assets/img/ass_seguradora_1024.png') } alt="Logo Facta Seguradora" style={{ maxWidth: '256px' }}/>
                          </div>
                          
                          <Row>
                              <Col xs="12" sm="12" xm="12">
                                <h5 className="text-center border-bottom border-light pb-3"><font className="font-weight-bold">SEGURO DE VIDA BENEFÍCIO GRATUITO</font></h5>
                              </Col>
                            </Row>
                          <Row>
                          <Col xs="12" sm="12" xm="12">
                              <label>Benefícios:</label>
                              <p> <font className="font-weight-bold">- Morte natural e acidental:</font> Até R$ 2.000,00. </p>
                              <p> <font className="font-weight-bold">- Auxílio Funeral ou Assistência Funeral:</font> Até R$ 2.000,00. </p>
                              <p> <font className="font-weight-bold">- Desconto em farmácias</font></p>
                          </Col>
                          </Row>

                          <Row>
                          <Col xs="12" sm="12" xm="12">
                              <label>Apólice Nº</label>
                              <p className="font-weight-bold"> - </p>
                          </Col>
                          </Row>

                          <Row>
                          <Col xs="12" sm="12" xm="12">
                              <label>Razão Social</label>
                              <p className="font-weight-bold">FACTA SEGURADORA S/A SEGURADORA</p>
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

                          {this.state.aceitouSeguro === false &&
                          <Row className="mb-3 mt-3">
                            <Col xs="12" sm="12">
                                { this.state.clicou  ?
                                  <LayoutFactaCarregando />
                                :
                                  <div>
                                    <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={this.salvaImgCcb} disabled={this.state.clicou}>
                                    Eu <strong>li</strong> e <strong>aceito</strong> os termos
                                    </Button>
                                  </div>
                                }
                            </Col>
                          </Row>
                          }
                      </CardBody>
                    </Card>
                    
                    
                  }

                  {this.state.aceitouSeguro === true &&
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                        <CardBody className="text-left">
                          <h5 className="text-center border-bottom border-light pb-3 font-weight-bold">SEGURO PRESTAMISTA</h5>
                          <Row>
                            <Col xs="12" sm="12" xm="12">
                              <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="inline-radio1" name="rd_seguro_prestamista" value="1" onChange={this.handleChange} defaultChecked={this.state.aceitouSeguro} disabled={!this.state.aceitouSeguro} />
                                <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                              </FormGroup>
                              <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="inline-radio2" name="rd_seguro_prestamista" value="0" disabled />
                                <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                                <Col xs="12" sm="12" xm="12">
                                <label>Prêmio</label>
                                  <p className="font-weight-bold">
                                  {
                                     parseFloat(AF.VLRSEGURO).toLocaleString('pt-BR', formatoValor)
                                  }
                                  </p>

                                </Col>
                          </Row>


                          <Row>
                            <Col xs="12" sm="12" xm="12">
                              <label>Apólice Nº</label>
                              <p className="font-weight-bold"> - </p>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs="12" sm="12" xm="12">
                              <label>Razão Social</label>
                              <p className="font-weight-bold">FACTA SEGURADORA S/A SEGURADORA</p>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs="12" sm="12" xm="12">
                              <label>SUSEPE Nº</label>
                              <p className="font-weight-bold">15414.99999/2019-99</p>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs="12" sm="12" xm="12">
                              <p className="font-weight-bold">Obs: Descontado uma única vez na fatura do Cartão Benefício.</p>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs="12" sm="12" xm="12" className="text-center">
                              <Button onClick={this.toggleModalSeguroPerm} className="btn-block font-weight-bold mt-2" color="outline-primary">Visualizar o bilhete do seguro</Button>
                            </Col>
                          </Row>



                          {this.state.aceitouSeguro === true &&
                          <Row className="mb-3 mt-3">
                            <Col xs="12" sm="12">
                                { this.state.clicou  ?
                                  <LayoutFactaCarregando />
                                :
                                  <div>
                                    <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={this.salvaImgCcb} disabled={this.state.clicou}>
                                    Eu <strong>li</strong> e <strong>aceito</strong> os termos
                                    </Button>
                                  </div>
                                }
                            </Col>
                          </Row>
                          }

                        </CardBody>
                      </Card>
                  }
                </Col>

              </Row>
            </Col>

           { <Modal isOpen={this.state.mdlLgSeguro} toggle={this.toggleModalSeguro} className={'modal-lg ' + this.props.className}>
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
            </Modal>}



            <Modal isOpen={this.state.mdlLgSeguroPerm} toggle={this.toggleModalSeguroPerm} className={'modal-lg ' + this.props.className}>
                        <ModalHeader toggle={this.toggleModalSeguroPerm}>
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
        : <PaginaMensagemLocalizacao />
        )
      }
      </div>
    );
  }
}

export default FactaSeguroInss;
