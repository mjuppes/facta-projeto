import React, { Component } from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';

import axios from 'axios';

class PropostaPendente extends Component {

  constructor(props) {
    super(props);
    this.state = {
      codigoAF64: this.props.match.params.propostaId,
      codigoAF: atob(this.props.match.params.propostaId),
      homeLink: '/digital/'+this.props.match.params.propostaId,
      proximoLink: '/digital/'+this.props.match.params.propostaId,
      carregando: true,
      dadosProposta: []
    };
  }

  componentDidMount  ()  {
    this.getDadosDaProposta();
    window.scrollTo(0, 0);
  }

  getDadosDaProposta = async () => {
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta?codigo=' + btoa(this.state.codigoAF64))
    .then(res => (
      this.setState({
        dadosProposta: res.data,
        carregando: false
      })
      
        
      ))
    .catch(error => console.log(error));



  };

  mtel(v) {
    v=v.replace(/\D/g,"");
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2");
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");
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
                          <h5 className="text-center">Solicitação Pendente</h5>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col xs="12" sm="12">
                          <p>Para a conclusão da sua solicitação, pedimos que entre em contato com o correspondente que fez o seu atendimento, para esclarecimentos:</p>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col xs="12" sm="12">
          								<h5>Dados para contato:</h5>
                          { this.state.dadosProposta.CORRETOR.FONE !== ''
                            ?
                              <h4>
                                <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                <span>{ this.mtel(this.state.dadosProposta.CORRETOR.FONE)}</span>
                              </h4>
                            : this.state.dadosProposta.CORRETOR.FONE_COMERCIAL !== ''
                              ?
                                <h4>
                                  <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                  <span>{ this.mtel(this.state.dadosProposta.CORRETOR.FONE_COMERCIAL) }</span>
                                </h4>
                              : this.state.dadosProposta.CORRETOR.CELULAR !== ''
                                ?
                                  <h4>
                                    <i className="fa fa-phone fa-lg mt-3 mr-3"></i>
                                    <span>{ this.mtel(this.state.dadosProposta.CORRETOR.CELULAR) }</span>
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
        }
      </div>
    );
  }
}

export default PropostaPendente;
