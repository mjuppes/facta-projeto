import React, { Component } from 'react';
import { Button, Collapse, Col, Row, Card, CardBody } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';
import TimelineProgresso from '../../TimelineProgresso';
import axios from 'axios';

import {isHoraMaior} from "../../../config";
class Termo extends Component {

  constructor(props) {
    super(props);

    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.toggleCustom = this.toggleCustom.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: false,
      accordion: [false, false, false, false],
      custom: [false, false, false, false],
      status: 'Closed',
      fadeIn: true,
      timeout: 300,
      codigoAF: atob(this.props.match.params.propostaId),
      homeLink: '/digital/'+this.props.match.params.propostaId,
      //homeLink: '/totem-facta',
      permissaoLocalizacao: false,
      localizacaoTermo: '',
      dataHoraPrimeiraTela: '',
      geoInicial: '',
      obj_proposta: [],
      DADOS_PROPOSTA_DIGITAL: [],
      isEncerrar: false,
      
      /* Informação via API do dispositivo */
      as: "",
      city: "",
      country: "",
      countryCode: "",
      isp: "",
      lat: "",
      lon: "",
      org: "",
      query: "",
      region: "",
      regionName: "",
      status: "",
      timezone: "",
      zip: ""

    };

    if (this.props.location.state === undefined) {
      this.props.history.push(this.state.homeLink);
      return false;
    }

    this.state.DADOS_PROPOSTA_DIGITAL = this.props.location.state.DADOS_PROPOSTA_DIGITAL;
    this.state.obj_proposta = this.props.location.state.DADOS_PROPOSTA_DIGITAL;

    var PROP = this.state.DADOS_PROPOSTA_DIGITAL;

    let orgao = 'facta-inss';
    let _state = this.props.location.state;

    if (isHoraMaior(_state.dataHoraPrimeiraTela) === true) {
      this.props.history.push(this.state.homeLink);
      return false;
    }

    if (_state.averbador === 1) {
      orgao = 'facta-tesouro';
    }
    else if (_state.averbador === 3 && PROP.Tipo_Operacao !== 33) {
      orgao = 'facta-inss';
    }
    if (_state.averbador === 3 && PROP.Tipo_Operacao === 33) {
      orgao = 'facta-inss-cartao';
    }
    if (_state.averbador === 3 && (PROP.Tipo_Operacao === 36 || PROP.Tipo_Operacao === 40  || PROP.Tipo_Operacao === 42)) {
      orgao = 'inss-cartao-rep-legal';
    }
    else if (_state.averbador === 10) {
      orgao = 'facta-exercito';
    }
    else if (_state.averbador === 15 && PROP.Tipo_Operacao !== 33) {
      orgao = 'facta-siape';
    }
    else if (_state.averbador === 15 && PROP.Tipo_Operacao === 33) {
      orgao = 'facta-siape-cartao';
    }
    else if (_state.averbador === 30) {
      orgao = 'facta-ipe';
    }
    else if (_state.averbador === 100) {
      orgao = 'facta-poder-judiciario';
    }
    else if (_state.averbador === 390) {
      orgao = 'facta-facil';
    }
     // FACCIOLI - 22/06/2021
    else if (_state.averbador === 20095) {
      orgao = 'facta-fgts';
    }
    else if (_state.averbador === 10226) {
      orgao = 'facta-prf-poa';
    }
    else if (_state.averbador === 20124) {
      orgao = 'facta-aux-brasil';
    }else if( _state.averbador === 23 ) {
      orgao = 'facta-marinha';
    }

   // FACCIOLI - 22/06/2021
    if(_state.averbador === 20095) { 
      this.state.proximoLink = '/'+orgao+'/'+this.props.match.params.propostaId;
    }
    if (_state.averbador === 20124) {
      this.state.proximoLink = '/'+orgao+'/'+this.props.match.params.propostaId;
    }
    else if(_state.averbador !== 20095 && _state.averbador !== 20124) {
      this.state.proximoLink = '/ccb-'+orgao+'/'+this.props.match.params.propostaId;
    }
    
    this.state.dataHoraPrimeiraTela = _state.dataHoraPrimeiraTela;
    this.state.geoInicial = _state.geoInicial;

    // Ifzinho para jogar direto para a tela da selfie para realizar testes de bloqueio
    if (false) {
        this.state.proximoLink = '/selfie/'+this.props.match.params.propostaId;
    }

  }

  componentDidMount() {
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
    navigator.geolocation.getCurrentPosition(
      function(position) {
        this.setState({ localizacaoTermo: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });
      }.bind(this),
      function(error) {
        this.setState({ permissaoLocalizacao: false });
      }.bind(this)
    );

    this.getDadosLogDispositivo();

    if (this.props.location.state !== undefined) {
      let retIpApi = this.getIpDispositivo();
    }

    console.log('obj_proposta');
    console.log(this.state.obj_proposta);
  }

  onEntering() {
    this.setState({ status: 'Opening...' });
  }

  onEntered() {
    this.setState({ status: 'Opened' });
  }

  onExiting() {
    this.setState({ status: 'Closing...' });
  }

  onExited() {
    this.setState({ status: 'Closed' });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  
  getDadosLogDispositivo = async () => { 
    await
     axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_dispositivo_log?codigoAF='+this.state.codigoAF)
    .then(res => {  
        if(res.data ==  true) {
          this.setState({isEncerrar : true})
        } else {
          this.setState({isEncerrar : false})
        }
    })
    .catch(error => console.log(error));
  }

  setGravaDadosDispositivo = async () => { 
    const FormData = require('form-data');
    const axios = require('axios');
    const formData = new FormData();

    formData.set('codigo_af', this.state.codigoAF);
    formData.set('as', this.state.as);
    formData.set('city', this.state.city);
    formData.set('country', this.state.country);
    formData.set('countryCode', this.state.countryCode);
    formData.set('isp', this.state.isp);
    formData.set('lat', this.state.lat);
    formData.set('lon', this.state.lon);
    formData.set('org', this.state.org);
    formData.set('query', this.state.query);
    formData.set('region', this.state.region);
    formData.set('regionName', this.state.regionName);
    formData.set('status', this.state.status);
    formData.set('timezone', this.state.timezone);
    formData.set('zip', this.state.zip);

    await axios({
      method: 'post',
      url: 'https://app.factafinanceira.com.br/proposta/set_dados_ip',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data' }
    })
    .catch(function (response) {
    }.bind(this));

    return true;
  }




  getIpDispositivo = async () => { 
    await
     axios
    .get('https://pro.ip-api.com/json/?key=ygbal37oYOpr9SC')
    .then(res => {  
      this.setState({
          as: res.data.as,
          city: res.data.city,
          country: res.data.country,
          countryCode: res.data.countryCode,
          isp: res.data.isp,
          lat: res.data.lat,
          lon: res.data.lon,
          org: res.data.org,
          query: res.data.query,
          region: res.data.region,
          regionName: res.data.regionName,
          status: res.data.status,
          timezone: res.data.timezone,
          zip: res.data.zip 
      });

    })
    .catch(error => console.log(error));

    let retDispositivo = await this.setGravaDadosDispositivo();
    return true;
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

    this.setState({loadSpinner: true, mensagem : 'Finalizando proposta aguarde...'});

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

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  toggleCustom(tab) {

    const prevState = this.state.custom;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      custom: state,
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
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
      "letterSpacing" : '-1px',
      "overflow" : "auto"
    };

    return (
      <>
      { this.state.permissaoLocalizacao === true
        ? (
          <>
          <div className="app align-items-center" style={appHeightAuto} >

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
                          uso="fa fa-square-o"
                          proposta="fa fa-square-o"
                          residencia="fa fa-square-o"
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
                  <Row className="mt-3">
                    <Col xs="12" sm="12">
                      <h5 className="text-center mb-3 font-weight-bold">Termo de Assinatura Digital</h5>
                      <p className="text-muted text-justify">
                        Bem-vindo a Plataforma de Consignado para clientes da <span className="font-weight-bold text-dark">Facta Financeira S.A.</span>
                        ("Plataforma FACTA"). A seguir apresentamos a você, USUÁRIO PARCEIRO, os
                        Termos e Condições de Uso, documento que relaciona as principais regras que devem
                        ser observadas por todos que acessam a Plataforma FACTA ou utilizam suas funcionalidades.
                      </p>
                      <p className="text-muted text-justify">
                        Como condição para acesso e uso das funcionalidades exclusivas da <span className="font-weight-bold text-dark">Plataforma FACTA</span>,
                        sobretudo a contratação de serviços oferecidos pela <span className="font-weight-bold text-dark">Facta Financeira S.A.</span> e/ou empresas
                        de seu conglomerado ("FACTA"), é necessário criar uma conta de acesso, declarando o
                        USUÁRIO PARCEIRO que fez a leitura completa e atenta das regras deste documento,
                        estando plenamente ciente e de acordo com elas.
                      </p>

                      <div className="text-left" id="termosAccordion" data-children=".item">
                        <div className="item">
                          <Button className="m-0 p-0 h5 btn-block text-left" color="link" onClick={() => this.toggleCustom(0)} aria-expanded={this.state.custom[0]} aria-controls="termosAccordion1">
                            1. Informações Gerais
                          </Button>
                          <Collapse className="text-justify" isOpen={this.state.custom[0]} data-parent="#termosAccordion" id="termosAccordion1">
                            <p>1.1. Nosso objetivo é acabar com a complexidade e tentamos deixar essa Política o mais simples possível, mas caso ainda tenha dúvidas, canais de atendimento estão à sua disposição.</p>
                            <p>1.2. A nossa Política de Privacidade foi criada para reafirmar o compromisso da <span className="font-weight-bold text-dark">Facta Financeira</span> com a segurança, privacidade e a transparência no tratamento das suas informações. Ela descreve como coletamos e tratamos dados quando Você baixa nosso aplicativo no seu celular/tablet, trafega em nossos websites, solicita algum dos nossos serviços, se torna nosso cliente, firma contratações, usa nossos serviços ou entra em contato com a <span className="font-weight-bold text-dark">Facta Financeira</span> por meio dos canais de comunicação disponíveis.</p>
                            <p>1.3. Essas informações podem se referir àquelas necessárias para identificar Você, para fins de cadastro e cumprimento da legislação, tais como seu nome, CPF e foto, ou ainda àquelas necessárias para prover os serviços da <span className="font-weight-bold text-dark">Facta Financeira</span> de forma eficiente e segura, tais como seu histórico de crédito, seu endereço de correspondência, dentre outras. Podemos ainda coletar e tratar dados locacionais para permitir a <span className="font-weight-bold text-dark">Facta Financeira</span> oferecer melhores serviços a Você e garantir a sua segurança, como, por exemplo, identificando contratação indevida.</p>
                          </Collapse>
                        </div>
                        <div className="item">
                          <Button className="m-0 p-0 h5 btn-block text-left" color="link" onClick={() => this.toggleCustom(1)} aria-expanded={this.state.custom[1]} aria-controls="termosAccordion2">
                            2. Das responsabilidades e obrigações
                          </Button>
                          <Collapse className="text-justify" isOpen={this.state.custom[1]} data-parent="#termosAccordion" id="termosAccordion2">
                            <p>2.1. A <span className="font-weight-bold text-dark">Facta Financeira</span> coleta e trata dados pessoais para fins como, identificação e autenticação; viabilização de ofertas e serviços da Facta Financeira; proteção ao crédito; operacionalização de novos produtos; prevenção e combate de crimes financeiros, problemas técnicos ou de segurança nos processos de identificação e autenticação; e até mesmo a melhoria de serviços e da sua experiência. Dentre os dados coletados, A <span className="font-weight-bold text-dark">Facta Financeira</span> poderá tratar dados sensíveis, como biometria, para fins de prevenção de fraude e garantia de segurança dos serviços contratados. Também podemos coletar e tratar dados para cumprir com a legislação vigente aplicável. Daremos alguns exemplos a seguir.</p>
                            <p>2.2. Ao trafegar nos websites, baixar o aplicativo ou solicitar e utilizar os serviços da <span className="font-weight-bold text-dark">Facta Financeira</span>, Você concorda expressamente com a coleta e tratamento de dados pessoais necessários para o fornecimento de serviços melhores a Você. Você pode revogar seu consentimento a qualquer momento por meio dos canais de comunicação disponíveis do Facta.</p>
                          </Collapse>
                        </div>
                        <div className="item">
                          <Button className="m-0 p-0 h5 btn-block text-left" color="link" onClick={() => this.toggleCustom(2)} aria-expanded={this.state.custom[2]} aria-controls="termosAccordion3">
                            3. Privacidade dos Usuários
                          </Button>
                          <Collapse className="text-justify" isOpen={this.state.custom[2]} data-parent="#termosAccordion" id="termosAccordion3">
                            <p>3.1. A <span className="font-weight-bold text-dark">Facta Financeira</span> registra suas informações de dívidas a vencer (sem atraso) ou vencidas (com atraso), coobrigações e garantias no Sistema de Informações de Crédito (SCR), mantido pelo Banco Central do Brasil. Você autoriza a <span className="font-weight-bold text-dark">Facta Financeira</span> a fazer consultas sobre suas informações na base de dados do SCR, que contém também informações registradas por outras instituições autorizadas a funcionar pelo Banco Central com as quais Você mantém relação contratual. Para proteção do crédito, Você autoriza a <span className="font-weight-bold text-dark">Facta Financeira</span> a consultar suas informações -incluindo dados pessoais, histórico de crédito, entre outros - em órgãos reguladores, birôs de crédito, serviços de compensação e Cadastro Positivo.</p>
                            <p>3.2. Você autoriza expressamente a <span className="font-weight-bold text-dark">Facta Financeira</span> a compartilhar algumas das suas informações com terceiros para continuar usufruindo dos melhores serviços e experiência. Podemos compartilhar dados com terceiros para conseguirmos prestar os serviços contratados, tais como, identificação e autenticação; viabilização de ofertas e serviços da <span className="font-weight-bold text-dark">Facta Financeira</span>; proteção do crédito; operacionalização de novos produtos; prevenção e combate a crimes financeiros, problemas técnicos ou de segurança nos processos de identificação, dentre outros. Certas informações também poderão ser compartilhadas para fins de cumprimento de obrigações legais.</p>
                            <p>3.3. Podemos também armazenar e manter informações para garantir a segurança e a confiabilidade dos serviços da <span className="font-weight-bold text-dark">Facta Financeira</span>, bem como para cumprir com determinações legais.</p>
                            <p>3.4. Você poderá solicitar a revisão e correção de seus dados sem qualquer ônus e a qualquer tempo. Para isso, basta entrar em contato por meio de um dos canais de atendimento disponíveis. Ao terminar sua relação com a <span className="font-weight-bold text-dark">Facta Financeira</span>, caso deseje excluir seus dados, lembre-se que a Facta Financeira, com o fim de cumprir com obrigações legais, armazenará determinados dados pelo período e nos termos que a legislação vigente aplicável exigir.</p>
                            <p>3.5. A <span className="font-weight-bold text-dark">Facta Financeira</span> poderá utilizar, formatar e divulgar depoimentos referentes a Facta Financeira postados por Você em vídeos, perfis e páginas públicas nas redes sociais, juntamente com seu nome e imagens (incluindo fotos de perfil), em websites, aplicativos ou materiais institucionais e publicitários para a divulgação dos serviços prestados pela <span className="font-weight-bold text-dark">Facta Financeira</span> ou para comprovação de contratação de produtos <span className="font-weight-bold text-dark">Facta Financeira</span>.</p>
                          </Collapse>
                        </div>
                        <div className="item">
                          <Button className="m-0 p-0 h5 btn-block text-left" color="link" onClick={() => this.toggleCustom(3)} aria-expanded={this.state.custom[3]} aria-controls="termosAccordion4">
                            4. Disposições Gerais
                          </Button>
                          <Collapse className="text-justify" isOpen={this.state.custom[3]} data-parent="#termosAccordion" id="termosAccordion4">
                            <p>4.1. Não se preocupe, a <span className="font-weight-bold text-dark">Facta Financeira</span> utiliza diversos tipos de medidas de segurança para garantir a integridade de suas informações, como padrões de segurança de informação praticados pela indústria quando coleta e armazena seus dados pessoais e criptografia de dados padrão da Internet.</p>
                            <p>4.2. A <span className="font-weight-bold text-dark">Facta Financeira</span> está sempre à disposição para esclarecer suas dúvidas e colocar Você no controle dos seus dados.</p>
                          </Collapse>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col xs="12" sm="12">

                      {(this.state.isEncerrar == false) &&
                        
                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                          pathname: this.state.proximoLink,
                          state: {
                            navegacao: true,
                            dataHoraTermo: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
                            geoInicial: this.state.geoInicial,
                            geoTermo: this.state.localizacaoTermo,
                            dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,
                            obj_proposta: this.state.obj_proposta,
                            DADOS_STATE_TERMO: this.state
                          }
                        }} >
                          Eu <strong>li</strong> e <strong>aceito</strong> os termos
                        </Link>
                      
                      }
                      {(this.state.isEncerrar == true) &&
                      
                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold"
                            onClick={() => this.encerraProposta() } 
                            to="#" 
                        >
                        Eu <strong>li</strong> e <strong>aceito</strong> os termos
                      </Link>
                      }
                      
                    </Col>
                  </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            </Col>
          </div>
        </>
      )
      : <PaginaMensagemLocalizacao nome={ this.state.obj_proposta !== undefined && this.state.obj_proposta.CLIENTE !== undefined ? this.state.obj_proposta.CLIENTE.DESCRICAO : "" }/>
    }
    </>
    );
  }
}

export default Termo;
