import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import axios from 'axios';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';
import PaginaMensagemNavegador from '../../../PaginaMensagemNavegador';
import { isMobile } from 'react-device-detect';
class Pendencias extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center position-absolute p-5">Loading...</div>

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: true,
      timeout: 300,
      tipoPendencia: props.tipo,
      codigoAF: atob(this.props.match.params.propostaId),
      codigoAF64: this.props.match.params.propostaId,
      proximoLink: '/termo/'+this.props.match.params.propostaId,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      carregando: true,
      navegadorCompativel: true,
      permissaoLocalizacao: false,
      localizacaoInicial: '',
      liberaFormalizacao: [],
      reprovada: [4, 28, 49],
      dados_pendencia: [],
      dadosProposta: [],
      dadosCliente: [],
      dadosCorretor: [],
      liberaResolucaoPendencias: true,
      corretoresRosa: [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760],
      isPc: false,
      modalDados: false,
      tipoCelular: '',
      dataHoraAtual: '',
      palavra_chave: ''
    };

    if (this.state.tipoPendencia === "pendencias") {
      this.state.liberaFormalizacao = [3];
    }
    else {
      this.state.liberaFormalizacao = [14, 16, 17];
    }

    if (this.props.location.state === undefined) {
      //this.props.history.push(this.state.homeLink);
    }

    localStorage.setItem('@app-factafinanceira-formalizacao/exibirTimeline', 0);

 

  }

  componentDidMount() {

    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
		if (iOS === true && navigator.appVersion.indexOf("CriOS") !== -1){
        this.setState({ navegadorCompativel: false });
		}

    navigator.geolocation.getCurrentPosition(
      function(position) {
        console.log(position);
        this.setState({ localizacaoInicial: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });
      }.bind(this),
      function(error) {
        this.setState({ permissaoLocalizacao: false });
      }.bind(this)
    );

    this.getBloqueioDispositivo();

    /*
      let isPc  = this.isDispositivoPc();
      this.state.isPc = isPc;
      //this.state.isPc = false;
    */
    

      

    this.getPendencias();

    this.gravaLogAcessos();

  }

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

  toggleMdlDados = () => {

    if(this.state.modalDados === false) {
      this.setState({modalDados: true});  
      
    } else {
      this.setState({modalDados: false});  
      
    }
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

  mtel(v) {
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
  }

  getPendencias = async () => {
    if (this.state.tipoPendencia === "pendencias") {
      await axios
      .get('https://app.factafinanceira.com.br/proposta/get_pendencias_proposta?codigo=' + this.state.codigoAF)
      .then(res => (
        this.setState({
          dados_pendencia: res.data,
          dadosProposta: res.data.PROPOSTA,
          dadosCliente: res.data.CLIENTE,
          dadosCorretor: res.data.CORRETOR,
          carregando: false
        })))
      .catch(error => console.log(error));

      
      var int_averbador = parseInt(this.state.dados_pendencia.Averbador);
      var int_classificacao = parseInt(this.state.dados_pendencia.CORRETOR.Classificacao);
      var int_codigo = parseInt(this.state.dados_pendencia.CORRETOR.CODIGO);

      // Se for GOV RS, MEX OU SIAPE mantém na formalização nova
      if (int_averbador === 1 || int_averbador === 10 || int_averbador === 15 || int_averbador === 30 || int_averbador === 20095 || int_averbador === 3) {
        // Ficar aqui
      }
      // Se for o Corretor 5083 (MLFREITAS) OU 15152 e PRESENCIAL, joga para formalização antiga
     /* else if ( ((int_codigo === 5083 || int_codigo === 15152) || this.state.dados_pendencia.CORRETOR.Franquia === "S") && this.state.dados_pendencia.codigotabela === 'PRE') {
        window.location.href = 'https://app.factafinanceira.com.br/pendencias/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }*/
      // Se for irmãos PRESENCIAL, vai para formalização antiga
      /*else if ( this.state.corretoresRosa.indexOf(int_codigo) !== -1 && this.state.dados_pendencia.codigotabela === 'PRE') {
        window.location.href = 'https://app.factafinanceira.com.br/pendencias/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }*/
      // SE FOR LOJA E A PROPOSTA FOR PRESENCIAL JOGA PARA FORMALIZAÇÃO ANTIGA
      /*else if (int_classificacao === 2 && this.state.dados_pendencia.codigotabela === 'PRE') {
        window.location.href = 'https://app.factafinanceira.com.br/pendencias/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }*/

/*
      if(int_averbador === 3 || int_averbador === 20095 || int_averbador === 15 || int_averbador === 10226 || int_averbador === 390 || int_averbador === 1 || int_averbador === 30 || int_averbador === 20124) {
        window.location.href = 'https://app.factafinanceira.com.br/v3/#/pendencias/' + this.state.codigoAF64;
        this.setState({ carregando : true });
        return false;
      }
*/
      if (this.state.dados_pendencia.pendencia_de_valores === true || this.state.dados_pendencia.pendencia_valores_somente === true) {
        let orgao = '';
        if (this.state.dadosProposta.Averbador === 1) {
          orgao = 'facta-tesouro';
        }
        else if (this.state.dadosProposta.Averbador === 3) {
          orgao = 'facta-inss';
        }
        else if (this.state.dadosProposta.Averbador === 10) {
          orgao = 'facta-mex';
        }
        else if (this.state.dadosProposta.Averbador === 15) {
          orgao = 'facta-siape';
        }
        else if (this.state.dadosProposta.Averbador === 30) {
          orgao = 'facta-ipe';
        }
        else if (this.state.dadosProposta.Averbador === 390) {
          orgao = 'facta-facil';
        }


        this.setState({ proximoLink: '/pendencias-ccb-' + orgao + '/'+this.props.match.params.propostaId });


        if (this.state.dadosProposta.Averbador === 20095) {
            orgao = 'facta-fgts';
            this.setState({ proximoLink: '/pendencias-' + orgao + '/'+this.props.match.params.propostaId });
        }
      }
      else if ( (this.state.dados_pendencia.pendencia_de_documentos === true || this.state.dados_pendencia.pendencia_de_selfie === true)  && (this.state.dadosProposta.Averbador === 3) && (int_classificacao === 1 || int_classificacao === 2) ) { 
        this.setState({ proximoLink: '/pendencias-tipo-documentos-unico/'+this.props.match.params.propostaId });
      }
      else if (this.state.dados_pendencia.pendencia_de_documentos === true && (this.state.dadosProposta.Averbador === 20095)  && (int_classificacao === 1 || int_classificacao === 2)  ) { 
        this.setState({ proximoLink: '/pendencias-tipo-documentos-unico/'+this.props.match.params.propostaId });
      }
      else if (this.state.dados_pendencia.pendencia_de_documentos === true) {
        /*
          if(int_averbador === 3 || int_averbador === 20095 || int_averbador === 15 || int_averbador === 10226 || int_averbador === 390 || int_averbador === 1 || int_averbador === 30 || int_averbador === 20124) {
            window.location.href = 'https://app.factafinanceira.com.br/v3/#/pendencias/' + this.state.codigoAF64;
            this.setState({ carregando : true });
            return false;
          }*/
        
        this.setState({ proximoLink: '/pendencias-tipo-documentos-unico/'+this.props.match.params.propostaId });
      }
      else if (this.state.dados_pendencia.pendencia_de_selfie === true) {
        this.setState({ proximoLink: '/pendencias-tipo-documentos-unico/'+this.props.match.params.propostaId });
      }
      else if (this.state.dados_pendencia.pendencia_de_audio === true) {
        this.setState({ proximoLink: '/pendencias-tipo-documentos-unico/'+this.props.match.params.propostaId });
        //this.setState({ proximoLink: '/pendencias-ccb-facta-inss/'+this.props.match.params.propostaId });
      }

      if (this.state.dados_pendencia.pendencia_de_valores === false && this.state.dados_pendencia.pendencia_de_documentos == false &&
          this.state.dados_pendencia.pendencia_de_selfie == false && this.state.dados_pendencia.pendencia_de_audio === false) {
        this.setState({ liberaResolucaoPendencias : false });
      }

    }
    else {
      await axios
      .get('https://app.factafinanceira.com.br/proposta/get_dados_regularizacao?codigo=' + this.state.codigoAF)
      .then(res => (
        console.log(res.data),
        this.setState({
          dados_pendencia: res.data,
          dadosProposta: res.data.PROPOSTA,
          dadosCliente: res.data.CLIENTE,
          dadosCorretor: res.data.CORRETOR,
          carregando: false
        })))
      .catch(error => console.log(error));
      if (this.state.dados_pendencia.pendencia_de_valores === true) {
        let orgao = '';
        if (this.state.dadosProposta.Averbador === 1) {
          orgao = 'facta-tesouro';
        }
        else if (this.state.dadosProposta.Averbador === 3) {
          orgao = 'facta-inss';
        }
        else if (this.state.dadosProposta.Averbador === 10) {
          orgao = 'facta-mex';
        }
        else if (this.state.dadosProposta.Averbador === 15) {
          orgao = 'facta-siape';
        }
        else if (this.state.dadosProposta.Averbador === 30) {
          orgao = 'facta-ipe';
        }
        else if (this.state.dadosProposta.Averbador === 100) {
          orgao = 'facta-poder-judiciario';
        }
        else if (this.state.dadosProposta.Averbador === 390) {
          orgao = 'facta-facil';
        }
        this.setState({ proximoLink: '/regularizacao-ccb-' + orgao + '/'+this.props.match.params.propostaId });
  		}
  		else if (this.state.dados_pendencia.pendencia_de_documentos === true) {
        this.setState({ proximoLink: '/regularizacao-tipo-documento/'+this.props.match.params.propostaId });
  		}
  		else if (this.state.dados_pendencia.pendencia_de_selfie === true) {
  			this.setState({ proximoLink: '/regularizacao-selfie/'+this.props.match.params.propostaId });
  		}
  		else if (this.state.dados_pendencia.pendencia_de_audio === true) {
  			this.setState({ proximoLink: '/regularizacao-gravacao-de-audio/'+this.props.match.params.propostaId });
        //this.setState({ proximoLink: '/pendencias-ccb-facta-inss/'+this.props.match.params.propostaId });
  		}
    }
  };

  gravaLogAcessos = () => {
    let dataHora = [new Date().getFullYear(), new Date().getMonth()+1, (new Date().getDate()) < 10 ? '0'+(new Date().getDate()) : (new Date().getDate()) ].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':');
    
    const FormData = require('form-data');
    const formData = new FormData();

    let tipo = (this.state.isPc ==  true) ? 'PC Desktop' : 'Mobile';

    formData.append('dataHora', dataHora);
    formData.append('codigoAF', this.state.codigoAF);
    formData.append('msgRetorno', this.state.userAgent);
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

    let DADOS_AF = this.state.dadosProposta;
    let DADOS_CLIENTE = this.state.dadosCliente;
    let DADOS_CORRETOR = DADOS_AF.CORRETOR;
    let DADOS_PENDENCIA = this.state.dados_pendencia;

    return (
      <div className='app align-items-center' style={appHeightAuto} >

        { this.state.carregando
          ? <LayoutFactaCarregando />
          : <>
            {this.state.navegadorCompativel === true
              ? (
                this.state.permissaoLocalizacao === true
                ? (
                    <>
                    <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
                      <LayoutFactaHeader />
                      
                      {(isMobile === false) && 
                        <Col md={{size: 10, offset: 1}} style={{ 'position' : 'relative' }}>
                          <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                          <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                        </Col>
                      }
                      <Row className="mt-4">
                        <Col md={{size: 8, offset: 2}}>
                          { this.state.liberaResolucaoPendencias === true && (
                            ( this.state.tipoPendencia === "pendencias" && (DADOS_AF.TIPOANALISE === 3 || (DADOS_AF.DADOSMESACREDITO[0] !== undefined && DADOS_AF.DADOSMESACREDITO[0].Status === 4)))
                            ||
                            (this.state.liberaFormalizacao.indexOf(DADOS_AF.TIPOANALISE) !== -1)
                          )
                            ? <>
                                <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                  <CardBody>
                                    <Row className="mt-3 text-justify">
                                      <Col xs="12" sm="12">
                                        <h5 className="text-center mb-3">Assinatura de Proposta Digital</h5>
                                        <h5 className="text-center mb-3">{ this.state.tipoPendencia === "pendencias" ? "Resolução de Pendências" : "Regularização de Contrato" }</h5>
                                        <p className="text-muted">Olá <span className="font-weight-bold text-dark">{ DADOS_CLIENTE.DESCRICAO }</span>,</p>
                                        <p className="text-muted">falta pouco para você concluir a contratação do seu empréstimo.</p>
                                        <p className="text-muted">Basta solucionar as pendências que a nossa equipe encontrou.</p>
                                        <p className="text-muted">Veja abaixo os itens necessários:</p>

                                        { DADOS_PENDENCIA.pendencia_de_documentos === true
                                          ? <p className="font-weight-bold mb-2 h5 text-danger mt-3"> - Reenviar Documento de Identificação</p>
                                          : null
                                        }

                                        { DADOS_PENDENCIA.pendencia_de_selfie === true
                                          ? <p className="font-weight-bold mb-2 h5 text-danger mt-3"> - Tirar Nova Selfie</p>
                                          : null
                                        }

                                        { DADOS_PENDENCIA.pendencia_de_audio === true
                                          ? <p className="font-weight-bold mb-2 h5 text-danger mt-3"> - Realizar Nova Gravação de Áudio</p>
                                          : null
                                        }

                                        { DADOS_PENDENCIA.pendencia_de_valores === true || DADOS_PENDENCIA.pendencia_valores_somente === true
                                          ? <p className="font-weight-bold mb-2 h5 text-danger mt-3"> - Alteração de valores</p>
                                          : null
                                        }

                                      </Col>
                                    </Row>
                                    <Row className="mt-3">
                                            
                                    {this.state.isPc == false
                                    ?<> 
                                            <Col xs="12" sm="12">
                                              <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                                pathname: this.state.proximoLink,
                                                state: {
                                                  navegacao: true,
                                                  averbador: DADOS_AF.Averbador,
                                                  obj_proposta: DADOS_AF,
                                                  dataHoraPrimeiraTela: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
                                                  geoInicial: this.state.localizacaoInicial,
                                                  obj_pendencias: this.state.dados_pendencia,
                                                  tipoFormalizacao: 'pendencias'
                                                }
                                              }} >
                                                Continuar
                                              </Link>
                                            </Col>

                                            </>
                                    :<>
                                        
                                        {this.state.dados_pendencia.CORRETOR.Franquia == 'S' || this.state.dados_pendencia.CORRETOR.Classificacao != 1 
                                          ?<> 

                                            <Col xs="12" sm="12">
                                              <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                                pathname: this.state.proximoLink,
                                                state: {
                                                  navegacao: true,
                                                  averbador: DADOS_AF.Averbador,
                                                  obj_proposta: DADOS_AF,
                                                  dataHoraPrimeiraTela: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
                                                  geoInicial: this.state.localizacaoInicial,
                                                  obj_pendencias: this.state.dados_pendencia,
                                                  tipoFormalizacao: 'pendencias'
                                                }
                                              }} >
                                                Continuar
                                              </Link>
                                            </Col>


                                          </>
                                          :<> 
                                                 {parseInt(this.state.dados_pendencia.CORRETOR.Classificacao) == 1  && this.state.isPc != true 
                                                ?<> 
                                                
                                                    <Col xs="12" sm="12">
                                                    <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                                        pathname: this.state.proximoLink,
                                                        state: {
                                                        navegacao: true,
                                                        averbador: DADOS_AF.Averbador,
                                                        obj_proposta: DADOS_AF,
                                                        dataHoraPrimeiraTela: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
                                                        geoInicial: this.state.localizacaoInicial,
                                                        obj_pendencias: this.state.dados_pendencia,
                                                        tipoFormalizacao: 'pendencias'
                                                        }
                                                    }} >
                                                    Continuar
                                                    </Link>
                                                    </Col>



                                                
                                                </> 
                                                :<>
                                                
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
                                                      onClick={() => this.setState({ modalDados : true}) }
                                                      to="#"
                                                      >
                                                      Continuar
                                                    </Link>
                                                    </Col>
                                                
                                                
                                                </>}

                                          
                                          </>
                                        }
                                         
                                    </> 
                                    }





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
                                            <p className="text-muted">Olá <span className="font-weight-bold text-dark">{ DADOS_CLIENTE.DESCRICAO }</span>,</p>
                                            <p className="text-muted">sua solicitação de empréstimo foi reprovada. <span className="text-danger">:(</span></p>
                                          </Col>
                                        </Row>
                                        <Row className="mt-3">
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
                                            <p className="text-muted">Olá <span className="font-weight-bold text-dark">{ DADOS_CLIENTE.DESCRICAO }</span>,</p>
                                            <p className="text-muted">você já realizou a assinatura da sua proposta.</p>
                                          </Col>
                                        </Row>
                                        <Row className="mt-3">
                                          <Col xs="12" sm="12">
                                            <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                              pathname: '/andamento/' + this.state.codigoAF64,
                                              state: {
                                                navegacao: true,
                                                averbador: DADOS_AF.Averbador,
                                                obj_proposta: DADOS_AF,
                                                obj_pendencias: this.state.dados_pendencia,
                                                tipo: 'pendencias'
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
                      </Row>
                      </Col>
                    </>
                  )
                : <PaginaMensagemLocalizacao />
              )
              : <PaginaMensagemNavegador />
            }
            </>

          }
      </div>
    );
  }
}

export default Pendencias;
