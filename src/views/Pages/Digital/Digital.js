import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import axios from 'axios';
import {isMobile} from 'react-device-detect';
import md5 from 'md5';
import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';
import PaginaMensagemNavegador from '../../../PaginaMensagemNavegador';
import TimelineProgresso from '../../TimelineProgresso';
import { configConsumerProps } from 'antd/lib/config-provider';
import ReactGA from 'react-ga';

class Digital extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Loading...</div>

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: true,
      timeout: 300,
      codigoAF: atob(this.props.match.params.propostaId),
      codigoAF64: this.props.match.params.propostaId,
      proximoLink: '/termo/'+this.props.match.params.propostaId,
      //homeLink: '/digital/'+this.props.match.params.propostaId,
      homeLink: '/totem-facta',
      carregando: true,
      navegadorCompativel: true,
      permissaoLocalizacao: false,
      localizacaoInicial: '',
      liberaFormalizacao: [12, 120, 168, 214, 215, 216], //remover o 11
      reprovada: [4, 28, 29, 49, 156],
      dadosProposta: [],
      dadosCliente: [],
      userAgent: '',
      appVersion: '',
      navegadorSamsungBrowser: false,
      samsungBrowserVersion: '',
      corretoresRosa: [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760],
      isPc: false,
      modalDados: false,
      tipoCelular: '',
      dataHoraAtual: '',
      palavra_chave: '',
      lojasLiberar: [],
	    latitude : '',
      longitude : '',
      isExcecao: true,
      paisGeo : '',
      isEncerrar: false,
      isErrorGeo : false,
      clicouErrorGeo: false
    };

    localStorage.setItem('@app-factafinanceira-formalizacao/dados_cartorio/cidade_cartorio', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/dados_cartorio/nome_cartorio', '');
    localStorage.setItem('@app-factafinanceira-formalizacao/exibirTimeline', 1);
    localStorage.setItem('@app-factafinanceira-formalizacao/RETORNO_OITI_LOG', '');


    //this.getLiberaV6();

  }

  async componentDidMount() {
    const TRACKING_ID = "G-GY567PKQLG"; // OUR_TRACKING_ID
    ReactGA.initialize(TRACKING_ID);

    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
		if (iOS === true && navigator.appVersion.indexOf("CriOS") !== -1){
        this.setState({ navegadorCompativel: false });
		}

    //this.setState({ userAgent: navigator.userAgent, appVersion: navigator.appVersion });

    this.state.userAgent = navigator.userAgent;
    this.state.appVersion = navigator.appVersion;


    let navegador = this.state.userAgent.substr(this.state.userAgent.indexOf(") ") + 1);
    if (navegador.indexOf("SamsungBrowser") !== -1) {

      let versao = navegador.substr(navegador.indexOf("SamsungBrowser"));
      versao = versao.substr(versao.indexOf("/") + 1);
      versao = versao.substr(0, versao.indexOf(" "));
      versao = versao.trim();
      this.setState({ navegadorSamsungBrowser: true, samsungBrowserVersion: versao });

    }
 
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
          this.setState({isErrorGeo : true});
      }
    };

    const coords = await getCoords();

    if(this.state.isErrorGeo === false) {
        this.setState({ latitude: coords.lat , longitude: coords.long });
      
        const getGeo =  await this.getGeoLocalizacao();

        if(this.state.isExcecao === false) {
          const validaGeo = await this.validaGeoLocalizacao();
        }
    }
    this.getBloqueioDispositivo();
    //let isPc  = this.isDispositivoPc();
    //this.state.isPc = false;

    this.getUsers();
    this.gravaLogAcessos();
    this.setState({permissaoLocalizacao : true})
  }

  mtel(v) {
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
  }

  getUsers = async () => {
    /* Page 404 - descomentar, quando o sistema está fora do ar.
    
    window.location.href = 'https://app.factafinanceira.com.br/v3/#/404';
    this.setState({ carregando : true });
    return false;
    */


    let dia = new Date().getDate();
    dia = ("0" + dia).slice(-2);
    let mes = new Date().getMonth()+1;
    mes = ("0" + mes).slice(-2);

    let ano = new Date().getFullYear();
    let token_af = this.state.codigoAF64+'_token_'+ano + '-' + mes + '-' + dia;

    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta?codigo=' + btoa(this.state.codigoAF64)+'&token='+md5(token_af) + '&ambiente=prod')
    .then(res => {
      console.log(res.data);
      this.setState({
        dadosProposta: res.data,
        dadosCliente: res.data.CLIENTE,
        carregando: false
      });

      if (res.data.RETORNO_OITI_LOG !== undefined && res.data.RETORNO_OITI_LOG !== "") {
        localStorage.setItem('@app-factafinanceira-formalizacao/RETORNO_OITI_LOG', res.data.RETORNO_OITI_LOG);
      }

      var int_averbador = parseInt(this.state.dadosProposta.Averbador);
      var int_classificacao = parseInt(this.state.dadosProposta.CORRETOR.Classificacao);
      var int_codigo = parseInt(this.state.dadosProposta.CORRETOR.CODIGO);

      if(int_averbador === 20095) {
        localStorage.setItem('@app-factafinanceira-formalizacao/averbadorFgts', 1);
      } else {
        localStorage.setItem('@app-factafinanceira-formalizacao/averbadorFgts', 0);
      }
      

      // Normativa 4076


    /*  if ((int_codigo === 1400  || int_codigo === 19778 ) && this.state.dadosProposta.codigotabela === 'PRE') {


        this.state.permissaoLocalizacao = true;
        //console.log('Teste:'+this.state.liberaFormalizacao.indexOf(this.state.dadosProposta.TIPOANALISE)+' - '+this.state.dadosProposta.nometabela); 
        //return;
        //window.location.href = 'https://app.factafinanceira.com.br/v2/#/digital/' + this.state.codigoAF64;
        //window.location.href = 'http://localhost:3000/#/digital/' + this.state.codigoAF64;
        //return false;
      }*/
      /*
      else
      */
      /*
      if (this.state.dadosProposta.DADOSTABELA !== undefined && this.state.dadosProposta.DADOSTABELA !== [] && parseInt(this.state.dadosProposta.DADOSTABELA[0].CodigoNormativa) === 4076) {
        if (this.state.reprovada.indexOf(this.state.dadosProposta.TIPOANALISE) === -1) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              this.setState({ localizacaoInicial: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });
            }.bind(this),
            function(error) {
              this.setState({ permissaoLocalizacao: false });
            }.bind(this)
          );
        }
      }
      // Se for GOV RS, MEX OU SIAPE mantém na formalização nova
      else if (int_averbador === 1 || int_averbador === 10 || int_averbador === 15 || int_averbador === 30) {
        if (this.state.reprovada.indexOf(this.state.dadosProposta.TIPOANALISE) === -1) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              this.setState({ localizacaoInicial: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });
            }.bind(this),
            function(error) {
              this.setState({ permissaoLocalizacao: false });
            }.bind(this)
          );
        }
      }
      else if (int_averbador === 3 &&
              (parseInt(this.state.dadosProposta.Tipo_Operacao) === 13 || parseInt(this.state.dadosProposta.Tipo_Operacao) === 27) &&
              (['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE'].indexOf(this.state.dadosProposta.CORRETOR.UF) !== -1) &&
              int_classificacao === 1 &&
              this.state.dadosProposta.codigotabela === 'PRE'
      ) {
        if (this.state.reprovada.indexOf(this.state.dadosProposta.TIPOANALISE) === -1) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              this.setState({ localizacaoInicial: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });
            }.bind(this),
            function(error) {
              this.setState({ permissaoLocalizacao: false });
            }.bind(this)
          );
        }
      }
      // Se for o Corretor 5083 (MLFREITAS) OU 15152 e PRESENCIAL, joga para formalização antiga
      else if ( ((int_codigo === 5083 || int_codigo === 15152) || this.state.dadosProposta.CORRETOR.Franquia === "S") && this.state.dadosProposta.codigotabela === 'PRE') {
        window.location.href = 'https://app.factafinanceira.com.br/digital/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }
      // Se for irmãos PRESENCIAL, vai para formalização antiga
      else if ( this.state.corretoresRosa.indexOf(int_codigo) !== -1 && this.state.dadosProposta.codigotabela === 'PRE') {
        window.location.href = 'https://app.factafinanceira.com.br/digital/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }
      // SE FOR LOJA E A PROPOSTA FOR PRESENCIAL JOGA PARA FORMALIZAÇÃO ANTIGA
      else if (int_classificacao === 2 && this.state.dadosProposta.codigotabela === 'PRE') {
      */

      //if (int_classificacao === 2 && (int_averbador === 3 || int_averbador === 390) && this.state.dadosProposta.codigotabela === 'PRE' && int_codigo !== 1400  && int_codigo !== 19778) { //vai voltar
       /* if (int_classificacao === 2 && (int_averbador === 3 || int_averbador === 390) && this.state.dadosProposta.codigotabela === 'PRE') {
        window.location.href = 'https://app.factafinanceira.com.br/digital/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }*/
/*      else if (int_codigo === 5083 && this.state.dadosProposta.codigotabela === 'PRE') {
        window.location.href = 'https://app.factafinanceira.com.br/digital/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }*/
      //else {

        //int_codigo = 1400;
        //if((int_codigo === 31276 || int_codigo === 19778 || int_codigo === 1400) && int_averbador == 20095)
        //return;
        /*if((this.state.lojasLiberar.indexOf(int_codigo) != '-1') && int_averbador == 20095)
        {
          window.location.href = 'https://app.factafinanceira.com.br/v6/#/digital/' + this.state.codigoAF64;
          this.setState({ carregando : true });
          return false;
        }else*/

        let array_averbadores = [20095,3,1,15,30,390,10226,20124,23,10];

        if(array_averbadores.indexOf(int_averbador) === -1 ) {
          this.setState({ carregando : true });
          window.location.href = 'https://app.factafinanceira.com.br/';
        }

       //Rotas V2 V3
        /*if(int_averbador === 3 || int_averbador === 20095 || int_averbador === 15 || int_averbador === 10226 || int_averbador === 390 || int_averbador === 1 || int_averbador === 30 || int_averbador === 20124) {
          window.location.href = 'https://app.factafinanceira.com.br/v3/#/digital/' + this.state.codigoAF64;
          this.setState({ carregando : true });
          return false;
        }*/
      
      /*
        if(int_codigo != 1024) {
          if(int_averbador === 3 || int_averbador === 20095 || int_averbador === 15 || int_averbador === 10226 || int_averbador === 390 || int_averbador === 1 || int_averbador === 30) {
            window.location.href = 'https://app.factafinanceira.com.br/v3/#/digital/' + this.state.codigoAF64;
            this.setState({ carregando : true });
            return false;
          }
        }*/

        if(this.state.isErrorGeo === false) {
            if (this.state.reprovada.indexOf(this.state.dadosProposta.TIPOANALISE) === -1) {
              navigator.geolocation.getCurrentPosition(
                function(position) {
                  this.setState({ localizacaoInicial: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });
                }.bind(this),
                function(error) {
                  this.setState({ permissaoLocalizacao: false });
                }.bind(this)
              );
            }
        }
      //}

    })
    .catch(error => console.log(error));
  };

  abrirFormalizacaoNoChrome = () => {
    window.open("googlechrome://navigate?url=" + 'https://app.factafinanceira.com.br/v2-homol/#/' + this.state.codigoAF64, "_system"); // here you can try with _system or _blank as per your requirement
  }

  getBloqueioDispositivo = async () => { 
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_bloqueio_dispositivo')
    .then(res => {  
      this.setState({ dadosDispositivos: res.data });

      this.state.isPc = this.isDispositivoPc(this.state.dadosDispositivos);

    })
    .catch(error => console.log(error));
  };



  getLiberaV6 =  async () => { 

    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_liberaV6')
    .then(res => {  
      res.data.map((dados, index) => (
        
       this.state.lojasLiberar.push(dados.CODIGO)
      ));

      this.state.lojasLiberar.push(31276);
      this.state.lojasLiberar.push(19778);
    })
    .catch(error => console.log(error));
  };


  isDispositivoPc = (dadosDispositivos) => {
    let userAgent = navigator.userAgent.toString();
    userAgent = userAgent.toLowerCase();
    this.state.userAgent = userAgent;

    let appVersion = navigator.appVersion.toLowerCase();  
    this.state.appVersion = appVersion;

    let arrayDispBloq = Array();

    dadosDispositivos.map((dados, index) => (
        arrayDispBloq.push(dados.DISPOSITIVO)
    ));

    for(let i = 0; i< arrayDispBloq.length; i++){
      if (userAgent.indexOf(arrayDispBloq[i]) != '-1' || appVersion.indexOf(arrayDispBloq[i]) != '-1'){
          return true;
      }
    }

     let devices = ['nokia',
    'iphone','blackberry','sony','lg',
    'htc_tattoo','samsung','symbian','SymbianOS','elaine','palm',
    'series60','android','obigo',
    'openwave','mobilexplorer','operamini', 'mobile'];

    for(let i = 0; i < devices.length; i++) {
        if (userAgent.indexOf(devices[i]) != '-1') {
            return false;
        }
    }

    return true;
  }

  getGeoLocalizacao = async () => {
      let urlGeoLocalizacao = "https://nominatim.openstreetmap.org/reverse?format=json&lat="+this.state.latitude+"&lon="+this.state.longitude;

      await axios.get(
        urlGeoLocalizacao,
        '').then((response) => {
            const paisDefault  = 'brasil';
            let paisGeo = response.data.address.country.toLowerCase().trim();
            if(paisGeo !== paisDefault) {
              this.setState({paisGeo : paisGeo, isExcecao : false})
            }
      })
      .catch((error) => {
        console.log('error', error);
      });

  }
  
  validaGeoLocalizacao = async () => { 
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_exececao_exterior?codigoAF='+this.state.codigoAF)
    .then(res => {  
      if(res.data.length !== 0) {
        if(this.state.paisGeo !== res.data[0].PAIS.toString().toLowerCase().trim()) { 
          this.setState({isExcecao: false, isEncerrar: true});
        } else {
          this.setState({isExcecao: true});
        }
      } 
	})
	.catch(error => console.log(error));
  }

  encerraProposta = async () => {

      const FormData = require('form-data');
      const axios = require('axios');
      const formData = new FormData();

      var informacoesDoDispositivo = "";
      informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
      informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
      informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
      informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
      informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;

      formData.set('infoDoDispositivo', informacoesDoDispositivo);
      formData.set('proposta', this.state.codigoAF);
      formData.set('isEncerrar', true);

      await axios({
        method: 'post',
        url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(function (response) {
        this.state.proximoLink = '/andamento/'+this.props.match.params.propostaId;
        this.props.history.push(this.state.proximoLink);
      }.bind(this))
      .catch(function (response) {
          this.setState({ carregando : false });
          alert("Erro ao realizar a formalização!");
      }.bind(this));

      return false;
  }


  toggleMdlDados = () => {

    if(this.state.modalDados === false) {
      this.setState({modalDados: true});  
      
    } else {
      this.setState({modalDados: false});  
      
    }
  }


  gravaLogAcessos = () => {
    let dataHora = [new Date().getFullYear(), new Date().getMonth()+1, (new Date().getDate()) < 10 ? '0'+(new Date().getDate()) : (new Date().getDate()) ].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':');
    const FormData = require('form-data');
    const formData = new FormData();

    let tipo = (this.state.isPc ==  true) ? 'PC Desktop' : 'Mobile';
    let msgRetorno = (this.state.userAgent !== "") ? this.state.userAgent : this.state.appVersion;

    formData.append('dataHora', dataHora);
    formData.append('codigoAF', this.state.codigoAF);
    formData.append('msgRetorno', msgRetorno);
    formData.append('tipoDispositivo', tipo);

    axios.post("https://app.factafinanceira.com.br/proposta/setDadosUserMobile", formData).then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log('error', error);
    });

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
      "letterSpacing" : '-1px'
    };

    const styleSpinner = {
      "padding": "20px",
      "margin": "200px auto"
    }

    let DADOS_AF = this.state.dadosProposta;
    let DADOS_CLIENTE = this.state.dadosCliente;
    let DADOS_CORRETOR = DADOS_AF.CORRETOR;

    return (
      <div className='align-items-center' style={appHeightAuto} >

        { this.state.carregando
          ? <Row className="text-center">
              <Col md="12" lg="12" xl="12">
              <div className="spinner-border text-info">
              <span className="sr-only">Carregando...</span>
            </div>
          </Col>
        </Row>
          : <>
            {this.state.navegadorCompativel === true
              ? (
                this.state.permissaoLocalizacao === true
                ? (
                    <>
                    <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
                      <LayoutFactaHeader />
                      <Row className="mt-6">

                        { isMobile === false
                          ? <>
                              <Col md="5" style={{ 'position' : 'relative' }}>
                                  <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                                  <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                                  <div style={{"display" : this.state.liberaFormalizacao.indexOf(DADOS_AF.TIPOANALISE) !== -1 && (DADOS_AF.nometabela === null || DADOS_AF.nometabela === '') ? "block" : "none"}}>
                                    <TimelineProgresso
                                      bemvindo="fa fa-square-o"
                                      uso="fa fa-square-o"
                                      proposta="fa fa-square-o"
                                      residencia="fa fa-square-o"
                                      fotos="fa fa-square-o"
                                      audio="fa fa-square-o"
                                    />
                                  </div>
                              </Col>
                            </>
                          : null
                        }

                        {this.state.isErrorGeo === false &&
                          <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                            { this.state.liberaFormalizacao.indexOf(DADOS_AF.TIPOANALISE) !== -1 && (DADOS_AF.nometabela === null || DADOS_AF.nometabela === '')
                              ? <>
                                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                    <CardBody>
                                      <Row className="mt-3 text-justify">
                                        <Col xs="12" sm="12">
                                          <h5 className="text-center mb-3">Assinatura de Proposta Digital</h5>
                                          <p className="text-muted">Olá <span className="font-weight-bold text-dark">{DADOS_CLIENTE.DESCRICAO}</span>,</p>
                                          <p className="text-muted">falta pouco para você concluir a contratação do seu empréstimo.</p>
                                          <p className="text-muted">Só precisamos confirmar algumas informações antes de fazer a liberação, ok?</p>
                                          <p className="text-muted">Ah... já ia esquecendo. Para uma melhor experiência, recomendamos realizar esse processo conectado em uma rede WI-FI :)</p>
                                          { false && this.state.navegadorSamsungBrowser === true
                                            ? <>
                                              <p>Navegador Samsung</p>
                                              <p>{ this.state.samsungBrowserVersion }</p>
                                              <p>{ parseInt(this.state.samsungBrowserVersion) < 15 ? 'Menor que 15' : 'Igual ou maior' }</p>
                                              </>
                                            : null
                                          }
                                          {/*
                                          <p>{ this.state.userAgent.substr(this.state.userAgent.indexOf(") ") + 1) }</p>
                                          <p>{ this.state.appVersion.substr(this.state.appVersion.indexOf(") ") + 1) }</p>
                                          <a href='market://details?id=com.sec.android.app.sbrowser'>ATUALIZAR NAVEGADOR</a>
                                          */}

                                        </Col>
                                      </Row>
                                      <Row className="mt-3">
                                      
                                      {this.state.isPc == false && this.state.isExcecao === true
                                      ?<> 

                                          <Col xs="12" sm="12">
                                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                            pathname: this.state.proximoLink,
                                            state: {
                                              navegacao: true,
                                              averbador: DADOS_AF.Averbador,
                                              DADOS_PROPOSTA_DIGITAL: DADOS_AF,
                                              dataHoraPrimeiraTela: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
                                              geoInicial: this.state.localizacaoInicial
                                            }
                                          }} >
                                            Continuar
                                          </Link>
                                        </Col>
                                      </>
                                      :<>
                                              {(this.state.dadosProposta.CORRETOR.Franquia == 'S' || this.state.dadosProposta.CORRETOR.Classificacao != 1) && this.state.isExcecao === true 
                                                ?<>
                                                <Col xs="12" sm="12">
                                                    <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                                      pathname: this.state.proximoLink,
                                                      state: {
                                                        navegacao: true,
                                                        averbador: DADOS_AF.Averbador,
                                                        DADOS_PROPOSTA_DIGITAL: DADOS_AF,
                                                        dataHoraPrimeiraTela: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
                                                        geoInicial: this.state.localizacaoInicial
                                                      }
                                                    }} >
                                                      Continuar
                                                    </Link>
                                                  </Col>
                                                  </>
                                                :<>
                                                  {parseInt(this.state.dadosProposta.CORRETOR.Classificacao) == 1  && this.state.isPc != true && this.state.isExcecao === true
                                                  ? <> 
                                                  
                                                  <Col xs="12" sm="12">
                                                    <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                                      pathname: this.state.proximoLink,
                                                      state: {
                                                        navegacao: true,
                                                        averbador: DADOS_AF.Averbador,
                                                        DADOS_PROPOSTA_DIGITAL: DADOS_AF,
                                                        dataHoraPrimeiraTela: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
                                                        geoInicial: this.state.localizacaoInicial
                                                      }
                                                    }} >
                                                      Continuar
                                                    </Link>
                                                  </Col>
                                                  </>
                                                  : <>
                                                      <Col xs="12">
                                                        <Modal isOpen={this.state.modalDados} toggle={this.modalDados} className='modal-primary modal-dialog-centered' style={{'zIndex' : 9999}}>
                                                            <ModalHeader toggle={this.toggleMdlDados}>Atenção</ModalHeader>
                                                            <ModalBody>
                                                              <Row className="mt-1">
                                                                <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                                  <i className="fa fa-times-circle-o align-self-center h2"></i>
                                                                </Col>
                                                                <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                                  <p className="align-self-center">Para realizar a formalização você deve acessar de um dipositivo móvel!!</p>
                                                                </Col>
                                                              </Row>
                                                              <Row className="mt-1">
                                                                <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                                                                  <Button color="success" onClick={this.toggleMdlDados}>Ok</Button>
                                                                </Col>
                                                              </Row>
                                                            </ModalBody>
                                                          </Modal>
                                                      </Col>

                                                      <Col xs="12" sm="12">
                                                      <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" 
                                                        onClick={() => (this.state.isEncerrar === false) ?  this.setState({ modalDados : true}) : this.encerraProposta() } 
                                                        to="#"
                                                        >
                                                        Continuar
                                                      </Link>
                                                      </Col>
                                                  </>

                                                  }
                                                </>
                                                } 
                                      </>}
                                    
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </>
                              : <>
                                { this.state.reprovada.indexOf(DADOS_AF.TIPOANALISE) !== -1
                                  ? <>
                                      <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                        <CardBody>
                                          <Row className="mt-3 text-center">
                                            <Col xs="12" sm="12">
                                              <h5 className="text-center mb-3">Assinatura de Proposta Digital</h5>
                                              <p className="text-muted">Olá <span className="font-weight-bold text-dark">{DADOS_CLIENTE.DESCRICAO}</span>,</p>
                                              <p className="text-muted">sua solicitação de empréstimo foi reprovada.</p>
                                              <p><i className="fa fa-meh-o fa-lg h1 text-danger"></i></p>
                                            </Col>
                                          </Row>
                                          <Row className="">
                                            <Col xs="12" sm="12">
                                              <h5>Em caso de dúvidas, entre em contato pelo(s) telefone(s) abaixo:</h5>
                                              { DADOS_CORRETOR.FONE !== ''
                                                ?
                                                  <h4>
                                                    <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                                    <span>{ this.mtel(DADOS_CORRETOR.FONE)}</span>
                                                  </h4>
                                                : DADOS_CORRETOR.FONE_COMERCIAL !== ''
                                                  ?
                                                    <h4>
                                                      <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                                      <span>{ this.mtel(DADOS_CORRETOR.FONE_COMERCIAL) }</span>
                                                    </h4>
                                                  : DADOS_CORRETOR.CELULAR !== ''
                                                    ?
                                                      <h4>
                                                        <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                                        <span>{ this.mtel(DADOS_CORRETOR.CELULAR) }</span>
                                                      </h4>
                                                    : null
                                                }
                                            </Col>
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </>
                                  : <>
                                      <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                        <CardBody>
                                          <Row className="mt-3 text-justify">
                                            <Col xs="12" sm="12">
                                              <h5 className="text-center mb-3">Assinatura de Proposta Digital</h5>
                                              <p className="text-muted">Olá <span className="font-weight-bold text-dark">{DADOS_CLIENTE.DESCRICAO}</span>,</p>
                                              <p className="text-muted">você já realizou a assinatura da sua proposta.</p>
                                            </Col>
                                          </Row>
                                          <Row className="mt-3">
                                            <Col xs="12" sm="12">
                                              <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                                pathname: '/andamento/' + this.state.codigoAF64,
                                                state: {
                                                  navegacao: true,
                                                  averbador: DADOS_AF.Averbador
                                                }
                                              }} >
                                                Acompanhar proposta
                                              </Link>
                                            </Col>
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </>
                                  }
                                </>
                              }

                          </Col>
                        }

                        {this.state.isErrorGeo === true  && this.state.clicouErrorGeo === false &&
                          <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>

                            <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                    <CardBody>
                                      <Row className="mt-3 text-justify">
                                        <Col xs="12" sm="12">
                                          <h5 className="text-center mb-3">Assinatura de Proposta Digital</h5>
                                          <p className="text-muted">Olá <span className="font-weight-bold text-dark">{DADOS_CLIENTE.DESCRICAO}</span>,</p>
                                          <p className="text-muted">falta pouco para você concluir a contratação do seu empréstimo.</p>
                                          <p className="text-muted">Só precisamos confirmar algumas informações antes de fazer a liberação, ok?</p>
                                          <p className="text-muted">Ah... já ia esquecendo. Para uma melhor experiência, recomendamos realizar esse processo conectado em uma rede WI-FI :)</p>
                                          { false && this.state.navegadorSamsungBrowser === true
                                            ? <>
                                              <p>Navegador Samsung</p>
                                              <p>{ this.state.samsungBrowserVersion }</p>
                                              <p>{ parseInt(this.state.samsungBrowserVersion) < 15 ? 'Menor que 15' : 'Igual ou maior' }</p>
                                              </>
                                            : null
                                          }
                                          {/*
                                          <p>{ this.state.userAgent.substr(this.state.userAgent.indexOf(") ") + 1) }</p>
                                          <p>{ this.state.appVersion.substr(this.state.appVersion.indexOf(") ") + 1) }</p>
                                          <a href='market://details?id=com.sec.android.app.sbrowser'>ATUALIZAR NAVEGADOR</a>
                                          */}

                                        </Col>
                                        <Col xs="12" sm="12">
                                            <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" 
                                              onClick={() =>  this.setState({ clicouErrorGeo : true, permissaoLocalizacao : false})  } 
                                              to="#"
                                              >
                                              Continuar
                                            </Link>
                                        </Col>
                                      </Row>
                                   </CardBody>
                              </Card>
                          </Col>
                        }


                        </Row>
                      </Col>
                    </>
                  )
                : <>{ this.state.reprovada.indexOf(DADOS_AF.TIPOANALISE) !== -1
                  ? <>
                  <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
                    <LayoutFactaHeader />
                    <Row className="mt-6">
                    <Col md={{size: 10, offset: 1}}>
                      <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                        <CardBody>
                          <Row className="mt-3 text-center">
                            <Col xs="12" sm="12">
                              <h5 className="text-center mb-3">Assinatura de Proposta Digital</h5>
                              <p className="text-muted">Olá <span className="font-weight-bold text-dark">{DADOS_CLIENTE.DESCRICAO}</span>,</p>
                              <p className="text-muted">sua solicitação de empréstimo foi reprovada.</p>
                              <p><i className="fa fa-meh-o fa-lg h1 text-danger"></i></p>
                            </Col>
                          </Row>
                          <Row className="">
                            <Col xs="12" sm="12">
                              <h5>Em caso de dúvidas, entre em contato pelo(s) telefone(s) abaixo:</h5>
                              { DADOS_CORRETOR.FONE !== ''
                                ?
                                  <h4>
                                    <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                    <span>{ this.mtel(DADOS_CORRETOR.FONE)}</span>
                                  </h4>
                                : DADOS_CORRETOR.FONE_COMERCIAL !== ''
                                  ?
                                    <h4>
                                      <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                      <span>{ this.mtel(DADOS_CORRETOR.FONE_COMERCIAL) }</span>
                                    </h4>
                                  : DADOS_CORRETOR.CELULAR !== ''
                                    ?
                                      <h4>
                                        <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                        <span>{ this.mtel(DADOS_CORRETOR.CELULAR) }</span>
                                      </h4>
                                    : null
                                }
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                      </Col>
                      </Row>
                      </Col>
                    </>
                  : <>
                      <PaginaMensagemLocalizacao nome = {DADOS_CLIENTE.DESCRICAO} />
                    </>
                  }</>
              )
              : <PaginaMensagemNavegador />
            }
            </>

          }
      </div>
    );
  }
}

export default Digital;
