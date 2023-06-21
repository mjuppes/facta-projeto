import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
import axios from 'axios';
//import LayoutFactaHeader from './LayoutFactaHeader';
class DadosDaPropostaFgtsTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {codigo_af: '', tipo_operacao: '', basecomissao: '', primeiro_desconto: '', ultimo_desconto: '', total_pagar: '' , iof : '', tac : '', vlraf : ''}
  }

  getPropostasFactaFgts = async () => { 
    
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta_facta_fgts?tipo=unico&codigo=' + this.props.codigo_af + '&ambiente=prod')
    .then(res => {  

      this.setState({           
        carregando: false,
        codigo_af: res.data[0].codigo_af,
        tipo_operacao: res.data[0].tipo_operacao,
        vlraf : res.data[0].vlraf,
        basecomissao: res.data[0].basecomissao,
        primeiro_desconto: res.data[0].primeiro_desconto,
        ultimo_desconto: res.data[0].ultimo_desconto,
        total_pagar: res.data[0].total_pagar,
        iof: res.data[0].iof,
        tac : res.data[0].tac,
        total_saque : res.data[0].total_saque
      });  
    })
    .catch(error => console.log(error));
  };
  

  componentDidMount() { 
    this.getPropostasFactaFgts();  
  }
  
  render() {
    const containerPaddingTop = {
      "paddingTop": "5%",
      "display": 'block',
      "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
      "fontFamily": 'Montserrat,sans-serif',
      "letterSpacing" : '-1px'
    };

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }

    return(
      <>
      {/* CRIAR COMPONENTE PARA ABSTRAIR ESSE BLOCO TODO*/}
      <Card className="border-white shadow text-left" style={{borderRadius: '8px'}} id="bloco_DadosDaProposta">
        <CardBody>
          <Row className="mt-3">
            <Col xs="12" sm="12">
              <h5 className="text-center font-weight-bold">Empréstimo Consignado</h5>
              <h5 className="text-center font-weight-bold">Proposta {  this.state.codigo_af }</h5>
              <h5 className="text-center mb-3 font-weight-bold">{  this.state.tipo_operacao }</h5>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="12" xm="12">
              <h5 className="text-center pb-3 border-bottom border-light">Custo Efetivo Total</h5>
              <label>Proposta</label>
              <p className="font-weight-bold"> {  this.state.codigo_af } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>1º Desconto</label>
              <p className="font-weight-bold">{ this.state.primeiro_desconto }</p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Último Desconto</label>
              <p className="font-weight-bold">{ this.state.ultimo_desconto }</p>
            </Col>
          </Row>

          {  
                <> 
                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">Valor Liberado</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> { parseFloat(this.state.vlraf).toLocaleString('pt-BR', formatoValor) } </p>
                    </Col>
                  </Row> 

                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">IOF</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> { parseFloat(this.state.iof).toLocaleString('pt-BR', formatoValor) } </p>
                    </Col>
                  </Row> 

                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">Total Financiado</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right">
                      {
                        parseFloat(
                          parseFloat(0)
                          + 
                          this.state.basecomissao
                        ).toLocaleString('pt-BR', formatoValor)
                      }
                      </p>
                    </Col>
                  </Row>
                  {
                     <>
                        <Row>
                          <Col xs="6" sm="6" xm="12">
                            <p className="font-weight-bold">Total a Pagar</p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <p className="font-weight-bold text-right">
                            {
                              parseFloat(this.state.total_saque).toLocaleString('pt-BR', formatoValor)
                            }
                            </p>
                          </Col>
                        </Row>
                      </>
                  }
                </> 
          }
        </CardBody>
      </Card>
      {/* /#> CRIAR COMPONENTE PARA ABSTRAIR ESSE BLOCO TODO*/}
      </>
    )
  }
}
export default DadosDaPropostaFgtsTemplate;
