import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Moment from "react-moment";
import axios from 'axios';
import { ConsoleView } from 'react-device-detect';
class DadosDaPropostaFgtsBlocoTemplate extends Component {
  constructor(props) {
    super(props); 

    this.state = {dadosFgts: [], total_fgts: '', total_emprestimo: '', total_saque: '', tac: '', cet: '' }
  }

  

  getPropostasFactaFgts = async () => { 
    
    await axios
    .get('https://app.factafinanceira.com.br/proposta/get_dados_proposta_facta_fgts?tipo=lista&codigo=' + this.props.proposta.CODIGO + '&ambiente=prod')
    .then(res => {
      this.setState({
        dadosFgts: res.data, 
        carregando: false,
        total_fgts: res.data[0].total_fgts,
        total_emprestimo: res.data[0].valor_emprestimo,
        total_saque: res.data[0].total_saque,
        tac: res.data[0].tac
      });  
    })
    .catch(error => console.log(error));
  };
  
  getCET = async () => { 
    
    await axios
    .get('https://app.factafinanceira.com.br/fgts/get_cet?taxa=' + this.props.proposta.TAXA)
    .then(res => {
      this.setState({ 
        carregando: false, 
        cet: res.data.cet
      });  
    })
    .catch(error => console.log(error));
  };
  
  componentDidMount() { 
    this.getPropostasFactaFgts();  
    this.getCET();  
  }

  render() {
    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
    var AF = this.props.proposta;
    var TIPO_OPERACAO = this.props.tipo_operacao;
    var COD_TP_OPERACAO = this.props.cod_tipo_operacao;  

     
 

    //this.items = this.state.dadosProposta.map((item, key) =>    <li key={item.data_vencimento}>{item.data_vencimento}</li>);

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
              <label>Valor Disponível de saldo FGTS</label>
              <p className="font-weight-bold"> { parseFloat(this.state.total_fgts).toLocaleString('pt-BR', formatoValor) }</p>
            </Col> 
          </Row>   
  
          <Row> 
              <Col xs="4" sm="4" md="4">
                <label>Data Vencimento</label>
              </Col>
              <Col xs="4" sm="4" md="4">
                <label>Saque Disponível</label>
              </Col>
              <Col xs="4" sm="4" md="4">
                <label>Valor Antecipação</label>                
              </Col>
            </Row>
          {this.state.dadosFgts.map((dados, index) => (
            <Row> 
                <Col xs="4" sm="4" md="4">
                  <p className="font-weight-bold">{dados.data_vencimento}</p>
                </Col>
                <Col xs="4" sm="4" md="4">
                  <p className="font-weight-bold"> { parseFloat(dados.saque_disponivel).toLocaleString('pt-BR', formatoValor) }</p>
                </Col>
                <Col xs="4" sm="4" md="4">
                  <p className="font-weight-bold"> { parseFloat(dados.valor_antecipacao).toLocaleString('pt-BR', formatoValor) }</p>
                </Col> 
            </Row>  
          ))}
          <Row>
            <Col xs="8" sm="8" md="8" className="text-right">
              <label>Total de Saque</label>
              
            </Col>
            <Col xs="4" sm="4" md="4">
              <p className="font-weight-bold"> { parseFloat(this.state.total_saque).toLocaleString('pt-BR', formatoValor) }</p>
            </Col>
          </Row>
          <Row className="border-top border-light">
            <Col xs="4" sm="3" xm="3" className="margin-top-20">
              <label>Taxa (a.m.)</label>
              <p className="font-weight-bold">{ parseFloat(AF.TAXA) }%</p>
            </Col> 
            <Col xs="4" sm="3" xm="3" className="margin-top-20">
              <label>CET (a.a.)</label>
              <p className="font-weight-bold">{ parseFloat(this.state.cet) }%</p>              
            </Col>
            <Col xs="4" sm="3" xm="3" className="margin-top-20">
              <label>TC</label>
              <p className="font-weight-bold">{ parseFloat(this.state.tac).toLocaleString('pt-BR', formatoValor) }</p>              
            </Col>
            <Col xs="6" sm="3" xm="3" className="margin-top-20">
              <label>Total Empréstimo</label>
              <p className="font-weight-bold"> { parseFloat(this.state.total_emprestimo).toLocaleString('pt-BR', formatoValor) }</p>              
            </Col> 
          </Row>  
        </CardBody>
      </Card>
      </>
    )
  }
}
export default DadosDaPropostaFgtsBlocoTemplate;
