import React, { Component } from 'react';
import { Router, HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Carregando...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

const Totem = React.lazy(() => import('./views/Pages/Totem/Totem'));
const Digital = React.lazy(() => import('./views/Pages/Digital/Digital'));
const Termo = React.lazy(() => import('./views/Pages/Termo/Termo'));
const CedulaFactaFacil = React.lazy(() => import('./views/Pages/CedulaFactaFacil/CedulaFactaFacil'));
const CedulaFactaInss = React.lazy(() => import('./views/Pages/CedulaFactaInss/CedulaFactaInss'));
const CedulaFactaSiape = React.lazy(() => import('./views/Pages/CedulaFactaSiape/CedulaFactaSiape'));
const CedulaFactaIpe = React.lazy(() => import('./views/Pages/CedulaFactaIpe/CedulaFactaIpe'));
const CedulaFactaTesouro = React.lazy(() => import('./views/Pages/CedulaFactaTesouro/CedulaFactaTesouro'));
const CedulaFactaMex = React.lazy(() => import('./views/Pages/CedulaFactaMex/CedulaFactaMex'));
const CedulaFactaPrfPoa = React.lazy(() => import('./views/Pages/CedulaFactaPrfPoa/CedulaFactaPrfPoa'));






const DeclaracaoResidencia = React.lazy(() => import('./views/Pages/DeclaracaoResidencia/DeclaracaoResidencia')); // Página para envio de documento (RG ou CNH)

const PropostaPendente = React.lazy(() => import('./views/Pages/PropostaPendente/PropostaPendente'));
const Documentos = React.lazy(() => import('./views/Pages/Documentos/Documentos')); // Tela para selecionar tipo de documento que será enviado
const FotoCnh = React.lazy(() => import('./views/Pages/FotoCnh/FotoCnh'));
const FotoDocumento = React.lazy(() => import('./views/Pages/FotoDocumento/FotoDocumento')); // Página para envio de documento (RG ou CNH)
const Comprovante = React.lazy(() => import('./views/Pages/Comprovante/Comprovante')); // Página para envio dos comprovantes (Cadastro de Optante e Extrato Bancário)

const PreSelfie = React.lazy(() => import('./views/Pages/PreSelfie/PreSelfie')); // Tela somente de Selfie, para proposta Presenciais de Lojas e Irmãos
const Selfie = React.lazy(() => import('./views/Pages/Selfie/Selfie')); // Tela para tirar Selfie ou Gravar Vídeo

const FaceTest = React.lazy(() => import('./views/Pages/FaceTest/FaceTest')); // Tela para tirar Selfie ou Gravar Vídeo
const DocTest = React.lazy(() => import('./views/Pages/DocTest/DocTest')); // Tela para tirar Selfie ou Gravar Vídeo
const FaceApiTeste = React.lazy(() => import('./views/Pages/FaceApiCamera/FaceApiCamera'));
const FaceApiUnico = React.lazy(() => import('./views/Pages/FaceApiUnico/FaceApiUnico'));

const Conclusao = React.lazy(() => import('./views/Pages/Conclusao/Conclusao'));
const Andamento = React.lazy(() => import('./views/Pages/Andamento/Andamento'));
const Pendencia = React.lazy(() => import('./views/Pages/Pendencias/Pendencias'));
const Audio = React.lazy(() => import('./views/Pages/Audio/Audio'));
const AssinaturaDigital = React.lazy(() => import('./views/Pages/AssinaturaDigital/AssinaturaDigital'));

const SimuladorIndex = React.lazy(() => import('./views/Simulador/Index/Index'));
const SimuladorValores = React.lazy(() => import('./views/Simulador/Valores/Valores'));
const SimuladorConfirmacao = React.lazy(() => import('./views/Simulador/Confirmacao/Confirmacao'));
const SimuladorDados = React.lazy(() => import('./views/Simulador/Dados/Dados'));
const SimuladorDadosEndereco = React.lazy(() => import('./views/Simulador/DadosEndereco/DadosEndereco'));
const SimuladorConclusao = React.lazy(() => import('./views/Simulador/Conclusao/Conclusao'));

const Desbloqueio = React.lazy(() => import('./views/Pages/Desbloqueio/Desbloqueio')); 
const AutorizaConsulta = React.lazy(() => import('./views/Pages/AutorizaConsulta/AutorizaConsulta')); 

const FactaFgts = React.lazy(() => import('./views/Pages/FactaFgts/FactaFgts')); 
const FactaFgtsCcb = React.lazy(() => import('./views/Pages/FactaFgts/FactaFgtsCcb')); 


const FactaSeguroInss = React.lazy(() => import('./views/Pages/Seguro/FactaSeguroInss')); 
const FactaInssCartao = React.lazy(() => import('./views/Pages/CedulaFactaInss/CedulaFactaInssCartao')); 
const FactaInssCartaoRepLegal = React.lazy(() => import('./views/Pages/CedulaFactaInss/CedulaFactaInssRepLegal')); 

const CedulaFactaSiapeCartao = React.lazy(() => import('./views/Pages/CedulaFactaInss/CedulaFactaSiapeCartao')); 







class App extends Component {

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              {/* TELA INICIAL E TELA DO TERMO */}
              <Route exact path="/totem-facta" name="Formalização Digital" render={props => <Totem {...props}/>} />
              <Route exact path="/digital/:propostaId" name="Formalização Digital" render={props => <Digital {...props}/>} />
              <Route exact path="/termo/:propostaId" name="Termo de Assinatura Digital" render={props => <Termo {...props}/>} />
              {/* ### */}
              {/* CCB FACTA FACIL */}
              <Route exact path="/ccb-facta-facil/:propostaId" name="Cédula de Crédito Bancário Facta Fácil" render={props => <CedulaFactaFacil tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-ccb-facta-facil/:propostaId" name="Cédula de Crédito Bancário Facta Fácil" render={props => <CedulaFactaFacil tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-ccb-facta-facil/:propostaId" name="Cédula de Crédito Bancário Facta Fácil" render={props => <CedulaFactaFacil tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* CCB INSS */}
              <Route exact path="/ccb-facta-marinha/:propostaId" name="Cédula de Crédito Bancário Marinha" render={props => <CedulaFactaInss tipo="normal" {...props}/>} />
              <Route exact path="/ccb-facta-exercito/:propostaId" name="Cédula de Crédito Bancário Exército" render={props => <CedulaFactaInss tipo="normal" {...props}/>} />

              <Route exact path="/ccb-facta-inss/:propostaId" name="Cédula de Crédito Bancário INSS" render={props => <CedulaFactaInss tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-ccb-facta-inss/:propostaId" name="Cédula de Crédito Bancário INSS" render={props => <CedulaFactaInss tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-ccb-facta-inss/:propostaId" name="Cédula de Crédito Bancário INSS" render={props => <CedulaFactaInss tipo="regularizacao" {...props}/>} />
              <Route exact path="/facta-inss-seguro/:propostaId" name="Cédula de Crédito Bancário INSS" render={props => <FactaSeguroInss tipo="normal" {...props}/>} />
              <Route exact path="/ccb-facta-inss-cartao/:propostaId" name="Cédula de Crédito Cartão INSS" render={props => <FactaInssCartao tipo="normal" {...props}/>} />
              <Route exact path="/ccb-inss-cartao-rep-legal/:propostaId" name="Cédula de Crédito Cartão INSS" render={props => <FactaInssCartaoRepLegal tipo="normal" {...props}/>} />

              <Route exact path="/ccb-facta-siape-cartao/:propostaId" name="Cédula de Crédito Cartão Siape" render={props => <CedulaFactaSiapeCartao tipo="normal" {...props}/>} />
              

              
              {/* ### */}

    
              {/* CCB SIAPE */}
              <Route exact path="/ccb-facta-siape/:propostaId" name="Cédula de Crédito Bancário SIAPE" render={props => <CedulaFactaSiape tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-ccb-facta-siape/:propostaId" name="Cédula de Crédito Bancário SIAPE" render={props => <CedulaFactaSiape tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-ccb-facta-siape/:propostaId" name="Cédula de Crédito Bancário SIAPE" render={props => <CedulaFactaSiape tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* CCB IPE */}
              <Route exact path="/ccb-facta-ipe/:propostaId" name="Cédula de Crédito Bancário IPÊ" render={props => <CedulaFactaIpe tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-ccb-facta-ipe/:propostaId" name="Cédula de Crédito Bancário IPÊ" render={props => <CedulaFactaIpe tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-ccb-facta-ipe/:propostaId" name="Cédula de Crédito Bancário IPÊ" render={props => <CedulaFactaIpe tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* CCB TESOURO */}
              <Route exact path="/ccb-facta-tesouro/:propostaId" name="Cédula de Crédito Bancário TESOURO" render={props => <CedulaFactaTesouro tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-ccb-facta-tesouro/:propostaId" name="Cédula de Crédito Bancário TESOURO" render={props => <CedulaFactaTesouro tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-ccb-facta-tesouro/:propostaId" name="Cédula de Crédito Bancário TESOURO" render={props => <CedulaFactaTesouro tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* CCB CONVÊNIO ESPECIAL */}
              <Route exact path="/ccb-facta-mex/:propostaId" name="Cédula de Crédito Bancário CONVÊNIO ESPECIAL" render={props => <CedulaFactaMex tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-ccb-facta-mex/:propostaId" name="Cédula de Crédito Bancário CONVÊNIO ESPECIAL" render={props => <CedulaFactaMex tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-ccb-facta-mex/:propostaId" name="Cédula de Crédito Bancário CONVÊNIO ESPECIAL" render={props => <CedulaFactaMex tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* CCB PREFEITURA POA */}
              <Route exact path="/ccb-facta-prf-poa/:propostaId" name="Cédula de Crédito Bancário Prefeitura POA" render={props => <CedulaFactaPrfPoa tipo="normal" {...props}/>} />
              {/* ### */}
              {/* TELA DE BLOQUEIO PARA PROPOSTAS QUE NÃO ACEITARAM O SEGURO */}
              <Route exact path="/proposta-pendente/:propostaId" name="Proposta Pendente" render={props => <PropostaPendente {...props}/>} />
              {/* ### */}
              {/* TELA PARA CONFIRMAR O ENDEREÇO */}
              <Route exact path="/declaracao-de-residencia/:propostaId" name="Declaração de Residência" render={props => <DeclaracaoResidencia {...props}/>} />
              {/* ### */}
              {/* TELA DE SELEÇÃO DO TIPO DE DOCUMENTO (RG OU CNH) */}
              <Route exact path="/tipo-documento/:propostaId" name="Seleção de Documentos" render={props => <Documentos tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-tipo-documento/:propostaId" name="Seleção de Documentos" render={props => <Documentos tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-tipo-documento/:propostaId" name="Seleção de Documentos" render={props => <Documentos tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* TELA PARA TIRAR A FOTO DO DOCUMENTO */}
              <Route exact path="/foto-documento/:propostaId" name="Foto do Documento" render={props => <FotoDocumento tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-foto-documento/:propostaId" name="Foto do Documento" render={props => <FotoDocumento tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-foto-documento/:propostaId" name="Foto do Documento" render={props => <FotoDocumento tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* TELA PARA TIRAR A FOTO DO COMPROVANTE DE OPTANTE E EXTRATO BANCÁRIO (AVERBADOR 390) */}
              <Route exact path="/comprovantes/:propostaId" name="Foto dos comprovantes" render={props => <Comprovante {...props}/>} />
              {/* ### */}
              {/* TELA DE 'PRE-SELFIE', PARA PROPOSTA PRESENCIAIS DE LOJAS, ONDE PRECISA SER ENVIADO A SELFIE E VÍDEO */}
              <Route exact path="/foto-selfie/:propostaId" name="Selfie" render={props => <PreSelfie {...props}/>} />
              {/* TELA PARA TIRAR SELFIE OU GRAVAR VÍDEO */}
              <Route exact path="/selfie/:propostaId" name="Selfie" render={props => <Selfie tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-selfie/:propostaId" name="Selfie" render={props => <Selfie tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-selfie/:propostaId" name="Selfie" render={props => <Selfie tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* TELA PARA GRAVAR VÍDEO */}
              <Route exact path="/video/:propostaId" name="Vídeo" render={props => <Selfie tipo="video" {...props}/>} />
              {/* ### */}
              {/* TELA PARA GRAVAÇÃO DE ÁUDIO */}
              <Route exact path="/audio/:propostaId" name="Áudio" render={props => <Audio tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-gravacao-de-audio/:propostaId" name="Áudio" render={props => <Audio tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao-gravacao-de-audio/:propostaId" name="Áudio" render={props => <Audio tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* TELAS DE CONCLUSÃO E ANDAMENTO DA PROPOSTA */}
              <Route exact path="/conclusao/:propostaId" name="Conclusão" render={props => <Conclusao {...props}/>} />
              <Route exact path="/andamento/:propostaId" name="Andamento" render={props => <Andamento {...props}/>} />
              {/* ### */}
              {/* TELAS PARA REGULARIZAÇÃO DE PENDÊNCIAS */}
              <Route exact path="/pendencias/:propostaId" name="Pendências" render={props => <Pendencia tipo="pendencias" {...props}/>} />
              <Route exact path="/regularizacao/:propostaId" name="Regularação" render={props => <Pendencia tipo="regularizacao" {...props}/>} />
              {/* ### */}
              {/* TELAS DE TESTE */}
              <Route exact path="/foto-cnh/:propostaId" name="Fotos" render={props => <FotoCnh {...props}/>} />
              <Route exact path="/teste-face-api" name="Test" render={props => <FaceTest {...props}/>} />
              <Route exact path="/teste-doc" name="Test" render={props => <DocTest {...props}/>} />
              <Route exact path="/face-api-teste" name="Test" render={props => <FaceApiTeste {...props}/>} />

              <Route exact path="/face-api-unico/:propostaId" name="Unico" render={props => <FaceApiUnico isPendencia='N' {...props}/>} />
              <Route exact path="/pendencias-tipo-documentos-unico/:propostaId" name="Unico" render={props => <FaceApiUnico isPendencia='S' {...props}/>} />
              
              <Route exact path="/assinatura-digital/:propostaId" name="Assinatura Digital" render={props => <AssinaturaDigital {...props}/>} />
              {/* ### */}
              {/* TELAS DO SIMULADOR DE EMPRÉSTIMO */}
              <Route exact path="/margem-nova" name="Simulação de Empréstimo Consignado" render={props => <SimuladorIndex margem_nova="S" {...props}/>} />
              <Route exact path="/emprestimo" name="Simulação de Empréstimo Consignado" render={props => <SimuladorIndex margem_nova="N" {...props}/>} />
              <Route exact path="/dados-orgao" name="Simulação de Empréstimo Consignado" render={props => <SimuladorValores {...props}/>} />
              <Route exact path="/dados-proposta" name="Simulação de Empréstimo Consignado" render={props => <SimuladorConfirmacao {...props}/>} />
              <Route exact path="/dados-pessoais" name="Simulação de Empréstimo Consignado" render={props => <SimuladorDados {...props}/>} />
              <Route exact path="/dados-complementares" name="Simulação de Empréstimo Consignado" render={props => <SimuladorDadosEndereco {...props}/>} />
              <Route exact path="/conclusao" name="Simulação de Empréstimo Consignado" render={props => <SimuladorConclusao {...props}/>} />
              {/* ### */}
              {/* TELAS DO SIMULADOR DE EMPRÉSTIMO */}
              <Route exact path="/autoriza-desbloqueio/:idDesbloqueio" name="autoriza desbloqueio" render={props => <Desbloqueio {...props}/>} />
              <Route exact path="/autoriza-consulta/:idConsulta" name="autoriza consulta" render={props => <AutorizaConsulta {...props}/>} />
              {/* ### */}
              {/* TELAS DO FGTS */}
              <Route exact path="/facta-fgts/:propostaId" name="Facta FGTS" render={props => <FactaFgts tipo="normal" {...props}/>} />
              <Route exact path="/pendencias-facta-fgts/:propostaId" name="Pendencia" render={props => <FactaFgts tipo="pendencias" {...props}/>} />
              <Route exact path="/facta-fgts-ccb/:propostaId" name="CCB fgts" render={props => <FactaFgtsCcb tipo="ccb" {...props}/>} />
              {/* ### */}

              {/* TELAS DO AUXILIO BRASIL */}
              <Route exact path="/facta-aux-brasil/:propostaId" name="Facta FGTS" render={props => <FactaFgts  tipo="auxbrasil" {...props}/>} />
              {/* ### */}

              {/*<Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />*/}
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
