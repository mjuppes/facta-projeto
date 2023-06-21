import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
import axios from 'axios';
//import LayoutFactaHeader from './LayoutFactaHeader';
class DadosDaPropostaTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = { tac: '' }
  }



  getPropostasFactaFgts = async () => { 
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta_facta_fgts?tipo=unico&codigo=' + this.props.proposta.CODIGO + '&ambiente=prod')
    .then(res => {
      let tac = res.data.length === 0 ? 0 : res.data[0].tac
      this.setState({ tac : tac });

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

    var AF = this.props.proposta;

    var CODIGO = AF.CODIGO;
    var DATA_INI_PROPOSTA = AF.DATAINICIO;
    var DATA_FIM_PROPOSTA = AF.DATAFIM;
    var COD_TP_OPERACAO = parseInt(AF.Tipo_Operacao);
    var TIPO_OPERACAO = this.props.tipo_operacao;

    return(
      <>
      {/* CRIAR COMPONENTE PARA ABSTRAIR ESSE BLOCO TODO*/}
      <Card className="border-white shadow text-left" style={{borderRadius: '8px'}} id="bloco_DadosDaProposta">
        <CardBody>
          <Row className="mt-3">
            

                {this.props.isCtrInss !== true &&
                  <Col xs="12" sm="12">
                    <h5 className="text-center font-weight-bold">{AF.Averbador !== 20124 ? 'Empréstimo Consignado' : 'Auxílio Brasil'}</h5>
                    <h5 className="text-center font-weight-bold">Proposta  { CODIGO }</h5>
                    <h5 className="text-center mb-3 font-weight-bold">{ TIPO_OPERACAO }</h5>                
                  </Col>
                }

                {this.props.isCtrInss === true &&
                  <Col xs="12" sm="12">
                    <h5 className="text-center mb-3 font-weight-bold">{ TIPO_OPERACAO }</h5>                
                    <h5 className="text-center font-weight-bold">Proposta  { CODIGO }</h5>
                  </Col>
                }

            
          </Row>

          <Row>
            <Col xs="12" sm="12" xm="12">
              <h5 className="text-center pb-3 border-bottom border-light">Custo Efetivo Total</h5>
              <label>Proposta</label>
              <p className="font-weight-bold"> { CODIGO } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>1º Desconto</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{ DATA_INI_PROPOSTA }</Moment></p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Último Desconto</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{ DATA_FIM_PROPOSTA }</Moment></p>
            </Col>
          </Row>

          {
            ( COD_TP_OPERACAO !== undefined && (COD_TP_OPERACAO === 2 || COD_TP_OPERACAO === 14 || COD_TP_OPERACAO === 32))
              ? (
                  <Row>
                    <Col xs="12" sm="12" xm="12">
                      <label>Nro. Contrato(s) Refinanciado(s)</label>
                      <p className="font-weight-bold"> { AF.NUMERO_CONTRATO_REFIN !== null && AF.NUMERO_CONTRATO_REFIN !== '' ? AF.NUMERO_CONTRATO_REFIN.split("|").join(" ") : ' - ' } </p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <label>Saldo Devedor</label>
                      <p className="font-weight-bold"> R$ { AF.saldoDevedor !== null ? AF.saldoDevedor : 0} </p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <label>Troco</label>
                      <p className="font-weight-bold"> R$ { AF.VLRAF !== null ? AF.VLRAF : 0 } </p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold">Valor pago no final</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold">
                      {
                        parseFloat(
                          (AF.NUMEROPRESTACAO !== null && AF.VLRPRESTACAO !== null ? AF.NUMEROPRESTACAO * AF.VLRPRESTACAO : 0)
                        ).toLocaleString('pt-BR', formatoValor)
                      }
                      </p>
                    </Col>
                  </Row>
                )
              : (
                <>
                  { AF.taxa_cet !== null && AF.taxa_cet_anual !== null
                    ? <>
                      <Row className="mb-3 border-bottom border-light">
                        <Col xs="12" sm="12" xm="12">
                          <p className="font-weight-bold"><small>(Custo efetivo total de { AF.taxa_cet.toFixed(2) }% a.m. / { AF.taxa_cet_anual.toFixed(2) }% a.a.)</small></p>
                        </Col>
                      </Row>
                      </>
                    : null
                  }

                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">Valor Liberado</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> { AF.Tipo_Operacao === 17 ? parseFloat(AF.BASECOMISSAO !== null ? AF.BASECOMISSAO : 0).toLocaleString('pt-BR', formatoValor) : parseFloat(AF.VLRAF !== null ? AF.VLRAF : 0).toLocaleString('pt-BR', formatoValor) } </p>
                    </Col>
                  </Row>

                  { AF.TAXA !== null
                    ? <>
                      <Row>
                        <Col xs="6" sm="6" xm="12">
                          <p className="text-muted">Juros Mensal</p>
                        </Col>
                        <Col xs="6" sm="6" xm="12">
                          <p className="font-weight-bold text-right"> { AF.TAXA.toFixed(2) }% a.m. </p>
                        </Col>
                      </Row>
                      </>
                    : null
                  }

                  { AF.taxa_anual !== null
                    ? <>
                      <Row>
                        <Col xs="6" sm="6" xm="12">
                          <p className="text-muted">Juros Anual</p>
                        </Col>
                        <Col xs="6" sm="6" xm="12">
                          <p className="font-weight-bold text-right"> { AF.taxa_anual.toFixed(2) }% a.a. </p>
                        </Col>
                      </Row>
                      </>
                    : null
                  }

                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">IOF</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> { parseFloat(AF.VLRIOF !== null ? AF.VLRIOF : 0).toLocaleString('pt-BR', formatoValor) } </p>
                    </Col>
                  </Row>

                  {COD_TP_OPERACAO !== 33 &&
                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">Seguro</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> 
                       {[10, 390].indexOf(parseInt(AF.Averbador)) === -1 ? (AF.VLRSEGURO !== null && AF.VLRSEGURO !== '' && parseInt(AF.VLRSEGURO) > 0 ? 'Sim' : 'Não') : 'Não' }
                      </p>
                    </Col>
                  </Row>
                  }
                  {COD_TP_OPERACAO === 33 &&
                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">Seguro</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> 
                        Sim
                      </p>
                    </Col>
                  </Row>
                  }
                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">Tarifa de Cadastro</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> 
                          {(AF.Averbador === 20124 && AF.TAC > 0) ? 'Sim' : 'Não'}
                      </p>
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
                          parseFloat(AF.VLRIOF !== null ? AF.VLRIOF : 0)
                          +
                          parseFloat(AF.VLRSEGURO !== null ? AF.VLRSEGURO : 0)
                          +
                          ([14, 18].indexOf(parseInt(AF.Tipo_Operacao)) !== -1 ? parseFloat(AF.BASECOMISSAO !== null ? AF.BASECOMISSAO : 0) : parseFloat(AF.VLRAF !== null ? AF.VLRAF : 0))
                        ).toLocaleString('pt-BR', formatoValor)
                      }
                      </p>
                    </Col>
                  </Row>
                  { parseInt(AF.Averbador) !== 1 && parseInt(AF.Averbador) !== 30
                    ? <>
                        <Row>
                          <Col xs="6" sm="6" xm="12">
                            <p className="font-weight-bold">Total a Pagar</p>
                          </Col>
                          <Col xs="6" sm="6" xm="12">
                            <p className="font-weight-bold text-right">
                            {
                              parseFloat(
                                (AF.NUMEROPRESTACAO !== null && AF.VLRPRESTACAO !== null ? AF.NUMEROPRESTACAO * AF.VLRPRESTACAO : 0)
                              ).toLocaleString('pt-BR', formatoValor)
                            }
                            </p>
                          </Col>
                        </Row>
                      </>
                    : null
                  }
                </>
              )
          }
        </CardBody>
      </Card>
      {/* /#> CRIAR COMPONENTE PARA ABSTRAIR ESSE BLOCO TODO*/}
      </>
    )
  }
}
export default DadosDaPropostaTemplate;
