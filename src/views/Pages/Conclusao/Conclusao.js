import React, { Component } from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import axios from 'axios';
import md5 from 'md5';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';

class Conclusao extends Component {

  constructor(props) {
    super(props);

    this.state = {
      codigoAF: atob(this.props.match.params.propostaId),
      codigoAF64: this.props.match.params.propostaId,
      homeLink: '/andamento/'+this.props.match.params.propostaId,
      proximoLink: '/andamento/'+this.props.match.params.propostaId,
      carregando: true,
      dadosProposta: []
    };
  }

  componentDidMount() {
    this.getUsers();
    window.scrollTo(0, 0);
  }

  getUsers = async () => {
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta?codigo=' + btoa(this.state.codigoAF64))
    .then(res => (
      this.setState({
        dadosProposta: res.data,
        carregando: false
      })))
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
    let DADOS_CLIENTE = DADOS_AF.CLIENTE;
    let DADOS_CORRETOR = DADOS_AF.CORRETOR;
    let ARR_REPROVADA = [4, 28, 49];
    let ARR_AV_CCB = [1, 3, 15, 30, 100, 390];

    let tipo_ccb = "ccb";

    let dia = new Date().getDate();
    dia = ("0" + dia).slice(-2);
    let mes = new Date().getMonth()+1;
    mes = ("0" + mes).slice(-2);
    let ano = new Date().getFullYear();

    let token_ccb = md5('api_gerar_ccb_' + ano + '-' + mes + '-' + dia);
    let token_ccb_credito = md5('ccb_credito' + ano + '-' + mes + '-' + dia);

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
    else if (DADOS_AF.Averbador === 390) {
      tipo_ccb = "ccb_facta_facil";
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} >

      { this.state.carregando
        ? <LayoutFactaCarregando />
        : <>
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>

              <LayoutFactaHeader />

              <Row className="mt-4">
                {(isMobile === false) &&
                      <Col md="5" style={{ 'position' : 'relative' }}>
                          <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                          <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                    
                      </Col>
                  }
          
                <Col md={{size: 8, offset: 2}}>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody>
                      <Row className="mt-3">

                      {(DADOS_AF.Tipo_Operacao === 33 || DADOS_AF.Tipo_Operacao === 36) && 


                        <Col xs="12" sm="12">
                            <h5 className="mb-3 font-weight-bold">Conclusão da Assinatura Digital</h5>
                            <p className="text-muted">Parabéns {DADOS_CLIENTE.DESCRICAO}!</p>
                            <p className="text-muted">Proposta enviada com sucesso!</p>
                            <p className="text-muted">Pendente de análise e aprovação pela Facta Financeira.</p>
                            <p className="text-muted">Produtos integrantes da Proposta: Cartão de Crédito Consignado Benefício</p>

                            <p className="text-muted">Informações contatar:</p>

                            <p className="text-muted">SAC: (51) 3191-7318 ou 0800.942.0462 </p>
                        </Col>
                      }

                      {(this.state.dadosProposta.Averbador !== 20095 && (DADOS_AF.Tipo_Operacao !== 33 && DADOS_AF.Tipo_Operacao !== 36)) &&
                        
                          <Col xs="12" sm="12">
                            <h5 className="mb-3 font-weight-bold">Conclusão da Assinatura Digital</h5>
                            <p className="text-muted">Parabéns! Sua proposta foi formalizada e aguarda a análise da nossa equipe.</p>
                            <p className="text-muted">Em breve você será notificado sobre o andamento da proposta.</p>
                          </Col>
                      }
                      {this.state.dadosProposta.Averbador === 20095 &&
                          <Col xs="12" sm="12">
                            <h5 className="mb-3 font-weight-bold">Conclusão da Assinatura Digital</h5>
                            <p className="text-muted">Parabéns! Sua proposta foi formalizada e aguarda a análise da nossa equipe.</p>
                            <p className="text-muted">Agora acompanhe o andamento de sua solicitação, pois ela é sujeita a análise de crédito e poderá demorar até
                            <font className="font-weight-bold"> 48 hrs</font> para aprovação.</p>
                            <p className="text-muted">Em breve você será notificado sobre o andamento da proposta.</p>
                          </Col>
                      }
                      </Row>

                      <Row className="mt-3">
                        <Col xs="12" sm="12">
          								<h5>Em caso de dúvidas, ligue para:</h5>
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

                      { ARR_REPROVADA.indexOf(DADOS_AF.TIPOANALISE) === -1 && (ARR_AV_CCB.indexOf(DADOS_AF.Averbador) !== -1)
                        ? (
                          <>
                            <Row className="mt-3">
                              <Col xs="12" sm="12">
                                <p className="font-weight-bold m-3">Para fazer o download da CCB, clique na proposta desejada:</p>
                                 {(DADOS_AF.Tipo_Operacao === 11 || DADOS_AF.Tipo_Operacao === 29 || DADOS_AF.Tipo_Operacao === 33 || DADOS_AF.Tipo_Operacao === 36 || DADOS_AF.Tipo_Operacao === 35 || DADOS_AF.Tipo_Operacao === 37  || DADOS_AF.Tipo_Operacao === 38) ? <>
                                    <p>

                                      {(DADOS_AF.Tipo_Operacao === 35 || DADOS_AF.Tipo_Operacao === 37) &&
                                        <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_ccb_rl.php?token=" + token_ccb + "&codigo=" + this.state.codigoAF64+"&tipo=1" } className="btn btn-outline-primary btn-block btn-lg">
                                          <i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { this.state.codigoAF }
                                        </a>
                                      }

                                      {(DADOS_AF.Tipo_Operacao === 33 || DADOS_AF.Tipo_Operacao === 36 || DADOS_AF.Tipo_Operacao === 38) &&
                                        <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_formulario_ccb_credito_consignado_beneficio.php?token=" + token_ccb + "&codigoaf=" + this.state.codigoAF64 } className="btn btn-outline-primary btn-block btn-lg">
                                          <i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { this.state.codigoAF }
                                        </a>
                                      }
                                      {(DADOS_AF.Tipo_Operacao !== 33 && DADOS_AF.Tipo_Operacao !== 36 && DADOS_AF.Tipo_Operacao !== 35 && DADOS_AF.Tipo_Operacao !== 37 && DADOS_AF.Tipo_Operacao !== 38) &&
                                        <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_formulario_ccb_credito.php?token=" + token_ccb_credito + "&codigoaf=" + this.state.codigoAF64 } className="btn btn-outline-primary btn-block btn-lg">
                                          <i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { this.state.codigoAF }
                                        </a>
                                      }

                                    </p> 
                                  </> : 
                                    <p>
                                        <a target="_blank" rel="noopener noreferrer" href={"https://app.factafinanceira.com.br/gerador_pdf/gerar_ccb.php?tipo_ccb="+ tipo_ccb +"&token=" + token_ccb + "&tipo=1&codigo=" + this.state.codigoAF64 } className="btn btn-outline-primary btn-block btn-lg">
                                          <i className="fa fa-download" aria-hidden="true"></i> Proposta Nº { this.state.codigoAF }
                                        </a>
                                    </p>
                                 }
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
                      <Row className="mt-3">
                        <Col xs="12" sm="12">
                          {
                                <Link className="btn btn-outline-primary btn-block mb-3 font-weight-bold btn-lg" to={{ pathname: this.state.proximoLink }} >
                                  Acompanhar proposta
                                </Link>
                          }
                        </Col>
                      </Row>
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

export default Conclusao;
