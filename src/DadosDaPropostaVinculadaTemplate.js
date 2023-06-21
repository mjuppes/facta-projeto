import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
class DadosDaPropostaVinculadaTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
    var AF = this.props.proposta;
    var TIPO_OPERACAO = this.props.tipo_operacao;
    var COD_TP_OPERACAO = this.props.cod_tipo_operacao;

    return(
      <>
      <Card className="border-white shadow" style={{borderRadius: '8px'}}>
        <CardBody className="text-left">
          <h5 className="text-center border-bottom border-light">
            Dados da Proposta
            <p><small className="text-muted text-capitalize">({ TIPO_OPERACAO.toLowerCase() })</small></p>
          </h5>
          <Row>
            <Col xs="12" sm="12" xm="12">
              <label>Proposta</label>
              <p className="font-weight-bold"> { AF.CODIGO } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>1º Desconto</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{AF.DATAINICIO}</Moment></p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Último Desconto</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{AF.DATAFIM}</Moment></p>
            </Col>
          </Row>

          { COD_TP_OPERACAO === 2 || COD_TP_OPERACAO === 14 || COD_TP_OPERACAO === 32
            ? (
              <>
                <Row>
                  <Col xs="12" sm="12" xm="12">
                    <label>Nro. Contrato(s) Refinanciado(s)</label>
                    <p className="font-weight-bold"> { AF.NUMERO_CONTRATO_REFIN.split("|").join(" ") } </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6" sm="6" xm="12">
                    <label>Saldo Devedor</label>
                    <p className="font-weight-bold"> { parseFloat(AF.saldoDevedor !== null ? AF.saldoDevedor : 0).toLocaleString('pt-BR', formatoValor) } </p>
                  </Col>
                  <Col xs="6" sm="6" xm="12">
                    <label>Troco</label>
                    <p className="font-weight-bold"> { parseFloat(AF.VLRAF !== null ? AF.VLRAF : 0).toLocaleString('pt-BR', formatoValor) } </p>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col xs="6" sm="6" xm="12">
                    <label>Valor Liberado</label>
                    <p className="font-weight-bold"> { AF.Tipo_Operacao === 17 ? parseFloat(AF.BASECOMISSAO !== null ? AF.BASECOMISSAO : 0).toLocaleString('pt-BR', formatoValor) : parseFloat(AF.VLRAF !== null ? AF.VLRAF : 0).toLocaleString('pt-BR', formatoValor) } </p>
                  </Col>
                  <Col xs="6" sm="6" xm="12">
                    <label>Parcelas</label>
                    <p className="font-weight-bold"> { AF.NUMEROPRESTACAO }x { parseFloat(AF.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor) } </p>
                  </Col>
                </Row>
              </>
            )
          }

          { AF.Averbador !== 390 && AF.taxa_cet !== null && AF.taxa_cet_anual !== null
            ?
              <Row className="mb-3 border-bottom border-light">
                <Col xs="12" sm="12" xm="12">
                  <p className="font-weight-bold"><small>(Custo efetivo total de { AF.taxa_cet.toLocaleString('pt-BR', formatoValor) }% a.m. / { AF.taxa_cet_anual.toLocaleString('pt-BR', formatoValor) }% a.a.)</small></p>
                </Col>
              </Row>
            : null
          }

          { AF.VLRAF !== null
            ? <>
              <Row>
                <Col xs="6" sm="6" xm="12">
                  <p className="text-muted">Valor Liberado</p>
                </Col>
                <Col xs="6" sm="6" xm="12">
                  <p className="font-weight-bold text-right"> { parseFloat(AF.VLRAF).toLocaleString('pt-BR', formatoValor) } </p>
                </Col>
              </Row>
              </>
            : null
          }

          { AF.Averbador !== 390
            ? <>
              { AF.TAXA !== null
                ? <>
                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">Juros Mensal</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> { AF.TAXA.toLocaleString('pt-BR', formatoValor) }% a.m. </p>
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
                      <p className="font-weight-bold text-right"> { AF.taxa_anual.toLocaleString('pt-BR', formatoValor) }% a.a. </p>
                    </Col>
                  </Row>
                  </>
                : null
              }

              { AF.VLRIOF !== null
                ? <>
                  <Row>
                    <Col xs="6" sm="6" xm="12">
                      <p className="text-muted">IOF</p>
                    </Col>
                    <Col xs="6" sm="6" xm="12">
                      <p className="font-weight-bold text-right"> { parseFloat(AF.VLRIOF).toLocaleString('pt-BR', formatoValor) } </p>
                    </Col>
                  </Row>
                  </>
                : null
              }
              <Row>
                <Col xs="6" sm="6" xm="12">
                  <p className="text-muted">Seguro</p>
                </Col>
                <Col xs="6" sm="6" xm="12">
                  <p className="font-weight-bold text-right"> { [10, 390].indexOf(parseInt(AF.Averbador)) === -1 ? (AF.VLRSEGURO !== null && AF.VLRSEGURO !== '' ? 'Sim' : 'Não') : 'Não' } </p>
                </Col>
              </Row>
            </>
            : null
          }
          <Row>
            <Col xs="12" sm="6" md="6">
              <p className="text-muted">Tarifa de Cadastro</p>
            </Col>
            <Col xs="12" sm="6" md="6">
              <p className="font-weight-bold text-right"> Não </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" md="6">
              <p className="text-muted">Total Financiado</p>
            </Col>
            <Col xs="6" sm="6" md="6">
              <p className="font-weight-bold text-right">
              {
                parseFloat(
                  parseFloat(AF.VLRIOF !== null ? AF.VLRIOF : 0)
                  +
                  parseFloat(AF.VLRSEGURO !== null ? AF.VLRSEGURO : 0)
                  +
                  ([14, 32, 18].indexOf(parseInt(AF.Tipo_Operacao)) !== -1 ? parseFloat(AF.BASECOMISSAO !== null ? AF.BASECOMISSAO : 0) : parseFloat(AF.VLRAF !== null ? AF.VLRAF : 0))
                ).toLocaleString('pt-BR', formatoValor)
              }
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" md="6">
              <p className="font-weight-bold">Total a Pagar</p>
            </Col>
            <Col xs="6" sm="6" md="6">
              <p className="font-weight-bold text-right"> { (AF.NUMEROPRESTACAO * AF.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor) } </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
      </>
    )
  }
}
export default DadosDaPropostaVinculadaTemplate;
