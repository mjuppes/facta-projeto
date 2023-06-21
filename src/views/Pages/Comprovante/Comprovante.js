import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Row, Button } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';

import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import '../../../scss/fotos.css';

import LayoutFactaHeader from '../../../LayoutFactaHeader';
import LayoutFactaCarregando from '../../../LayoutFactaCarregando';
import PaginaMensagemLocalizacao from '../../../PaginaMensagemLocalizacao';
import TimelineProgresso from '../../TimelineProgresso';

class Comprovante extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeout: 300,
      exibeCamera: false,
      etapa: 'frente',
      instrucao: true,

      dataUriFrente: '',
      dataUriFrenteRenda: '',
      dataUriVerso: '',

      codigoAFOriginal: this.props.match.params.propostaId,
      homeLink: '/digital/'+this.props.match.params.propostaId,
      proximoLink: '',
      averbador: 0,
      enviouDocumentos: true,
      labelDocumento: '',
      labelFoto_1: '',
      labelFoto_2: '',
      base64Ccb: '',
      base64CcbTermos : ''
    };

    if (this.props.location.state === undefined) {
      this.props.history.push(this.state.homeLink);
      this.state.obj_proposta = [];
      return false;
    }
    else {
      this.state.obj_proposta = this.props.location.state.obj_proposta;
    }

    var _state = this.props.location.state;

    this.state.averbador            =  this.state.obj_proposta.Averbador;
    this.state.dataHoraPrimeiraTela = _state.dataHoraPrimeiraTela;
    this.state.dataHoraTermo        = _state.dataHoraTermo;
    this.state.dataHoraCcb          = _state.dataHoraCcb;

    this.state.geoInicial = _state.geoInicial;
    this.state.geoTermo   = _state.geoTermo;
    this.state.geoCcb     = _state.geoCcb;

    this.state.base64Ccb = _state.base64Ccb;
    this.state.base64CcbTermos = _state.base64CcbTermos;

    this.state.fotoDocumentoFrente  = _state.fotoDocumentoFrente;
    this.state.fotoDocumentoVerso   = _state.fotoDocumentoVerso;

    this.state.aceitouSeguro          = _state.aceitouSeguro !== undefined          ? _state.aceitouSeguro : '';
    this.state.dataHoraAceitouSeguro  = _state.dataHoraAceitouSeguro !== undefined  ? _state.dataHoraAceitouSeguro : '';

    this.state.aceitouConsultaDataprev = _state.aceitouConsultaDataprev !== undefined ? _state.aceitouConsultaDataprev : '';
    this.state.dataHoraAceitouDataprev = _state.dataHoraAceitouDataprev !== undefined ? _state.dataHoraAceitouDataprev : '';

    this.state.aceitouAutTransferencia          = _state.aceitouAutTransferencia !== undefined          ? _state.aceitouAutTransferencia : '';
    this.state.dataHoraAceitouAutTransferencia  = _state.dataHoraAceitouAutTransferencia !== undefined  ? _state.dataHoraAceitouAutTransferencia : '';

    this.state.aceitouAutBoletos          = _state.aceitouAutBoletos !== undefined          ? _state.aceitouAutBoletos : '';
    this.state.dataHoraAceitouAutBoletos  = _state.dataHoraAceitouAutBoletos !== undefined  ? _state.dataHoraAceitouAutBoletos : '';

    this.state.aceitouDebitoEmConta = _state.aceitouDebitoEmConta !== undefined ? _state.aceitouDebitoEmConta : '';
    this.state.dataHoraAceitouDebitoEmConta = _state.dataHoraAceitouDebitoEmConta !== undefined ? _state.dataHoraAceitouDebitoEmConta : '';

    if (this.state.averbador == 10) {
        this.state.labelFoto_1 = 'Comprovante de Residência';
        this.state.labelFoto_2 = 'Foto do Contracheque';
    }
    else if (this.state.averbador == 15) {
        this.state.labelFoto_1 = '';
        this.state.labelFoto_2 = 'Foto do Contracheque';
    }
    else {
        this.state.labelFoto_1 = 'Foto do Extrato Bancário';
        this.state.labelFoto_2 = 'Foto do Cadastro de Optante';
    }

    this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
    // Se for proposta de TESOURO SEMPRE tira SELFIE e GRAVA AUDIO
    if (parseInt(this.state.obj_proposta.Averbador) === 1 || parseInt(this.state.obj_proposta.Averbador) === 30 || parseInt(this.state.obj_proposta.Averbador) === 100) {
      this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
    }
    else if (parseInt(this.state.obj_proposta.Averbador) === 3 &&
            (parseInt(this.state.obj_proposta.Tipo_Operacao) === 13 || parseInt(this.state.obj_proposta.Tipo_Operacao) === 27) &&
            (['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE'].indexOf(this.state.obj_proposta.CORRETOR.UF) !== -1) &&
            parseInt(this.state.obj_proposta.CORRETOR.Classificacao) === 1 &&
            this.state.obj_proposta.codigotabela === 'PRE'
    ) {
      this.state.proximoLink = '/foto-selfie/'+this.state.codigoAFOriginal;
    }
    else if ((this.state.obj_proposta.CORRETOR.FRANQUIA === 'S' || (parseInt(this.state.int_averbador) === 20095)  || (parseInt(this.state.obj_proposta.CORRETOR.Classificacao) === 1 && [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760].indexOf(parseInt(this.state.obj_proposta.CORRETOR.CODIGO)) === -1) )) {
      this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
    }
    else {
      // PROPOSTA PRESENCIAL VAI PARA O PreSelfie.js
      // Onde será tirada a selfie (validando a prova de vida) e depois
      // gravado o vídeo no Selfie.js
      if (this.state.obj_proposta.codigotabela === 'PRE') {
        this.state.proximoLink = '/foto-selfie/'+this.state.codigoAFOriginal;
      }
      else {
        this.state.proximoLink = '/selfie/'+this.state.codigoAFOriginal;
      }
    }

  }

  onTakePhotoFrente = (dataUri) => {
    console.log('takePhoto');
    this.setState({dataUriFrente: dataUri });
  }

  onTakePhotoFrenteRenda = (dataUri) => {
    console.log('takePhoto');
    this.setState({dataUriFrenteRenda: dataUri });
  }

  removeImageFrente = () => {
    console.log('Excluir imagem');
    this.setState({dataUriFrente: '' });
  }

  removeImageFrenteRenda = () => {
    console.log('Excluir imagem');
    this.setState({dataUriFrenteRenda: '' });
  }

  onTakePhotoVerso = (dataUri) => {
    console.log('takePhoto');
    this.setState({dataUriVerso: dataUri });
  }

  removeImageVerso = () => {
    console.log('Excluir imagem');
    this.setState({dataUriVerso: '' });
  }

  proximaEtapa = (etapa) => {
    console.log('Mudar etapa: ' + etapa);
    this.setState({etapa: etapa});
  }

  componentDidMount () {
    setTimeout(() => {window.scrollTo(0, 3)}, 100);
    if (!navigator.mediaDevices){
      navigator.mediaDevices = navigator;
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

    const containerPaddingTopMobile = {
      'backgroundColor' : '#000',
      'overflow' : 'hidden'
    }

    return (
      <div className="app align-items-center" style={appHeightAuto} >
        { this.state.instrucao === false
          ? (<>
            { /* ### ETAPA FRENTE ### */ }
            { this.state.etapa === 'frente'
              ? (this.state.dataUriFrente !== ''
                ? <>
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
                            <Row>
                              <Col>
                                <h5 className="text-center mb-3 font-weight-bold">{ this.state.labelFoto_1 }</h5>
                                <p className="text-center">Veja abaixo como ficou a imagem</p>
                                <Row>
                                  <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                    <img className="img-fluid" src={ this.state.dataUriFrente } alt='Foto tirada' style={{'maxWidth' : '95%'}} />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="text-center" xs="12">
                                <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                  <Button className="btn-block font-weight-bold mt-2" color="outline-danger" onClick={ this.removeImageFrente }><i className="fa fa-trash"></i> Remover</Button>
                                  <Button className="btn-block font-weight-bold mt-2" color="outline-primary" size="lg"
                                    onClick={ () => { this.proximaEtapa( this.state.averbador === 390 ? 'renda' : 'verso' ) } }
                                  >Prosseguir</Button>
                                </Col>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  </>
                : <>
                  <Col className="w-100 p-3 min-vh-100 text-center" style={ isMobile ? containerPaddingTopMobile : containerPaddingTop}>
                    <Col xs="12" sm="12" md="12" className="text-center p-0">
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
                        <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'backgroundColor' : '#000', 'height' : (window.screen.height * 0.85) + 'px'}}>
                          <div className="text-center position-absolute text-white p-3 mt-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: '10000', width: '90%', left: '5%'}}>
                            <h5 className="text-center">{ this.state.labelFoto_1 }</h5>
                          </div>
                          <Col className="w-100 p-0 min-vh-100 text-center" style={{'backgroundColor' : '#000'}}>
                            <Col xs="12" sm="12" md="12" className="text-center p-0">
                              <Col xs="12" sm="12" md="12" className="p-0" style={{'backgroundColor' : '#000'}}>
                                <Camera
                                  onTakePhotoAnimationDone={ (dataUri) => { this.onTakePhotoFrente(dataUri); } }
                                  idealFacingMode={FACING_MODES.ENVIRONMENT}
                                  isImageMirror={false}
                                  isSilentMode={true}
                                  isFullscreen={ isMobile ? true : false }
                                  onCameraError={ () => { this.setState({ cameraDisponivel : false }) } }
                                />
                              </Col>
                            </Col>
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                  </>
              )
              : (this.state.etapa === 'renda'
                 /* ### ETAPA RENDA (FACTA FACIL) ### */
                 ? (this.state.dataUriFrenteRenda !== ''
                   ? <>
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
                                     fotos="fa fa-square-o text-warning"
                                     audio="fa fa-square-o"
                                   />
                               </Col>
                             </>
                           : null
                         }

                         <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                           <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                             <CardBody>
                               <Row>
                                 <Col>
                                   <h5 className="text-center mb-3 font-weight-bold">Foto Comprovante de Renda</h5>
                                   <p className="text-center">Veja abaixo como ficou a imagem</p>
                                   <Row>
                                     <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                       <img className="img-fluid" src={ this.state.dataUriFrenteRenda } alt='Foto tirada' style={{'maxWidth' : '95%'}} />
                                     </Col>
                                   </Row>
                                 </Col>
                               </Row>
                               <Row>
                                 <Col className="text-center" xs="12">
                                   <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                     <Button className="btn-block font-weight-bold mt-2" color="outline-danger" onClick={ this.removeImageFrenteRenda }><i className="fa fa-trash"></i> Remover</Button>
                                     <Button className="btn-block font-weight-bold mt-2" color="outline-primary" size="lg" onClick={ () => { this.proximaEtapa('verso') } }>Prosseguir</Button>
                                   </Col>
                                 </Col>
                               </Row>
                             </CardBody>
                           </Card>
                         </Col>
                       </Row>
                     </Col>
                     </>
                   : <>
                     <Col className="w-100 p-3 min-vh-100 text-center" style={ isMobile ? containerPaddingTopMobile : containerPaddingTop}>
                       <Col xs="12" sm="12" md="12" className="text-center p-0">
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
                           <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'backgroundColor' : '#000', 'height' : (window.screen.height * 0.85) + 'px'}}>
                             <div className="text-center position-absolute text-white p-3 mt-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: '10000', width: '90%', left: '5%'}}>
                               <h5 className="text-center">Foto Comprovante de Renda</h5>
                             </div>
                             <Col className="w-100 p-0 min-vh-100 text-center" style={{'backgroundColor' : '#000'}}>
                               <Col xs="12" sm="12" md="12" className="text-center p-0">
                                 <Col xs="12" sm="12" md="12" className="p-0" style={{'backgroundColor' : '#000'}}>
                                   <Camera
                                     onTakePhotoAnimationDone={ (dataUri) => { this.onTakePhotoFrenteRenda(dataUri); } }
                                     idealFacingMode={FACING_MODES.ENVIRONMENT}
                                     isImageMirror={false}
                                     isSilentMode={true}
                                     isFullscreen={ isMobile ? true : false }
                                     onCameraError={ () => { this.setState({ cameraDisponivel : false }) } }
                                   />
                                 </Col>
                               </Col>
                             </Col>
                           </Col>
                         </Row>
                       </Col>
                     </Col>
                     </>
                   )
                 /* ### FIM ETAPA RENDA (FACTA FACIL) ### */
                 : (this.state.dataUriVerso !== ''
                    /* ### ETAPA VERSO ### */
                    ? <>
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
                                        fotos="fa fa-square-o text-warning"
                                        audio="fa fa-square-o"
                                      />
                                  </Col>
                                </>
                              : null
                            }

                            <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                              <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                <CardBody>
                                  <Row>
                                    <Col>
                                      <h5 className="text-center mb-3 font-weight-bold">{ this.state.labelFoto_2 }</h5>
                                      <p className="text-center">Veja abaixo como ficou a imagem</p>
                                      <Row>
                                        <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                          <img className="img-fluid" src={ this.state.dataUriVerso } alt='Foto tirada' style={{'maxWidth' : '95%'}} />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col className="text-center" xs="12">
                                      <Col className="text-center mt-3" md="12" lg="12" xs="12" sm="12">
                                        <Button className="btn-block font-weight-bold mt-2" color="outline-danger" onClick={ this.removeImageVerso }><i className="fa fa-trash"></i> Remover</Button>
                                        <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" to={{
                                          pathname: this.state.proximoLink,
                                          state: {
                                            navegacao: true,
                                            obj_proposta: this.state.obj_proposta,
                                            dataHoraPrimeiraTela: this.state.dataHoraPrimeiraTela,
                                            dataHoraTermo: this.state.dataHoraTermo,
                                            dataHoraCcb: this.state.dataHoraCcb,
                                            fotoDocumentoFrente: this.state.fotoDocumentoFrente,
                                            fotoDocumentoVerso: this.state.fotoDocumentoVerso,

                                            fotoExtrato: this.state.dataUriFrente,
                                            fotoRenda: this.state.dataUriFrenteRenda,
                                            fotoOptante: this.state.dataUriVerso,

                                            geoInicial: this.state.geoInicial,
                                            geoTermo: this.state.geoTermo,
                                            geoCcb: this.state.geoCcb,

                                            base64Ccb: this.state.base64Ccb,
                                            base64CcbTermos: this.state.base64CcbTermos,

                                            aceitouSeguro: this.state.aceitouSeguro,
                                            dataHoraAceitouSeguro: this.state.dataHoraAceitouSeguro,

                                            aceitouConsultaDataprev: this.state.aceitouConsultaDataprev,
                                            dataHoraAceitouDataprev: this.state.dataHoraAceitouDataprev,

                                            aceitouAutTransferencia: this.state.aceitouAutTransferencia,
                                            dataHoraAceitouAutTransferencia: this.state.dataHoraAceitouAutTransferencia,

                                            aceitouAutBoletos: this.state.aceitouAutBoletos,
                                            dataHoraAceitouAutBoletos: this.state.dataHoraAceitouAutBoletos,

                                            aceitouDebitoEmConta: this.state.aceitouDebitoEmConta,
                                            dataHoraAceitouDebitoEmConta: this.state.dataHoraAceitouDebitoEmConta

                                          }
                                        }}
                                        >
                                          Prosseguir
                                        </Link>
                                      </Col>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </Col>

                      </>
                    : <>
                      <Col className="w-100 p-3 min-vh-100 text-center" style={ isMobile ? containerPaddingTopMobile : containerPaddingTop}>
                        <Col xs="12" sm="12" md="12" className="text-center p-0">
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
                            <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'backgroundColor' : '#000', 'height' : (window.screen.height * 0.85) + 'px'}}>
                              <div className="text-center position-absolute text-white p-3 mt-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: '10000', width: '90%', left: '5%'}}>
                                <h5 className="text-center">{ this.state.labelFoto_2 }</h5>
                              </div>
                              <Col className="w-100 p-0 min-vh-100 text-center" style={{'backgroundColor' : '#000'}}>
                                <Col xs="12" sm="12" md="12" className="text-center p-0">
                                  <Col xs="12" sm="12" md="12" className="p-0" style={{'backgroundColor' : '#000'}}>
                                    <Camera
                                      onTakePhotoAnimationDone={ (dataUri) => { this.onTakePhotoVerso(dataUri); } }
                                      idealFacingMode={FACING_MODES.ENVIRONMENT}
                                      isImageMirror={false}
                                      isSilentMode={true}
                                      isFullscreen={ isMobile ? true : false }
                                      onCameraError={ () => { this.setState({ cameraDisponivel : false }) } }
                                    />
                                  </Col>
                                </Col>
                              </Col>
                            </Col>
                          </Row>
                        </Col>
                      </Col>
                      </>
                    )
                    /* ### FIM ETAPA VERSO ### */
                )
            }
        </>)
      : <>
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
                        fotos="fa fa-square-o text-warning"
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
                      <p className="text-center">Agora vamos precisar que você tire foto do seu
                      {
                        this.state.averbador === 15
                        ? 'contracheque'
                        : (this.state.averbador === 10 ? 'comprovante de residência e do contracheque' : 'extrato bancário, comprovante de residência e do cadastro de optante')
                      }.
                      </p>
                    </Col>
                    <Col xs="12" sm="12">
                      <Row className="mt-3">
                        <Col xs="12" sm="12">
                          <Button size="lg" color="outline-success" className="font-weight-bold" onClick={() => {this.setState({instrucao : false, etapa : (this.state.averbador === 15 ? 'verso' : 'frente') }) }}>OK</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
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

export default Comprovante;
