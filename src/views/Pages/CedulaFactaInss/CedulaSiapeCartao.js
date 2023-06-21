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

class CedulaFactaInssCartao extends Component {

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
        this.state.proximoLink = '/facta-inss-seguro/'+this.props.match.params.propostaId;
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


  async componentDidMount () {
    this.setState({ carregando : false });
    setTimeout( () => {window.scrollTo(0, 3)}, 100);

    const getCoords = async () => {
      try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          return {
            long: pos.coords.longitude,
            lat: pos.coords.latitude,
          };
      } catch (err) {
        this.setState({ permissaoLocalizacao: false });
      }
    };

    const coords = await getCoords();

    this.setState({ localizacaoCcb: "https://www.google.com/maps/place/" + coords.lat + "," + coords.long, permissaoLocalizacao: true });

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

                    <DadosDaPropostaTemplate proposta={AF} tipo_operacao={TIPO_OPERACAO} isCtrInss = {true}/>

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

                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                      <CardBody className="text-left">
                        <h5 className="text-center border-bottom border-light pb-3 font-weight-bold"><i className="fa fa-warning" style={iconWarning}></i>  ATENÇÃO <i className="fa fa-warning red-color" style={iconWarning}></i></h5>
                        <Col xs="12" sm="12" xm="12">
                          <Label check className="form-check-label text-justify">
                          A Facta NÃO solicita valores antecipados ou quaisquer tipo de pagamentos/transferências para contas que não sejam de titularidade da FACTA FINANCEIRA com CNPJ de inscrição. Antes de realizar depósitos ou pagamentos, entre em contato conosco  0800.9420462 ou 5131917318.
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
                        <h5 className="text-center border-bottom border-light pb-3">PROPOSTA DE ADESÃO</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">

                            <p>
                                1. A FACTA compromete-se a entregar ao CLIENTE um CARTÃO DE CRÉDITO, por meio do qual poderá realizar compras parceladas ou saques.
                            </p>
                            <p>
                                2. Inicialmente, será entregue ao CLIENTE um número correspondente a um CARTÃO virtual. Se requerido pelo CLIENTE, será emitido CARTÃO de plástico com o respectivo envio ao endereço cadastrado no quadro III ou retirado na loja onde foi contraído o financiamento.
                            </p>
                            <p>
                                3. O CLIENTE permite que o adimplemento das faturas ocorra mediante consignação em folha de
                                pagamento, de forma irrevogável e irretratável, dessa forma:
                            </p>
                            <p>
                                (i) Em caso de liquidação espontânea, sem ter havido qualquer ato de cobrança, não será devolvido nenhum tipo de ressarcimento de custo;
                            </p>
                            <p>
                                (ii) DECLARA que possui margem consignável disponível, bem como detém ciência de que eventuais valores que sobejarem a margem consignável deverão ser pagos por meio da fatura emitida pela FACTA, e;
                            </p>
                            <p>
                                (iii) SOLICITA que sua Fonte Pagadora faça o repasse dos valores descontados dos vencimentos
                                    diretamente à FACTA sempre em nome do próprio CLIENTE, garantindo o abatimento desse valor do total
                                    da fatura. A presente autorização é, sendo o caso, extensível ao Instituto Nacional do Seguro Social –
                                    INSS, na qualidade de Fonte Pagadora, conforme preceitua a legislação vigente.
                            </p>
                            <p>
                                4. Em caso de mora no pagamento de quaisquer valores devidos nos termos desta Cédula, inclusive
                                    principal ou juros, sem prejuízo do disposto nas demais cláusulas da presente, incidirão sobre o saldo
                                    devedor devidamente atualizado os seguintes encargos:
                            </p>
                            <p>
                                (I) juros de mora à razão de 1% (um por cento) ao mês ou fração de mês; 
                            </p>
                            <p>
                                (II) multa não compensatória de 2% (dois por cento) sobre o montante dos débitos.
                            </p>
                            <p>
                                5. No caso de atraso no pagamento das faturas, o valor devido será acrescido de juros remuneratórios
                                    capitalizados mensalmente à taxa de juros estabelecida na proposta, na quantidade de parcelas, valores,
                                    data de vencimento, bem como tributos e encargos especificados na Proposta.
                            </p>
                            <p>
                                6. A assinatura do CLIENTE no Quadro VI opta pela modalidade de saque pelo cartão de crédito, que será
                                efetuada mediante a transferência do valor liberado na conta corrente indicada no QUADRO V. Nestes
                                casos, o CLIENTE tem ciência de todo Custo Total da Operação, que está definido no próprio QUADRO VI.
                            </p>
                            <p>
                                7. O CLIENTE autoriza a FACTA a consultar o SCR do Bacen e as organizações de cadastros sobre seus
                                débitos, bem como a divulgação dos seus dados e obrigações, inclusive cadastrais, para constarem nos
                                bancos de dados do Serasa/SPC e outros, cuja finalidade será o compartilhamento com outras empresas,
                                os quais serão utilizados para subsidiar decisões de crédito e negócios.
                            </p>
                            <p>
                                8. O CLIENTE declara ter recebido a 2ª via desta Proposta e das Cláusulas Gerais do Contrato aderidas, e
ter tomado ciência, previamente à contratação da presente operação, dos fluxos considerados no cálculo do
CET.
                            </p>
                            <p>
                                9. O CLIENTE, por meio desta proposta, adere integralmente às cláusulas constantes no Contrato de
Cartão de Crédito com Desconto Consignado registrado no Cartório de Registro de Títulos e Documentos
de Porto Alegre, sob n° 1685503.
                            </p>
                            <p>
                            10. O CLIENTE declara, sob as penas da lei, que todas as informações prestadas na presente proposta,
                                bem como todos os documentos apresentados são verdadeiros.
                                Firmam as partes o presente em 02 vias, sendo a 1ª via da Financeira e a 2ª via do Creditado/Financiado.
                            </p>
                            <p>
                            </p>
                            <p>
                            </p>

                          </Col>
                        </Row>
                      </CardBody>
                    </Card>



                    <Card className="border-white shadow" style={{borderRadius: '8px'}} id="bloco_DadosDaCcb">
                      <CardBody className="text-left">
                        <h5 className="text-center border-bottom border-light pb-3">TERMO DE CONSENTIMENTO ESCLARECIDO DO CARTÃO DE CRÉDITO CONSIGNADO</h5>
                        <Row className="text-justify">
                          <Col xs="12" sm="12" xm="12">

                            <p>
                              Em cumprimento à sentença judicial proferida nos autos da Ação Civil Pública n. 106890-28.2015.4.01.3700, 3ª Vara Federal da Seção Judiciária de São Luís/MA, proposta pela Defensoria Pública da União
                            </p>
                            <p>
                            Eu, acima qualificado como titular do cartão de crédito consignado benefício contratado com Facta Financeira S.A. Crédito, Financiamento e Investimento, declaro para os devidos fins e sob as penas da lei, estar de ciente e de acordo que: 
                            </p>

                            <p>
                                (i) Contratei um cartão de crédito consignado benefício; 
                            </p>
                            <p>
                                (ii) Fui informado que a realização de saque mediante a utilização do meu limite do cartão de crédito consignado benefício ensejará a incidência de encargos e que o valor do saque, acrescido destes encargos, constará na minha próxima fatura do cartão; 
                            </p>
                            <p>
                                (iii)     A diferença entre o valor pago mediante consignação (desconto realizado diretamente na remuneração/benefício) e o total da fatura poderá ser paga por meio da minha fatura mensal, o que é recomendado pela Facta Financeira, já que,
                                 caso a fatura não seja integralmente paga até data de vencimento, incidirão encargos sobre o valor devido, conforme previsto na fatura; 
                            </p>
                            <p>
                                (iv)  declaro ainda saber que existem outras modalidades de crédito, a exemplo do empréstimo consignado, que possuem juros mensais em percentuais menores; 
                            </p>
                            <p>
                                (v)   estou ciente de que a taxa de juros do cartão de crédito consignado benefício é inferior à taxa de juros do Cartão de Crédito convencional; 
                            </p>
                            <p>
                                (vi)  Sendo utilizado o limite parcial ou total de meu cartão de crédito consignado benefício, para saques ou compras, em uma única transação, o 
                                saldo devedor do cartão será liquidado até o termo final do prazo de {AF.NUMEROPRESTACAO} prestações, contados a partir da data do primeiro desconto em folha, DESDE QUE: (a) eu não realize outras transações de qualquer natureza, durante todo o período de amortização projetado a partir da última utilização; (b) não ocorra a redução/perda da minha margem consignável de cartão; (c) os descontos através da consignação ocorram mensalmente, sem interrupção, até o total da dívida; (d) eu não realize qualquer pagamento espontâneo via fatura; e (e) não haja alteração da taxa dos juros remuneratórios. Para tirar dúvidas acerca do Contrato ora firmado, inclusive sobre informações presentes neste Termo de Consentimento, o TITULAR poderá entrar em contato, gratuitamente, com o Facta Financeira S.A. Crédito, Financiamento e Investimento através do seguintes Canais de atendimento: E-mail: sac@factafinanceira.com.br Telefones: SAC 0800 942 0462 ou 51 3191-7318 Ouvidoria: 0800. 232. 22.22 Horário de atendimento: Segunda a Sexta das 10h às 16h. Site: www.factafinanceira.com.br. 
                            </p>
                            <p>
                            </p>
                            <p>
                            </p>

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

export default CedulaFactaInssCartao;
