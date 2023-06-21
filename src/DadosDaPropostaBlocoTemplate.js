import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
class DadosDaPropostaBlocoTemplate extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() { 
 
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
            <Col xs="12" sm="6" md="6">
              <label>Valor Líquido do Crédito</label>
              <p className="font-weight-bold"> { parseFloat(AF.VLRAF !== null  ? AF.VLRAF : 0).toLocaleString('pt-BR', formatoValor) } </p>
            </Col>
            <Col xs="12" sm="6" md="6">
              <label>Parcelas</label>
              <p className="font-weight-bold"> { AF.NUMEROPRESTACAO }x { parseFloat(AF.VLRPRESTACAO !== null ? AF.VLRPRESTACAO : 0).toLocaleString('pt-BR', formatoValor) } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="6" md="6">
              <label>Tarifa de Cadastro</label>
              <p className="font-weight-bold"> 
                {(AF.Averbador === 20124 && AF.TAC > 0) ? ''+AF.TAC.toLocaleString('pt-BR', formatoValor) : 'R$ 0,00'}
               </p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Seguro</label>
              <p className="font-weight-bold"> { parseFloat(AF.VLRSEGURO !== null  ? AF.VLRSEGURO : 0).toLocaleString('pt-BR', formatoValor) } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="6" sm="6" xm="12">
              <label>1ª Parcela</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{AF.DATAINICIO}</Moment></p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Última Parcela</label>
              <p className="font-weight-bold"><Moment format="DD/MM/YYYY">{AF.DATAFIM}</Moment></p>
            </Col>
          </Row>
          <Row className="border-bottom mb-3">
            <Col xs="6" sm="6" xm="12">
              <label>IOF</label>
              <p className="font-weight-bold"> { parseFloat(AF.VLRIOF !== null ? AF.VLRIOF : 0).toLocaleString('pt-BR', formatoValor) } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="6" md="6">
              <label>Valor Total de Crédito</label>
              <p className="font-weight-bold"> {
                ( COD_TP_OPERACAO !== undefined && (COD_TP_OPERACAO === 2 || COD_TP_OPERACAO === 14 || COD_TP_OPERACAO === 32))
                  ? parseFloat(AF.saldoDevedor !== null  ? AF.saldoDevedor : 0).toLocaleString('pt-BR', formatoValor)
                  : AF.Tipo_Operacao === 17 ? parseFloat(AF.BASECOMISSAO !== null  ? AF.BASECOMISSAO : 0).toLocaleString('pt-BR', formatoValor) : parseFloat(AF.VLRAF !== null  ? AF.VLRAF : 0).toLocaleString('pt-BR', formatoValor)
                }
              </p>
            </Col>
            { parseInt(AF.Averbador) !== 1 && parseInt(AF.Averbador) !== 30
              ? <>
                  <Col xs="12" sm="6" md="6">
                    <label>Valor Total Devido</label>
                    <p className="font-weight-bold"> {
                      AF.VLRPRESTACAO !== null  && AF.NUMEROPRESTACAO !== null
                        ? (AF.VLRPRESTACAO * AF.NUMEROPRESTACAO).toLocaleString('pt-BR', formatoValor)
                        : ' - '
                      }
                    </p>
                  </Col>
                </>
              : null
            }
          </Row>
        </CardBody>
      </Card>
      </>
    )
  }
}
export default DadosDaPropostaBlocoTemplate;
