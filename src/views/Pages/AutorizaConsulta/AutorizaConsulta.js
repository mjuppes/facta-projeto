import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from 'reactstrap';

import LayoutFactaHeader from '../../../LayoutFactaHeader';

import axios from 'axios';

class AutorizaConsulta extends Component {

  constructor(props) {
    super(props);
    let valores = atob(this.props.match.params.idConsulta);
    let dados = valores.split(":");
    let nome = atob(dados[1]);
 
    this.state = {
      id_consulta : dados[0],
      nome : this.utf8_decode(nome),
      cpf : dados[2],
      beneficio : dados[3],
      dataHora: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'),
      confirmado: false, 
      localizacao: '',
      permissaoLocalizacao: false
    }

    if(localStorage.getItem('id_consulta') !== this.state.id_consulta) {
      localStorage.clear();
    }
  }

  localizacao = () => {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        this.setState({ localizacao: "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude, permissaoLocalizacao: true });

        this.autorizaConsultaDataPrev();

      }.bind(this),
      function(error) {
        this.setState({ permissaoLocalizacao: false });
      }.bind(this)
    );
  }
  utf8_decode = (strData) => {
    const tmpArr = []
    let i = 0
    let c1 = 0
    let seqlen = 0
    strData += ''
    while (i < strData.length) {
      c1 = strData.charCodeAt(i) & 0xFF
      seqlen = 0
      if (c1 <= 0xBF) {
        c1 = (c1 & 0x7F)
        seqlen = 1
      } else if (c1 <= 0xDF) {
        c1 = (c1 & 0x1F)
        seqlen = 2
      } else if (c1 <= 0xEF) {
        c1 = (c1 & 0x0F)
        seqlen = 3
      } else {
        c1 = (c1 & 0x07)
        seqlen = 4
      }
      for (let ai = 1; ai < seqlen; ++ai) {
        c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F))
      }
      if (seqlen === 4) {
        c1 -= 0x10000
        tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)))
        tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)))
      } else {
        tmpArr.push(String.fromCharCode(c1))
      }
      i += seqlen
    }
    return tmpArr.join('')
  }

  autorizaConsultaDataPrev = async () => {
    const url = "https://app.factafinanceira.com.br/DesbloqueioBeneficio/ApiAutorizaConsulta";
    const FormData = require('form-data');

    const formData = new FormData();
    formData.append('id_consulta', this.state.id_consulta);
    formData.append('localizacao', this.state.localizacao);
    

    const headers =  {'Content-Type': 'multipart/form-data' };
    await axios.post(url, formData, {
          headers: headers
    }).then((response) => {
      this.setState({ confirmado: true });
      localStorage.setItem('id_consulta', this.state.id_consulta);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  componentDidMount () {
    if (localStorage.getItem('id_consulta')) {
       this.setState({confirmado : true});
    }

    
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
        
            <Col className="w-100 p-3 min-vh-100 text-center" style={containerPaddingTop}>
              <LayoutFactaHeader />
              <Row className="mt-6">
                <Col md={{size: 10, offset: 1}} style={{ 'position' : 'relative' }}>
                    <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                    <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                </Col>
                <Col md={{size: 10, offset: 1}}>
                  <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                    <CardBody>
                    { this.state.confirmado === false
                      ? 
                       <>
                            <Row>
                              <Col>
                                <h4 className="text-center mb-3 font-weight-bold">Termo de Autorização de Consulta de Benefício</h4>
                                <Row className="mt-5">
                                  <Col className="text-justify" md="12" lg="12" xs="12" sm="12">
                                    <p>
                                      Eu <span className="font-weight-bold">{ this.state.nome }</span> CPF <span className="font-weight-bold">{ this.state.cpf }</span> autorizo o INSS/DATAPREV a disponibilizar as informações do beneffício <span className="font-weight-bold">{ this.state.beneficio }</span> para apoiar a contratação/simulação de empréstimo consignado/cartão consignado de benefícios do INSS para subsidiar a proposta pelo Banco Credor.
                                    </p>
                                    <Row className="mt-3">
                                      <Col xs="12" sm="12" className="text-center">
                                        <Button className="btn-block font-weight-bold" color="outline-primary" size="lg"  onClick={() => {this.localizacao()}}>
                                          Confirmar
                                        </Button>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </>
                        : <>
                        <Row>
                          <Col>
                            <h4 className="text-center mb-3 font-weight-bold">Termo de Autorização de Consulta de Benefício</h4>
                            <Row className="mt-5">
                              <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                <p>
                                  Sr(a).  <span className="font-weight-bold">{ this.state.nome }</span> recebemos o seu pedido para a liberação da Consulta de Benefício com sucesso!
                                </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </> }
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
      </div>
    );
  }
}

export default AutorizaConsulta;
