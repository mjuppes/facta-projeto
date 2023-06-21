import React, { Component } from 'react';
import { Col, Row, Button, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import Spinner from '../../Spinner';
import TimelineProgresso from '../../TimelineProgresso';
import LayoutFactaHeader from '../../../LayoutFactaHeader';
import DocumentosUnico from '../DocumentosUnico/DocumentosUnico';
import EnvioSelfieUnico from '../EnvioSelfieUnico/EnvioSelfieUnico';
import EnvioDocumentoUnicoCNH from '../EnvioDocumentoUnicoCNH/EnvioDocumentoUnicoCNH';
import EnvioDocumentoUnicoCIM from '../EnvioDocumentoUnicoCIM/EnvioDocumentoUnicoCIM';
import CardAnalfabeto from '../EnvioDocAnalfabeto/CardAnalfabeto';
import EnvioDocumentoUnicoCTPS from '../EnvioDocumentoUnicoCTPS/EnvioDocumentoUnicoCTPS';
import EnvioDocUnicoIdentidade from '../EnvioDocUnicoIdentidade/EnvioDocUnicoIdentidade';
import EnvioDocumentoEstrangeiro from '../EnvioDocumentoEstrangeiro/EnvioDocumentoEstrangeiro';
import EnvioAudioUnico from '../EnvioAudioUnico/EnvioAudioUnico';
import EnvioVideoUnico from '../EnvioVideoUnico/EnvioVideoUnico';
import EnvioDocumento from '../EnvioDocumento/EnvioDocumento';
import CardCTPS from '../EnvioDocumentoUnicoCTPS/CardCTPS';
import CardRG from '../EnvioDocUnicoIdentidade/CardRG';
import CardCNH from '../EnvioDocumentoUnicoCNH/CardCNH';
import CardCIM from '../EnvioDocumentoUnicoCIM/CardCIM';
import CardAviso from './CardAviso';


import './FaceApiUnico.css'; 

import CryptoJS from 'crypto-js';
import axios from 'axios';

const URL_API = 'https://app.factafinanceira.com.br/api3';
const URL_API_BIO = 'https://app.factafinanceira.com.br/API3PROD';
const URL_APISIMPLY = 'https://app.factafinanceira.com.br/ProcessaDocumentoSimply';

class FaceApiUnico extends Component {
    constructor(props) {
      super(props);

      this.state = {
        imagem : '',
        id_unico: false,
        access_token: false,
        loadSpinner: false,
        homeLink: '/digital/'+this.props.match.params.propostaId,
        homeFaceApiUnico: '/face-api-unico/'+this.props.match.params.propostaId,
        tipoDocumento: '',
        etapaDocumento : false,
        etapaFinalizar : false,
        documentosUnico: false,
        keyComponente: 1,
        rgFrente:  false,
        rgVerso:  false,
        rgFrenteNovo :  false,
        rgVersoNovo:  false,
        modalDados: false,
        errorUnico: false,
        tirarSelfie: false,
        nome : '',
        cpf : '',
        nascimento : '',
        averbador : '',
        imagemSelfieOITI : '',
        tentativaUnico : 1,
        vlrseguro : '',
        //DADOS DA TELA NORMAL DE FORMALIZA��O
        codigoAFOriginal: this.props.match.params.propostaId,
        corretoresRosa: [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760],
        //Enviar imagens quando finalizar  
        tipoAnaliseAtualizar: 11,
        imagemCNH : '',
        imagemCTPS : '',
        imagemCIM : '',
        fotoDocumentoFrente : '',
        fotoDocumentoVerso : '',
        imagemVerso : '',
        isCNH : false,
        tipoPendencia: (this.props.isPendencia == 'S') ? 'pendencia' : 'normal',
        isAudio: false,
        isVideo: false,
		    isCardAnalfabeto: false,
        isAnalfabetoEnvDoc: false,
        styleFotos : 'fa fa-square-o',
        styleAudio : 'fa fa-square-o',
        styleConclusao : 'fa fa-square-o',
        clicouVideo: false,
        blobAudio: '',
        isCamera: false,
        base64Video: '',
        codigotabela: '',
        uf: '',
        isCorretorNorte: false,
        isCorretorRosa: false,
        corretorClassificacao: '',
        passouPelaOITI : false,
        scoreReprovado: false,
        id_tabela_unico: '',
        isOcr : false,
        isCTPS : false,
        isCIM : false,
        isRNE: false,
        idOiti: false,
        isPendencia: (this.props.isPendencia == 'S') ? 'S' : 'N',
        obj_pendencias:'',
        isPendenciaAudio : false,
        isPendenciaVideo : false,

        numeroPmt: '',
        valorProposta : '',
        valorPmt : '',
        nomeCliente: '',
        contrato : '',
        valorSeguro_datahora : '',
        valorSeguro_opcao : '',
        isFgtsAux: false,
        enviouDocumentos: true,
        documentosEnviados: '',
        imagemContraCheque: '',
        imagemResidencia:'',
        imagemOptante:'',
        isContracheque: false,
        isExtrato: false,
        isCompResid: false,
        isCadOptante: false,
        ctpsFrente: false ,
        ctpsVerso : false,
        CIMFrente: false ,
        CIMVerso : false,
        rneFrente: false ,
        rneVerso : false,
        isCardCIM : false,
        isCardRG: false,
        isCardCTPS: false,
        isCardCNH: false,
        clicouRgVerso: false,
		    resultPromisse: false,

        //Tipificação Serviço SimplyID
        assertividadeFrente : '',
        tipoArquivoFrente : '',
        assertividadeVerso : '',
        tipoArquivoVerso : '',
        responseText : '',
        CodigoSolicitacao : '',
        Status : '',
        DataSolicitacao : '',
        DataProcessamento: '', 
        tentativaSimply: 0, 
        isCardAviso: false,
        isEstrangeiro: false,
        lojasLiberar: [1400, 10226, 1435, 1434, 31373, 31276, 19901, 31226, 1432, 1409, 19902, 1444, 31353, 200020, 1414],
        corretorCodigo: 0,
        idsimply: '', 
        isErroFaceMatch: false,
        isValidDocumentos: false,
        isScoreExcep: false,
		    fotoDocTestemunhaFrente : '',
        fotoDocTestemunhaVerso : '',
        imagemTestemunhaCNH : '',
        disabledVerso: true,
        isRepresentanteLegal: false,
        codVinculado: '',
        imagemExtrato : [],
        showModalExtrato: false,
        isComplementar : false,
        id_inclusao : false
      };

      if (this.props.location.state === undefined || this.props.location.state === '') {
          this.props.history.push(this.state.homeLink);
          this.state.obj_proposta = [];
          return false;
      }

      

      let _nav         = this.props.location.state;
      let corretorCodigo = "";

      let formatoValor = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
  
      if(this.props.isPendencia !== 'S') {
        this.state.nome  = _nav.obj_proposta.CLIENTE.DESCRICAO;
        this.state.cpf   = _nav.obj_proposta.CLIENTE.CPF;
        this.state.nascimento = _nav.obj_proposta.CLIENTE.DATANASCIMENTO.substr(0, 10).split('-').reverse().join('/');
        this.state.cliente_nascimento = _nav.obj_proposta.CLIENTE.DATANASCIMENTO.substr(0, 10).split('-').reverse().join('/');
          
        this.state.averbador = _nav.obj_proposta.Averbador;
        this.state.vlrseguro = parseInt(_nav.obj_proposta.VLRSEGURO);

        
        this.state.codigotabela = _nav.obj_proposta.codigotabela;
        this.state.analfabeto = _nav.obj_proposta.ANALFABETO;
        this.state.uf = _nav.obj_proposta.CORRETOR.UF;
        this.state.tipo_operacao = _nav.obj_proposta.Tipo_Operacao;

        corretorCodigo  = _nav.obj_proposta.CORRETOR.CODIGO;
        let corretoreRosa   =  [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760].indexOf(corretorCodigo);
        this.state.isCorretorRosa = ((corretoreRosa !== -1) ? true : false);
  
        this.state.corretorClassificacao = _nav.obj_proposta.CORRETOR.Classificacao;

        this.state.valorProposta = parseFloat(_nav.obj_proposta.VLRAF).toLocaleString('pt-BR', formatoValor);
        this.state.numeroPmt = _nav.obj_proposta.NUMEROPRESTACAO;
        this.state.valorPmt = parseFloat(_nav.obj_proposta.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor);
        this.state.nomeCliente = _nav.obj_proposta.CLIENTE.DESCRICAO;

        this.state.documentosEnviados = _nav.obj_proposta.S_DADOSPESSOAIS.documentosEnviados;

        if(_nav.obj_proposta.Tipo_Operacao === 17) {
          this.state.contrato = _nav.obj_proposta.DADOSPORTABILIDADE.contrato;
        } else {
          this.state.contrato = _nav.obj_proposta.Numero_Contrato;
        }
        
        this.state.valorSeguro_datahora = _nav.dataHoraAceitouSeguro;
        this.state.valorSeguro_opcao = _nav.aceitouSeguro;

        this.state.convenio = _nav.obj_proposta.CONVENIO;


        if(parseInt(_nav.obj_proposta.Tipo_Operacao) === 17 || parseInt(_nav.obj_proposta.Tipo_Operacao) === 18 ){
          this.state.codVinculado = _nav.obj_proposta.CODIGO_VINCULADO
        }

        let arrayRepresentante = [35,36,37,38,40,42];
        if(arrayRepresentante.indexOf(parseInt(_nav.obj_proposta.Tipo_Operacao)) !== -1) {
            this.state.isRepresentanteLegal = true;
        }

      } else {

        this.state.nome  = _nav.obj_pendencias.CLIENTE.DESCRICAO;
        this.state.cpf   = _nav.obj_pendencias.CLIENTE.CPF;

        this.state.obj_pendencias = this.props.location.state.obj_pendencias;
        this.state.nascimento = _nav.obj_pendencias.CLIENTE.DATANASCIMENTO.substr(0, 10).split('-').reverse().join('/');
        this.state.cliente_nascimento = _nav.obj_pendencias.CLIENTE.DATANASCIMENTO.substr(0, 10).split('-').reverse().join('/');

        
        this.state.averbador = _nav.averbador;

        this.state.vlrseguro = parseInt(_nav.obj_pendencias.VLRSEGURO);
        this.state.codigotabela = _nav.obj_pendencias.codigotabela;
        this.state.analfabeto = _nav.obj_pendencias.ANALFABETO;
        this.state.uf = _nav.obj_pendencias.CORRETOR.UF;
        this.state.tipo_operacao = _nav.obj_pendencias.Tipo_Operacao;

        corretorCodigo  = _nav.obj_pendencias.CORRETOR.CODIGO;
        let corretoreRosa   =  [1054, 1525, 1488, 19564, 19790, 1501, 1408, 10760].indexOf(corretorCodigo);
        this.state.isCorretorRosa = ((corretoreRosa !== -1) ? true : false);
  
        this.state.corretorClassificacao = _nav.obj_pendencias.CORRETOR.Classificacao;

        this.state.isPendenciaAudio = _nav.obj_pendencias.pendencia_de_audio;
        this.state.isPendenciaVideo = _nav.obj_pendencias.pendencia_de_video;

        this.state.convenio = _nav.obj_pendencias.CONVENIO;
        this.state.valorProposta = parseFloat(_nav.obj_pendencias.VLRAF).toLocaleString('pt-BR', formatoValor);
        this.state.numeroPmt = _nav.obj_pendencias.NUMEROPRESTACAO;
        this.state.valorPmt = parseFloat(_nav.obj_pendencias.VLRPRESTACAO).toLocaleString('pt-BR', formatoValor);
        this.state.nomeCliente = _nav.obj_pendencias.CLIENTE.DESCRICAO;
        this.state.documentosEnviados = _nav.obj_pendencias.S_DADOSPESSOAIS.documentosEnviados;
      }

      //Quando liberar para os outros averbadores
      let arrAverbadores = [1, 3, 15, 30, 390, 10];
      this.state.isFgtsAux = (arrAverbadores.indexOf(parseInt(this.state.averbador)) === -1) ? true : false; //Se for FGTS ou Auxílio Brasil

	    if ([15, 390].indexOf(parseInt(this.state.averbador)) !== -1 && parseInt(this.state.documentosEnviados) === 0 && this.state.isPendencia === 'N') {
          this.state.enviouDocumentos = false;
          this.state.isValidDocumentos = true;
      }

	    this.state.corretorCodigo = parseInt(corretorCodigo);

      this.state.dataHoraCcb = _nav.dataHoraCcb;
      this.state.dataHoraTermo = _nav.dataHoraTermo;

      this.state.cliente_cpf = _nav.obj_proposta.CLIENTE.CPF;
      //this.state.cliente_nascimento = _nav.obj_proposta.CLIENTE.DATANASCIMENTO.substr(0, 10).split('-').reverse().join('/');
      this.state.geoTermo = _nav.geoTermo;
      this.state.obj_proposta = _nav.obj_proposta;

      this.state.geoCcb = _nav.geoCcb;
      this.state.codigoAtualizacao = this.state.tipoPendencia !== "normal" && _nav.obj_pendencias !== undefined && _nav.obj_pendencias !== [] ? 'AD3' : this.state.codigoAtualizacao;
      this.state.tipoAnaliseAtualizar = (this.state.tipoPendencia !== "normal" && _nav.obj_pendencias !== undefined && parseInt(_nav.obj_pendencias.length) !== 0) ? _nav.obj_pendencias.statusOcorrenciaAtualizar : this.state.tipoAnaliseAtualizar;

      this.state.isEstrangeiro = (this.state.obj_proposta.ESTRANGEIRO === 'SIM' ? true : false);


      //console.log(this.state.obj_proposta.NOME_REPRESENTANTE, this.state.obj_proposta.CPF_REPRESENTANTE, this.state.obj_proposta.DATA_NASC_REPRESENTANTE.substr(0, 10).split('-').reverse().join('/'));
    }

    reloadComponente = () => {
      this.setState({keyComponente : ((this.state.keyComponente === 1) ? 0 : 1),
         assertividadeFrente : '', 
         tipoArquivoFrente : '', 
         assertividadeVerso : '', 
         tipoArquivoVerso : ''
         });
    }

  	removeDocumento = (tipoDocumento) => { //Caso específo para identidade 
      
      if (this.state.isErroFaceMatch === true) { //Caso erro de faceMatch deve retornar ao início do processo
          this.setState({ rgFrente : false, rgVerso: false, idsimply : ''});//Não é um caso de Update Novo Registro

          if (tipoDocumento === 'VERSO') {
              this.getTipoDocumento('RG');
          }

          if (tipoDocumento === 'VERSO_NOVO') { 
              this.getTipoDocumento('RGNOVO');
          }

          if (tipoDocumento === 'CNH') {
              this.getTipoDocumento('CNH');
          }
          if (tipoDocumento === 'CIM') {
            this.getTipoDocumento('CIM');
        }

      } else {

          if (tipoDocumento === 'FRENTE' || tipoDocumento === 'FRENTE_NOVO') {
             this.setState({ keyComponente : ((this.state.keyComponente === 1) ? 0 : 1), idsimply : ''}); //Revome idSimply caso seja um rg frente
          } else {
             this.setState({ keyComponente : ((this.state.keyComponente === 1) ? 0 : 1)}); //se for verso mantém o id para dar update
          }
      }
    }

    getStateSelfie = (access_token, id_unico, imagemSelfie, id_tabela_unico) => {
        this.state.access_token = access_token;
        this.state.id_unico = id_unico;
        this.state.tirarSelfie = false;
        this.state.documentosUnico = true;
        this.state.imagemSelfie = imagemSelfie;
        this.state.imagemSelfieOITI = imagemSelfie;
        this.state.id_tabela_unico = id_tabela_unico;
    }

    getTipoDocumento = (tipoDocumento) => {
		    if (tipoDocumento === 'ANALFABETO') { //Se for analfabeto vai retornar para etapaDocumento para selecionar identidade ou CNH da testemunha
            this.setState({
              isAnalfabetoEnvDoc  : true,
              documentosUnico     : true,
              isCardAnalfabeto    : false,  
              rgFrente            : false,
              rgVerso             : false,
              rgFrenteNovo        : false,
              rgVersoNovo         : false,
              CIMFrente           : false ,
              CIMVerso            : false,
              clicouRgVerso       : false,
            });
        } else {
            this.state.documentosUnico  = false;
            this.state.etapaDocumento   = true;
            this.state.tipoDocumento    = tipoDocumento;
            this.state.isCardRG         = false;
            this.state.isCardCTPS       = false;
            this.state.isCardCNH        = false;
            this.state.isCardCIM        = false;
            this.state.isVideo          = false;
            this.state.clicouRgVerso    = false;
        }

        this.reloadComponente();
    }

    setCard = (tipoDocumento) => {
      if(tipoDocumento === 'RG' || tipoDocumento === 'RGNOVO') {
        this.setState({documentosUnico : false, isCardRG : true, etapaDocumento: false, tipoDocumento : tipoDocumento});
      }
      if(tipoDocumento === 'CTPS') {
        this.setState({documentosUnico : false, isCardCTPS : true, etapaDocumento: false});
      }
      if(tipoDocumento === 'CNH') {
        this.setState({documentosUnico : false, isCardCNH : true, etapaDocumento: false});
      }
      if(tipoDocumento === 'CIM') { //Aqui estammos
        this.setState({documentosUnico : false, isCardCIM : true, etapaDocumento: false});
      }

	    if(tipoDocumento === 'AVISO') {
        this.setState({documentosUnico : false, isCardAviso : true, etapaDocumento: false});
      }
    }

    voltarInicioUnicoSelfie = (tentativaUnico) => {
      tentativaUnico = parseInt(tentativaUnico) + 1;

      this.setState({ tirarSelfie : false, id_unico : false, access_token: false,
          etapaDocumento: false, tipoDocumento: false, imagemSelfieOITI : '', 
          tentativaUnico : tentativaUnico,
          rgFrente : false, rgVerso : false, 
          rgFrenteNovo: false, rgVersoNovo: false
      });
    }
      /*exemplo:*/
	  setDocumento = () => {
      this.setState({ documentosUnico : true, isCardCNH : false, etapaDocumento: false, idsimply : '', tentativaSimply : 0});
    }

    getStatusDocumento = (documento, imagem, isOcr, isOiti, isEncerrar) => {
      if(documento === 'CNH') {
          this.state.imagemCNH = imagem;
          this.state.isCNH = true;
          this.state.isOcr = isOcr;

          if(isEncerrar === true) {
            this.encerraProposta();
          } else {

            if(isOiti === true) {
              this.validaOITI(documento, imagem);
            } else {
              if(this.state.isPendencia != 'S') {
                this._finalizaFormalizacao();
              } else {
                this._finalizaFormaPendencias();
              }
            }
          }
      } else {
      /*    
        if(documento === 'FRENTE') {
              this.state.fotoDocumentoFrente  = imagem;
              this.state.etapaDocumento       = true;
              this.state.rgFrente             = true;
              this.reloadComponente();
          }
        */
          if(documento === 'FRENTE') {
            this.state.fotoDocumentoFrente  = imagem;
            this.state.etapaDocumento       = false;
            this.state.rgFrente             = true;
            this.state.clicouRgVerso        = true;
            this.state.isCardRG             = true;
          }

          if(documento === 'VERSO') {
              this.state.fotoDocumentoVerso = imagem;
              this.state.isOcr = isOcr;

              if(isEncerrar === true) {
                this.encerraProposta();
              } else {
                if(isOiti === true) {
                  this.validaOITI(documento, imagem);
                } else {


                  if(this.state.isPendencia != 'S') {
                    this._finalizaFormalizacao();
                  } else {
                    this._finalizaFormaPendencias();
                  }
                }
              }
          }
          if(documento === 'FRENTE_NOVO') {
              this.state.fotoDocumentoFrente =  imagem;
              this.state.etapaDocumento = true;
              this.state.rgFrenteNovo   = true;
              this.state.clicouRgVerso  = true;
              this.state.isCardRG       = true;
          }

          if(documento === 'VERSO_NOVO') {
              this.state.fotoDocumentoVerso = imagem;
              this.state.isOcr = isOcr;

              if(isEncerrar === true) {
                this.encerraProposta();
              } else {
                if(isOiti === true) {
                  this.validaOITI(documento, imagem);
                } else {
                  if(this.state.isPendencia != 'S') {
                    this._finalizaFormalizacao();
                  } else {
                    this._finalizaFormaPendencias();
                  }
                }
              }
          }
          if(documento === 'CTPS_FRENTE') {
            this.state.fotoDocumentoFrente = imagem;
            this.state.etapaDocumento = true;
            this.state.ctpsFrente = true;
            this.reloadComponente();
          }
          if(documento === 'CTPS_VERSO') {
            this.state.fotoDocumentoVerso = imagem;
            this.state.isOcr = isOcr;
            this.state.isCTPS = true;

            if(isEncerrar === true) {
              this.encerraProposta(); 
             
            } else {
              if(isOiti === true) {
                this.validaOITI(documento, imagem);
            
              } else {
                if(this.state.isPendencia != 'S') {
                  this._finalizaFormalizacao();
                  
                } else {
                  this._finalizaFormaPendencias();
                  
                }
              }
            }
          }
          if(documento === 'CIM_FRENTE') {
            this.state.fotoDocumentoFrente = imagem;
            this.state.etapaDocumento = true;
            this.state.CIMFrente = true;
            this.reloadComponente();
          }

          if(documento === 'CIM_VERSO') {
            this.state.fotoDocumentoVerso = imagem;
            this.state.isOcr = isOcr;
            this.state.isCIM = true;

            if(isEncerrar === true) {
              this.encerraProposta();
            } else {
              if(isOiti === true) {
                this.validaOITI(documento, imagem);
              } else {
                if(this.state.isPendencia != 'S') {
                  this._finalizaFormalizacao();
                } else {
                  this._finalizaFormaPendencias();
                }
              }
            }
          }
          if(documento === 'RNE_FRENTE') {
            this.state.fotoDocumentoFrente = imagem;
            this.state.etapaDocumento = true;
            this.state.rneFrente = true;
            this.reloadComponente();
          }

          if(documento === 'RNE_VERSO') {
            this.state.fotoDocumentoVerso = imagem;
            this.state.isOcr = isOcr;
            this.state.isRNE = true;

            if(isEncerrar === true) {
              this.encerraProposta();
            } else {
              if(isOiti === true) {
                this.validaOITI(documento, imagem);
              } else {
                if(this.state.isPendencia != 'S') {
                  this._finalizaFormalizacao();
                } else {
                  this._finalizaFormaPendencias();
                }
              }
              
            }
          }
      }
      
    }
    
	getDocumentoTestemunha = (documento, imagem) => {
      if(documento === 'CNH') {
          this.state.imagemTestemunhaCNH = imagem;
          this.state.isCNH     = true;
          if(this.state.isPendencia != 'S') {
            this._finalizaFormalizacao();
          } else {
            this._finalizaFormaPendencias();
          }

      } else {
          if(documento === 'FRENTE') {
              this.state.fotoDocTestemunhaFrente = imagem;
              this.state.etapaDocumento          = true;
              this.state.rgFrente                = true;
              this.state.clicouRgVerso           = true;
              this.state.isCardRG                = true;
              //this.reloadComponente();
            }
            if(documento === 'VERSO') {
                this.state.fotoDocTestemunhaVerso = imagem;
                this.state.isVideo             = false;
                if(this.state.isPendencia !== 'S') {
                  this._finalizaFormalizacao();
                } else {
                  this._finalizaFormaPendencias();
                }
            }

            if(documento === 'FRENTE_NOVO') {
                this.state.fotoDocTestemunhaFrente =  imagem;
                this.state.etapaDocumento       = true;
                this.state.rgFrenteNovo         = true;
                this.state.clicouRgVerso        = true;
                this.state.isCardRG             = true;
                
                //this.reloadComponente();
            }

            if(documento === 'VERSO_NOVO') {
                this.state.fotoDocTestemunhaVerso = imagem;
                this.state.isVideo             = false;

                if(this.state.isPendencia !== 'S') {
                  this._finalizaFormalizacao();
                } else {
                  this._finalizaFormaPendencias();
                }
            }

        }
        
    }
	
	  checkedFoto = () => {
      this.setState({styleFotos : "fa fa-check-square-o text-success"});
    }

    checkedAudioVideo = (enabled, blobAudio) => {
       this.setState({ styleAudio : (enabled === true) ?  "fa fa-check-square-o text-success" : "fa fa-square-o", blobAudio : (blobAudio !== '') ? blobAudio : '' });
    }

    setEtapaAudioVideo = (documento, imagem, tipoEtapa, isOcr, isOiti, isEncerrar, isScoreExcep) => { //Regras para habilitar audio/video para averbadores
          if(isOiti === true) {
            this.validaOITI(documento, imagem);
          } else {
            this.checkedFoto();

            if (documento === 'CNH') {
              this.setState({imagemCNH : imagem
                ,isCNH : true
                ,isOcr : isOcr})
                
                if(isEncerrar === true) {
                  this.encerraProposta();
                  return;
                }
            }

            if (documento === 'CTPS_VERSO') {
              this.setState({fotoDocumentoVerso : imagem,
                isCTPS : true,
                isOcr : isOcr})
                
                if(isEncerrar === true) {
                  this.encerraProposta();
                  return;
                }
            }

            if (documento === 'RNE_VERSO') {
              this.setState({fotoDocumentoVerso : imagem
                ,isRNE : true,
                isOcr : isOcr});
                
                if(isEncerrar === true) {
                  this.encerraProposta();
                  return;
                }
            }

            if (documento === 'VERSO' || documento === 'VERSO_NOVO') {
              this.setState({fotoDocumentoVerso : imagem
                ,isOcr : isOcr});

                if(isEncerrar === true) {
                  this.encerraProposta();
                  return;
                }
            }

            if (documento === 'CIM_VERSO') {
                this.setState({fotoDocumentoVerso : imagem
                ,isOcr : isOcr});

                if(isEncerrar === true) {
                  this.encerraProposta();
                  return;
                }
            }

            if(this.state.isPendencia !== 'S') {
			        this.state.isScoreExcep = isScoreExcep;

              if (this.state.analfabeto === 'S') {
                  this.setState({isVideo : true});
              }

              //Alteração chamado 3455832
              else if ((parseInt(this.state.averbador) === 1 || parseInt(this.state.averbador) === 30) && parseInt(this.state.tipo_operacao) === 14 && parseInt(this.state.convenio) === 3) {
                this.setState({isAudio : true});
              }

              //Chamado 3880575
              else if ((parseInt(this.state.averbador) === 10)) { //CIM
                this.setState({isAudio : true, isComplementar : true});
              }

              else if(parseInt(this.state.averbador) === 20095 && this.state.analfabeto === 'N') {
                      this._finalizaFormalizacao();
              }
              else if(parseInt(this.state.averbador) === 20124 && this.state.analfabeto === 'N') {
                this._finalizaFormalizacao();
              }
              else if (parseInt(this.state.averbador) === 3 && parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) === 2 && this.state.obj_proposta.CTRMAG === 'SIM') { //CASO AVERBADOR 3 INSS  REGRA CARTÃO MAGNÉTICO MENOR QUE 90 DIAS
                  //this._finalizaFormalizacao();
                  this.setState({isAudio : true, isComplementar : true});
              }

              else if ((parseInt(this.state.averbador) === 3   &&  parseInt(this.state.corretorClassificacao) === 1 ) && this.state.analfabeto !== 'S' && parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) === 1) {
                if(this.state.vlrseguro > 0) {
                  this.setState({isAudio : true, isComplementar : false});
                } else {
                  this._finalizaFormalizacao();
                }
              }

              else if ((parseInt(this.state.averbador) === 3   &&  parseInt(this.state.corretorClassificacao) === 1 ) && this.state.analfabeto !== 'S' && parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) === 2) { //CARTÃO MAGNÉTICO
                  this.setState({isAudio : true, isComplementar : true});
              }

              else if (parseInt(this.state.averbador) === 15  && this.state.analfabeto !== 'S') {
                this._finalizaFormalizacao();
              }

              else if ((parseInt(this.state.averbador) === 20095 || parseInt(this.state.averbador) === 3) && this.state.analfabeto === 'S') {
                this.setState({isVideo : true});
              }

              else if ((parseInt(this.state.averbador) === 1 || parseInt(this.state.averbador) === 30 ) && tipoEtapa === 'PRE' && parseInt(this.state.tipo_operacao) === 14) {
                this.setState({isVideo : true});
              }

              else if (parseInt(this.state.averbador) === 1 || parseInt(this.state.averbador) === 30 || parseInt(this.state.averbador) === 100) {
                this.setState({isAudio : true});
              }

              else if((parseInt(this.state.corretorClassificacao) === 2 || this.state.corretoresRosa.indexOf(this.state.corretorCodigo) !== -1) && (parseInt(this.state.averbador) !== 20095 && parseInt(this.state.averbador) !== 3)) {

                if (tipoEtapa === 'DIG') {
                  this.setState({isAudio : true});
                } else if (tipoEtapa === 'PRE') {
                  this.setState({isVideo : true});
                } else if (tipoEtapa !== 'DIG' || tipoEtapa !== 'PRE') {
                  this.setState({isVideo : true});
                }

              }

              else if((parseInt(this.state.corretorClassificacao) === 2 || this.state.corretoresRosa.indexOf(this.state.corretorCodigo) !== -1) &&  parseInt(this.state.averbador) === 3 ) {

                if (tipoEtapa === 'DIG') {
                  this.setState({isAudio : true, isComplementar : true});
                } else if (tipoEtapa === 'PRE') {
                  this.setState({isVideo : true});
                } else if (tipoEtapa !== 'DIG' || tipoEtapa !== 'PRE') {
                  this.setState({isVideo : true});
                }

              }

              

              else if(parseInt(this.state.corretorClassificacao) === 1 && parseInt(this.state.averbador) === 390 ){ //Classificação 1 loja e o 2 é corretor

                if (tipoEtapa === 'DIG'){
                  this.setState({isAudio : true});
                } else if (tipoEtapa === 'PRE'){
                  this.setState({isVideo : true});
                } else if (tipoEtapa !== 'DIG' || tipoEtapa !== 'PRE') {
                  this.setState({isAudio : true});
                }

              }

              else if (parseInt(this.state.corretorClassificacao) === 1 && parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) === 2 && this.state.obj_proposta.AVDPC === 'SIM') {
                  this.setState({isAudio : true});
              }

              else if((parseInt(this.state.corretorClassificacao) === 1 )
              && parseInt(this.state.averbador) !== 20095 && (tipoEtapa !== 'DIG' || tipoEtapa !== 'PRE' || tipoEtapa.toString() == 'NULL') ){
                  this._finalizaFormalizacao();
              }

              else if((parseInt(this.state.corretorClassificacao) == 2 && parseInt(this.state.averbador) != 20095) && (tipoEtapa !== 'DIG' || tipoEtapa !== 'PRE') ){
                this.setState({isVideo : true});
              }

              else if((parseInt(this.state.corretorClassificacao) == 1 && parseInt(this.state.averbador) != 20095) && (tipoEtapa !== 'DIG' || tipoEtapa !== 'PRE') ){
                this._finalizaFormalizacao();
              }

                /*
                if(parseInt(this.state.averbador) === 3) {
                  if(parseInt(this.state.corretorClassificacao) === 1 && this.state.analfabeto !== 'S') {
                    this._finalizaFormalizacao();
                  }

                  if(parseInt(this.state.corretorClassificacao) === 2) {
                      if(tipoEtapa === 'DIG' && this.state.analfabeto !== 'S') {
                        this.setState({isAudio : true});
                      } else {
                        this.setState({isVideo : true});
                      }
                  }
                }*/
            } else {
              if(this.state.isPendenciaAudio === false && this.state.isPendenciaVideo === false) {//Pendencia apenas de documentos
                  this._finalizaFormaPendencias();
              } else {

                //Poder ser pendencia de audio ou video habilita o componente
                if(this.state.isPendenciaAudio ===  true) {
                    this.setState({isAudio : true});
                }

                if(this.state.isPendenciaVideo ===  true) {
                  this.setState({isVideo : true});
                }
              }
            }
        }
    }

    validaOITI = (tipoDocumento, imagemDocumento) => {
      this.setState({ loadSpinner: true, mensagem: 'Revalidando documentos...' });

      axios.post(URL_API + "/getAuthBureauToken").then(async (response) => {
        if(response.data.error === "" || response.data.error === undefined) {
            this.state.imagemSelfieOITI = this.state.imagemSelfieOITI.replace('data:image/jpeg;base64,', '');

            if(this.state.isRepresentanteLegal == false) {
              this.enviaOITI(this.state.nome, this.state.cpf, this.state.nascimento, response.data.token, response.data.expires, this.state.imagemSelfieOITI, tipoDocumento, imagemDocumento);
            } else {
              let DATA_NASC_REPRESENTANTE = this.state.obj_proposta.DATA_NASC_REPRESENTANTE.substr(0, 10).split('-').reverse().join('/');

              this.enviaOITI(this.state.obj_proposta.NOME_REPRESENTANTE, this.state.obj_proposta.CPF_REPRESENTANTE, DATA_NASC_REPRESENTANTE, response.data.token, response.data.expires, this.state.imagemSelfieOITI, tipoDocumento, imagemDocumento);
            }
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error)
      });
    }

    enviaOITI = (nome, cpf, nascimento, token, expires, imagem, tipoDocumento, imagemDocumento) => {
        let verb   = "POST/rs/certiface"+expires;
        let login  = 'facta.livenessbureau.trial';

        let hash         = CryptoJS.HmacSHA256(verb, token);
        let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

        let hashInBase64Safe = hashInBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        let signature  = login + ';' + hashInBase64Safe + ';' + expires; // Concatena a chave da assinatura

        const FormData = require('form-data');
        const formData = new FormData();

        formData.append('token',token);
        formData.append('cpf',cpf);
        formData.append('nome',nome);
        formData.append('nascimento',nascimento);
        formData.append('imagem',imagem);
        formData.append('signature',signature);

        axios.post(
          URL_API + "/getValidaBiometria",
          formData).then((response) => {
              console.log(response.data);
              /*
                Resultado = Pos -> Certificação Positiva (1.2)  -> Ok, entra no fluxo atual das regras "MESACREDITO_REGRAS_FF";
                Neg -> Certificação Negativa (200.2) -> Reprovar proposta utilizando o status/tipoanalise 28;
                Suc -> Cadastro com Sucesso  (1.1)   -> Verificar condições na regra "MESACREDITO_REGRAS_FF";
                Ale -> Cadastro com Alerta   (200.1) –> Obrigatoriamente precisa ser incluído para análise da mesa de crédito, utilizando o status de mesa 13;
                Decisões de uso de STATUS estão envolvidas na tabela "MESACREDITO_REGRAS_FF";
              */

              if(response.data.resultado === 'NEG') { //28
                this.gravaRetorno('200.2', response.data.codID,  response.data.protocol, response.data.score, response.data.similares, response.data.mensagem);
                this.setState({loadSpinner: false, scoreReprovado: true});
              } else {
                let codigoResult = "";

                if(response.data.resultado === 'SUC' || response.data.resultado === 'FAS' || response.data.resultado === 'PEN') { //13
                  codigoResult = '1.1';
                }

                if(response.data.resultado === 'POS' || response.data.resultado === 'VAL') { //1.2
                  codigoResult = '1.2';
                }

                if(response.data.resultado === 'ALE') {
                  codigoResult = '200.1';
                }

                this.gravaRetorno(codigoResult, response.data.codID, response.data.protocol, response.data.score, response.data.similares, response.data.mensagem);
                this.checkedFoto();

                if(this.state.averbador !== 3 && this.state.analfabeto !== 'S') {
                  this._finalizaFormalizacao();
                } else {
                  this.setState({loadSpinner : false});
                  this.setEtapaAudioVideo(tipoDocumento, imagemDocumento, this.state.obj_proposta.codigotabela, true, false);
                }
              }
           })
          .catch((error) => {
            console.log(error);
            console.log('error', error);
          });
    }

    _finalizaFormalizacao = async () => {

      if ( this.state.obj_proposta.codigotabela === 'PRE' ||
           (this.state.propostaPendente === true && this.state.propostaFinaliza === true) ||
           ( parseInt(this.state.obj_proposta.CORRETOR.Classificacao) === 1 &&
             parseInt(this.state.obj_proposta.mesaCreditoTipoBeneficio) !== 2 &&
             this.state.corretoresRosa.indexOf(this.state.obj_proposta.CORRETOR.CODIGO) === -1
             || parseInt(this.state.averbador) === 20095 || parseInt(this.state.averbador) === 3
             //Quando liberar para os outros novos averbadores listar abaixo a condição.
             || parseInt(this.state.averbador) === 1 || parseInt(this.state.averbador) === 15
             || parseInt(this.state.averbador) === 30 || parseInt(this.state.averbador) === 390
             || parseInt(this.state.averbador) === 10226 || parseInt(this.state.averbador) === 20124
             || parseInt(this.state.averbador) === 23 || parseInt(this.state.averbador) === 10
             
           )
      ) {

        const FormData = require('form-data');
        const axios = require('axios');
        const formData = new FormData();
        this.setState({ carregando: true });

        let blob_fotoDocumentoFrente = "";
        let blob_fotoDocumentoVerso = "";
        let blob_base64Video = "";

        console.log(typeof(this.state.imagemSelfie));
        console.log('testelog: '+this.state.imagemSelfie);
        if (this.state.isCNH === true) {
              blob_fotoDocumentoFrente = await fetch(this.state.imagemCNH).then(res => res.blob());
              formData.append('CNH', blob_fotoDocumentoFrente);
        } else {
          if (this.state.fotoDocumentoFrente !== '' && this.state.fotoDocumentoFrente !== undefined) {
              blob_fotoDocumentoFrente = await fetch(this.state.fotoDocumentoFrente).then(res => res.blob());
              console.log(blob_fotoDocumentoFrente);
              formData.append('fotoDocumentoFrente', blob_fotoDocumentoFrente);
          }

          if (this.state.fotoDocumentoVerso !== '' && this.state.fotoDocumentoVerso !== undefined) {
              blob_fotoDocumentoVerso = await fetch(this.state.fotoDocumentoVerso).then(res => res.blob());
              console.log(blob_fotoDocumentoVerso);
              formData.append('fotoDocumentoVerso', blob_fotoDocumentoVerso);
          }
        }

		    if (this.state.isScoreExcep === true) {
            formData.set('isScoreExcep', this.state.isScoreExcep);
        }

       	formData.set('isOcr', this.state.isOcr);
        let blob_base64SelfieIni = await fetch(this.state.imagemSelfie).then(res => res.blob());
        formData.append('SelfieIni', blob_base64SelfieIni);

        if (this.state.imagemExtrato.length !== '' && this.state.imagemExtrato !== undefined) {
            let blob_extrato = "";

            for (let i=0; i < this.state.imagemExtrato.length; i++) {
                blob_extrato = await fetch(this.state.imagemExtrato[i].toString()).then(res => res.blob());
                formData.append('fotoExtrato_'+ i, blob_extrato); //Nome arquivo + indice no array
            }
        }

        if (this.state.imagemOptante !== '' && this.state.imagemOptante !== undefined) {
          const blob_fotoOptante = await fetch(this.state.imagemOptante).then(res => res.blob());
          formData.append('fotoOptante', blob_fotoOptante);
        }

        if (this.state.imagemCompRenda !== '' && this.state.imagemCompRenda !== undefined) {
          const blob_compRenda = await fetch(this.state.imagemCompRenda).then(res => res.blob());
          formData.append('fotoCompRenda', blob_compRenda);
        }

        if (this.state.imagemContraCheque !== '' && this.state.imagemContraCheque !== undefined) {
          const blob_contraCheque = await fetch(this.state.imagemContraCheque).then(res => res.blob());
          formData.append('fotoContraCheque', blob_contraCheque);
        }


          
        if(this.state.analfabeto !== '') {
            formData.set('analfabeto', this.state.analfabeto);
        }

	      if(this.state.isAnalfabetoEnvDoc === true) {
            formData.set('isAnalfabetoEnvDoc', this.state.isAnalfabetoEnvDoc);
        }

        if(this.state.imagemTestemunhaCNH !== '') {
            const blob_imagemTestemunhaCNH = await fetch(this.state.imagemTestemunhaCNH).then(res => res.blob());
            formData.append('fotoDocumentoFrenteTestemunha', blob_imagemTestemunhaCNH);
        }

        if(this.state.fotoDocTestemunhaFrente !== '') {
          const blob_fotoDocTestemunhaFrente = await fetch(this.state.fotoDocTestemunhaFrente).then(res => res.blob());
          formData.append('fotoDocumentoFrenteTestemunha', blob_fotoDocTestemunhaFrente);
        }

        if(this.state.fotoDocTestemunhaVerso !== '') {
          const blob_fotoDocTestemunhaVerso = await fetch(this.state.fotoDocTestemunhaVerso).then(res => res.blob());
          formData.append('fotoDocumentoVersoTestemunha', blob_fotoDocTestemunhaVerso);
        }


        if (this.state.blobAudio !== '' && this.state.blobAudio !== undefined) {
          formData.append('AUDIO', this.state.blobAudio);
        }

        if (this.state.base64Video !== '' && this.state.base64Video !== undefined) {
            let validaVideo64 = this.state.base64Video;
            validaVideo64 = validaVideo64.replace("data:", "");
            if(validaVideo64 !== '') {
              blob_base64Video = await fetch(this.state.base64Video).then(res => res.blob());
              formData.append('VideoFormalizacao', blob_base64Video);
            }
        }

        let LOCALIZACOES = "";

        formData.set('proposta', atob(this.state.codigoAFOriginal));
        formData.set('termo_datahora', this.state.dataHoraTermo);
        formData.set('termo_localizacao', this.state.geoTermo);
        formData.set('corretorClassificacao', this.state.corretorClassificacao);

        
        LOCALIZACOES += "\r\nTERMO\r\n";
        LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraTermo !== undefined && this.state.dataHoraTermo !== "" ? this.state.dataHoraTermo : "-") +"\r\n";
        LOCALIZACOES += "\r\nLOCALIZAÇAO: "+ (this.state.geoTermo !== undefined && this.state.geoTermo !== "" ? this.state.geoTermo : "-") +"\r\n";
  
        formData.set('ccb_datahora', this.state.dataHoraCcb);
        formData.set('ccb_localizacao', this.state.geoCcb);
  
        LOCALIZACOES += "\r\nCCB\r\n";
        LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraCcb !== undefined && this.state.dataHoraCcb !== "" ? this.state.dataHoraCcb : "-") +"\r\n";
        LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";
  
        formData.set('assinatura_datahora', [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':'));
        formData.set('assinatura_localizacao', this.state.geoCcb);
  
        LOCALIZACOES += "\r\nASSINATURA\r\n";
        LOCALIZACOES += "\r\nDATA/HORA: "+ [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':') +"\r\n";
        LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";
  
        if (this.state.consultaDataprev_opcao !== undefined && this.state.consultaDataprev_opcao !== '') {
          formData.set('consultaDataprev_opcao', this.state.consultaDataprev_opcao !== undefined ? (this.state.consultaDataprev_opcao === true ? "S" : "N") : "");
          formData.set('consultaDataprev_datahora', this.state.consultaDataprev_datahora);
  
          LOCALIZACOES += "\r\nCONSULTA DATAPREV\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.consultaDataprev_datahora !== undefined && this.state.consultaDataprev_datahora !== "" ? this.state.consultaDataprev_datahora : "-") +"\r\n";
          LOCALIZACOES += "\r\nACEITOU: "+ (this.state.consultaDataprev_opcao !== undefined ? (this.state.consultaDataprev_opcao === true ? "S" : "N") : "-") +"\r\n";
        }
  
        if (this.state.aberturaDeConta_opcao !== undefined && this.state.aberturaDeConta_opcao !== '') {
          formData.set('aberturaDeConta_opcao', this.state.aberturaDeConta_opcao !== undefined ? (this.state.aberturaDeConta_opcao === true ? "S" : "N") : "");
          formData.set('aberturaDeConta_datahora', this.state.aberturaDeConta_datahora);
  
          LOCALIZACOES += "\r\nABERTURA DE CONTA\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.aberturaDeConta_datahora !== undefined && this.state.aberturaDeConta_datahora !== "" ? this.state.aberturaDeConta_datahora : "-") +"\r\n";
          LOCALIZACOES += "\r\nACEITOU: "+ (this.state.aberturaDeConta_opcao !== undefined ? (this.state.aberturaDeConta_opcao === true ? "S" : "N") : "-") +"\r\n";
        }
  
        if (this.state.valorSeguro_opcao !== undefined && this.state.valorSeguro_opcao !== '') {
          formData.set('valorSeguro_opcao', this.state.valorSeguro_opcao !== undefined ? (this.state.valorSeguro_opcao === true ? "S" : "N") : "");
          formData.set('valorSeguro_datahora', this.state.valorSeguro_datahora);
  
          LOCALIZACOES += "\r\nSEGURO\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.valorSeguro_datahora !== undefined && this.state.valorSeguro_datahora !== "" ? this.state.valorSeguro_datahora : "-") +"\r\n";
          LOCALIZACOES += "\r\nACEITOU: "+ (this.state.valorSeguro_opcao !== undefined ? (this.state.valorSeguro_opcao === true ? "S" : "N") : "-") +"\r\n";
        }
  
        if (this.state.contaQuitacao_opcao !== undefined && this.state.contaQuitacao_opcao !== '') {
          formData.set('contaQuitacao_opcao', this.state.contaQuitacao_opcao !== undefined ? (this.state.contaQuitacao_opcao === true ? "S" : "N") : "");
          formData.set('contaQuitacao_datahora', this.state.contaQuitacao_datahora);
  
          LOCALIZACOES += "\r\nQUITAÇÃO\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.contaQuitacao_datahora !== undefined && this.state.contaQuitacao_datahora !== "" ? this.state.contaQuitacao_datahora : "-") +"\r\n";
          LOCALIZACOES += "\r\nACEITOU: "+ (this.state.contaQuitacao_opcao !== undefined ? (this.state.contaQuitacao_opcao === true ? "S" : "N") : "-") +"\r\n";
        }
  
        if (this.state.contaTransferencias_opcao !== undefined && this.state.contaTransferencias_opcao !== '') {
          formData.set('contaTransferencias_opcao', this.state.contaTransferencias_opcao !== undefined ? (this.state.contaTransferencias_opcao === true ? "S" : "N") : "");
          formData.set('contaTransferencias_datahora', this.state.contaTransferencias_datahora);
  
          LOCALIZACOES += "\r\nTRANSFERÊNCIAS\r\n";
          LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.contaTransferencias_datahora !== undefined && this.state.contaTransferencias_datahora !== "" ? this.state.contaTransferencias_datahora : "-") +"\r\n";
          LOCALIZACOES += "\r\nACEITOU: "+ (this.state.contaTransferencias_opcao !== undefined ? (this.state.contaTransferencias_opcao === true ? "S" : "N") : "-") +"\r\n";
        }
  
        formData.set('codigoAtualizacao', 'AD');
        formData.set('statusOcorrenciaAtualizar', this.state.tipoAnaliseAtualizar);
  
        formData.set('cliente_cpf', this.state.cliente_cpf);
        formData.set('cliente_nascimento', this.state.cliente_nascimento);
  
        var informacoesDoDispositivo = "";
        if (this.state.tipoPendencia !== "normal" && this.state.obj_pendencias !== undefined && this.state.obj_pendencias !== []) {
          informacoesDoDispositivo += "\r\nRESOLUÇÃO DE PENDÊNCIAS\r\n\r\n";
          formData.set('resolucaoPendencias', 1);
          formData.set('gerarNovaCcb', this.state.obj_pendencias.pendencia_de_valores === true ? 1 : 0);
        }
        else {
          formData.set('resolucaoPendencias', 0);
          formData.set('gerarNovaCcb', true);
        }
        informacoesDoDispositivo += "\r\nTipo de Formalização: " + (this.state.obj_proposta.codigotabela === 'DIG' ? 'Não Presencial' : 'Presencial') +"\r\n\r\n";
        informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
        informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
        informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
        informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
        informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;
        informacoesDoDispositivo += LOCALIZACOES;
  
        formData.set('infoDoDispositivo', informacoesDoDispositivo);
  
        if (parseInt(this.state.obj_proposta.Averbador) === 1) {
          var cidade_cartorio = localStorage.getItem('@app-factafinanceira-formalizacao/dados_cartorio/cidade_cartorio');
          var nome_cartorio = localStorage.getItem('@app-factafinanceira-formalizacao/dados_cartorio/nome_cartorio');
          formData.set('cidade_cartorio', cidade_cartorio);
          formData.set('nome_cartorio', nome_cartorio);
        }
  
        // var erroPrintCCB = localStorage.getItem('@app-factafinanceira-formalizacao/dados_ccb/erro');
        // if (erroPrintCCB !== undefined) {
        //     formData.set('erro_print_ccb', erroPrintCCB);
        // }
  
        var htmlCCB = localStorage.getItem('@app-factafinanceira-formalizacao/dados_html_ccb');
        if (htmlCCB !== undefined && htmlCCB !== null) {
            formData.set('print_ccb_html', htmlCCB);
        }

        if (parseInt(this.state.obj_proposta.Averbador) === 20095) {
            var htmlCCBFGTS = localStorage.getItem('@app-factafinanceira-formalizacao/dados_html_fgts_ccb');
            if (htmlCCBFGTS !== undefined && htmlCCBFGTS !== null) {
                formData.set('print_ccb_fgts_html', htmlCCBFGTS);
            }
        }


        formData.set('ambiente', "prod");
        if(this.state.obj_pendencias !== undefined) {
          formData.set('pendencia_de_valores', this.state.obj_pendencias.pendencia_de_valores === true ? 1 : 0);  
          formData.set('pendencia_de_documentos', this.state.obj_pendencias.pendencia_de_documentos === true ? 1 : 0);
        }

        if(this.state.isCTPS === true) {
          formData.set('isCTPS', this.state.isCTPS);
        }
        if(this.state.isErroFaceMatch === true) {
          formData.set('isErroFaceMatch', this.state.isErroFaceMatch);
        }

        this.setState({loadSpinner: true, mensagem : 'Finalizando proposta aguarde...'});
        await axios({
          method: 'post',
          url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(function (response) {
            setTimeout(() => {
              this.setState({ carregando : false,  mensagem : 'Proposta formalizada com sucesso!!', styleConclusao : 'fa fa-check-square-o text-success' });
            },  2000);

            setTimeout(() => {
              this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
              this.props.history.push(this.state.proximoLink);
            },  4000);
        }.bind(this))
        .catch(function (response) {
            // console.log(response);
            this.setState({ carregando : false });
            alert("Erro ao realizar a formalização!");
        }.bind(this));
  
        return false;
      }  
    }

    showVideo = (video) => {
        this.setState({base64Video : video});
    }
 
    gravaRetorno = (codID, cause, protocol, score, similares, msg)  => {
      let url = URL_API+"/ApiOITI";

      const FormData = require('form-data');
      const formData = new FormData();

      formData.append('CODIGO', codID);
      formData.append('MENSAGEMERRO', msg);
      formData.append('CAUSE', cause);
      formData.append('PROTOCOL', protocol);
      formData.append('SCORE', score);
      formData.append('CODIGO_AF', atob(this.state.codigoAFOriginal));
      formData.append('SIMILARES', similares);

      const headers =  { 'Content-Type' : 'multipart/form-data' };

      let mensagem = "";

      axios.post(url, formData, {
        headers: headers
      }).then((response) => {
        mensagem = response;

        console.log('Chegou!!')
      })
      .catch((error) => {
          console.log('Error:'+error);
      });

    }

    encerraProposta = async () => {
      const FormData = require('form-data');
      const axios = require('axios');
      const formData = new FormData();

      let blob_fotoDocumentoFrente = "";
      let blob_fotoDocumentoVerso = "";

      if (this.state.isCNH === true) {
            blob_fotoDocumentoFrente = await fetch(this.state.imagemCNH).then(res => res.blob());
            formData.append('CNH', blob_fotoDocumentoFrente);
      } else {
        if (this.state.fotoDocumentoFrente !== '' && this.state.fotoDocumentoFrente !== undefined) {
            blob_fotoDocumentoFrente = await fetch(this.state.fotoDocumentoFrente).then(res => res.blob());
            formData.append('fotoDocumentoFrente', blob_fotoDocumentoFrente);
        }

        if (this.state.fotoDocumentoVerso !== '' && this.state.fotoDocumentoVerso !== undefined) {
            blob_fotoDocumentoVerso = await fetch(this.state.fotoDocumentoVerso).then(res => res.blob());
            formData.append('fotoDocumentoVerso', blob_fotoDocumentoVerso);
        }
      }

      let blob_base64SelfieIni = await fetch(this.state.imagemSelfie).then(res => res.blob());
      formData.append('SelfieIni', blob_base64SelfieIni);

      let LOCALIZACOES = "";

      LOCALIZACOES += "\r\nTERMO\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraTermo !== undefined && this.state.dataHoraTermo !== "" ? this.state.dataHoraTermo : "-") +"\r\n";
      LOCALIZACOES += "\r\nLOCALIZAÇAO: "+ (this.state.geoTermo !== undefined && this.state.geoTermo !== "" ? this.state.geoTermo : "-") +"\r\n";

      LOCALIZACOES += "\r\nCCB\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ (this.state.dataHoraCcb !== undefined && this.state.dataHoraCcb !== "" ? this.state.dataHoraCcb : "-") +"\r\n";
      LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";

      LOCALIZACOES += "\r\nASSINATURA\r\n";
      LOCALIZACOES += "\r\nDATA/HORA: "+ [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()].join('-')+' '+[new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()].join(':') +"\r\n";
      LOCALIZACOES += "\r\nLOCALIZAÇÃO: "+ (this.state.geoCcb !== undefined && this.state.geoCcb !== "" ? this.state.geoCcb : "-") +"\r\n";

      var informacoesDoDispositivo = "";
      informacoesDoDispositivo += "\r\nTipo de Formalização: " + (this.state.obj_proposta.codigotabela === 'DIG' ? 'Não Presencial' : 'Presencial') +"\r\n\r\n";
      informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
      informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
      informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
      informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
      informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;
      informacoesDoDispositivo += LOCALIZACOES;

      formData.set('infoDoDispositivo', informacoesDoDispositivo);


      formData.set('proposta', atob(this.state.codigoAFOriginal));
      formData.set('isEncerrar', true);

      this.setState({loadSpinner: true, mensagem : 'Finalizando proposta aguarde...'});

      await axios({
        method: 'post',
        url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(function (response) {
        this.state.proximoLink = '/andamento/'+this.props.match.params.propostaId;
        this.props.history.push(this.state.proximoLink);
      }.bind(this))
      .catch(function (response) {
          this.setState({ carregando : false });
          alert("Erro ao realizar a formalização!");
      }.bind(this));

      return false;

    }

    _finalizaFormaPendencias = async () => {

      const FormData = require('form-data');
      const axios = require('axios');
      const formData = new FormData();
      var averbador = parseInt(this.state.averbador);
      this.setState({ carregando: true });

      let blob_fotoDocumentoFrente = "";
      let blob_fotoDocumentoVerso = "";
      let blob_base64Video = "";

      
      if (this.state.isCNH === true) {
          blob_fotoDocumentoFrente = await fetch(this.state.imagemCNH).then(res => res.blob());
          formData.append('CNH', blob_fotoDocumentoFrente);
      } else {
        if (this.state.fotoDocumentoFrente !== '' && this.state.fotoDocumentoFrente !== undefined) {
            blob_fotoDocumentoFrente = await fetch(this.state.fotoDocumentoFrente).then(res => res.blob());
            formData.append('fotoDocumentoFrente', blob_fotoDocumentoFrente);
        }
 
        if (this.state.fotoDocumentoVerso !== '' && this.state.fotoDocumentoVerso !== undefined) {
            blob_fotoDocumentoVerso = await fetch(this.state.fotoDocumentoVerso).then(res => res.blob());
            formData.append('fotoDocumentoVerso', blob_fotoDocumentoVerso);
        }
      }
      
      let blob_base64SelfieIni = await fetch(this.state.imagemSelfie).then(res => res.blob());
      formData.append('SelfieIni', blob_base64SelfieIni);
      
      if (this.state.blobAudio !== '' && this.state.blobAudio !== undefined) {
        formData.append('AUDIO', this.state.blobAudio);
      }

      if (this.state.imagemExtrato !== '' && this.state.imagemExtrato !== undefined) {
        const blob_fotoExtrato = await fetch(this.state.imagemExtrato).then(res => res.blob());
        formData.append('fotoExtrato', blob_fotoExtrato);
      }

      if (this.state.imagemOptante !== '' && this.state.imagemOptante !== undefined) {
        const blob_fotoOptante = await fetch(this.state.imagemOptante).then(res => res.blob());
        formData.append('fotoOptante', blob_fotoOptante);
      }

      if (this.state.imagemCompRenda !== '' && this.state.imagemCompRenda !== undefined) {
        const blob_compRenda = await fetch(this.state.imagemCompRenda).then(res => res.blob());
        formData.append('fotoCompRenda', blob_compRenda);
      }

      if (this.state.imagemContraCheque !== '' && this.state.imagemContraCheque !== undefined) {
        const blob_contraCheque = await fetch(this.state.imagemContraCheque).then(res => res.blob());
        formData.append('fotoContraCheque', blob_contraCheque);
      }
	  
	  
	  if(this.state.isAnalfabetoEnvDoc === true) {
        formData.set('isAnalfabetoEnvDoc', this.state.isAnalfabetoEnvDoc);
      }

      if(this.state.imagemTestemunhaCNH !== '') {
          const blob_imagemTestemunhaCNH = await fetch(this.state.imagemTestemunhaCNH).then(res => res.blob());
          formData.append('fotoDocumentoFrenteTestemunha', blob_imagemTestemunhaCNH);
      }

      if(this.state.fotoDocTestemunhaFrente !== '') {
        const blob_fotoDocTestemunhaFrente = await fetch(this.state.fotoDocTestemunhaFrente).then(res => res.blob());
        formData.append('fotoDocumentoFrenteTestemunha', blob_fotoDocTestemunhaFrente);
      }

      if(this.state.fotoDocTestemunhaVerso !== '') {
        const blob_fotoDocTestemunhaVerso = await fetch(this.state.fotoDocTestemunhaVerso).then(res => res.blob());
        formData.append('fotoDocumentoVersoTestemunha', blob_fotoDocTestemunhaVerso);
      }


      if (this.state.base64Video !== '' && this.state.base64Video !== undefined) {
          let validaVideo64 = this.state.base64Video;
          validaVideo64 = validaVideo64.replace("data:", "");
          if(validaVideo64 !== '') {
            blob_base64Video = await fetch(this.state.base64Video).then(res => res.blob());
            formData.append('VideoFormalizacao', blob_base64Video);
          }
      }

      formData.set('proposta', atob(this.state.codigoAFOriginal));
      formData.set('codigoAtualizacao', 'AD3');
      formData.set('statusOcorrenciaAtualizar', this.state.obj_pendencias.statusOcorrenciaAtualizar);

      formData.set('cliente_cpf', this.state.cliente_cpf);
      formData.set('cliente_nascimento', this.state.cliente_nascimento);

      var informacoesDoDispositivo = "";

      informacoesDoDispositivo += "\r\nRESOLUÇÃO DE PENDÊNCIAS\r\n\r\n";
      informacoesDoDispositivo += "\r\nVendor: " + navigator.vendor;
      informacoesDoDispositivo += "\r\nPlataforma: " + navigator.platform;
      informacoesDoDispositivo += "\r\nappName: " + navigator.appName;
      informacoesDoDispositivo += "\r\nappCodeName: " + navigator.appCodeName;
      informacoesDoDispositivo += "\r\nappVersion: " + navigator.appVersion;


      let pendencia_de_valores = (this.state.obj_pendencias.pendencia_de_valores === true) ? 1 : 0;
      let pendencia_de_documentos = (this.state.obj_pendencias.pendencia_de_documentos === true) ? 1 : 0;

      formData.set('corretorClassificacao', this.state.corretorClassificacao);
      formData.set('pendencia_de_documentos', pendencia_de_documentos); 
      formData.set('pendencia_de_valores', pendencia_de_valores); 
      formData.set('infoDoDispositivo', informacoesDoDispositivo);
      formData.set('resolucaoPendencias', 1);
      formData.set('gerarNovaCcb', 1);
      formData.set('ambiente', "prod");

      if(this.state.isCTPS === true) {
        formData.set('isCTPS', this.state.isCTPS);
      }

      this.setState({loadSpinner: true, mensagem : 'Finalizando proposta aguarde...'});
      await axios({
        method: 'post',
        url: 'https://app.factafinanceira.com.br/proposta/atualizar_formalizacao',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(function (response) {
        setTimeout(() => {
          this.setState({ carregando : false,  mensagem : 'Proposta formalizada com sucesso!!', styleConclusao : 'fa fa-check-square-o text-success' });
        },  2000);

        setTimeout(() => {
          this.state.proximoLink = '/conclusao/'+this.props.match.params.propostaId;
          this.props.history.push(this.state.proximoLink);
        },  4000);
      }.bind(this))
      .catch(function (response) {
          //handle error
          this.setState({ carregando: false });
          alert("Erro ao realizar a formalização!");
      }.bind(this));

      return false;
    }

    newExtract = () => {
      this.reloadComponente();
      this.state.isExtrato = true;
    }

    addImagemExtrato = (imagemDocumento) => {
      this.state.imagemExtrato.push(imagemDocumento);
    }

    deleteExtract = () => {
      console.log(this.state.imagemExtrato);
      this.state.imagemExtrato.pop();
      console.log(this.state.imagemExtrato);

      this.setState({enviouDocumentos: false, showModalExtrato : true, modalDados: true});
      /*console.log('enviouDocumentos: '+this.state.enviouDocumentos)
      console.log('showModalExtrato: '+ this.state.showModalExtrato)
      console.log('modalDados: '+this.state.modalDados)*/
    }

    reloadExtrato = () => {
      this.setState({enviouDocumentos: true, showModalExtrato : false, modalDados: false});
      this.reloadComponente();
      this.state.isExtrato = true;
    }
  
    //habilitar esta função quando incluir os outros averbadores
    setDocContraCheque = (tipoOptante, imagemDocumento) => {
      switch (tipoOptante) {
          //Averbador 390
          case 'EXTRATO':
              this.setState({enviouDocumentos: true, showModalExtrato: false, modalDados: false});
              this.reloadComponente();
              this.state.isExtrato    = false;
              this.state.isCompRenda  = true;
             break;
          case 'COMPRENDA':
              this.state.imagemCompRenda = imagemDocumento;
              this.reloadComponente();
              this.state.isCompRenda  = false;
              this.state.isCadOptante = true;
            break;
          case 'CADOPTANTE':
              this.state.imagemOptante      = imagemDocumento;
              this.state.isCadOptante       = false;
              this.state.isValidDocumentos  = false;
              this.state.enviouDocumentos   = true;
            break;

          //Averbador 15 somente cheque
          case 'CONTRACHEQUE':
              this.state.imagemContraCheque = imagemDocumento;
              this.state.isValidDocumentos  = false;
              this.state.enviouDocumentos   = true;
              this.state.isContracheque     = false;
            break;
        }
    }

	  validaDocumento = async (imagemDocumento, tipoDocumento) => {
        const FormData = require('form-data');
        const formData = new FormData();

        const TIPO_DOCUMENTO = {
          FRENTE : 'FRENTE',
          VERSO : 'VERSO',
          FRENTE_NOVO : 'FRENTE_NOVO',
          VERSO_NOVO : 'VERSO_NOVO',
          CNH : 'CNH'
        };

        let nome = (this.state.isRepresentanteLegal === false) ? this.state.nome : this.state.obj_proposta.NOME_REPRESENTANTE;

        let blob_imagemSelfie = await fetch(this.state.imagemSelfie).then(res => res.blob());
        formData.append('imagemSelfie', blob_imagemSelfie);

        let blob_documento    = await fetch(imagemDocumento).then(res => res.blob());
        formData.append('imagemDocumento', blob_documento);

        formData.append('tipoDocumento', tipoDocumento);
        formData.append('CodigoLegado', atob(this.state.codigoAFOriginal));
        formData.append('cpf', this.state.cpf);
        formData.append('nome', nome);
        formData.append('averbador', this.state.averbador);

        await axios.post(
          URL_APISIMPLY + "/getProcessDocumentoSimply",
          formData).then((response) => {

              const assertividadeMin  = 70;
              let   resultPromisse    = false;

              if (response.data.tipoDocumento !== TIPO_DOCUMENTO.CNH) {

                  let assertividade = response.data.assertividade;
                  let tipoArquivo   = response.data.tipoArquivo;

                  let tipoArquivoFace   = response.data.tipoArquivoFace;  
                  let qualidadeFace     = response.data.qualidadeFace;

                  if (response.data.tipoDocumento === TIPO_DOCUMENTO.FRENTE || response.data.tipoDocumento === TIPO_DOCUMENTO.FRENTE_NOVO) {
                      let assertividadeFace           = response.data.assertividadeFace;
                      let faceMatch                   = response.data.faceMatch;

                      this.state.tipoArquivoFace      = tipoArquivoFace;
                      this.state.assertividadeFace    = assertividadeFace;
                      this.state.qualidadeFace        = qualidadeFace;

                      this.state.tipoArquivoFrente    = tipoArquivo;
                      this.state.faceMatch            = faceMatch;
                      this.state.assertividadeFrente  = assertividade;

                      this.state.qualidadeFrente      = response.data.qualidadeFrente;
                      this.state.tipoDoc              = response.data.tipoDocumento.toString()


                      if(response.data.tipoDocumento === TIPO_DOCUMENTO.FRENTE && response.data.alfabetizadoTexto === 'N' && this.state.averbador === 3) {
                        this.setState({isAnalfabetoEnvDoc : false, analfabeto : 'S'});
                      }

                      if(response.data.tipoDocumento === TIPO_DOCUMENTO.FRENTE && response.data.alfabetizadoTexto === 'S' && this.state.averbador === 3) {
                        this.setState({analfabeto : 'N'});
                      }

                      
                      if (parseInt(tipoArquivo) === 103) {
                          resultPromisse = ( (assertividade > assertividadeMin)  ? true : false);
                      }
                  }

                  if (response.data.tipoDocumento === TIPO_DOCUMENTO.VERSO || response.data.tipoDocumento === TIPO_DOCUMENTO.VERSO_NOVO) {
                      this.state.assertividadeVerso  =  assertividade;
                      this.state.tipoArquivoVerso    =  tipoArquivo;
                      this.state.qualidadeVerso      =  response.data.qualidadeVerso;
                      this.state.tipoDoc             =  response.data.tipoDocumento.toString();

                      if (parseInt(tipoArquivo) === 104) {
                          let isFaceName = true;

                          /*
                            if(response.data.tipoDocumento === TIPO_DOCUMENTO.VERSO) {
                              isFaceName =  ((response.data.nomeTexto.trim().toLowerCase() === this.state.nome.trim().toLowerCase()) ? true : false);
                            }
                          */

                          if(isFaceName) {
                              resultPromisse  = ((assertividade > assertividadeMin)  ? true : false);

                              if (resultPromisse === true) {
                                if (this.state.faceMatch < assertividadeMin) {
                                    resultPromisse = false;
                                    this.setState({ isErroFaceMatch : true });
                                } else {
                                    this.setState({ isErroFaceMatch : false });
                                }
                              }
                          } else {
                            this.setState({ isErroFaceMatch : true });
                          }

                      }
                  }

              } else {
                  //Se não será uma CNH
                  //Fazer a mesma coisa para a cnh
                  let assertividadeFrente = (response.data.assertividadeFrente);
                  let assertividadeVerso  = 0;
                  let faceMatch           = (response.data.faceMatch);

                  if (response.data.assertividadeVerso !== false) {
                      assertividadeVerso = (response.data.assertividadeVerso);
                  }

                  let tipoArquivoFrente  = (response.data.tipoArquivoFrente);
                  let tipoArquivoVerso   = (response.data.tipoArquivoVerso);

                  let tipoArquivoFace    = (response.data.tipoArquivoFace);

                  let assertividadeFace  = (response.data.assertividadeFace);
                  let qualidadeFace      = (response.data.qualidadeFace);

                  let qualidadeFrente    = (response.data.qualidadeFrente);
                  let qualidadeVerso     = (response.data.qualidadeVerso);

                  this.state.tipoArquivoFace      = tipoArquivoFace;
                  this.state.assertividadeFace    = assertividadeFace;
                  this.state.qualidadeFace        = qualidadeFace;
                  this.state.qualidadeVerso       = qualidadeVerso;
                  this.state.qualidadeFrente      = qualidadeFrente;
                  this.state.faceMatch            = faceMatch;
                  this.state.assertividadeFrente  = assertividadeFrente;
                  this.state.assertividadeVerso   = assertividadeVerso;
                  this.state.tipoArquivoFrente    = tipoArquivoFrente;
                  this.state.tipoArquivoVerso     = tipoArquivoVerso;
                  this.state.tipoDoc              = response.data.tipoDocumento;

                  if ( ((tipoArquivoFrente === 105) || (tipoArquivoFrente === 121)) &&
                  ((tipoArquivoVerso === 105) || (tipoArquivoVerso === 121)) ) {

                    let isFaceName = true;

                    //let nomeTexto = response.data.nomeTexto.trim().toLowerCase();
                    //isFaceName =  ((nomeTexto === this.state.nome.trim().toLowerCase()) ? true : false);

                    if(isFaceName) {
                        resultPromisse  = ( (assertividadeFrente < assertividadeMin || assertividadeVerso < assertividadeMin)  ) ? false : true;

                        if (resultPromisse === true) { //Se documento verso estiver ok vai validar o FaceMatch
                            if (this.state.faceMatch < assertividadeMin) {
                                resultPromisse = false;
                                this.setState({ isErroFaceMatch : true });
                            } else {
                                this.setState({ isErroFaceMatch : false });
                            }
                        }
                    } else {
                      
                      this.setState({ isErroFaceMatch : true });
                    }
                  }
              }

              this.state.responseText       =  response.data.responseText;
              this.state.CodigoSolicitacao  =  response.data.CodigoSolicitacao;
              this.state.Status             =  response.data.Status           ;
              this.state.DataSolicitacao    =  response.data.DataSolicitacao  ;
              this.state.DataProcessamento  =  response.data.DataProcessamento;
              this.state.nomeTexto          =  response.data.nomeTexto        ;
              this.state.resultPromisse     =  resultPromisse   ;
        })
        .catch((error) => {
          console.log('error', error);
        });

        let ret = await this.gravaDadosDocumentoSimply();
        return this.state.resultPromisse;
    }



    gravaDadosDocumentoSimply = async () => {
        const FormData = require('form-data');
        const formData = new FormData();

        let isDocumento = this.state.resultPromisse;

        this.state.assertividadeFrente  = (isNaN(this.state.assertividadeFrente) ? 0 : this.state.assertividadeFrente);
        this.state.assertividadeVerso   = (isNaN(this.state.assertividadeVerso)  ? 0 : this.state.assertividadeVerso);
        this.state.qualidadeFace        = (isNaN(this.state.qualidadeFace)  ? 0 : this.state.qualidadeFace);

        this.state.qualidadeFrente      = (isNaN(this.state.qualidadeFrente)  ? 0 : this.state.qualidadeFrente);
        this.state.qualidadeVerso       = (isNaN(this.state.qualidadeVerso)  ? 0 : this.state.qualidadeVerso);
        this.state.faceMatch            = (isNaN(this.state.faceMatch)  ? 0 : this.state.faceMatch);
        this.state.assertividadeFace    = (isNaN(this.state.assertividadeFace)  ? 0 : this.state.assertividadeFace);

        formData.append('codigo_af', atob(this.state.codigoAFOriginal));
        formData.append('tipoDoc',this.state.tipoDoc);
        formData.append('isDocumento',isDocumento);

        formData.append('tipoArquivoFace',this.state.tipoArquivoFace);
        formData.append('assertividadeFace',this.state.assertividadeFace);
        formData.append('qualidadeFace',this.state.qualidadeFace);

        formData.append('faceMatch',this.state.faceMatch);
        formData.append('assertividadeFrente',this.state.assertividadeFrente);
        formData.append('assertividadeVerso',this.state.assertividadeVerso);
        formData.append('tipoArquivoFrente',this.state.tipoArquivoFrente);
        formData.append('tipoArquivoVerso',this.state.tipoArquivoVerso);
        formData.append('qualidadeFrente',this.state.qualidadeFrente);

        formData.append('nomeTexto',this.state.nomeTexto);
        formData.append('qualidadeVerso',this.state.qualidadeVerso);
        formData.append('responseText',this.state.responseText);  
        formData.append('CodigoSolicitacao',this.state.CodigoSolicitacao);
        formData.append('Status',this.state.Status);
        formData.append('DataSolicitacao',this.state.DataSolicitacao);
        formData.append('DataProcessamento',this.state.DataProcessamento);
        formData.append('idsimply',this.state.idsimply);

        formData.append('tipo_operacao',this.state.tipo_operacao);
        formData.append('codVinculado',this.state.codVinculado);
        formData.append('idsimplyVinculado',this.state.idsimplyVinculado);

        await axios.post(
          URL_APISIMPLY + "/setDadosSimplyId",
          formData).then((response) => {
              this.setState({result : response.data.result, idsimply : response.data.idsimply, idsimplyVinculado : response.data.idsimplyVinculado});
        })
        .catch((error) => {
          console.log('error', error);
        });

        return this.state.result;
    }

    enableVerso = () => {

      this.setState({disabledVerso: false, isCardRG: false, etapaDocumento: true});
      this.reloadComponente();

    }

    
    getIdInclusao = () => {
      this.setState({loadSpinner : true, showCamera : false, mensagem : 'Carregando dados...'})

      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('cpf', this.state.cliente_cpf);
      formData.append('tipo_operacao', this.state.tipo_operacao);
      

      axios.post(URL_API_BIO + "/getIdInclusaoUnico",
      formData).then(async (response) => {
          this.setState({id_inclusao : response.data.ID_INCLUSAO, loadSpinner : false, sucessUnico: true});
      })
      .catch((error) => {
        console.log(error)
      });
    }

    componentDidMount() {
      if (this.props.location.state === undefined || this.props.location.state === '') {
          this.props.history.push(this.state.homeLink);
          this.state.obj_proposta = [];
          return false;
      }
      this.getIdInclusao();
    }

    showBtnNewExtract  = () => {
      //this.setState({showBtnNewExtract : true});
      this.setState({isExtrato : true, enviouDocumentos: true}) 
      
    } 

    render() {
        /* Codigos para configuracao UNICO */
        const CONFIG  = {
          CNH : 1,
          RGFRENTE : 6,
          RGVERSO : 7,
          RGFRENTE_NOVO : 8,
          RGVERSO_NOVO : 9,
          CTPS: 5 //OUTROS
        };

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
          "background": 'linear-gradient(-45deg, #B0DACC 0%, #3D8EB9 60%)',
          'overflow' : 'hidden'
        };

        const containerStyleSpinner = {
          'margin-top' : '50%',
        };


        const btn100 = {
          'width' : '100%'
        };

        const colunaBtn = {
          'margin-bottom': '10px'
        };


        return (
          <div className="app align-items-center" style={appHeightAuto} >
                  <Col className="w-100 p-3 text-center" style={containerPaddingTop}>
                  <LayoutFactaHeader />
                  <Col xs="12" sm="12" md="12" className="text-center p-0">
                    <Row className="mt-6">  
                        {(isMobile === false) &&
                            <Col md="5" style={{ 'position' : 'relative' }}>
                                <img src={ require('../../../assets/img/logo_topo.png') } alt="Logo" style={{ 'marginTop' : '5%' }} />
                                <p className="text-white mb-3"><i className="fa fa-lock"></i> | Site seguro</p>
                                <TimelineProgresso
                                  bemvindo="fa fa-check-square-o text-success"
                                  uso="fa fa-check-square-o text-success"
                                  proposta="fa fa-check-square-o text-success"
                                  residencia="fa fa-check-square-o text-success"
                                  fotos={this.state.styleFotos}
                                  audio={this.state.styleAudio}
                                  confirmacao={this.state.styleConclusao}
                                />
                            </Col>
                        }

                        {this.state.tentativaUnico != false /* SE FOR DIFERENTE DE 3 TENTATIVAS */
                        ? <>
                                {this.state.loadSpinner  === true &&
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                      <div>
                                        <div style={containerStyleSpinner}>
                                        <Spinner 
                                          mensagem = {this.state.mensagem}
                                        />
                                        </div>
                                      </div>
                                    </Col>
                                }

                                {(this.state.scoreReprovado === true) && //Encerra contrato
                                  <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                      <CardBody>
                                        <Row>
                                          <Col xs="12" sm="12">
                                            <p>Olá <span className="font-weight-bold">{ this.state.nome }</span>!</p>
                                            <p>Infelizmente sua proposta foi reprovada!</p>
                                            <p><i className="fa fa-meh-o fa-lg h1 text-danger"></i></p>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                }

                                {(this.state.enviouDocumentos === false && this.state.isValidDocumentos === true && this.state.showModalExtrato === false && this.state.modalDados === false) && //Encerra contrato
                                  <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                      <CardBody>
                                        <Row className="mt-3">
                                          <Col xs="12" sm="12">
                                            <h5 className="text-center mb-3 font-weight-bold">Envio de Documentos</h5>
                                            <p className="text-center">Agora vamos precisar que você tire foto do seu 
                                            {
                                              this.state.averbador === 15 ? ' contracheque'
                                              : (this.state.averbador === 390) ? ' extrato  bancário, comprovante de residência e do cadastro de optante' : null
                                            } .
                                            </p>
                                          </Col>
                                          <Col xs="12" sm="12">
                                            <Row className="mt-3">
                                              <Col xs="12" sm="12">
                                                <Button size="lg" color="outline-success" className="font-weight-bold" onClick={() => {
                                                  this.setState({
                                                    isExtrato : (this.state.averbador === 390) ? true : false,
                                                    isContracheque : (this.state.averbador === 15) ? true : false,
                                                    enviouDocumentos: true}) 
                                                    }}>
                                                OK
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                    </Col>
                                }

                                {(this.state.showModalExtrato === true) &&
                                        <Col xs="12">
                                            <Modal isOpen={this.state.modalDados} toggle={this.modalDados} className='modal-primary modal-dialog-centered' style={{'zIndex' : 9999}}>
                                              <ModalHeader toggle={() => this.reloadExtrato()}>Atenção</ModalHeader>
                                              <ModalBody>
                                                <Row className="mt-1">
                                                  <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                    <i className="fa fa-times-circle-o align-self-center h2"></i>
                                                  </Col>
                                                  <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                    <p className="align-self-center">
                                                      {
                                                        this.state.imagemExtrato.length === 0 ?  'Você precisa enviar a foto do extrato!' : 'Deseja tirar outra foto do extrato?'
                                                      }
                                                    </p>
                                                  </Col>
                                                </Row>
                                                <Row className="mt-1">
                                                  <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center" style={colunaBtn}>
                                                  <Button type="submit" color="primary" style={btn100}
                                                      onClick={() => this.reloadExtrato()} >
                                                      {
                                                        this.state.imagemExtrato.length === 0 ? 'Tirar foto' : 'Sim'
                                                      }
                                                  </Button>
                                                  </Col>

                                                  {(this.state.imagemExtrato.length !== 0) &&
                                                    <Col md="12" lg="12" xl="12" xs="12" sm="12" className="text-center">
                                                      <Button color="secondary" style={btn100} 
                                                        onClick={() =>this.setDocContraCheque('EXTRATO', false)}>
                                                          Não
                                                      </Button>
                                                    </Col>
                                                  }
                                                </Row>
                                              </ModalBody>
                                            </Modal>
                                          </Col>
                                }

                                {(this.state.enviouDocumentos === true && this.state.isValidDocumentos === true && this.state.isPendencia === 'N') && 
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                        {(this.state.isExtrato === true) && 
                                            <EnvioDocumento
                                              key = {this.state.keyComponente}
                                              tipoDocumento = {CONFIG.CTPS}
                                              onClick = {this.reloadComponente.bind(this)}
                                              setDocContraCheque = {this.setDocContraCheque}
                                              newExtract = {this.newExtract}
                                              deleteExtract = {this.deleteExtract}
                                              addImagemExtrato = {this.addImagemExtrato}
                                              showBtnnewExtract = {true}
                                              tipo = 'EXTRATO'
                                              titulo = 'Foto do Extrato Bancário'
                                          />}
                                        {(this.state.isCompRenda === true) &&
                                            <EnvioDocumento
                                              key = {this.state.keyComponente}
                                              tipoDocumento = {CONFIG.CTPS}
                                              onClick = {this.reloadComponente.bind(this)}
                                              setDocContraCheque = {this.setDocContraCheque}
                                              tipo = 'COMPRENDA'
                                              titulo = 'Foto do Comprovante de Renda'
                                        />}
                                        {(this.state.isCadOptante === true) &&
                                            <EnvioDocumento
                                              key = {this.state.keyComponente}
                                              tipoDocumento = {CONFIG.CTPS}
                                              onClick = {this.reloadComponente.bind(this)}
                                              setDocContraCheque = {this.setDocContraCheque}
                                              tipo = 'CADOPTANTE'
                                              titulo = 'Foto do Cadastro de Optante'
                                              
                                              
                                        />}
                                        {(this.state.isContracheque === true) &&
                                            <EnvioDocumento
                                              key = {this.state.keyComponente}
                                              tipoDocumento = {CONFIG.CTPS}
                                              onClick = {this.reloadComponente.bind(this)}
                                              setDocContraCheque = {this.setDocContraCheque}
                                              tipo = 'CONTRACHEQUE'
                                              titulo = 'Foto do Contra Cheque'
                                        />}
                                    </Col>
                                }

                                {(this.state.tirarSelfie === false && this.state.id_unico === false && this.state.access_token === false && this.state.loadSpinner === false && this.state.isVideo === false && this.state.scoreReprovado === false  && this.state.isValidDocumentos === false) &&
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                        <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                            <CardBody>
                                            <Row className="mt-3">
                                                <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                                <img src={ require('../../../assets/img/selfie_template.jpg') } alt="Selfie" className="w-100" />
                                                </Col>
                                                <Col>
                                                <h5 className="text-center mt-3 mb-3">Agora precisamos que você </h5>
                                                <Row className="mt-3">
                                                    <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                    <i className="fa fa-camera align-self-center h4"></i>
                                                    </Col>
                                                    <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                    <p className="align-self-center">Na próxima tela, clique em <span className="font-weight-bold">"Permitir"</span> para acessar a câmera do celular.</p>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-1">
                                                    <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                    <i className="fa fa-times-circle-o align-self-center h2"></i>
                                                    </Col>
                                                    <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                    <p className="align-self-center">Não é recomendado o uso de óculos, boné ou chapéu.</p>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-1">
                                                    <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                    <i className="fa fa-lightbulb-o align-self-center h4"></i>
                                                    </Col>
                                                    <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                    <p className="align-self-center">Fique em frente a câmera em um lugar iluminado.</p>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                    <Col xs="12" sm="12" className="text-center">
                                                    <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" 
                                                      onClick={ () => this.setState({ tirarSelfie : true}) }
                                                      >
                                                        Tirar Selfie
                                                    </Button>
                                                    </Col>
                                                </Row>
                                                </Col>
                                            </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                }

                                {(this.state.tirarSelfie === true) && /* SELFIE */
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                       <EnvioSelfieUnico
                                          voltarInicioUnicoSelfie = {this.voltarInicioUnicoSelfie}
                                          tentativaUnico = {this.state.tentativaUnico}
                                          codigoAF = {atob(this.state.codigoAFOriginal)}
                                          nome = {this.state.nome}
                                          cpf = {this.state.cpf}
                                          isRepresentanteLegal = {this.state.isRepresentanteLegal}
                                          nomeRepresentanteLegal = {this.state.obj_proposta.NOME_REPRESENTANTE}
                                          cpfRepresentanteLegal = {this.state.obj_proposta.CPF_REPRESENTANTE}
                                          nascimento = {this.state.nascimento}
                                          key = {this.state.keyComponente}
                                          onClick = {this.reloadComponente.bind(this)}
                                          getStateSelfie = {this.getStateSelfie}
                                          tipo_operacao = {this.state.tipo_operacao}
                                          codVinculado = {this.state.codVinculado}
                                          id_inclusao = {this.state.id_inclusao}
                                        />
                                    </Col>
                                }

                                {(this.state.documentosUnico === true) && /* TIPOS DE DOCUMENTOS UNICO */
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                        <DocumentosUnico
                                          key = {this.state.keyComponente}
                                          getTipoDocumento = {this.getTipoDocumento}
                                          setCard = {this.setCard}
										                      isEstrangeiro = {this.state.isEstrangeiro}
										                      isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                          averbador = {this.state.averbador}
                                        />
                                    </Col>
                                }

                                {(this.state.isCardRG === true) &&
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                          <CardRG 
                                            clicouRgVerso = {this.state.clicouRgVerso}
                                            tipoDocumento = {this.state.tipoDocumento}
                                            enableVerso = {this.enableVerso}
                                            getTipoDocumento = {this.getTipoDocumento}
                                          />
                                    </Col>
                                }
                                {(this.state.isCardCTPS === true) &&
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                          <CardCTPS 
                                            getTipoDocumento = {this.getTipoDocumento}
                                          />
                                    </Col>
                                }
                                {(this.state.isCardCIM === true) &&
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                          <CardCIM
                                            getTipoDocumento = {this.getTipoDocumento}
                                          />
                                    </Col>
                                }

                                {(this.state.isCardCNH === true) &&
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                          <CardCNH 
                                            getTipoDocumento = {this.getTipoDocumento}
                                          />
                                    </Col>
                                }
								                {(this.state.isCardAnalfabeto === true) &&
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                          <CardAnalfabeto
                                            getTipoDocumento = {this.getTipoDocumento}
                                          />
                                    </Col>
                                }
								                {(this.state.isCardAviso === true) &&
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                          <CardAviso
                                            isEstrangeiro = {this.state.isEstrangeiro}
                                            setDocumento = {this.setDocumento}
                                            getTipoDocumento = {this.getTipoDocumento}
                                          />
                                    </Col>
                                }

                                {(this.state.etapaDocumento === true && this.state.tipoDocumento === 'RNE' && this.state.etapaFinalizar === false && this.state.loadSpinner == false && this.state.isAudio === false && this.state.isVideo === false) && /* CTPS */
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                    {(this.state.rneFrente === false && this.state.rneVerso === false) &&
                                        <EnvioDocumentoEstrangeiro
                                          key = {this.state.keyComponente}
                                          tipoDocumento = 'RNE_FRENTE'
                                          onClick = {this.reloadComponente.bind(this)}
                                          getStatusDocumento = {this.getStatusDocumento}
                                          etapaFinalizar = {false}
                                          tipoOperacao = {this.state.tipo_operacao}
                                          mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                          isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                        />  
                                    }

                                    {(this.state.rneFrente === true && this.state.rneVerso === false) &&
                                      <EnvioDocumentoEstrangeiro
                                        key = {this.state.keyComponente}
                                        access_token = {this.state.access_token}
                                        nome = {this.state.nome}
                                        tipoDocumento = 'RNE_VERSO'
                                        averbador = {this.state.averbador}
                                        id_unico = {this.state.id_unico}
                                        id_tabela_unico = {this.state.id_tabela_unico}
                                        tentativaUnico = {this.state.tentativaUnico}
                                        codigoAF = {atob(this.state.codigoAFOriginal)}
                                        onClick = {this.reloadComponente.bind(this)}
                                        voltarInicioUnicoSelfie = {this.voltarInicioUnicoSelfie}
                                        getStatusDocumento = {this.getStatusDocumento}
                                        etapaFinalizar = {true}
                                        checkedFoto = {this.checkedFoto}
                                        validaOITI = {this.validaOITI}
                                        codigotabela = {this.state.codigotabela}
                                        setEtapaAudioVideo = {this.setEtapaAudioVideo}
                                        analfabeto = {this.state.analfabeto}
                                        encerraProposta = {this.encerraProposta}
                                        corretorClassificacao = {this.state.corretorClassificacao}
                                        isPendencia = {this.state.isPendencia}
                                        isPendenciaAudio = {this.state.isPendenciaAudio}
                                        isPendenciaVideo = {this.state.isPendenciaVideo}
                                        isFgtsAux = {this.state.isFgtsAux}
                                        tipoOperacao = {this.state.tipo_operacao}
                                        mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                        isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                      />  
                                    }
                                    </Col>
                                }


                                {(this.state.etapaDocumento === true && this.state.tipoDocumento === 'CTPS' && this.state.etapaFinalizar === false && this.state.loadSpinner == false && this.state.isAudio === false && this.state.isVideo === false) && /* CTPS */
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                    {(this.state.ctpsFrente === false && this.state.ctpsVerso === false) &&
                                        <EnvioDocumentoUnicoCTPS
                                          key = {this.state.keyComponente}
                                          ctps = 'CTPS_FRENTE'
                                          tipoDocumento = {CONFIG.CTPS}
                                          onClick = {this.reloadComponente.bind(this)}
                                          getStatusDocumento = {this.getStatusDocumento}
                                          etapaFinalizar = {false}
                                          tipoOperacao = {this.state.tipo_operacao}
                                          mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                          isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                        />  
                                    }

                                    {(this.state.ctpsFrente === true && this.state.ctpsVerso === false) &&
                                      <EnvioDocumentoUnicoCTPS
                                        key = {this.state.keyComponente}
                                        access_token = {this.state.access_token}
                                        nome = {this.state.nome}
                                        ctps = 'CTPS_VERSO'
                                        averbador = {this.state.averbador}
                                        tipoDocumento = {CONFIG.CTPS}
                                        id_unico = {this.state.id_unico}
                                        id_tabela_unico = {this.state.id_tabela_unico}
                                        tentativaUnico = {this.state.tentativaUnico}
                                        codigoAF = {atob(this.state.codigoAFOriginal)}
                                        onClick = {this.reloadComponente.bind(this)}
                                        voltarInicioUnicoSelfie = {this.voltarInicioUnicoSelfie}
                                        getStatusDocumento = {this.getStatusDocumento}
                                        etapaFinalizar = {true}
                                        checkedFoto = {this.checkedFoto}
                                        validaOITI = {this.validaOITI}
                                        codigotabela = {this.state.codigotabela}
                                        setEtapaAudioVideo = {this.setEtapaAudioVideo}
                                        analfabeto = {this.state.analfabeto}
                                        encerraProposta = {this.encerraProposta}
                                        corretorClassificacao = {this.state.corretorClassificacao}
                                        isPendencia = {this.state.isPendencia}
                                        isPendenciaAudio = {this.state.isPendenciaAudio}
                                        isPendenciaVideo = {this.state.isPendenciaVideo}
                                        isFgtsAux = {this.state.isFgtsAux}
                                        tipoOperacao = {this.state.tipo_operacao}
                                        mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                        isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                      />  
                                    }
                                    </Col>
                                }

                                {/*Novo Componente CIM, Estamos aqui */}

                                {(this.state.etapaDocumento === true && this.state.tipoDocumento === 'CIM' && this.state.etapaFinalizar === false && this.state.loadSpinner == false && this.state.isAudio === false && this.state.isVideo === false) && /* CTPS */
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                    {(this.state.CIMFrente == false && this.state.CIMVerso == false) &&
                                        <EnvioDocumentoUnicoCIM
                                          key = {this.state.keyComponente}
                                          CIM = 'CIM_FRENTE' //'CTPS_FRENTE'
                                          onClick = {this.reloadComponente.bind(this)}
                                          getStatusDocumento = {this.getStatusDocumento}
                                          etapaFinalizar = {false}
                                          tipoOperacao = {this.state.tipo_operacao}
                                          mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                          
                                        />  
                                    }

                                    {(this.state.CIMFrente === true && this.state.CIMVerso === false) &&
                                      <EnvioDocumentoUnicoCIM
                                        key = {this.state.keyComponente}
                                        access_token = {this.state.access_token}
                                        nome = {this.state.nome}
                                        CIM = 'CIM_VERSO' //'CTPS_VERSO'
                                        averbador = {this.state.averbador}
                                        id_unico = {this.state.id_unico}
                                        id_tabela_unico = {this.state.id_tabela_unico}
                                        tentativaUnico = {this.state.tentativaUnico}
                                        codigoAF = {atob(this.state.codigoAFOriginal)}
                                        onClick = {this.reloadComponente.bind(this)}
                                        voltarInicioUnicoSelfie = {this.voltarInicioUnicoSelfie}
                                        getStatusDocumento = {this.getStatusDocumento}
                                        etapaFinalizar = {true}
                                        checkedFoto = {this.checkedFoto}
                                        validaOITI = {this.validaOITI}
                                        codigotabela = {this.state.codigotabela}
                                        setEtapaAudioVideo = {this.setEtapaAudioVideo}
                                        analfabeto = {this.state.analfabeto}
                                        encerraProposta = {this.encerraProposta}
                                        corretorClassificacao = {this.state.corretorClassificacao}
                                        isPendencia = {this.state.isPendencia}
                                        isPendenciaAudio = {this.state.isPendenciaAudio}
                                        isPendenciaVideo = {this.state.isPendenciaVideo}
                                        isFgtsAux = {this.state.isFgtsAux}
                                        tipoOperacao = {this.state.tipo_operacao}
                                        mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                      />  
                                    }
                                    </Col>
                                }



                                {(this.state.etapaDocumento === true && this.state.tipoDocumento === 'CNH' && this.state.etapaFinalizar === false 
                                && this.state.loadSpinner == false && this.state.isAudio === false 
                                && this.state.isVideo === false && this.state.isCardAnalfabeto === false   && this.state.documentosUnico === false) && /* CNH ABERTA */
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                        <EnvioDocumentoUnicoCNH
                                          key = {this.state.keyComponente}
                                          access_token = {this.state.access_token}
                                          nome = {this.state.nome}
                                          cnh = 'CNH'
                                          averbador = {this.state.averbador}
                                          tipoDocumento = {CONFIG.CNH}
                                          id_unico = {this.state.id_unico}
                                          id_tabela_unico = {this.state.id_tabela_unico}
                                          tentativaUnico = {this.state.tentativaUnico}
                                          codigoAF = {atob(this.state.codigoAFOriginal)}
                                          onClick = {this.reloadComponente.bind(this)}
                                          voltarInicioUnicoSelfie = {this.voltarInicioUnicoSelfie}
                                          getStatusDocumento = {this.getStatusDocumento}
                                          etapaFinalizar = {true}
                                          checkedFoto = {this.checkedFoto}
                                          validaOITI = {this.validaOITI}
                                          codigotabela = {this.state.codigotabela}
                                          setEtapaAudioVideo = {this.setEtapaAudioVideo}
                                          analfabeto = {this.state.analfabeto}
                                          encerraProposta = {this.encerraProposta}
                                          corretorClassificacao = {this.state.corretorClassificacao}
                                          isPendencia = {this.state.isPendencia}
                                          isPendenciaAudio = {this.state.isPendenciaAudio}
                                          isPendenciaVideo = {this.state.isPendenciaVideo}
                                          isFgtsAux = {this.state.isFgtsAux}
										                      validaDocumento = {this.validaDocumento}
                                          gravaDadosDocumentoSimply = {this.gravaDadosDocumentoSimply}
                                          tentativaSimply = {this.state.tentativaSimply}
                                          setCard = {this.setCard}
                                          setDocumento = {this.setDocumento}
                                          lojasLiberar = {this.state.lojasLiberar}
                                          corretorCodigo = {this.state.corretorCodigo}
                                          removeDocumento = {this.removeDocumento}
                                          tipoOperacao = {this.state.tipo_operacao}
                                          mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                          CTRMAG = {this.state.obj_proposta.CTRMAG}
                    										  isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                          getDocumentoTestemunha = {this.getDocumentoTestemunha}
                                          vlrseguro = {this.state.vlrseguro}
                                        />  
                                    </Col>
                                }

                                {(this.state.etapaDocumento === true && this.state.tipoDocumento === 'RG' && this.state.etapaFinalizar === false && this.state.loadSpinner == false && this.state.isAudio === false  && this.state.isVideo === false && this.state.isCardRG === false) && /* PARA AS ANTIGAS IDENTIDADES */
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                        {(this.state.rgFrente == false && this.state.rgVerso == false && this.state.clicouRgVerso === false) &&
                                            <EnvioDocUnicoIdentidade  
                                              key = {this.state.keyComponente}
                                              access_token = {this.state.access_token}
                                              tipoDocumento = {CONFIG.RGFRENTE}
                                              rg = 'FRENTE'
                                              averbador = {false}
                                              tipo = '501'
                                              id_unico = {this.state.id_unico}
                                              id_tabela_unico = {this.state.id_tabela_unico}
                                              codigoAF = {atob(this.state.codigoAFOriginal)}
                                              onClick = {this.reloadComponente.bind(this)}
                                              getStatusDocumento = {this.getStatusDocumento}
                                              etapaFinalizar = {false}
											                        validaDocumento = {this.validaDocumento}
                                              gravaDadosDocumentoSimply = {this.gravaDadosDocumentoSimply}
                                              tentativaSimply = {this.state.tentativaSimply}
                                              setCard = {this.setCard}
                                              setDocumento = {this.setDocumento}
                                              lojasLiberar = {this.state.lojasLiberar}
                                              corretorCodigo = {this.state.corretorCodigo}
                                              removeDocumento = {this.removeDocumento}
                                              corretorClassificacao = {this.state.corretorClassificacao}
                                              mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                              CTRMAG = {this.state.obj_proposta.CTRMAG}
                                              isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                              getDocumentoTestemunha = {this.getDocumentoTestemunha}
                                              vlrseguro = {this.state.vlrseguro}
                                            />
                                        }

                                        {(this.state.rgFrente === true && this.state.rgVerso === false && this.state.disabledVerso === false) &&
                                            <EnvioDocUnicoIdentidade
                                              key = {this.state.keyComponente}
                                              access_token = {this.state.access_token}
                                              tipoDocumento = {CONFIG.RGVERSO}
                                              rg = 'VERSO'
                                              averbador = {this.state.averbador}
                                              tipo = '502'
                                              id_unico = {this.state.id_unico}
                                              id_tabela_unico = {this.state.id_tabela_unico}
                                              tentativaUnico = {this.state.tentativaUnico}
                                              codigoAF = {atob(this.state.codigoAFOriginal)}
                                              onClick = {this.reloadComponente.bind(this)}
                                              getStatusDocumento = {this.getStatusDocumento}
                                              voltarInicioUnicoSelfie = {this.voltarInicioUnicoSelfie}
                                              etapaFinalizar = {true}
                                              checkedFoto = {this.checkedFoto}
                                              validaOITI = {this.validaOITI}
                                              setEtapaAudioVideo = {this.setEtapaAudioVideo}
                                              codigotabela = {this.state.codigotabela}
                                              analfabeto = {this.state.analfabeto}
                                              encerraProposta = {this.encerraProposta}
                                              corretorClassificacao = {this.state.corretorClassificacao}
                                              isPendencia = {this.state.isPendencia}
                                              isPendenciaAudio = {this.state.isPendenciaAudio}
                                              isPendenciaVideo = {this.state.isPendenciaVideo}
                                              isFgtsAux = {this.state.isFgtsAux}
											                        validaDocumento = {this.validaDocumento}
                                              gravaDadosDocumentoSimply = {this.gravaDadosDocumentoSimply}
                                              tentativaSimply = {this.state.tentativaSimply}
                                              setCard = {this.setCard}
                                              setDocumento = {this.setDocumento}
                                              lojasLiberar = {this.state.lojasLiberar}
                                              corretorCodigo = {this.state.corretorCodigo}
                                              removeDocumento = {this.removeDocumento}
                                              tipoOperacao = {this.state.tipo_operacao}
                                              mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                              CTRMAG = {this.state.obj_proposta.CTRMAG}
											                        isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                              getDocumentoTestemunha = {this.getDocumentoTestemunha}
                                              vlrseguro = {this.state.vlrseguro}
                                            />
                                        }
                                    </Col>
                                }

                                {(this.state.etapaDocumento === true && this.state.tipoDocumento === 'RGNOVO' && this.state.loadSpinner == false && this.state.isAudio === false && this.state.isVideo === false && this.state.isCardRG === false) && /* PARA AS NOVAS IDENTIDADES */
                                    <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                        {(this.state.rgFrenteNovo === false && this.state.rgVersoNovo === false && this.state.clicouRgVerso === false) &&
                                            <EnvioDocUnicoIdentidade
                                              key = {this.state.keyComponente}
                                              access_token = {this.state.access_token}
                                              tipoDocumento = {CONFIG.RGFRENTE_NOVO}
                                              rg = 'FRENTE_NOVO'
                                              averbador = {false}
                                              tipo = '501'
                                              id_unico = {this.state.id_unico}
                                              id_tabela_unico = {this.state.id_tabela_unico}
                                              codigoAF = {atob(this.state.codigoAFOriginal)}
                                              onClick = {this.reloadComponente.bind(this)}
                                              getStatusDocumento = {this.getStatusDocumento}
                                              etapaFinalizar = {false}
											                        validaDocumento = {this.validaDocumento}
                                              gravaDadosDocumentoSimply = {this.gravaDadosDocumentoSimply}
                                              tentativaSimply = {this.state.tentativaSimply}
                                              setCard = {this.setCard}
                                              setDocumento = {this.setDocumento}
                                              lojasLiberar = {this.state.lojasLiberar}
                                              corretorCodigo = {this.state.corretorCodigo}
                                              removeDocumento = {this.removeDocumento}
                                              corretorClassificacao = {this.state.corretorClassificacao}
                                              mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                              CTRMAG = {this.state.obj_proposta.CTRMAG}
											                        isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                              getDocumentoTestemunha = {this.getDocumentoTestemunha}
                                              vlrseguro = {this.state.vlrseguro}
                                            />
                                        }

                                        {(this.state.rgFrenteNovo === true && this.state.rgVersoNovo === false && this.state.disabledVerso === false) &&
                                            <EnvioDocUnicoIdentidade
                                              key = {this.state.keyComponente}
                                              access_token = {this.state.access_token}
                                              tipoDocumento = {CONFIG.RGVERSO_NOVO}
                                              rg = 'VERSO_NOVO'
                                              averbador = {this.state.averbador}
                                              tipo = '502'
                                              id_unico = {this.state.id_unico}
                                              id_tabela_unico = {this.state.id_tabela_unico}
                                              tentativaUnico = {this.state.tentativaUnico}
                                              onClick = {this.reloadComponente.bind(this)}
                                              codigoAF = {atob(this.state.codigoAFOriginal)}
                                              getStatusDocumento = {this.getStatusDocumento}
                                              voltarInicioUnicoSelfie = {this.voltarInicioUnicoSelfie}
                                              etapaFinalizar = {true}
                                              checkedFoto = {this.checkedFoto}
                                              validaOITI = {this.validaOITI}
                                              setEtapaAudioVideo = {this.setEtapaAudioVideo}
                                              codigotabela = {this.state.codigotabela}
                                              analfabeto = {this.state.analfabeto}
                                              encerraProposta = {this.encerraProposta}
                                              corretorClassificacao = {this.state.corretorClassificacao}
                                              isPendencia = {this.state.isPendencia}
                                              isPendenciaAudio = {this.state.isPendenciaAudio}
                                              isPendenciaVideo = {this.state.isPendenciaVideo}
                                              isFgtsAux = {this.state.isFgtsAux}
											                        validaDocumento = {this.validaDocumento}
                                              gravaDadosDocumentoSimply = {this.gravaDadosDocumentoSimply}
                                              tentativaSimply = {this.state.tentativaSimply}
                                              setCard = {this.setCard}
                                              setDocumento = {this.setDocumento}
                                              lojasLiberar = {this.state.lojasLiberar}
                                              corretorCodigo = {this.state.corretorCodigo}
                                              removeDocumento = {this.removeDocumento}
                                              tipoOperacao = {this.state.tipo_operacao}
                                              mesaCreditoTipoBeneficio = {this.state.obj_proposta.mesaCreditoTipoBeneficio}
                                              CTRMAG = {this.state.obj_proposta.CTRMAG}
											                        isAnalfabetoEnvDoc = {this.state.isAnalfabetoEnvDoc}
                                              getDocumentoTestemunha = {this.getDocumentoTestemunha}
                                              vlrseguro = {this.state.vlrseguro}
                                            />
                                        }
                                    </Col>
                                }

                                {(this.state.isVideo === true && this.state.clicouVideo === false && this.state.base64Video === '') && /* INÍCIO OPÇÃO VIDEO */
                                  <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                    <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                      <CardBody>
                                        <Row className="mt-3">
                                          <Col className="text-center" md="12" lg="12" xs="12" sm="12">
                                            <img src={ require('../../../assets/img/selfie_template.jpg') } alt="Selfie" className="w-100" />
                                          </Col>
                                          <Col>
                                            <h5 className="text-center mt-3 mb-3">Agora precisamos que você { this.state.textoDigPre }</h5>
                                            <Row className="mt-3">
                                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                <i className="fa fa-camera align-self-center h4"></i>
                                              </Col>
                                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                <p className="align-self-center">Na próxima tela, clique em <span className="font-weight-bold">"Permitir"</span> para acessar a câmera do celular.</p>
                                              </Col>
                                            </Row>

                                            <Row className="mt-1">
                                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                <i className="fa fa-times-circle-o align-self-center h2"></i>
                                              </Col>
                                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                <p className="align-self-center">Não é recomendado o uso de óculos, boné ou chapéu.</p>
                                              </Col>
                                            </Row>

                                            <Row className="mt-1">
                                              <Col md="2" lg="2" xl="2" xs="2" sm="2" className="d-flex justify-content-center">
                                                <i className="fa fa-lightbulb-o align-self-center h4"></i>
                                              </Col>
                                              <Col md="10" lg="10" xl="10" xs="10" sm="10" className="text-left pl-0">
                                                <p className="align-self-center">Fique em frente a câmera em um lugar iluminado.</p>
                                              </Col>
                                            </Row>

                                            <Row className="mt-3">
                                              <Col xs="12" sm="12" className="text-center">
                                                <Button className="btn-block font-weight-bold" color="outline-primary" size="lg" onClick={ () => {this.setState({ clicouVideo : true }) } } >
                                                    Gravar Ví­deo
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                }

                                {(this.state.clicouVideo === true && this.state.base64Video === '') &&  /* HABILITA COMPONENTE VIDEO */
                                  <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'backgroundColor' : '#000', 'height' : (window.screen.height * 0.85) + 'px'}}>
                                      <EnvioVideoUnico
                                          checkedAudioVideo = {this.checkedAudioVideo}
                                          showVideo = {this.showVideo}
                                      />
                                  </Col>
                                }
   
                                {(this.state.base64Video !== ''  && this.state.loadSpinner === false &&  this.state.analfabeto !== 'S') && /* MOSTRA VIDEO */
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                        <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                          <CardBody>
                                            <Row className="mt-3">
                                              <Col xs="12" className="mt-3">
                                                  <h5 className="text-center mb-3 font-weight-bold">Veja abaixo como ficou o ví­deo</h5>
                                              </Col>
                                              <Col className="col-12 text-center">
                                                <video className="col-12 d-block" src={this.state.base64Video} controls></video>
                                              </Col>
                                              <Col xs="12" className="text-center mt-3">
                                                {(this.state.selfieFim !== '') &&
                                                  <Button className="btn-block font-weight-bold mt-2" color="outline-primary" size="lg" onClick={ (this.state.isPendencia !== 'S') ?  this._finalizaFormalizacao : this._finalizaFormaPendencias}>
                                                    Finalizar
                                                  </Button>
                                                }
                                              </Col>
                                              <Col xs="12" sm="12" md="12" className="text-center">
                                                <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" 
                                                color="outline-danger" onClick={() => { this.setState({ base64Video : '', styleAudio : 'fa fa-square-o' }) }}>
                                                  <i className="fa fa-trash"></i> Gravar novamente</Button>
                                              </Col>
                                            </Row>
                                          </CardBody>
                                        </Card>
                                  </Col>
                                }
								
								                {(this.state.base64Video !== '' && this.state.loadSpinner === false && this.state.analfabeto === 'S' && this.state.isCardAnalfabeto === false && this.state.isAnalfabetoEnvDoc === false) && /* MOSTRA VIDEO ANALFABETO */
                                    <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                        <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                          <CardBody>
                                            <Row className="mt-3">
                                              <Col xs="12" className="mt-3">
                                                  <h5 className="text-center mb-3 font-weight-bold">Veja abaixo como ficou o ví­deo</h5>
                                              </Col>
                                              <Col className="col-12 text-center">
                                                <video className="col-12 d-block" src={this.state.base64Video} controls></video>
                                              </Col>
                                              <Col xs="12" className="text-center mt-3">
                                                {(this.state.selfieFim !== '') &&
                                                  <Button className="btn-block font-weight-bold mt-2" color="outline-primary" size="lg" onClick={ () => {this.setState({ isCardAnalfabeto : true }) } }>
                                                    Ir para próxima etapa
                                                  </Button>
                                                }
                                              </Col>
                                              <Col xs="12" sm="12" md="12" className="text-center">
                                                <Button className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2" 
                                                color="outline-danger" onClick={() => { this.setState({ base64Video : '', styleAudio : 'fa fa-square-o' }) }}>
                                                  <i className="fa fa-trash"></i> Gravar novamente</Button>
                                              </Col>
                                            </Row>
                                          </CardBody>
                                        </Card>
                                  </Col>
                                }

                                {(this.state.isAudio === true  && this.state.loadSpinner === false) && /* OPÇÃO DE ÁUDIO */
                                  <Col md={{size: isMobile ? 10 : 6, offset: isMobile ? 1 : 0}}>
                                    <EnvioAudioUnico
                                      nome = {this.state.nome}
                                      averbador = {this.state.averbador}
                                      codigoAF = {this.state.codigoAFOriginal}
                                      tipo_operacao = {this.state.tipo_operacao}
                                      valorProposta = {this.state.valorProposta}
                                      numeroPmt = {this.state.numeroPmt}
                                      valorPmt = {this.state.valorPmt}
                                      nomeCliente = {this.state.nomeCliente}
                                      contrato = {this.state.contrato}
                                      vlrseguro = {this.state.vlrseguro}
                                      isComplementar = {this.state.isComplementar}
                                      nomeRepresentanteLegal = {this.state.obj_proposta.NOME_REPRESENTANTE}
                                      checkedAudioVideo = {this.checkedAudioVideo}
                                      _finalizaFormalizacao = {(this.state.isPendencia !== 'S') ? this._finalizaFormalizacao : this._finalizaFormaPendencias}
                                    />
                                  </Col>
                                }
                         </>
                        :
                         <>
                         {(this.state.isOcr === false) && 
                            <Col xs={ isMobile ? 12 : 6} sm={ isMobile ? 12 : 6} md={ isMobile ? 12 : 6} className="p-0" style={{'height' : (window.screen.height * 0.85) + 'px'}}>
                                <Card className="border-white shadow" style={{borderRadius: '8px'}}>
                                    <CardBody>
                                      <Row className="mt-3">
                                        <Col xs="12" sm="12">
                                            <p>{this.state.msgErroUnico}</p>
                                            <p><i className="fa fa-meh-o fa-lg h1 text-danger"></i></p>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col className="text-center" md="12" lg="12" xl="12" xs="12" sm="12">
                                            <Link className="btn btn-outline-primary btn-block btn-lg font-weight-bold mt-2"
                                            onClick={() => this.voltarInicioUnicoSelfie(this.state.tentativaUnico)}
                                            to="#">
                                              Retornar o processo
                                            </Link>
                                        </Col>
                                      </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                          }
                         </>
                        }
                    </Row>
                  </Col>
                </Col>

          </div>            
        );
    }
}

export default FaceApiUnico;