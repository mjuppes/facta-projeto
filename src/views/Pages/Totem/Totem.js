import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Col, Container, Row, Card, CardBody, FormGroup, Button } from 'reactstrap';
import InputMask from 'react-input-mask';
import '../../../scss/fontsize.css';
import axios from 'axios';
import md5 from 'md5';

class Totem extends Component {

  constructor(props) {
    super(props);


    this.state = {
      carregando: false,
      cpf : (this.props.location.state == null) ? '' : this.props.location.state.cpf,
      nomeCliente: '',
      dadosCodigoAF: [],
      pesquisouPropostas: false,
      achouPropostas: false,
    };

    if(this.props.location.state != null) {
       this._pesquisaContratos();
    } 
  }

  componentDidMount() { }

  _pesquisaContratos = async () => {

    if (this.state.cpf.length < 11) {
      alert("Informe um CPF válido");
      return false;
    }

    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_propostas_para_formalizar?cpf=' + this.state.cpf)
    .then(res => (
      console.log(res.data.length+' - '+res.data)
      ,
      this.setState({
        pesquisouPropostas : true,
        achouPropostas : res.data.length === 0 ? false : true,
        dadosCodigoAF : res.data,
        nomeCliente : res.data[0].NOME,
        erroNaPesquisa : false
      })
    ))
    .catch(error => this.setState({ pesquisouPropostas : true, erroNaPesquisa : true }));
  }

  updateInputValue = (evt) => {
    this.setState({
      cpf: evt.target.value
    });
  }

  _iniciaProcesso(codigoAF) {
    return function() {
      window.location.href = 'https://app.factafinanceira.com.br/v4/#/digital/' + btoa(codigoAF);
      //window.location.href = 'http://localhost:3004/#/digital/' + btoa(this.state.codigoAF);
    }
  };

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

    function refreshPage() {
      window.location.reload(false);
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

                      { this.state.achouPropostas === false
                        ? <>
                          <Row className="mt-5 text-center">
                            <Col xs="12" sm="12">
                              <h5>Para verificarmos se existe alguma proposta para você, informe o número do seu CPF.</h5>
                            </Col>
                          </Row>
                          <Row className="mt-5">
                            <Col xs="12">
                              <FormGroup>
                                <InputMask mask="999.999.999-99" onChange={this.updateInputValue} className="form-control text-center" style={{fontSize : '22px'}} type="text" name="numero_cpf" placeholder="000.000.000-00"/>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row className="mt-5 mb-5">
                            <Col xs="12" sm="12">
                              <Button className="font-weight-bold btn-block" color="outline-primary" size="lg" onClick={this._pesquisaContratos}>
                                { this.state.carregando === false
                                  ? 'PESQUISAR'
                                  : <Col className="spinner-grow text-light" role="status"><span className="sr-only">...</span></Col>
                                }
                              </Button>
                            </Col>
                          </Row>
                          </>
                        : null
                      }

                      { this.state.pesquisouPropostas === true
                        ? <>
                            <Row className="mt-5 text-center">
                              { this.state.erroNaPesquisa === true
                                ? <h5>Houve um erro ao tentar realizar a pesquisa.</h5>
                                : <>
                                  { this.state.achouPropostas === true
                                    ? <>
                                        <p className="text-muted mt-5 p-3 text-center w-100 h4">Olá <span className="font-weight-bold text-dark">{ this.state.nomeCliente}</span>,</p>
                                        <p className="text-muted p-3  text-center w-100 h4">por favor selecionar proposta(s) abaixo a ser(em) formalizada(s):</p>
                                        {this.state.dadosCodigoAF.map((dados, index) => (
                                          
                                          <p className="text-muted  text-center w-100 h4">
                                              <Button  className="mt-1 mb-5  btn-block" color="outline-primary" size="lg" onClick={this._iniciaProcesso(dados.CODIGO)}>
                                               <font className="font-weight-bold"> { dados.AVERBADOR } - { dados.CONVENIO } - CODIGO: { dados.CODIGO }</font>
                                              </Button>
                                          </p>
                                        ))}
                                        <p className="text-muted  text-center w-100 h4">

                                          <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                                          state: {
                                            achouPropostas: false
                                            }
                                          }}
                                          onClick={refreshPage} >
                                           VOLTAR AO INÍCIO
                                        </Link>
                                        </p>
                                      </>
                                    : <h5 className="p-3">Não encontramos nenuma proposta para ser formalizada</h5>
                                  }
                                  </>
                              }
                            </Row>
                          </>
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

export default Totem;
