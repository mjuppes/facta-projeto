import React, { Component } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import LayoutFactaHeader from '../../../LayoutFactaHeader';

import TimelineProgresso from '../../TimelineProgresso';

class Documentos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeout: 300,
      tipoPendencia: props.tipo,
      codigoAFOriginal: this.props.match.params.propostaId,
      codigoAF: atob(this.props.match.params.propostaId),
      homeLink: '/digital/'+this.props.match.params.propostaId,
      //homeLink: '/totem-facta',
      homeLinkPendencias: '/pendencias/'+this.props.match.params.propostaId,
      homeLinkRegularizacao: '/regularizacao/'+this.props.match.params.propostaId,
      proximoLink: '',
      base64Ccb: '',
      base64CcbTermos: '',
      tipoFormalizacao: 'normal',
      obj_pendencias: [],
    };

    if (this.props.location.state === undefined) {
      if (window.location.href.indexOf("/pendencias-") !== -1) {
        this.props.history.push(this.state.homeLinkPendencias);
      }
      else if (window.location.href.indexOf("/regularizacao-") !== -1) {
        this.props.history.push(this.state.homeLinkRegularizacao);
      }
      else {
        this.props.history.push(this.state.homeLink);
      }
      this.state.obj_proposta = [];
      return false;
    }
    else {
      this.state.obj_proposta = this.props.location.state.obj_proposta;
    }

    var _state = this.props.location.state;
    /*
    console.log('Teste aqui!!');
    console.log(_state.dataHoraTermo)
    console.log(_state.geoTermo)
    console.log(_state);
    console.log('Teste aqui 2!!');
    */

    this.state.obj_pendencias         = this.state.tipoPendencia !== "normal" && _state.obj_pendencias !== undefined ? _state.obj_pendencias : [];
    this.state.dataHoraPrimeiraTela   = _state.dataHoraPrimeiraTela;
    this.state.dataHoraTermo          = _state.dataHoraTermo;
    this.state.dataHoraCcb            = _state.dataHoraCcb;

    this.state.geoInicial             = _state.geoInicial;
    this.state.geoTermo               = _state.geoTermo;
    this.state.geoCcb                 = _state.geoCcb;

    this.state.aceitouSeguro          = _state.aceitouSeguro !== undefined ? _state.aceitouSeguro : '';
    this.state.dataHoraAceitouSeguro  = _state.dataHoraAceitouSeguro !== undefined ? _state.dataHoraAceitouSeguro : '';

    this.state.aceitouConsultaDataprev = _state.aceitouConsultaDataprev !== undefined ? _state.aceitouConsultaDataprev : '';
    this.state.dataHoraAceitouDataprev = _state.dataHoraAceitouDataprev !== undefined ? _state.dataHoraAceitouDataprev : '';

    this.state.aceitouConta         = _state.aceitouConta !== undefined ? _state.aceitouConta : '';
    this.state.dataHoraAceitouConta = _state.dataHoraAceitouConta !== undefined ? _state.dataHoraAceitouConta : '';

    this.state.aceitouAutTransferencia          = _state.aceitouAutTransferencia !== undefined ? _state.aceitouAutTransferencia : '';
    this.state.dataHoraAceitouAutTransferencia  = _state.dataHoraAceitouAutTransferencia !== undefined ? _state.dataHoraAceitouAutTransferencia : '';

    this.state.aceitouAutBoletos          = _state.aceitouAutBoletos !== undefined ? _state.aceitouAutBoletos : '';
    this.state.dataHoraAceitouAutBoletos  = _state.dataHoraAceitouAutBoletos !== undefined ? _state.dataHoraAceitouAutBoletos : '';

    this.state.base64Ccb = _state.base64Ccb;
    this.state.base64CcbTermos = _state.base64CcbTermos;

    this.state.tipoFormalizacao = _state.tipoFormalizacao !== undefined ? _state.tipoFormalizacao : this.state.tipoFormalizacao;

  }

  componentDidMount() {
    window.scrollTo(0, 3);
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

          { isMobile === false
            ? <>
                <Col md="5" style={{ 'position' : 'relative' }}>
                    <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                    <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                    <TimelineProgresso
                      bemvindo="fa fa-check-square-o text-success"
                      uso="fa fa-check-square-o text-success"
                      proposta="fa fa-check-square-o text-success"
                      residencia="fa fa-check-square-o text-success"
                      fotos="fa fa-square-o"
                      audio="fa fa-square-o"
                    />
                </Col>
              </>
            : null
          }

          <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
            <Card className="border-white shadow" style={{borderRadius: '8px'}}>
              <CardBody>
                <Row className="mt-3">
                  <Col xs="12" sm="12">
                    <h5 className="text-center mb-3 font-weight-bold">Envio de Documentos</h5>
                    <p className="text-justify"> Selecione abaixo o tipo de documento de identificação que você tem para enviar </p>
                  </Col>
                  <Col xs="12" sm="12">
                    <Row className="mt-3">
                      <Col xs="12" sm="12">
                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold" to={{
                          pathname: (this.state.tipoPendencia === 'normal' ? '/foto-documento/' : '/'+this.state.tipoPendencia+'-foto-documento/') + this.state.codigoAFOriginal,
                          state: {
                            navegacao: true,
                            tipoDocumento: 'RG',
                            obj_proposta: this.state.obj_proposta,
                            dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,
                            dataHoraTermo: this.state.dataHoraTermo,
                            dataHoraCcb: this.state.dataHoraCcb,
                            geoInicial: this.state.geoInicial,
                            geoTermo: this.state.geoTermo,
                            geoCcb: this.state.geoCcb,

                            aceitouSeguro: this.state.aceitouSeguro,
                            dataHoraAceitouSeguro: this.state.dataHoraAceitouSeguro,

                            aceitouConsultaDataprev: this.state.aceitouConsultaDataprev,
                            dataHoraAceitouDataprev: this.state.dataHoraAceitouDataprev,

                            aceitouConta: this.state.aceitouConta,
                            dataHoraAceitouConta: this.state.dataHoraAceitouConta,

                            aceitouAutTransferencia: this.state.aceitouAutTransferencia,
                            dataHoraAceitouAutTransferencia: this.state.dataHoraAceitouAutTransferencia,

                            aceitouAutBoletos: this.state.aceitouAutBoletos,
                            dataHoraAceitouAutBoletos: this.state.dataHoraAceitouAutBoletos,
                            obj_pendencias: this.state.obj_pendencias,
                          }
                        }} >
                          Carteira de Identidade
                        </Link>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="12">
                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" to={{
                          pathname: (this.state.tipoPendencia === 'normal' ? '/foto-documento/' : '/'+this.state.tipoPendencia+'-foto-documento/') + this.state.codigoAFOriginal,
                          state: {
                            navegacao: true,
                            tipoDocumento: 'CNH',
                            obj_proposta: this.state.obj_proposta,
                            dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,
                            dataHoraTermo: this.state.dataHoraTermo,
                            dataHoraCcb: this.state.dataHoraCcb,
                            geoInicial: this.state.geoInicial,
                            geoTermo: this.state.geoTermo,
                            geoCcb: this.state.geoCcb,

                            aceitouSeguro: this.state.aceitouSeguro,
                            dataHoraAceitouSeguro: this.state.dataHoraAceitouSeguro,

                            aceitouConsultaDataprev: this.state.aceitouConsultaDataprev,
                            dataHoraAceitouDataprev: this.state.dataHoraAceitouDataprev,

                            aceitouConta: this.state.aceitouConta,
                            dataHoraAceitouConta: this.state.dataHoraAceitouConta,

                            aceitouAutTransferencia: this.state.aceitouAutTransferencia,
                            dataHoraAceitouAutTransferencia: this.state.dataHoraAceitouAutTransferencia,

                            aceitouAutBoletos: this.state.aceitouAutBoletos,
                            dataHoraAceitouAutBoletos: this.state.dataHoraAceitouAutBoletos,
                            base64Ccb: this.state.base64Ccb,
                            obj_pendencias: this.state.obj_pendencias,
                          }
                        }} >
                          Carteira de Motorista
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default Documentos;
