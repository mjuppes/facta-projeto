import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import Moment from "react-moment";

import axios from 'axios';

import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
class FactaAuxBrasilQuestionario extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clicou    : false,
      pergunta1 : 'S',
      pergunta2 : 'S',
      pergunta3 : 'S',
      pergunta4 : 'S',
      pergunta5 : 'S',
      pergunta6 : 'S',
      pergunta7 : 'S'
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    if (e.target.name !== undefined) {
      let {name, value} = e.target;
      let new_state = Object.assign({}, this.state);
      this.setState({ [name] : value });
    }
  }

  getQuestionario = async () => {
    this.setState({clicou: true});

    const FormData = require('form-data');
    const formData = new FormData();

    formData.append('codigoaf',this.props.codigo_af);
    formData.append('pergunta1',this.state.pergunta1);
    formData.append('pergunta2',this.state.pergunta2);
    formData.append('pergunta3',this.state.pergunta3);
    formData.append('pergunta4',this.state.pergunta4);
    formData.append('pergunta5',this.state.pergunta5);
    formData.append('pergunta6',this.state.pergunta6);
    formData.append('pergunta7',this.state.pergunta7);

    await axios.post(

    'https://app.factafinanceira.com.br/proposta/setQuestionarioAuxBrasil',

    formData).then((response) => {
        this.props.salvaImgCcb();
    })
    .catch((error) => {
        console.log('error', error);
    });
  }

  componentDidMount() {
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
  }

  render() {

    let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }

    return (
        <div>
                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <Row className="mt-3">
                            <Col xs="12" sm="12">
                                <h5 className="text-center font-weight-bold">QUESTIONÁRIO DE ORIENTAÇÕES DE EDUCAÇÃO FINANCEIRA</h5>
                                <p className="text-center font-weight-bold">
                                    <strong>CONHEÇA OS DIREITOS E DEVERES DO SEU CONTRATO DE EMPRESTIMO CONSIGNADO AUXÍLIO BRASIL</strong>
                                </p>
                            </Col>
                        </Row>
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>

                                    Olá beneficiário(a) <font className="font-weight-bold">{this.props.nome_cliente.toUpperCase()}</font>!
                                </p>
                                <p>
                                    Você está realizando a contratação de um empréstimo consignado do Programa Auxílio Brasil.
                                </p>
                                <p>
                                    Esse questionário tem como objetivo ajudar você a refletir sobre as vantagens e desvantagens do empréstimo, bem como conhecer seus principais direitos e deveres.
                                </p>
                                <p>
                                    Não existem respostas certas ou erradas. As respostas não irão influenciar na análise do banco para a concessão do empréstimo.
                                </p>
                                <p>
                                    Em caso de dúvidas, entre em contato com o Serviço de Atendimento ao Consumidor de seu banco, com o Serviço de Defesa do Consumidor de seu Estado ou com a Ouvidoria do Ministério da Cidadania (telefone 121).
                                </p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <p className="text-center font-weight-bold">
                            <strong>QUADRO RESUMO DA PROPOSTA</strong>
                        </p>
                        <CardBody>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Valor contratado</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.vlrContratado} </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Taxa de juros mensal</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.juros_mensal} % a.m.</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Taxa de juros anual</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.juros_anual} % a.a.</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Valor total de juros</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.vlrTotalJuros} </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Custo efetivo total</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.taxa_cet} % a.m.</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Quantidade de parcelas</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.total_de_parcelas} </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Valor da parcela</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.valor_prestacao} </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Data de encerramento dos descontos:</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> <Moment format="DD/MM/YYYY">{this.props.data_encerramento_descontos}</Moment></p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="text-muted">Previsão	do	valor	do	benefício	com	desconto	do
    empréstimo:*</p>
                                </Col>
                                <Col xs="6" sm="6" xm="12">
                                    <p className="font-weight-bold text-right"> {this.props.valor_prev_beneficio !== "" ? parseFloat(this.props.valor_prev_beneficio).toLocaleString('pt-BR', formatoValor) : 'R$ 0,00'} </p>

                                </Col>
                            </Row>
                        </CardBody>
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>
                                    *ATENÇÃO: O valor do benefício é uma previsão, considerando a situação do benefício e os descontos previstos na data da proposta de empréstimo
                                </p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <p className="text-center font-weight-bold">
                            <strong>REFLEXÃO PARA CONTRATAÇÃO DO EMPRÉSTIMO CONSIGNADO AUXÍLIO BRASIL</strong>
                        </p>
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>
                                    <font className="font-weight-bold">O empréstimo consignado é um contrato</font> que você está firmando com essa instituição financeira onde você receberá um 
                                    valor de crédito <font className="font-weight-bold">que será pago com juros</font>. Esse valor foi apresentado a você no demonstrativo que acompanha esse formulário.
                                </p>
                                <p>
                                    1. Ficou claro para você o valor que receberá do empréstimo, a taxa de juros mensal e o valor total que irá pagar no final do contrato?
                                </p>
                                <p>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio1" name="pergunta1" value="S" onChange={this.handleChange} defaultChecked />
                                        <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio2" name="pergunta1" value="N" onChange={this.handleChange} />
                                        <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                                    </FormGroup>
                                </p>
                                <p>
                                    2. E o prazo do empréstimo, valor da parcela e até quando irá pagá-la?
                                </p>
                                <p>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio1" name="pergunta2" value="S" onChange={this.handleChange} defaultChecked />
                                        <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio2" name="pergunta2" value="N" onChange={this.handleChange} />
                                        <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                                    </FormGroup>
                                </p>
                                <p>
                                    No empréstimo consignado, <font className="font-weight-bold">o valor da parcela já vem descontado todos os meses diretamente em seu benefício</font>, antes do pagamento ser depositado na sua conta. O banco entregou a você o demonstrativo onde foi simulado o valor que será depositado do seu benefício a partir do próximo mês até a quitação do empréstimo.
                                </p>
                                <p>
                                    <font className="font-weight-bold">Você não pode deixar de pagar</font> as prestações ou descumprir as regras até que o contrato desse empréstimo termine ou você pague toda a dívida.
                                </p>
                                <p>
                                    3. O pagamento das parcelas do empréstimo é uma obrigação que você está assumindo. Você entendeu que a partir do próximo mês a prestação será descontada todo mês do seu benefício e que com isso o seu benefício virá com valor menor?
                                </p>
                                <p>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio1" name="pergunta3" value="S" onChange={this.handleChange} defaultChecked />
                                        <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio2" name="pergunta3" value="N" onChange={this.handleChange} />
                                        <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                                    </FormGroup>
                                </p>
                                <p>
                                    4. Você já fez suas contas para ver se vai conseguir honrar esse compromisso junto com os outros gastos do seu dia a dia?                                
                                </p>
                                <p>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio1" name="pergunta4" value="S" onChange={this.handleChange} defaultChecked />
                                        <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio2" name="pergunta4" value="N" onChange={this.handleChange} />
                                        <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                                    </FormGroup>
                                </p>
                                <p>
                                    5. Você já pensou se seria possível buscar outra solução para você não precisar fazer um empréstimo? Você já refletiu com sua família se contratar o empréstimo é a única e melhor solução para sua situação?
                                </p>
                                <p>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio1" name="pergunta5" value="S" onChange={this.handleChange} defaultChecked />
                                        <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio2" name="pergunta5" value="N" onChange={this.handleChange} />
                                        <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                                    </FormGroup>
                                </p>
                                <p>
                                    6. Você já avaliou se essa contratação é realmente uma solução para sua família, já que vocês ficarão com o valor do benefício menor durante um longo período?
                                </p>
                                <p>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio1" name="pergunta6" value="S" onChange={this.handleChange} defaultChecked />
                                        <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio2" name="pergunta6" value="N" onChange={this.handleChange} />
                                        <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                                    </FormGroup>
                                </p>
                                <p>
                                Mesmo se deixar de receber o benefício do Auxílio Brasil, <font className="font-weight-bold">você precisa se organizar para pagar todo mês o empréstimo</font> até o final do prazo do contrato, depositando na sua conta o valor da parcela,
                                </p>
                                <p>
                                    <font className="font-weight-bold">Se o seu benefício for cancelado, seu empréstimo não será cancelado.</font>
                                </p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <p className="text-center font-weight-bold">
                            <strong>VOCÊ NÃO PRECISA PEGAR EMPRÉSTIMO CONSIGNADO DO AUXÍLIO BRASIL</strong>
                        </p>
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>
                                    O empréstimo consignado do Auxílio Brasil é uma opção que deve ser utilizada apenas nos casos em que você realmente tem um problema que não pode resolver sem fazer esta contratação. Verifique se alguém da sua família ou da sua comunidade pode te oferecer outra solução, onde você não precise pagar juros.
                                </p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <p className="text-center font-weight-bold">
                            <strong>VOCÊ NÃO PRECISA CONTRATAR OUTROS SERVIÇOS BANCÁRIOS PARA TER ACESSO AO EMPRÉSTIMO CONSIGNADO</strong>
                        </p>
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>
                                    <font className="font-weight-bold">O banco não pode obrigar você a contratar qualquer serviço para que você possa contratar o empréstimo consignado</font>, como seguros ou títulos de capitalização. Se isso aconteceu, denuncie no endereço consumidor.gov.br e não assine o contrato. Isso é venda casada.
                                </p>
                                <p>
                                    No Brasil, <font className="font-weight-bold">a venda casada é expressamente proibida</font> pelo Código de Defesa do Consumidor (art. 39, I), constituindo, inclusive, crime contra as relações de consumo (art. 5º, II, da Lei n.º 8.137/90).
                                </p>
                            </Col>
                        </Row>
                        </CardBody>
                </Card>

                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <p className="text-center font-weight-bold">
                            <strong>ATRASO NO PAGAMENTO DAS PRESTAÇÕES</strong>
                        </p>
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>
                                ATENÇÃO! Caso haja atraso no pagamento das prestações, os valores serão acrescidos de multa e juros conforme consta em seu contrato.
                                </p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <p className="text-center font-weight-bold">
                            <strong>PROBLEMAS NA CONTRATAÇÃO OU NO VALOR DESCONTADO DO SEU BENEFÍCIO</strong>
                        </p>
    
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>
                                O banco onde você está contratando o empréstimo consignado é escolhido diretamente por você. 
                                <font className="font-weight-bold">Verifique se todas as informações prestadas pelo banco estão claras</font>.
                                </p>
                                <p>
                                Caso você verifique que o desconto do empréstimo foi feito de forma diferente daquela que você contratou, procure o banco. Em casos assim, você pode registrar reclamação no endereço consumidor.gov.br ou também pode procurar o PROCON ou a Defensoria Pública da União ou dos Estados.
                                </p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card className="border-white shadow" style={{borderRadius: '8px'}} >
                    <CardBody className="text-left">
                        <p className="text-center font-weight-bold">
                            <strong>AVISOS FINAIS</strong>
                        </p>
                        <Row className="text-justify">
                            <Col xs="12" sm="12" xm="12">
                                <p>
                                    Caso precise esclarecer dúvidas e conhecer seus direitos enquanto consumidor, entre em contato com o Serviço de Defesa do Consumidor de seu estado.
                                </p>
                                <p>
                                    7. Você compreendeu os direitos e deveres que foram apresentados nesse questionário?
                                </p>
                                <p>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio1" name="pergunta7" value="S" onChange={this.handleChange} defaultChecked />
                                        <Label className="form-check-label" check htmlFor="inline-radio1">Sim</Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Input className="form-check-input" type="radio" id="inline-radio2" name="pergunta7" value="N" onChange={this.handleChange} />
                                        <Label className="form-check-label" check htmlFor="inline-radio2">Não</Label>
                                    </FormGroup>
                                </p>
                            </Col>
                        </Row>
                        <Row className="mb-3 mt-3">
                            <Col xs="12" sm="12">
                                { this.state.clicou  ?
                                    <LayoutFactaCarregando />
                                :
                                    <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={this.getQuestionario}  disabled={this.state.clicou}>
                                        Eu <strong>li</strong> e <strong>aceito</strong> os termos
                                    </Button>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
        </div>
    );
  }
}

export default FactaAuxBrasilQuestionario;
