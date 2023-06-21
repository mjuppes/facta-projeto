import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import Moment from "react-moment";
//import domtoimage from 'dom-to-image';
// import html2canvas from 'html2canvas';
/* ES6 */
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import {isMobile} from 'react-device-detect';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';

import DadosDaPropostaTemplate from '../../../DadosDaPropostaTemplate';
import DadosDaPropostaBlocoTemplate from '../../../DadosDaPropostaBlocoTemplate';
import DadosLimiteCreditoBlocoTemplate from '../../../DadosLimiteCreditoBlocoTemplate';

import DadosDaPropostaVinculadaTemplate from '../../../DadosDaPropostaVinculadaTemplate';
import DadosDoClienteTemplate from '../../../DadosDoClienteTemplate';
import DadosDoCorretorTemplate from '../../../DadosDoCorretorTemplate';
import TimelineProgresso from '../../TimelineProgresso';

class CedulaFactaInssRepLegal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeIn: true,
      timeout: 300,
      tipoPendencia: props.tipo,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      codigoAF64: this.props.match.params.propostaId,
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
      mdlLgPort: false,
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      corretoresRosa: [1525, 1488, 19564, 19790, 1501, 1408, 10760], // Corretores Irmãos do Dono... são tratados como Loja
      codigoNormativa: 0,
      erroPrintCCB : '',
      etapaFinal : false,
      vlrSeguro : 0
    };

    this.toggleModalAbertura = this.toggleModalAbertura.bind(this);
    this.toggleModalSeguro = this.toggleModalSeguro.bind(this);
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
      this.state.obj_banco = PRINCIPAL.BANCO;
      this.state.obj_contratos = PRINCIPAL.CONTRATOSREFIN;
      this.state.espBeneficio = PRINCIPAL.ESPECIEBENEFICIO;
      this.state.tipoOperacao = PRINCIPAL.TIPOOPERACAO;

      if (PRINCIPAL.DADOSTABELA !== undefined && PRINCIPAL.DADOSTABELA !== []) {
        this.state.codigoNormativa = PRINCIPAL.DADOSTABELA[0].CodigoNormativa;
      }

      this.state.aceitouSeguro = PRINCIPAL.VLRSEGURO !== undefined && parseFloat(PRINCIPAL.VLRSEGURO !== '' && PRINCIPAL.VLRSEGURO !== null ? PRINCIPAL.VLRSEGURO : 0) > 0 ? true : false;
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
        else if (PRINCIPAL.pendencia_valores_somente === true) {
          this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
          this.state.etapaFinal = true;
        }
      }
      else {
        //this.state.proximoLink = '/tipo-documento/'+this.props.match.params.propostaId; // Rota antiga para já tirar foto dos DOCS
        if (parseInt(this.state.tipoOperacao.Codigo) === 33 || parseInt(this.state.tipoOperacao.Codigo) === 36) {
          this.state.proximoLink = '/facta-inss-seguro/'+this.props.match.params.propostaId;
        } else {
          this.state.proximoLink = '/declaracao-de-residencia/'+this.props.match.params.propostaId;
        }
        console.log('Link: '+this.state.proximoLink);
      }

    }

    localStorage.setItem('@app-factafinanceira-formalizacao/dados_ccb/erro', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/print_ccb_1', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/print_ccb_2', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/dados_html_ccb', '');

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

  toggleModalPort() {
    this.setState({
      mdlLgPort: !this.state.mdlLgPort,
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

      this.setState({ fontSizeControle : '0.650rem' });
      var node = document.getElementById('ccbCliente');
      var timelineRemover = node.querySelector('#divTimeline');
      if (timelineRemover !== undefined && timelineRemover !== null) {
        timelineRemover.remove();
      }
      localStorage.setItem('@app-factafinanceira-formalizacao/dados_html_ccb', node.innerHTML);

      await htmlToImage.toPng(node)
      .then(function (dataUrl) {
        this.setState({base64Ccb : dataUrl})
        localStorage.setItem('@app-factafinanceira-formalizacao/print_ccb_2', dataUrl);
      }.bind(this))
      .catch(function (error) {
        console.error('oops, something went wrong! (Data)', JSON.stringify(error));
        localStorage.setItem('@app-factafinanceira-formalizacao/dados_ccb/erro', JSON.stringify(error.path));
      }).finally(async function (){

        if (this.state.etapaFinal === true) {
          const FormData = require('form-data');
          const axios = require('axios');
          const formData = new FormData();
          var averbador = parseInt(this.state.obj_proposta.Averbador);
          this.setState({ carregando: true });

          if (this.state.base64Ccb !== '' && this.state.base64Ccb !== undefined) {
            const blob_base64PrintCcb = await fetch(this.state.base64Ccb).then(res => res.blob());
            formData.append('PrintCCB', blob_base64PrintCcb);
          }

          let LOCALIZACOES = "";

          formData.set('proposta', atob(this.state.codigoAF64));

          formData.set('termo_datahora', this.state.dataHoraTermo);
          formData.set('termo_localizacao', this.state.geoTermo);

          LOCALIZACOES += "\r\nTERMO\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraTermo !== undefined && this.state.dataHoraTermo !== "" ? this.state.dataHoraTermo : "-") +"\r\n";
          LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoTermo !== undefined && this.state.geoTermo !== "" ? this.state.geoTermo : "-") +"\r\n";

          var dt_ccb = [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':');
          var geo_ccb = this.state.localizacaoCcb;
          formData.set('ccb_datahora', dt_ccb);
          formData.set('ccb_localizacao', geo_ccb);

          LOCALIZACOES += "\r\nCCB\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ dt_ccb +"\r\n";
          LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ geo_ccb +"\r\n";

          formData.set('assinatura_datahora', dt_ccb);
          formData.set('assinatura_localizacao', geo_ccb);

          LOCALIZACOES += "\r\nASSINATURA\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ dt_ccb +"\r\n";
          LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ geo_ccb +"\r\n";

          if (this.state.aceitouConsultaDataprev !== undefined && this.state.aceitouConsultaDataprev !== '') {
            formData.set('consultaDataprev_opcao', this.state.aceitouConsultaDataprev !== undefined ? (this.state.aceitouConsultaDataprev === true ? "S" : "N") : "");
            formData.set('consultaDataprev_datahora', this.state.dataHoraAceitouDataprev);

            LOCALIZACOES += "\r\nCONSULTA DATAPREV\r\n";
            LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraAceitouDataprev !== undefined && this.state.dataHoraAceitouDataprev !== "" ? this.state.dataHoraAceitouDataprev : "-") +"\r\n";
            LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aceitouConsultaDataprev !== undefined ? (this.state.aceitouConsultaDataprev === true ? "S" : "N") : "-") +"\r\n";
          }

          if (this.state.aceitouConta !== undefined && this.state.aceitouConta !== '') {
            formData.set('aberturaDeConta_opcao', this.state.aceitouConta !== undefined ? (this.state.aceitouConta === true ? "S" : "N") : "");
            formData.set('aberturaDeConta_datahora', this.state.dataHoraAceitouConta);

            LOCALIZACOES += "\r\nABERTURA DE CONTA\r\n";
            LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraAceitouConta !== undefined && this.state.dataHoraAceitouConta !== "" ? this.state.dataHoraAceitouConta : "-") +"\r\n";
            LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aceitouConta !== undefined ? (this.state.aceitouConta === true ? "S" : "N") : "-") +"\r\n";
          }

          if (this.state.aceitouSeguro !== undefined && this.state.aceitouSeguro !== '') {
            formData.set('valorSeguro_opcao', this.state.aceitouSeguro !== undefined ? (this.state.aceitouSeguro === true ? "S" : "N") : "");
            formData.set('valorSeguro_datahora', this.state.dataHoraAceitouSeguro);

            LOCALIZACOES += "\r\nSEGURO\r\n";
            LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraAceitouSeguro !== undefined && this.state.dataHoraAceitouSeguro !== "" ? this.state.dataHoraAceitouSeguro : "-") +"\r\n";
            LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aceitouSeguro !== undefined ? (this.state.aceitouSeguro === true ? "S" : "N") : "-") +"\r\n";
          }

          if (this.state.aceitouAutBoletos !== undefined && this.state.aceitouAutBoletos !== '') {
            formData.set('contaQuitacao_opcao', this.state.aceitouAutBoletos !== undefined ? (this.state.aceitouAutBoletos === true ? "S" : "N") : "");
            formData.set('contaQuitacao_datahora', this.state.dataHoraAceitouAutBoletos);

            LOCALIZACOES += "\r\nQUITAÇÃO\r\n";
            LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraAceitouAutBoletos !== undefined && this.state.dataHoraAceitouAutBoletos !== "" ? this.state.dataHoraAceitouAutBoletos : "-") +"\r\n";
            LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aceitouAutBoletos !== undefined ? (this.state.aceitouAutBoletos === true ? "S" : "N") : "-") +"\r\n";
          }

          if (this.state.aceitouAutTransferencia !== undefined && this.state.aceitouAutTransferencia !== '') {
            formData.set('contaTransferencias_opcao', this.state.aceitouAutTransferencia !== undefined ? (this.state.aceitouAutTransferencia === true ? "S" : "N") : "");
            formData.set('contaTransferencias_datahora', this.state.dataHoraAceitouAutTransferencia);

            LOCALIZACOES += "\r\nTRANSFERÊNCIAS\r\n";
            LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraAceitouAutTransferencia !== undefined && this.state.dataHoraAceitouAutTransferencia !== "" ? this.state.dataHoraAceitouAutTransferencia : "-") +"\r\n";
            LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aceitouAutTransferencia !== undefined ? (this.state.aceitouAutTransferencia === true ? "S" : "N") : "-") +"\r\n";
          }

          formData.set('codigoAtualizacao', 'AD3');
          formData.set('statusOcorrenciaAtualizar', this.state.obj_pendencias.statusOcorrenciaAtualizar);

          formData.set('cliente_cpf', this.state.cliente_cpf);
          formData.set('cliente_nascimento', this.state.cliente_nascimento);

          var informacoesDoDispositivo = "";

          informacoesDoDispositivo += "\r\nRESOLUÇÃO DE PENDÊNCIAS\r\n\r\n";
          informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
          informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
          informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
          informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
          informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;
          informacoesDoDispositivo += LOCALIZACOES;

          formData.set('infoDoDispositivo', informacoesDoDispositivo);
          formData.set('resolucaoPendencias', 1);
          formData.set('gerarNovaCcb', 1);
          formData.set('ambiente', "prod");

          await axios({
            method: 'post',
            //url: 'https://app.factafinanceira.com.br/proposta/app_react_atualizar_formalizacao',
            url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' }
          })
          .then(function (response) {
              this.setState({ carregando: false });
              alert("Proposta formalizada com sucesso!");
              this.props.history.push(this.state.proximoLink);
          }.bind(this))
          .catch(function (response) {
              //handle error
              this.setState({ carregando: false });
              alert("Erro ao realizar a formalização!");
          }.bind(this));

          return false;
        }
        else {

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
        }

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

                    <DadosDaPropostaTemplate proposta={AF} tipo_operacao={TIPO_OPERACAO} />

                    <DadosDoClienteTemplate cliente={this.state.obj_cliente} />

                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody className="text-left">
                        <h5 className="text-center pb-4 border-bottom border-light">Dados Funcionais</h5>
                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <label>Fonte Pagadora</label>
                            <p className="font-weight-bold">INSS</p>
                          </Col>
                          <Col xs="12" sm="12" xm="12">
                            <label>Nº do Benefício</label>
                            <p className="font-weight-bold">{ AF.MATRICULA }</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" sm="12" xm="12">
                            <label>Espécie</label>
                            <p className="font-weight-bold text-capitalize">{ this.state.obj_proposta !== [] && AF.TIPOBENEFICIO !== '' && this.state.espBeneficio[0] !== undefined ? AF.TIPOBENEFICIO + ' - ' + this.state.espBeneficio[0].NOME.toLowerCase() : ' - ' }</p>
                          </Col>
                        </Row>
                        {(parseInt(AF.Tipo_Operacao) === 35 || parseInt(AF.Tipo_Operacao) === 36 || parseInt(AF.Tipo_Operacao) === 40 || parseInt(AF.Tipo_Operacao) === 42) &&
                          <Row>
                            <Col xs="12" sm="12" xm="12">
                              <label>Nome Representante Legal</label>
                              <p className="font-weight-bold">{AF.NOME_REPRESENTANTE}</p>
                            </Col>
                            <Col xs="12" sm="12" xm="12">
                              <label>CPF Representante Legal</label>
                              <p className="font-weight-bold">{AF.CPF_REPRESENTANTE}</p>
                            </Col>
                          </Row>
                        }
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

                    <DadosLimiteCreditoBlocoTemplate proposta={AF} codigo_af ={atob(this.state.codigoAF64)} tipo_operacao={TIPO_OPERACAO} cod_tipo_operacao={COD_TP_OPERACAO}/>

                    { AF.DESBLOQUEAR_BENEFICIO === "S"
                      ? <>
                        <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                          <CardBody className="text-left">
                            <h5 className="text-center border-bottom border-light pb-3">Termo de Autorização de Desbloqueio de Benefício</h5>
                            <Row>
                              <Col xs="12" sm="12" xm="12">
                                <FormGroup check className="checkbox">
                                  <Input className="form-check-input" type="checkbox" id="checkbox1" name="autorizacao_dataprev" value="1" defaultChecked onChange={this.handleChange} />
                                  <Label check className="form-check-label" htmlFor="checkbox1">
                                    Eu <span className="font-weight-bold">{ this.state.obj_cliente.DESCRICAO }</span>, CPF <span className="font-weight-bold">{ this.state.obj_cliente.CPF }</span>,{' '}
                                    autorizo o INSS/DATAPREV a desbloquear o benefício <span className="font-weight-bold">{ AF.MATRICULA }</span>,{' '}
                                    para que seja possível realizar a contratação de empréstimo consignado ou cartão consignado de benefícios do INSS.
                                  </Label>
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        </>
                      : null
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
                    

                    { this.state.propostaINSS === true && parseInt(this.state.obj_proposta.Averbador) !== 10226
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

                          { AF.contaFactaFinanceira !== undefined && AF.contaFactaFinanceira.id !== undefined && parseInt(this.state.obj_proposta.Averbador) !== 10226
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

                        { AF.Tipo_Operacao === 17
                          ? (
                            <>
                              <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                <CardBody className="text-left">
                                  <h5 className="text-center border-bottom border-light pb-3">Autorização de Portabilidade de Crédito</h5>
                                  <Row>
                                    <Col xs="12" sm="12" xm="12">
                                      <FormGroup check className="checkbox">
                                        <Input className="form-check-input" type="checkbox" id="chkBoletos" name="autorizacao_boletos" value="1" defaultChecked onChange={this.handleChange} />
                                        <Label check className="form-check-label text-justify" htmlFor="chkBoletos">
                                          Eu, { this.state.obj_cliente.DESCRICAO }, <span className="font-weight-bold">AUTORIZO</span> e <span className="font-weight-bold">SOLICITO</span> que a <span className="font-weight-bold">FACTA FINANCEIRA S.A. CFI</span>, inscrita no CNPJ sob o n. 15.581.638/0001-30, sediada na Rua dos Andradas, n. 1409, 7º
                                          andar, em Porto Alegre/RS, CEP: 90020-022, ou qualquer instituição financeira adquirente desta operação, encaminhe à instituição credora original meu pedido de portabilidade, conforme os dados fornecidos por mim, e solicite a confirmação desses dados para efetivar a portabilidade.
                                        </Label>

                                        <Modal isOpen={this.state.mdlLgPort} toggle={this.toggleModalPort} className={'modal-lg ' + this.props.className}>
                                          <ModalHeader toggle={this.toggleModalPort}>TERMO DE REQUISIÇÃO PARA PORTABILIDADE DE CRÉDITO</ModalHeader>
                                          <ModalBody>

                                              <table className="table table-striped">
                                                <tr>
                                                  <td colSpan="2">
                                                    Nome do Cliente: <br />
                                                    <span className="font-weight-bold">{ this.state.obj_cliente.DESCRICAO }</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    CPF: <br />
                                                    <span className="font-weight-bold">{ this.state.obj_cliente.CPF }</span>
                                                  </td>
                                                  <td>
                                                    RG: <br />
                                                    <span className="font-weight-bold">{ this.state.obj_cliente.RG }</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    Data de nascimento: <br />
                                                    <span className="font-weight-bold"><Moment format="DD/MM/YYYY">{this.state.obj_cliente.DATANASCIMENTO}</Moment></span>
                                                  </td>
                                                  <td>
                                                    Telefone / Celular: <br />
                                                    <span className="font-weight-bold">{ this.state.obj_cliente.FONE !== "" ? this.state.obj_cliente.FONE : this.state.obj_cliente.CELULAR }</span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colSpan="2">
                                                    Nº do contrato Original: <br />
                                                    <span className="font-weight-bold">{ AF.DADOSPORTABILIDADE !== undefined ? AF.DADOSPORTABILIDADE.contrato : '-' }</span>
                                                  </td>
                                                </tr>
                                              </table>
                                              <p>
                                                1.	Autorizo e solicito que a Facta Financeira ou qualquer instituição financeira
                                                adquirente desta operação, encaminhe à instituição credora original meu pedido de
                                                portabilidade, conforme os dados fornecidos por mim, e solicite a confirmação desses
                                                dados para efetivar a portabilidade.
                                              </p>
                                              <p>
                                                2.	Caso haja divergência no valor da dívida fornecido por mim com os dados
                                                disponibilizados pela Credora Original, seja maior ou menor, eu autorizo, ainda,
                                                a Financeira ou qualquer instituição financeira adquirente desta operação a
                                                realizar a portabilidade no valor exato divulgado pela Instituição Credora Original,
                                                desde que respeitado o valor limite de crédito concedido a mim.
                                              </p>
                                              <p>
                                                3.	Autorizo que a portabilidade seja reduzida inclusive na hipótese de o valor da
                                                prestação da operação de crédito objeto da portabilidade na financeira ou qualquer
                                                instituição financeira adquirente desta operação, ser maior do que o valor da
                                                prestação na instituição Credora Original.
                                              </p>
                                              <p>
                                                4.	Se os valores informados pela Credora Original forem superiores ao valor
                                                limite de crédito, em caso de ausência ou insuficiência de margem consignável
                                                disponível ou se a operação a ser portada estiver em atraso perante a instituição
                                                credora original, estou ciente de que a financeira ou qualquer instituição
                                                financeira adquirente desta operação, cancelará este limite de crédito e a
                                                portabilidade dos contratos, no quadro acima não será realizada.
                                              </p>
                                              <p>
                                                5.	SCR e Informações Cadastrais: Autorizo a Financeira ou qualquer instituição
                                                financeira adquirente desta operação a consultar o sistema de informações de
                                                crédito (SCR) sobre eventuais informações ao meu respeito. Fico ciente de que
                                                meus dados serão registrados no SCR nos termos da regulamentação vigente.
                                              </p>

                                          </ModalBody>
                                          <ModalFooter>
                                            <Button color="secondary" onClick={this.toggleModalPort}>Fechar</Button>
                                          </ModalFooter>
                                        </Modal>

                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col xs="12" sm="12" xm="12" className="text-center">
                                      <Button onClick={this.toggleModalPort} className="btn-block font-weight-bold mt-2" color="outline-primary">Clique aqui para visualizar os Termos da Portabilidade</Button>
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
                                <Input className="form-check-input" type="radio" id="inline-radio1" name="rd_seguro_prestamista" value="1" onChange={this.handleChange} defaultChecked={this.state.aceitouSeguro} disabled={!this.state.aceitouSeguro} />
                                <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                              </FormGroup>
                              <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="inline-radio2" name="rd_seguro_prestamista" value="0" onChange={this.handleChange} defaultChecked={!this.state.aceitouSeguro} />
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
                                  { [13, 14, 18, 27].indexOf(parseInt(item_vinculadas.Tipo_Operacao)) !== -1
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





                    <Card className="border-white shadow" style={{borderRadius: '8px'}} id="bloco_DadosDaCcb">
                      <CardBody className="text-left">
                        <h5 className="text-center border-bottom border-light pb-3">A. DECLARAÇÕES E AUTORIZAÇÕES DO CLIENTE EMITENTE</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>
                              O cliente declara que, previamente à emissão desta cédula, recebeu informações detalhadas acerca dos valores e fluxos que compõe o CET máximo do seu empréstimo e, ainda, que tem ciência de que para este cálculo foi considerado o valor do limite de crédito e a taxa de juros máxima a ser aplicada no seu empréstimo, o qual será efetivado conforme condições previstas nesta cédula.
                            </p>

                            { AF.Tipo_Operacao === 2
                              ? (
                                <>
                                  <p className="text-dark font-weight-light">
                                     Empréstimos consignados: O cliente declara estar ciente de que o valor de
                                     <span className="font-weight-bold">R$ { AF.saldoDevedor } </span>
                                     se prestou a quitar dívida anterior e por mim reconhecida junto à <span className="font-weight-bold">Facta Financeira S.A</span>
                                     ou qualquer instituição financeira adquirente desta operação,
                                     referente ao(s)
                                     <span className="font-weight-bold">
                                      contrato(s)
                                      { AF.NUMERO_CONTRATO_REFIN }
                                    </span>.
                                  </p>
                                </>
                              )
                              : null
                            }

                            <p>
                            	1. Desta forma, o cliente promete pagar para Financeira ou qualquer instituição financeira adquirente desta operação, ou à sua ordem, o valor devido em decorrência desta cédula na forma e prazo aqui descritos e autoriza, de forma irrevogável e irretratável, a consignação das parcelas diretamente em sua folha de pagamento, benefício ou aposentadoria.
                            </p>
                            <p>
                            	2. Para facilitar o processo de averbação, o cliente concorda e autoriza que a Financeira, ou qualquer instituição financeira adquirente desta operação, solicite, em seu nome, à entidade consignante, a realização de todo e qualquer procedimento administrativo necessário à averbação desta operação, incluindo o desbloqueio de margem consignável. Eventuais credenciais fornecidas pelo cliente neste processo serão utilizadas exclusivamente para este fim.
                            </p>
                            <p>
                            	3. O cliente declara estar ciente de que, nos casos de limite contratado cuja concessão de crédito dependa de reajuste dos seus proventos, as análises cadastrais e de crédito, a serem realizadas pela financeira ou qualquer instituição financeira adquirente desta operação, bem como a verificação da existência de margem consignável e a averbação do empréstimo junto à sua entidade pagadora, somente serão realizados após a efetiva concessão do referido ajuste. Mesmo que este reajuste seja concedido, a efetiva concessão do empréstimo dependerá, ainda, das análises anteriormente mencionadas, motivo pelo qual o crédito poderá não ser concedido.
                            </p>
                            <p>
                            	4. Para comprovação de residência, sob as penas da lei (Art. 2° da lei 7.115/83), declaro que resido no endereço constante do comprovante de residência anexo a esta cédula ou, na ausência deste comprovante, no endereço descrito no quadro I acima. Declaro ainda, estar ciente de que a falsidade de presente declaração pode implicar em sanção penal prevista.
                            </p>
                            <p>
                            	5. O Emitente autoriza o credor a efetuar a liberação do valor empréstimo por meio de crédito em conta corrente própria ou de terceiros, por ele indicado, em caso de portabilidade de dívida na conta da instituição financeira credora da operação que está sendo portada. Em se tratando de empréstimo contratado mediante telefone, dispositivos móveis de comunicação (mobile), caixas eletrônicos, internet ou por correspondentes, poderá o cliente solicitar a desistência do empréstimo ora contratado no prazo de até 7 (sete) dias úteis a contar do recebimento da quantia emprestada, mediante restituição, à Financeira ou a qualquer instituição financeira adquirente desta operação, do valor total concedido acrescido de eventuais tributos e juros até a data de efetivação da devolução.
                            </p>
                            <p>
                            	6. O Emitente declara serem verdadeiras todas as informações prestadas, assim como está ciente dos termos e condições desta CCB, nos termos da Lei 10.931/04. Declara-se, ainda, ciente de que pode solicitar a qualquer momento, segunda via deste documento, bem como que a disponibilização da segunda via ensejará em cobrança conforme Tabela de serviços, disponibilizada no site da instituição financeira.
                            </p>
                            <p>
                            	<span className="font-weight-bold">7. SEGURO PRESTAMISTA:</span> O CREDOR disponibiliza ao EMITENTE, integrante do Grupo Segurável, a oferta do Microsseguro Prestamista. Para aceitá-la o EMITENTE deve manifestar a opção “sim” no campo próprio ou “não” caso não deseje contratar. Na hipótese de contratação do Microsseguro Prestamista pelo EMITENTE, integrante do Grupo Segurável, ao assinar a CCB, declara para todos os fins de direito que, teve o acesso prévio, ciência e concorda integralmente com os termos das Condições Gerais e Especiais do Microsseguro contratado, e autoriza, o CREDOR a divulgar as informações constantes desta Cédula de Crédito Bancário (CCB), bem como cópia da mesma à Seguradora.
                            </p>
                            <p>
                            	({ this.state.labelSeguroSim }) - SIM
                            </p>
                            <p>
                            	({ this.state.labelSeguroNao }) - NÃO
                            </p>
                            <p>
                            	<span className="font-weight-bold">Local e data</span>: <span className="font-weight-bold">{ this.state.obj_cliente.NOME_CIDADE }</span>, <span className="font-weight-bold">{ this.state.diaAtual }</span> de <span className="font-weight-bold">{ this.state.mesAtual.toUpperCase() } de { this.state.anoAtual }</span>.
                            </p>
                            <p>
                            	<span className="font-weight-bold">8. CLÁUSULA DO SEGURO PRESTAMISTA:</span> Caso o EMITENTE opte pela contratação do Microsseguro prestamista, conforme opção assinalada no item "SEGURO PRESTAMISTA" do preâmbulo, fica desde já consignado que o segurado (EMITENTE(s) terá(ão) direito à quitação do saldo devedor oriundo da presente Cédula, nos casos de morte natural ou acidental e de invalidez permanente total por acidente. 1º - O saldo devedor do empréstimo será apurado na data do sinistro, respeitadas as condições contratuais do Microsseguro; 2º - O prêmio e quaisquer outras despesas correrão por conta do(s) EMITENTE(S), ficando a CREDORA desde logo autorizada a debitar o valor correspondente ao prêmio do Microsseguro do valor financiado na presente Cédula; O(s) EMITENTE(S) declara(m) ter ciência e concorda(m) com todos os termos, regras e condições do seguro acima mencionado, inteiramente disciplinadas no Bilhete de Microsseguro.
                            </p>
                          </Col>
                        </Row>


                        <h5 className="text-center border-bottom border-light pb-3">B. SISTEMA DE INFORMAÇÕES DE CRÉDITO DO BANCO CENTRAL DO BRASIL (SCR)</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">

                            <p>
                              O cliente autoriza, a qualquer tempo, mesmo após o término deste contrato, a Financeira ou qualquer instituição financeira adquirente desta operação e as demais instituições aptas a consultar o SCR nos termos da regulamentação e que adquiram, recebam ou manifestem interesse em adquirir ou de receber em garantia, total ou parcialmente, operações de crédito de sua responsabilidade (“Instituições Autorizadas”), a consultarem no SCR informações a seu respeito.
                            </p>
                            <p>
                              O SCR é constituído por informações remetidas ao Banco Central do Brasil (BACEN) sobre operações de crédito, nos termos da regulamentação. A sua finalidade é prover ao BACEN informações para monitoramento do crédito no sistema financeiro e fiscalização, além de viabilizar o intercâmbio de informações entre instituições financeiras. O cliente está ciente de que as consultas ao SCR serão realizadas com base na presente autorização e que a Financeira ou qualquer instituições financeiras adquirentes desta operação poderão trocar entre si suas informações constantes do seu cadastro, inclusive entre as sociedades pertencentes ao conglomerado das instituições financeiras adquirentes desta operação.
                            </p>
                            <p>
                              O cliente declara, ainda, ciência de que os dados sobre o montante das suas dívidas a vencer e vencidas, inclusive em atraso e baixadas com prejuízo, bem como o valor das coobrigações que tenha assumido e das garantias que tenha prestado serão fornecidos ao BACEN e registrados no SCR, valendo essa declaração como comunicação prévia desses registros.
                            </p>
                            <p>
                              O cliente poderá ter acesso, a qualquer tempo, aos seus dados no SCR pelos meios disponibilizados pelo BACEN, inclusive seu site e, em caso de divergência, pedir sua correção, exclusão ou registro de manifestação de discordância, bem como cadastramento de medidas judiciais, mediante solicitação à central de atendimento da instituição que efetivou o registro dos dados no SCR.
                            </p>

                          </Col>
                        </Row>

                        <h5 className="text-center border-bottom border-light pb-3">C. ENVIO DE SMS E CORRESPONDÊNCIA ELETRÔNICA</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>
                              Como forma de manter o cliente informado sobre o empréstimo, bem como produtos e serviços de seu interesse da Financeira ou quaisquer instituições financeiras adquirentes desta operação, o cliente autoriza o envio de SMS e e- mails, inclusive para envio de boletos e cópia de contratos, a qualquer tempo, mesmo após a extinção desta operação. O cliente poderá cancelar essa autorização a qualquer momento entrando em contato com a Financeira ou qualquer instituição financeira adquirentes desta operação. Lembre-se: O cliente deverá manter seus dados cadastrais sempre atualizados. Isso ajuda a Financeira ou qualquer instituição financeira adquirente desta operação a entrar em contato com o cliente e passar informações sobre a sua operação sempre que for necessário. Para atualizar os dados, ou em caso de dúvidas, o cliente deverá contatar a Financeira ou qualquer instituição financeira adquirente desta operação.
                            </p>
                          </Col>
                        </Row>

                        <h5 className="text-center border-bottom border-light pb-3">D. CONDIÇÕES GERAIS DA CÉDULA DE CRÉDITO BANCÁRIO</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>
                            	Estas são as condições gerais do seu limite de crédito para empréstimo com desconto em folha de pagamento. Leia atentamente e, em caso de dúvidas, consulte os canais de atendimento: Uso consciente do crédito: Evite endividar-se. Realize a contratação de empréstimos sempre de acordo com suas condições financeiras, sem comprometer o seu orçamento ou de sua família.
                            </p>
                            <p>
                            	<span className="font-weight-bold">Crédito consignado:</span> O crédito consignado é um empréstimo com parcelas descontadas diretamente da folha de pagamento ou do seu benefício / aposentadoria. É condição imprescindível para a efetivação da contratação a confirmação da sua margem consignável pelo empregador ou entidade pagadora.
                            </p>
                            <p>
                            	<span className="font-weight-bold">Valor do limite de crédito:</span> A Financeira ou qualquer instituição financeira adquirente desta operação concederá ao cliente um limite de crédito de utilização única até o valor indicado nesta cédula. Todas as informações financeiras preenchidas nesta cédula e fornecidas previamente e no ato da contratação foram calculadas com base no valor do limite de crédito (valor máximo a ser emprestado) dependerá das condições previstas nesta cédula. Assim, em caso de aprovação da operação, após determinação do valor do empréstimo, os dados financeiros efetivos serão informados ao cliente.
                            </p>
                          </Col>
                        </Row>

                        <h5 className="text-center border-bottom border-light pb-3">E. PARÂMETROS PARA DETERMINAÇÃO DO VALOR DO EMPRÉSTIMO</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">

                            <p>
                              <span className="font-weight-bold">1. O cliente autoriza o banco a efetivar a contratação de um empréstimo</span> liberando ao cliente maior valor possível, até o valor do limite de crédito, considerando a existência e o valor da sua margem consignável disponível.
                            </p>
                            <p>
                              <span className="font-weight-bold">2. Margem consignável disponível:</span> Em caso de ausência ou insuficiência de margem consignável, esta contratação poderá ser cancelada ou o valor do empréstimo poderá ser inferior ao valor do limite de crédito, de forma que o valor das parcelas se adéqüe à margem disponível, o que gerará um valor emprestado menor e, por conseqüência, um valor liberado ao c l i ent e inferior ao valor liberado máximo. Neste caso, a F inanceira ou qualquer instituição financeira adquirente desta operação averbará a parcela conforme a disponibilidade verificada e informará os dados financeiros finais do empréstimo. Em caso de dúvida ou para consultar as informações atualizadas do empréstimo você poderá utilizar os canais de atendimento informados.
                            </p>
                            <p>
                              <span className="font-weight-bold">3. Taxa máxima de juros:</span> A taxa máxima de juros informada nesta cédula poderá variar sempre para menor, quando da efetivação do seu empréstimo, que dependerá da data de averbação junto à entidade pagadora e da data de fechamento da folha de pagamento e conseqüentemente pagamento da primeira parcela do empréstimo. A taxa de juros efetiva será informada ao cliente juntamente com os demais dados financeiros finais do empréstimo calculados com base no valor do empréstimo efetivamente concedido pela Financeira ou qualquer instituição financeira adquirente desta operação.
                            </p>
                            <p>
                              <span className="font-weight-bold">4. Cálculo do IOF – Importante:</span> Na primeira concessão, o IOF máximo é calculado considerando a utilização integral do valor limite de crédito solicitado no momento da contratação. O IOF efetivo será calculado com base no valor do empréstimo. No refinanciamento, o IOF máximo é calculado com base no valor liberado máximo e o IOF efetivo será calculado com base no valor liberado efetivo. Se o contrato refinanciado pelo cliente for inferior a um ano, poderá ser cobrado o IOF complementar sobre o saldo refinanciado. Neste caso, o IOF complementar também integrará o IOF máximo. Eventual diferença entre os valores do IOF apurados poderá ser compensada do valor liberado ao cliente.
                            </p>
                            <p>
                              <span className="font-weight-bold">5. Custo Efetivo Total – CET máximo e CET do seu empréstimo:</span> O CET é o custo total do empréstimo, expresso na forma de taxa percentual. Para o cálculo do CET máximo são considerados o valor do limite de crédito, o número de parcelas a pagar e a data de pagamento de cada uma, o prazo do empréstimo, a taxa de juros máxima, o IOF máximo e as demais despesas previstas na data desta contratação. Para apuração do CET do empréstimo será considerado o valor do empréstimo, o número de parcelas a pagar e a data de pagamento de cada uma, o prazo do empréstimo, a taxa de juros efetivo, o IOF efetivo e as demais despesas do seu empréstimo apurados após a averbação junto à sua margem disponível, conforme critérios previstos nestas condições gerais. Assim, o cliente receberá as informações sobre o CET máximo previamente à contratação deste empréstimo.
                            </p>
                            <p>
                              <span className="font-weight-bold">6. Como ocorre o pagamento do empréstimo:</span> O cliente se compromete pagar a F inanceira ou qualquer instituição financeira adquirente desta operação o valor do empréstimo, acrescido de juros remuneratórios, capitalizados mensalmente, à taxa de juros efetiva indicada nesta cédula, que será convertida em uma taxa diária, considerando um mês de 30 dias, na quantidade de parcelas, valores e data de vencimento indicados nesta cédula e conforme calculo demonstrado em planilha apurada nos termos da legislação aplicável. A parcela devida será utilizada, em primeiro lugar, para liquidar a integralidade dos juros incorridos e o saldo será aplicado para amortizar o saldo devedor.
                            </p>
                            <p>
                              <span className="font-weight-bold">7. Forma de pagamento:</span> O pagamento do valor do empréstimo será realizado por meio de descontos mensais em folha de pagamento, no valor necessário à quitação de cada parcela, até a quitação total. Se, após a averbação da operação, a margem consignável disponível se tornar insuficiente para a consignação integral da parcela contratada, o valor das parcelas a vencer poderá ser consignado parcialmente, readequando-o à margem consignável disponível, Neste caso, o número de parcelas será adequado para que o saldo devedor seja quitado mediante ao pagamento do novo valor.
                            </p>

                            <p className="text-dark font-weight-bold ml-1">CONSIDERANDO QUE</p>

                            <p>
                              <span className="font-weight-bold">(a)</span> Caso não seja possível o desconto mensal na folha de pagamento, inclusive nos casos de falta ou insuficiência de margem consignável, o cliente deverá:
                            </p>
                            <p>
                              (i) pagar as parcelas devidas diretamente a Financeira ou qualquer instituição financeira adquirente desta operação por meio de boleto bancário;
                            </p>
                            <p>
                              (ii) verificar com a Financeira ou qualquer instituição financeira adquirente desta operação a possibilidade de reprogramar o pagamento; ou
                            </p>
                            <p>
                              (iii) pagar as parcelas mediante débito realizado em qualquer conta de sua titularidade, preferencialmente naquela indicada para crédito do valor contratado. Para tanto, resta autorizado a Financeira, ou qualquer instituição financeira adquirente desta operação a terem acesso às suas informações bancárias, nos termos do Artigo 1º, §3º da Lei Complementar 105/01, de forma a não configurar quebra de sigilo bancário.
                            </p>
                            <p>
                              <span className="font-weight-bold">8.	Atraso no pagamento:</span> Em caso de atraso no pagamento de quaisquer das parcelas ou ocorrer o vencimento antecipado do empréstimo, serão devidos sobre os valores em atraso: juros remuneratórios do período, acrescidos de juros moratórios de 1% ao mês, desde o atraso até a data do efetivo pagamento, e multa de 2% sobre o valor devido.
                            </p>
                            <p>
                              Se não for possível o desconto da parcela diretamente do salário, ou débito em conta, a Financeira ou qualquer instituição financeira adquirente desta operação, poderá em determinadas situações e de forma a não gerar prejuízo, prorrogar o vencimento das parcelas seguintes proporcionalmente ao período de atraso a fim de viabilizar o pagamento do empréstimo nas mesmas condições originalmente pactuadas. Em caso de atraso, o cliente está ciente de que terá seu nome inscrito no SPC, SERASA ou em outro órgão encarregado de cadastrar atraso no pagamento.
                            </p>
                            <p>
                              <span className="font-weight-bold">9.	Liquidação antecipada:</span> O emitente poderá liquidar antecipadamente o empréstimo mediante redução proporcional de juros calculada pela aplicação da taxa de desconto, igual à taxa de juros aqui convencionada pelas partes, sobre o saldo devedor decorrente desta cédula.
                            </p>
                            <p>
                              <span className="font-weight-bold">10.	Pagamento de Parcelas em Duplicidade:</span>
                            </p>
                            <p>
                              (i) Se o cliente fizer algum pagamento diretamente a Financeira ou qualquer instituição financeira adquirente desta operação, mas tenha ocorrido desconto em sua remuneração gerando pagamento em duplicidade, a Financeira ou qualquer instituição financeira adquirente desta operação poderá restituir o valor mediante crédito em conta-corrente, conta-poupança ou quaisquer outros produtos de sua titularidade mantidos na nestas instituições.
                            </p>
                            <p>
                              (ii) Caso o cliente possua parcelas vencidas e não pagas, para evitar a incidência de juros, a Financeira ou qualquer instituição financeira adquirente desta operação utilizará esse valor para amortizar qualquer saldo em atraso, deste ou de qualquer outro empréstimo que tenha com a Financeira ou qualquer instituição financeira adquirente desta operação.
                            </p>
                            <p>
                              (iii) Se o valor em atraso for inferior ao pago em duplicidade, a Financeira ou qualquer instituição financeira adquirente desta operação, restituirá ao cliente a diferença conforme descrito acima.
                            </p>
                            <p>
                              11.	Seus principais direitos:
                            </p>
                            <p>
                              (i) Quitar antecipadamente a dívida, com redução proporcional de juros;
                            </p>
                            <p>
                              (ii) obter informações de seu empréstimo, inclusive de eventual cessão ou endosso a terceiro;
                            </p>
                            <p>
                              (iii) solicitar a qualquer momento, uma segunda via deste documento;
                            </p>
                            <p>
                              (iv) solicitar transferência de sua divida (portabilidade) para outra instituição de sua preferência;
                            </p>
                            <p>
                              (v) ressarcimento de parcelas pagas em duplicidade.
                            </p>

                          </Col>
                        </Row>

                        <h5 className="text-center border-bottom border-light pb-3">F. DIREITOS DA FINANCEIRA OU QUALQUER INSTITUIÇÃO FINANCEIRA ADQUIRENTE DESTA OPERAÇÃO</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">
                            <p>1. Cobrar todas as despesas da cobrança judicial ou administrativa dos valores em atraso, incluindo custos de postagem de carta de cobrança, cobrança telefônica, inclusão de dados no cadastro de proteção ao crédito e custas de honorários advocatícios;</p>
                            <p>(i) Em caso de liquidação espontânea, sem ter havido qualquer ato de cobrança, não será devolvido nenhum tipo de ressarcimento de custo;</p>
                            <p>(ii) Endossar ou ceder esta cédula, total ou parcialmente;</p>
                            <p>(iii) exigir pagamento imediato em caso de não cumprimento do cliente com suas obrigações, com a suspensão da consignação das parcelas ou demais penalidades conforme previstas em lei;</p>
                            <p>(iv) utilizar, em caso de desoneração ou rescisão do seu contrato de trabalho, as suas verbas rescisórias para liquidação total ou parcial da dívida, observando limites legais;</p>
                            <p>(v) Realizar a compensação de saldo devedor do empréstimo com eventuais créditos que o cliente tenha na Financeira ou qualquer instituição financeira adquirente desta operação, decorrentes de depósitos à vista ou a prazo, ou aplicação financeira em valor suficiente para a liquidação do saldo devedor.</p>
                            <p>2. Da Cessão: O credor poderá emitir Certificado de Cédulas de Crédito Bancários – CCCB com lastro nesta Cédula e negociá-lo livremente no mercado, bem como transferir esta Cédula por endosso ou ceder a terceiros, no todo ou em parte, os direitos destas decorrentes, independentemente de qualquer aviso ou autorização de qualquer espécie.</p>
                            <p><span className="font-weight-bold">DECLARAÇÃO:</span> Responsabilizo-me pela exatidão e veracidade das informações e documentos apresentados, bem como declaro conhecer e respeitar as disposições das leis citadas a seguir, sob pena de aplicação das sanções nelas previstas: Lei nº 9.613/98, Lei 12.683/12, e disposições do Código Penal que dispõem sobre os crimes de “Lavagem de Dinheiro” e demais normas e regulamentações aplicáveis.</p>
                            <p>Declaro, ainda, que são lícitas as origens de meu patrimônio, renda e/ou faturamento e concordo que a Financeira ou qualquer instituição financeira adquirente desta operação poderá solicitar informações sobre a minha capacidade financeira, fato relacionado às cessões realizadas nos termos deste Contrato ou aos CRÉDITOS que viole referidas normas atividade econômica, operações realizadas e serviços contratados, com o objetivo de atender à legislação relativa às práticas de combate aos crimes de lavagem de dinheiro, Lei nº 12.846/13, que dispõe sobre atos de corrupção e lesivos contra a administração pública nacional e estrangeira e outras normas correlatas.</p>
                            <p>(i) O Emitente declara conhecer as normas do Banco Central do Brasil, que dispõe sobre os crimes de lavagem de dinheiro e as suas obrigações;</p>
                            <p>(ii) comunicar formalmente qualquer mudança de propósito e natureza da relação de negócios com a FACTA;</p>
                            <p>(iii) não participar direta ou indiretamente, com quaisquer formas de trabalho escravo e infantil, ou práticas danosa ao meio ambiente;</p>
                            <p>(iv) serem verdadeiras todas as informações prestadas,</p>
                            <p>(v) assim como está ciente de todos os termos e condições desta CCB, responsabilizando-se ainda sim</p>
                          </Col>
                        </Row>

                        <Row className="mb-3 mt-3">
                          <Col xs="12" sm="12">
                              { this.state.clicou  ?
                                <LayoutFactaCarregando />
                              :
                                <div>
                                  <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={this.salvaImgCcb} disabled={this.state.clicou}>
                                    { this.state.etapaFinal === true
                                      ? <><strong>Concordo com os termos!</strong> <br />Confirmar assinatura</>
                                      : <>Eu <strong>li</strong> e <strong>aceito</strong> os termos</>
                                    }
                                  </Button>
                                </div>
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

export default CedulaFactaInssRepLegal;
