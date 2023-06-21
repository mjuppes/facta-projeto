import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import '../../../scss/fotos.css';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import TimelineProgresso from '../../TimelineProgresso';

class FotoDocumento extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeout: 300,
      tipoPendencia: props.tipo,
      exibeCamera: false,
      etapa: 'frente',
      dataUriFrente: '',
      dataUriVerso: '',
      codigoAFOriginal: this.props.match.params.propostaId,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      proximoLink: '',
      averbador: 0,
      enviouDocumentos: true,
      labelDocumento: '',
      base64Ccb: '',
      modeloDocumento: 'RG',
      exibeBoxDocumento: isMobile ? 'flex' : 'none',
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
      propostaPendente: false,
      propostaFinaliza: true,
      cliente_cpf: '',
      cliente_nascimento: '',
      cameraDisponivel: true,
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

    this.state.obj_pendencias = _state.obj_pendencias;
    this.state.cliente_cpf = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias.CLIENTE.CPF : _PROPOSTA.CLIENTE.CPF;
    this.state.cliente_nascimento = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== [] ? _state.obj_pendencias.CLIENTE.DATANASCIMENTO : _PROPOSTA.CLIENTE.DATANASCIMENTO;

    if (this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined && _state.obj_pendencias !== []) {
      this.state.propostaPendente = true;
      if (_state.obj_pendencias.pendencia_de_selfie === true) {
        this.state.proximoLink = '/'+this.state.tipoPendencia+'-selfie/'+this.props.match.params.propostaId;
        this.state.propostaFinaliza = false;
  		}
  		else if (_state.obj_pendencias.pendencia_de_audio === true && parseInt(_PROPOSTA.Averbador) != 20095 ) {
        this.state.proximoLink = '/'+this.state.tipoPendencia+'-gravacao-de-audio/'+this.props.match.params.propostaId;
        this.state.propostaFinaliza = false;
  		}
      else {
        this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
      }

    }
    else {
      if ([10, 15, 390].indexOf(parseInt(_PROPOSTA.Averbador)) !== -1 && parseInt(_DADOSPESSOAIS.documentosEnviados) === 0) {
        this.state.enviouDocumentos = false;
      }

      if (this.state.enviouDocumentos === true && parseInt(_PROPOSTA.Averbador) === 20095) {
        this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
      } else {
        if (this.state.enviouDocumentos === true) {
          if ((parseInt(_PROPOSTA.Averbador) === 1 || parseInt(_PROPOSTA.Averbador) === 30) && _PROPOSTA.codigotabela === 'PRE' && parseInt(_PROPOSTA.Tipo_Operacao) == 14) {
            this.state.proximoLink = '/foto-selfie/'+this.state.codigoAFOriginal;
          }
          // Se for proposta de TESOURO SEMPRE tira SELFIE e GRAVA AUDIO
          else if (parseInt(_PROPOSTA.Averbador) === 1 || parseInt(_PROPOSTA.Averbador) === 30 || parseInt(_PROPOSTA.Averbador) === 100) {
            this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
          }
          else if (parseInt(_PROPOSTA.Averbador) === 3 &&
                  (parseInt(_PROPOSTA.Tipo_Operacao) === 13 || parseInt(_PROPOSTA.Tipo_Operacao) === 27) &&
                  (['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE'].indexOf(_CORRETOR.UF) !== -1) &&
                  parseInt(_CORRETOR.Classificacao) === 1 &&
                  _PROPOSTA.codigotabela === 'PRE'
          ) {
            this.state.proximoLink = '/foto-selfie/'+this.state.codigoAFOriginal;
          }
          else if (parseInt(_PROPOSTA.Averbador) === 3 && _PROPOSTA.ANALFABETO === "S" && _PROPOSTA.codigotabela === 'PRE') {
            this.state.proximoLink = '/foto-selfie/'+this.state.codigoAFOriginal;
          }
          else if ((_CORRETOR.FRANQUIA === 'S' || (parseInt(_CORRETOR.Classificacao) === 1 && [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760].indexOf(parseInt(_CORRETOR.CODIGO)) === -1) )) {
            this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
          }
          else {
            // PROPOSTA PRESENCIAL VAI PARA O PreSelfie.js
            // Onde será tirada a selfie (validando a prova de vida) e depois
            // gravado o vídeo no Selfie.js
            if (_PROPOSTA.codigotabela === 'PRE') {
              this.state.proximoLink = '/foto-selfie/'+this.state.codigoAFOriginal;
            }
            else {
              this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
            }
          }
        }
        else {
          this.state.proximoLink = '/comprovantes/'+this.state.codigoAFOriginal;
        }

      }
    }

    this.state.labelDocumento = _state.tipoDocumento === 'RG' ? 'do RG' : 'da CNH';
    this.state.modeloDocumento = _state.tipoDocumento;

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

  }

  onTakePhotoFrente = (dataUri) => {
    this.setState({dataUriFrente: dataUri });
  }

  removeImageFrente = () => {
    this.setState({dataUriFrente: '' });
  }

  onTakePhotoVerso = (dataUri) => {
    this.setState({dataUriVerso: dataUri });
  }

  removeImageVerso = () => {
    this.setState({dataUriVerso: '' });
  }

  proximaEtapa = (etapa) => {
    this.setState({etapa: etapa});
    window.scrollTo(0, 3);
  }

  componentDidMount () {

    window.addEventListener('resize', this.updateDimensions);
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
    if (!navigator.mediaDevices){
      navigator.mediaDevices = navigator;
    }
    /*
    navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

    navigator.getMedia({video: true}, function() {
      this.setState({ cameraDisponivel : true });
    }.bind(this), function() {
      this.setState({ cameraDisponivel : false });
    }.bind(this));
    */
    setInterval(function (){this.updateDimensions()}.bind(this), 100);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    var video = document.querySelector('div.react-html5-camera-photo video');
    var divDoc = document.getElementById('divFotoExemplo');
    if (divDoc !== undefined && divDoc !== null) {
      divDoc.style.top = ((video.clientHeight - divDoc.clientHeight) / 2) + 'px';
    }
  };

  _finalizaFormalizacao = async () => {

    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();
    this.setState({ carregando: true });

    if (this.state.dataUriFrente !== '' && this.state.dataUriFrente !== undefined) {
        const blob_fotoDocumentoFrente = await fetch(this.state.dataUriFrente).then(res => res.blob());
        formData.append('fotoDocumentoFrente', blob_fotoDocumentoFrente);
    }

    if (this.state.dataUriVerso !== '' && this.state.dataUriVerso !== undefined) {
      const blob_fotoDocumentoVerso = await fetch(this.state.dataUriVerso).then(res => res.blob());
      formData.append('fotoDocumentoVerso', blob_fotoDocumentoVerso);
    }

    if (this.state.base64Ccb !== '' && this.state.base64Ccb !== undefined) {
      const blob_base64PrintCcb = await fetch(this.state.base64Ccb).then(res => res.blob());
      formData.append('PrintCCB', blob_base64PrintCcb);
    }

    let LOCALIZACOES = "";

    formData.set('proposta', atob(this.state.codigoAFOriginal));

    formData.set('termo_datahora', this.state.dataHoraTermo);
    formData.set('termo_localizacao', this.state.geoTermo);

    LOCALIZACOES += "\r\nTERMO\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraTermo !== undefined && this.state.dataHoraTermo !== "" ? this.state.dataHoraTermo : "-") +"\r\n";
    LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoTermo !== undefined && this.state.geoTermo !== "" ? this.state.geoTermo : "-") +"\r\n";

    formData.set('ccb_datahora', this.state.dataHoraCcb);
    formData.set('ccb_localizacao', this.state.geoCcb);

    LOCALIZACOES += "\r\nCCB\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraCcb !== undefined && this.state.dataHoraCcb !== "" ? this.state.dataHoraCcb : "-") +"\r\n";
    LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";

    formData.set('assinatura_datahora', [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'));
    formData.set('assinatura_localizacao', this.state.geoCcb);

    LOCALIZACOES += "\r\nASSINATURA\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':') +"\r\n";
    LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";

    formData.set('consultaDataprev_opcao', this.state.consultaDataprev_opcao !== undefined ? (this.state.consultaDataprev_opcao === true ? "S" : "N") : "");
    formData.set('consultaDataprev_datahora', this.state.consultaDataprev_datahora);

    LOCALIZACOES += "\r\nCONSULTA DATAPREV\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.consultaDataprev_datahora !== undefined && this.state.consultaDataprev_datahora !== "" ? this.state.consultaDataprev_datahora : "-") +"\r\n";
    LOCALIZACOES += "\r\nACEITOU: "+ (this.state.consultaDataprev_opcao !== undefined ? (this.state.consultaDataprev_opcao === true ? "S" : "N") : "-") +"\r\n";

    formData.set('aberturaDeConta_opcao', this.state.aberturaDeConta_opcao !== undefined ? (this.state.aberturaDeConta_opcao === true ? "S" : "N") : "");
    formData.set('aberturaDeConta_datahora', this.state.aberturaDeConta_datahora);

    LOCALIZACOES += "\r\nABERTURA DE CONTA\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.aberturaDeConta_datahora !== undefined && this.state.aberturaDeConta_datahora !== "" ? this.state.aberturaDeConta_datahora : "-") +"\r\n";
    LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aberturaDeConta_opcao !== undefined ? (this.state.aberturaDeConta_opcao === true ? "S" : "N") : "-") +"\r\n";

    formData.set('valorSeguro_opcao', this.state.valorSeguro_opcao !== undefined ? (this.state.valorSeguro_opcao === true ? "S" : "N") : "");
    formData.set('valorSeguro_datahora', this.state.valorSeguro_datahora);

    LOCALIZACOES += "\r\nSEGURO\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.valorSeguro_datahora !== undefined && this.state.valorSeguro_datahora !== "" ? this.state.valorSeguro_datahora : "-") +"\r\n";
    LOCALIZACOES += "\r\nACEITOU: "+ (this.state.valorSeguro_opcao !== undefined ? (this.state.valorSeguro_opcao === true ? "S" : "N") : "-") +"\r\n";

    formData.set('contaQuitacao_opcao', this.state.contaQuitacao_opcao !== undefined ? (this.state.contaQuitacao_opcao === true ? "S" : "N") : "");
    formData.set('contaQuitacao_datahora', this.state.contaQuitacao_datahora);

    LOCALIZACOES += "\r\nQUITAÇÃO\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.contaQuitacao_datahora !== undefined && this.state.contaQuitacao_datahora !== "" ? this.state.contaQuitacao_datahora : "-") +"\r\n";
    LOCALIZACOES += "\r\nACEITOU: "+ (this.state.contaQuitacao_opcao !== undefined ? (this.state.contaQuitacao_opcao === true ? "S" : "N") : "-") +"\r\n";

    formData.set('contaTransferencias_opcao', this.state.contaTransferencias_opcao !== undefined ? (this.state.contaTransferencias_opcao === true ? "S" : "N") : "");
    formData.set('contaTransferencias_datahora', this.state.contaTransferencias_datahora);

    LOCALIZACOES += "\r\nTRANSFERÊNCIAS\r\n";
    LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.contaTransferencias_datahora !== undefined && this.state.contaTransferencias_datahora !== "" ? this.state.contaTransferencias_datahora : "-") +"\r\n";
    LOCALIZACOES += "\r\nACEITOU: "+ (this.state.contaTransferencias_opcao !== undefined ? (this.state.contaTransferencias_opcao === true ? "S" : "N") : "-") +"\r\n";

    formData.set('codigoAtualizacao', 'AD3');
    formData.set('statusOcorrenciaAtualizar', '23');

    formData.set('cliente_cpf', this.state.cliente_cpf);
    formData.set('cliente_nascimento', this.state.cliente_nascimento);

    formData.set('resolucaoPendencias', 1);
    formData.set('gerarNovaCcb', this.state.obj_pendencias.pendencia_de_valores === true ? 1 : 0);

    var informacoesDoDispositivo = "";

    informacoesDoDispositivo += "\r\nRESOLUÇÃO DE PENDÊNCIAS\r\n\r\n";
    informacoesDoDispositivo += "\r\nTipo de Formalização: "+ (this.state.obj_proposta.codigotabela === "DIG" ? "Não Presencial" : "Presencial") +"\r\n\r\n";
    informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
    informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
    informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
    informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
    informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;
    informacoesDoDispositivo += LOCALIZACOES;

    formData.set('infoDoDispositivo', informacoesDoDispositivo);

    formData.set('ambiente', "prod");

    await axios({
      method: 'post',
      //url: 'https://app.factafinanceira.com.br/proposta/app_react_atualizar_formalizacao',
      url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data' }
    })
    .then(function (response) {
        console.log(response);
        this.setState({ carregando: false });
        alert("Proposta formalizada com sucesso!");
        this.props.history.push(this.state.proximoLink);
    }.bind(this))
    .catch(function (response) {
        //handle error
        console.log(response);
        this.setState({ carregando: false });
        alert("Erro ao realizar a formalização!");
    }.bind(this));

    return false;

  }

  handleClickPageLocation() {
    window.location.href = 'http://play.google.com/store/apps/details?id=com.sec.android.app.sbrowser';
  }

  render() {
    const handleCopyLink = (param) => (event) => {
      let link = "https://app.factafinanceira.com.br/v2/#"+param;
      let textField = document.createElement('textarea');
      let msg = document.getElementById("msg");

      textField.innerText = link;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      msg.innerHTML = "<font font-weight: bold; color='green'>Link Copiado</font>";

      setTimeout(() => {
        msg.innerHTML = "";
      },  2000);
    };

    const appHeightAuto = {
      "height": "auto"
    };
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px'
      
    };

    const containerPaddingTopMobile = {
      'backgroundColor' : '#000',
      'overflow' : 'hidden'
    }

    const widthModeloRgFrente_Max = "380px";
    const widthModeloRgFrente = "360px";
    const widthModeloRgVerso = "380px";

    const widthModeloCnh_Max = "300px";
    const widthModeloCnhFrente = "300px";
    const widthModeloCnhVerso = "300px";
    const widthModeloCnhFrente_Foto = "120px";
    const widthModeloCnhFrente_Dados = "180px";
    const infoFotoEDados = {
      'display' : 'flex',
      'border' : '1px solid dodgerblue',
      'margin' : '3px',
      'height' : '140px',
      'alignItems' : 'center',
      'justifyContent' : 'center'
    }
    const infoTextos = {
      'display' : 'flex',
      'border' : '1px solid dodgerblue',
      'margin' : '3px',
      'height' : '30px',
      'width' : this.state.etapa === 'frente' ? (this.state.modeloDocumento === 'RG' ? widthModeloRgFrente : widthModeloCnhFrente) : (this.state.modeloDocumento === 'RG' ? widthModeloRgVerso : widthModeloCnhVerso),
      'alignItems' : 'center',
      'justifyContent' : 'center'
    }
    const boxFotoDocumento = {
      'width' : '98%',
      'padding' : this.state.etapa === 'frente' ? '20px' : '40px',
      //'border' : '2px dashed dodgerblue',
      'marginLeft' : '1%',
      'display' : this.state.exibeBoxDocumento,
      'justifyContent' : 'center'
    }
    const infoTextos_Verso = {
      //'display' : 'flex',
      'border' : '1px solid dodgerblue',
      'margin' : '3px',
      'height' : '70px',
      'width' : this.state.modeloDocumento === 'RG' ? widthModeloRgVerso : widthModeloCnhVerso,
      //'alignItems' : 'center',
      //'justifyContent' : 'center'
    }
    const infoFotoEPolegar = {
      'display' : 'flex',
      'border' : '1px solid dodgerblue',
      'margin' : '3px',
      'height' : '130px',
      'width' : '180px',
      'alignItems' : 'center',
      'justifyContent' : 'center'
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} >

        { this.state.cameraDisponivel === false
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
                              residencia="fa fa-check-square-o text-success"
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
                        <Row>
                          <Col>
                            <h5 className="text-center mb-3 font-weight-bold">Dispositivo de Vídeo Indisponível </h5>
                            <Row>
                              <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                <p>Para realizar a formalização digital é necessário o uso de câmera.
                                  Por favor, certifique-se que a mesma está habilitada e tente novamente.
                                  Ou clique no botão abaixo para atualizar versão do navegador.</p>
                              </Col>
                            </Row>
                          <button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                          onClick={this.handleClickPageLocation}>
                                Ir para PlayStore
                              </button>
                          </Col>
                        </Row>
                      </CardBody>
                      <Row>
                          <Col md="12" lg="12" xs="12" sm="12">
                            <p>Ou se prefirir clique no link abaixo para copiar e em seguida cole o mesmo no chrome navegador: </p>
                            <p>
                              <Link onClick={handleCopyLink(this.state.homeLink)} >
                                <font size="1">https://app.factafinanceira.com.br/v2/#{this.state.homeLink}</font>
                              </Link>
                            </p>
                            <span id='msg'></span>
                          </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Col>
          </>
        : <>
        { this.state.etapa === 'frente'
          ? (
            this.state.dataUriFrente !== ''
              ? (<>
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
                                  residencia="fa fa-check-square-o text-success"
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
                            <Row>
                              <Col>
                                <h5 className="text-center mb-3 font-weight-bold">Foto { this.state.labelDocumento } (Frente)</h5>
                                <p className="text-center">Veja abaixo como ficou a imagem</p>
                                <Row>
                                  <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                    <img className="img-fluid" src={ this.state.dataUriFrente } alt='Foto tirada' style={{'maxWidth' : '95%'}} />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="text-center" xs="12">
                                <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                  <Button className="btn-block font-weight-bold mt-2" color="outline-danger" onClick={ this.removeImageFrente }><i className="fa fa-trash"></i> Remover</Button>
                                  <Button className="btn-block font-weight-bold mt-2" color="outline-primary" size="lg" onClick={ () => { this.proximaEtapa('verso') } }>Prosseguir</Button>
                                </Col>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </>)
              : (<>
                  <Col className="w-100 p-3 min-vh-100 text-center" style={ isMobile ? containerPaddingTopMobile : containerPaddingTop}>
                    <Col xs="12" sm="12" md="12" className="text-center p-0">
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
                                    residencia="fa fa-check-square-o text-success"
                                    fotos="fa fa-square-o"
                                    audio="fa fa-square-o"
                                  />
                              </Col>
                            </>
                          : null
                        }
                        <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'backgroundColor' : '#000', 'height' : (window.screen.height * 0.85) + 'px'}}>
                          <div className="text-center position-absolute text-white p-3 mt-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: '10000', width: '90%', left: '5%'}}>
                            <h5>Foto { this.state.labelDocumento } (Frente)</h5>
                          </div>
                          <div className="mt-1 text-white" id="divFotoExemplo" style={{display: true ? 'none' : 'block', 'zIndex' : '1', 'position' : 'absolute', 'width' : '100%'}}>
                            <div style={boxFotoDocumento}>
                              { this.state.modeloDocumento === 'RG'
                                ? <>
                                    <div style={{'width' : widthModeloRgFrente_Max, 'border' : '3px solid dodgerblue'}}>
                                      <div className="d-inline-flex" style={{'maxWidth' : widthModeloRgFrente, 'visibility' : 'hidden'}}>
                                        <div style={infoTextos_Verso}>
                                        </div>
                                      </div>
                                      <div className="d-inline-flex" style={{'maxWidth' : widthModeloRgFrente}}>
                                        <div style={infoFotoEPolegar}>
                                        </div>
                                        <div style={infoFotoEPolegar}>
                                        </div>
                                      </div>
                                      <div className="d-inline-flex" style={{'maxWidth' : widthModeloRgFrente, 'visibility' : 'hidden'}}>
                                        <div style={{...infoTextos_Verso, 'borderRight' : '0px', 'borderLeft' : '0px', 'borderTop' : '0px'}}>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                : <>
                                    <div style={{'width' : widthModeloCnh_Max, 'border' : '3px solid dodgerblue'}}>
                                      <div className="d-inline-flex" style={{'maxWidth' : widthModeloCnhFrente, 'visibility' : 'hidden'}}>
                                        <div style={infoTextos}>
                                        </div>
                                      </div>
                                      <div className="d-inline-flex" style={{'maxWidth' : widthModeloCnhFrente}}>
                                        <div style={{...infoFotoEDados, 'width' : widthModeloCnhFrente_Foto}}>
                                        </div>
                                        <div style={{...infoFotoEDados, 'width' : widthModeloCnhFrente_Dados}}>
                                        </div>
                                      </div>
                                      <div className="d-inline-flex" style={{'maxWidth' : widthModeloCnhFrente, 'visibility' : 'hidden'}}>
                                        <div style={infoTextos}>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                              }
                            </div>
                          </div>
                          <Camera
                            onTakePhoto={() => { this.setState({exibeBoxDocumento : 'none'})}}
                            onTakePhotoAnimationDone={ (dataUri) => { this.onTakePhotoFrente(dataUri); this.setState({exibeBoxDocumento : isMobile ? 'flex' : 'none'}); } }
                            onCameraStart={() => {setTimeout(function (){this.updateDimensions()}.bind(this), 50)}}
                            idealFacingMode={FACING_MODES.ENVIRONMENT}
                            isImageMirror={false}
                            isSilentMode={true}
                            isFullscreen={ isMobile ? true : false }
                            onCameraError={ () => { this.setState({ cameraDisponivel : false }) } }
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                </>)
              )
            : (this.state.dataUriVerso !== ''
              ? (<>
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
                                  residencia="fa fa-check-square-o text-success"
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
                            <Row>
                              <Col>
                                <h5 className="text-center mb-3 font-weight-bold">Foto { this.state.labelDocumento } (Verso)</h5>
                                <p className="text-center">Veja abaixo como ficou a imagem</p>
                                <Row>
                                  <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                    <img className="img-fluid" src={ this.state.dataUriVerso } alt='Foto tirada' style={{'maxWidth' : '95%'}} />
                                  </Col>
                                </Row>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="text-center" xs="12">
                                  <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                    <Button className="btn-block font-weight-bold mt-2" color="outline-danger" onClick={ this.removeImageVerso }><i className="fa fa-trash"></i> Remover</Button>
                                    { this.state.propostaPendente === false || (this.state.propostaPendente === true && this.state.propostaFinaliza === false)
                                      ? <>
                                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" to={{
                                            pathname: this.state.proximoLink,
                                            state: {
                                              navegacao: true,
                                              obj_proposta: this.state.obj_proposta,
                                              dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,
                                              dataHoraTermo: this.state.dataHoraTermo,
                                              dataHoraCcb: this.state.dataHoraCcb,
                                              fotoDocumentoFrente: this.state.dataUriFrente,
                                              fotoDocumentoVerso: this.state.dataUriVerso,
                                              geoInicial: this.state.geoInicial,
                                              geoTermo: this.state.geoTermo,
                                              geoCcb: this.state.geoCcb,

                                              aceitouSeguro: this.state.aceitouSeguro,
                                              dataHoraAceitouSeguro: this.state.dataHoraAceitouSeguro,

                                              aceitouConsultaDataprev: this.state.aceitouConsultaDataprev,
                                              dataHoraAceitouDataprev: this.state.dataHoraAceitouDataprev,

                                              aceitouConta: this.state.aceitouConta,
                                              dataHoraAceitouConta: this.state.dataHoraAceitouConta,

                                              aceitouAutTransferencia: this.state.aceitouAutTransferencia,
                                              dataHoraAceitouAutTransferencia: this.state.dataHoraAceitouAutTransferencia,

                                              aceitouDebitoEmConta: this.state.aceitouDebitoEmConta,
                                              dataHoraAceitouDebitoEmConta: this.state.dataHoraAceitouDebitoEmConta,

                                              aceitouAutBoletos: this.state.aceitouAutBoletos,
                                              dataHoraAceitouAutBoletos: this.state.dataHoraAceitouAutBoletos,
                                              base64Ccb: this.state.base64Ccb,
                                              obj_pendencias: this.state.obj_pendencias,
                                            }
                                          }}
                                          >
                                            Prosseguir
                                          </Link>
                                        </>
                                      : <>
                                        <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={ this._finalizaFormalizacao } >
                                            Confirmar a assinatura
                                        </Button>
                                        </>
                                    }
                                  </Col>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </>)
                : (<>
                  <Col className="w-100 p-3 min-vh-100 text-center" style={ isMobile ? containerPaddingTopMobile : containerPaddingTop}>
                    <Col xs="12" sm="12" md="12" className="text-center p-0">
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
                                    residencia="fa fa-check-square-o text-success"
                                    fotos="fa fa-square-o"
                                    audio="fa fa-square-o"
                                  />
                              </Col>
                            </>
                          : null
                        }

                        <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'backgroundColor' : '#000', 'height' : (window.screen.height * 0.85) + 'px'}}>
                          <div className="text-center position-absolute text-white p-3 mt-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: '10000', width: '90%', left: '5%'}}>
                            <h5>Foto { this.state.labelDocumento } (Verso)</h5>
                          </div>
                          <div className="mt-1 text-white" id="divFotoExemplo" style={{display : true ? 'none' : 'block', 'zIndex' : '1', 'position' : 'absolute', 'width' : '100%'}}>
                            { this.state.modeloDocumento === 'RG'
                            ? <>
                                <div style={{...boxFotoDocumento, 'padding' : '20px'}}>
                                  <div style={{'width' : widthModeloRgVerso, 'border' : '3px solid dodgerblue'}}>
                                    <div className="d-inline-flex" style={{'maxWidth' : widthModeloRgVerso}}>
                                      <div style={{...infoTextos_Verso, 'height' : '40px', 'border' : '0px'}}>
                                        <span style={{'fontSize' : '10px', 'float' : 'left', 'marginLeft' : '5px'}}></span>
                                        <span style={{'fontSize' : '10px', 'float' : 'right', 'marginRight' : '5px'}}></span>
                                      </div>
                                    </div>
                                    <div className="d-inline-flex" style={{'maxWidth' : widthModeloRgVerso}}>
                                      <div style={{...infoTextos_Verso, 'border' : '0px'}}>
                                        <span style={{'fontSize' : '10px', 'float' : 'left', 'marginLeft' : '5px'}}></span>
                                      </div>
                                    </div>
                                    <div className="d-inline-flex" style={{'maxWidth' : widthModeloRgVerso}}>
                                      <div style={{...infoTextos_Verso, 'border' : '0px'}}>
                                      </div>
                                    </div>
                                    <div className="d-inline-flex" style={{'maxWidth' : widthModeloRgVerso}}>
                                      <div style={{...infoTextos_Verso, 'border' : '0px'}}>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            : <>
                                <div style={boxFotoDocumento}>
                                  <div style={{'width' : widthModeloCnh_Max, 'border' : '3px solid dodgerblue'}}>
                                    <div className="d-inline-flex" style={{'maxWidth' : widthModeloCnhFrente, 'visibility' : 'hidden'}}>
                                      <div style={infoTextos}>
                                      </div>
                                    </div>
                                    <div className="d-inline-flex" style={{'maxWidth' : widthModeloCnhFrente, 'visibility' : 'hidden'}}>
                                      <div style={{...infoFotoEDados, 'width' : widthModeloCnhFrente_Foto}}>
                                      </div>
                                      <div style={{...infoFotoEDados, 'width' : widthModeloCnhFrente_Dados}}>
                                      </div>
                                    </div>
                                    <div className="d-inline-flex" style={{'maxWidth' : widthModeloCnhFrente, 'visibility' : 'hidden'}}>
                                      <div style={infoTextos}>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            }
                          </div>
                          <Camera
                            onTakePhoto={() => { this.setState({exibeBoxDocumento : 'none'})}}
                            onTakePhotoAnimationDone={ (dataUri) => { this.onTakePhotoVerso(dataUri); this.setState({exibeBoxDocumento : isMobile ? 'flex' : 'none'}); } }
                            onCameraStart={() => {setTimeout(function (){this.updateDimensions()}.bind(this), 50)}}
                            idealFacingMode={FACING_MODES.ENVIRONMENT}
                            isImageMirror={false}
                            isSilentMode={true}
                            isFullscreen={ isMobile ? true : false }
                            onCameraError={ () => { this.setState({ cameraDisponivel : false }) } }
                          />
                      </Col>
                      </Row>
                    </Col>
                  </Col>
                  </>)
          )
        }
        </>
      }
      </div>
    );
  }
}

export default FotoDocumento;
