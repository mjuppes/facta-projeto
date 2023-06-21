import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
import axios from 'axios';
class DadosLimiteCreditoBlocoTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {margem_cartao: '', limite_cartao: '',
         valor_saque: '', limite_compras: '',
         loadSpinner: true
        }
    }

    getPropostasLimiteCredito = async () => { 
        await axios
        .get('https://app.factafinanceira.com.br/proposta/get_dados_limite_credito?codigo=' + this.props.proposta.idSimulador+ '&ambiente=prod')
        .then(res => {  

          if(res.data.length === 0){
              this.setState({           
                margem_cartao: 0,
                limite_cartao: 0,
                valor_saque: 0,
                saque_maximo : 0,
                limite_compras : 0,
                loadSpinner: false 
            }); 
          } else {
            this.setState({           
                margem_cartao: res.data[0].margem_cartao,
                limite_cartao: res.data[0].limite_cartao,
                valor_saque: res.data[0].VLRAF,
                saque_maximo : res.data[0].saque_maximo,
                limite_compras : res.data[0].disponivel_compras,
                loadSpinner: false 
            }); 
          }
        })
        .catch(error => console.log(error));
    };

    componentDidMount() { 
        this.getPropostasLimiteCredito();
    }

    render() {

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
    var AF = this.props.proposta;

    var TIPO_OPERACAO = this.props.tipo_operacao;
    var COD_TP_OPERACAO = this.props.cod_tipo_operacao;

    const styleSpinner = {
        "padding": "20px",
        "margin": "200px auto"
      }
    return(
      <>
      <Card className="border-white shadow" style={{borderRadius: '8px'}}>

        {(this.state.loadSpinner) &&
            <div>
                <Row className="text-center">
                    <Col md="12" lg="12" xl="12">
                        <div className="spinner-border text-info" style={styleSpinner}>
                        <span className="sr-only">Carregando...</span>
                        </div>
                    </Col>
                    </Row>
            </div>
        }
        {(this.state.loadSpinner === false) &&
        <CardBody className="text-left">
          <h5 className="text-center border-bottom border-light">
            Limites Cartão de Crédito
            <p><small className="text-muted text-capitalize">(Cartão Consignado Benefício) </small></p>
          </h5>
          <Row>
            <Col xs="12" sm="6" md="6">
              <label>Valor Limite Cartão</label>
              <p className="font-weight-bold"> { parseFloat(this.state.limite_cartao).toLocaleString('pt-BR', formatoValor) } </p>
            </Col>
            <Col xs="12" sm="6" md="6">
              <label>Valor Máximo de Saque</label>
              <p className="font-weight-bold"> { parseFloat(this.state.saque_maximo).toLocaleString('pt-BR', formatoValor) } </p>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="6" md="6">
              <label>Limite Disponível para Compras</label>
              <p className="font-weight-bold"> 
                  { parseFloat(this.state.limite_compras).toLocaleString('pt-BR', formatoValor) }
               </p>
            </Col>
            <Col xs="6" sm="6" xm="12">
              <label>Valor Saque Solicitado</label>
              <p className="font-weight-bold"> 
                  { parseFloat(this.state.valor_saque).toLocaleString('pt-BR', formatoValor) }
               </p>
            </Col>
          </Row>
        </CardBody>
        }
      </Card>
      </>
    )
  }
}
export default DadosLimiteCreditoBlocoTemplate;
