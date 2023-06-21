import React, { Component } from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';

import axios from 'axios';
import md5 from 'md5';

class Andamento extends Component {

  constructor(props) {
    super(props);

    this.state = {
      codigoAF64: this.props.match.params.propostaId,
      codigoAF: atob(this.props.match.params.propostaId),
      homeLink: '/andamento/'+this.props.match.params.propostaId,
      proximoLink: '/andamento/'+this.props.match.params.propostaId,
      carregando: true,
      reprovada: [4, 28, 49],
      dadosProposta: [],
      dadosCliente: []
    };

    // console.log(this.props.location.state);

  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getUsers();
  }

  getUsers = async () => {
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta?codigo=' + btoa(this.state.codigoAF64))
    .then(res => {
      console.log(res.data); 
      this.setState({
        dadosProposta: res.data,
        dadosCliente: res.data.CLIENTE,
        carregando: false
      })
    })

    .catch(error => console.log(error));
  };

  mtel(v) {
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
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


    console.log(DADOS_CLIENTE);
    let DADOS_CORRETOR = DADOS_AF.CORRETOR;
    let ARR_REPROVADA = this.state.reprovada;
    let ARR_AV_CCB = [1, 3, 15, 30, 100];
    let tipo_ccb = "ccb";

    let dia = new Date().getDate();
    dia = ("0" + dia).slice(-2);
    let mes = new Date().getMonth()+1;
    mes = ("0" + mes).slice(-2);
    let ano = new Date().getFullYear();

    let token_ccb = md5('api_gerar_ccb_' + ano + '-' + mes + '-' + dia);

    if (DADOS_AF.Averbador === 1) {
      tipo_ccb = "ccb_tesouro";
    }
    else if (DADOS_AF.Averbador === 3) {
      tipo_ccb = "ccb";
    }
    else if (DADOS_AF.Averbador === 15) {
      tipo_ccb = "ccb_siape";
    }
    else if (DADOS_AF.Averbador === 30) {
      tipo_ccb = "ccb_ipe";
    }
    else if (DADOS_AF.Averbador === 100) {
      tipo_ccb = "ccb_poder_judiciario";
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} >

      { this.state.carregando
        ? (
          <>
            <Container className="flex-row align-items-center m-auto">
              <Row className="text-center">
                <Col md="12" lg="12" xl="12">
                  <div className="spinner-border text-info">
                    <span className="sr-only">Carregando...</span>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        )
        : <>
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
              <Row>
                <Col md="12">
                  <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" />
                  <p className="text-white mb-3" style={{marginTop: '-10px'}}><i className="fa fa-lock"></i> | Site seguro</p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={{size: 8, offset: 2}}>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody>

                      <Row className="mt-3">
                        <Col xs="12" sm="12">
                          <h5 className="text-center">Andamento de Proposta</h5>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        { ARR_REPROVADA.indexOf(DADOS_AF.TIPOANALISE) !== -1
                          ? <>
                              <Col xs="12" sm="12">
                                <p>Olá <span className="font-weight-bold">{ DADOS_CLIENTE.DESCRICAO }</span>!</p>
                                <p>Infelizmente sua proposta foi reprovada!</p>
                                <p><i className="fa fa-meh-o fa-lg h1 text-danger"></i></p>
                              </Col>
                            </>
                          : <>
                              {this.state.dadosProposta.Averbador !== 20095
                              ?
                                <Col xs="12" sm="12">
                                  <p>Olá <span className="font-weight-bold">{ DADOS_CLIENTE.DESCRICAO }</span>!</p>
                                  <p>Você já realizou a autorização da proposta!</p>
                                  <p>Agora acompanhe o andamento de sua solicitação, pois ela é sujeita a análise de crédito.</p>
                                </Col>
                              :
                                <Col xs="12" sm="12">
                                  <p>Olá <span className="font-weight-bold">{ DADOS_CLIENTE.DESCRICAO }</span>!</p>
                                  <p>Você já realizou a autorização da proposta!</p>
                                  <p>Agora acompanhe o andamento de sua solicitação, pois ela é sujeita a análise de crédito e poderá demorar até <font className="font-weight-bold"> 72 hrs</font> para aprovação.</p>
                                </Col>
                              }
                            </>
                        }

                      </Row>
                      <Row className="">
                        <Col xs="12" sm="12">
          								<h5>Em caso de dúvidas, entre em contato pelo(s) telefone(s) abaixo:</h5>
                          { this.state.dadosProposta.CORRETOR.FONE !== ''
                            ?
                              <h4>
                                <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                <span>{ this.mtel(DADOS_CORRETOR.FONE)}</span>
                              </h4>
                            : this.state.dadosProposta.CORRETOR.FONE_COMERCIAL !== ''
                              ?
                                <h4>
                                  <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                  <span>{ this.mtel(DADOS_CORRETOR.FONE_COMERCIAL) }</span>
                                </h4>
                              : this.state.dadosProposta.CORRETOR.CELULAR !== ''
                                ?
                                  <h4>
                                    <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                    <span>{ this.mtel(DADOS_CORRETOR.CELULAR) }</span>
                                  </h4>
                                : null
                            }
                        </Col>
                      </Row>

                      { ARR_REPROVADA.indexOf(DADOS_AF.TIPOANALISE) === -1 && (ARR_AV_CCB.indexOf(DADOS_AF.Averbador) !== -1)
                        ? (
                          <>
                            <Row className="mt-3">
                              <Col xs="12" sm="12">
                                <p className="font-weight-bold m-3">Para fazer o download da CCB, clique na proposta desejada:</p>
                                <p>
                                {(DADOS_AF.Tipo_Operacao === 33 || DADOS_AF.Tipo_Operacao === 36  || DADOS_AF.Tipo_Operacao === 38) &&
                                        <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_formulario_ccb_credito_consignado_beneficio.php?token=" + token_ccb + "&codigoaf=" + this.state.codigoAF64 } className="btn btn-outline-primary btn-block btn-lg">
                                          <i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { this.state.codigoAF }
                                        </a>
                                }

                                {(DADOS_AF.Tipo_Operacao === 35 || DADOS_AF.Tipo_Operacao === 37) &&
                                    <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_ccb_rl.php?token=" + token_ccb + "&codigo=" + this.state.codigoAF64+"&tipo=1" } className="btn btn-outline-primary btn-block btn-lg">
                                      <i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { this.state.codigoAF }
                                    </a>
                                }

                                {(DADOS_AF.Tipo_Operacao !== 33 && DADOS_AF.Tipo_Operacao !== 36 && DADOS_AF.Tipo_Operacao !== 35 && DADOS_AF.Tipo_Operacao !== 37 && DADOS_AF.Tipo_Operacao !== 38) &&
                                  <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_ccb.php?tipo_ccb="+ tipo_ccb +"&token=" + token_ccb + "&tipo=1&codigo=" + this.state.codigoAF64 } className="btn btn-outline-primary btn-block btn-lg">
      		                          <i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { this.state.codigoAF }
  				                        </a>
                                }
      					               </p>
                             </Col>
                           </Row>
                           { DADOS_AF.PROPOSTA_VINCULADA !== undefined
                             ? (
                                  Object.values(DADOS_AF.PROPOSTA_VINCULADA).map(vinc => (
                                    <>
                                    { vinc.Averbador === 3
                                      ? <>
                                        <Row className="mt-3">
                                          <Col xs="12" sm="12">
                  													<p>
                  														<a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_ccb.php?tipo_ccb="+ tipo_ccb +"&token=" + token_ccb + "&tipo=1&codigo=" + btoa(vinc.CODIGO)} className="btn btn-outline-primary btn-block btn-lg">
                  															<i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { vinc.CODIGO }
                  														</a>
                  													</p>
                                          </Col>
                                        </Row>
                                        </>
                                      : null
                                    }
                                    </>
                                  )
                                )
                              )
                              : null
                            }
                          </>
                        )
                        : null
    									}

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </>
        }
      </div>
    );
  }
}

export default Andamento;
