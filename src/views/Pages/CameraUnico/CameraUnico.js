import { drawContour } from 'face-api.js/build/commonjs/draw';
import React, { Component } from 'react';
import { UnicoCheckBuilder, SelfieCameraTypes, UnicoThemeBuilder,DocumentCameraTypes } from "unico-webframe";
import Spinner from '../../Spinner';

class CameraUnico extends Component {

    constructor(props) {
      super(props);

      this.state = {
        loadSpinner: false
      }
    }

    componentDidMount() {
      let unicoCameraBuilder = new UnicoCheckBuilder();
      let public_url  = process.env.PUBLIC_URL;

      unicoCameraBuilder.setResourceDirectory(public_url + "/resources");

      console.log(public_url + "/resources");

      const unicoTheme = new UnicoThemeBuilder().setColorSilhouetteSuccess("#0384fc")
      .setColorSilhouetteError("#D50000").setColorSilhouetteNeutral("#fcfcfc")
      .setBackgroundColor("#dff1f5").setColorText("#0384fc").setBackgroundColorComponents("#0384fc")
      .setColorTextComponents("#dff1f5").setBackgroundColorButtons("#0384fc").setColorTextButtons("#dff1f5")
      .setBackgroundColorBoxMessage("#fff").setColorTextBoxMessage("#000")
      .setHtmlPopupLoading(`<div style="position: absolute; top: 45%; right: 50%; transform: translate(50%, -50%); z-index: 10; text-align: center;">Carregando...</div>`).build();

      unicoCameraBuilder.setTheme(unicoTheme);

      let callback          = "";
      let cameraPromised    = "";
      let setDocumentoUnico = "";

      let url = window.location.protocol + "//" + window.location.host + public_url + "/models";
      unicoCameraBuilder.setModelsPath(url);

      let unicoCamera = unicoCameraBuilder.build();
      let showMessageErrorUnico = this.props.showMessageErrorUnico.bind(this);

      switch (this.props.tipoDocumento) {
        case 'SELFIE': 
            this.setState({ loadSpinner: true, mensagem: 'Carregando aguarde...' });

            cameraPromised = unicoCamera.prepareSelfieCamera(public_url + "/services.json",SelfieCameraTypes.SMART);
            let getImagemUnico = this.props.getImagemUnico.bind(this);

            callback = {
              on: {
                success: function(result) {
                  getImagemUnico(result);
                },
                error: function(error) {
                  showMessageErrorUnico('Erro ao tirar Selfie verifique seu dispositivo!!');
                }
              }
            }

            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
        case 'CNH':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.CNH);
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }

            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
        case 'FRENTE':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.RG_FRENTE);
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }

            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
        case 'VERSO':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.RG_VERSO);
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }

            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
          case 'FRENTE_NOVO':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.RG_FRENTE_NOVO);
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }

            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
          case 'VERSO_NOVO':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.RG_VERSO_NOVO);
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

            callback = {
              on: {
                success: function(result) {
                   setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }

            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
        case 'CTPS_FRENTE':
          cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("CARTEIRA DE TRABALHO FRENTE"));
          setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

          callback = {
            on: {
              success: function(result) {
                setDocumentoUnico(result.base64);
              },
              error: function(error) {
                showMessageErrorUnico(error.message);
              }
            }
          }

          cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
        case 'CTPS_VERSO':
          cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("CARTEIRA DE TRABALHO VERSO"));
          setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

          callback = {
            on: {
              success: function(result) {
                setDocumentoUnico(result.base64);
              },
              error: function(error) {
                showMessageErrorUnico(error.message);
              }
            }
          }

          cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;  
        case 'EXTRATO':
          cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("EXTRATO"));
          setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

          callback = {
            on: {
              success: function(result) {
                setDocumentoUnico(result.base64);
              },
              error: function(error) {
                showMessageErrorUnico(error.message);
              }
            }
          }

          cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
        case 'COMPRENDA':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("COMPROVANTE DE RENDA"));
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);
  
            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }
  
            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
            break;
        case 'COMPRESID':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("COMPROVANTE DE RESIDÊNCIA"));
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);
  
            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }
  
            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
            break;  
        case 'CADOPTANTE':
              cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("CADASTRO OPTANTE"));
              setDocumentoUnico = this.props.setDocumentoUnico.bind(this);
    
              callback = {
                on: {
                  success: function(result) {
                    setDocumentoUnico(result.base64);
                  },
                  error: function(error) {
                    showMessageErrorUnico(error.message);
                  }
                }
              }
    
              cameraPromised.then(cameraOpener => cameraOpener.open(callback));
              break;  
        case 'CONTRACHEQUE':
              cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("CONTRA CHEQUE"));
              setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

              callback = {
                on: {
                  success: function(result) {
                    setDocumentoUnico(result.base64);
                  },
                  error: function(error) {
                    showMessageErrorUnico(error.message);
                  }
                }
              }

              cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;
          case 'RNE_FRENTE':
              cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("RNE FRENTE"));
              setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

              callback = {
                on: {
                  success: function(result) {
                    setDocumentoUnico(result.base64);
                  },
                  error: function(error) {
                    showMessageErrorUnico(error.message);
                  }
                }
              }

              cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;  

          case 'RNE_VERSO':
              cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("RNE VERSO"));
              setDocumentoUnico = this.props.setDocumentoUnico.bind(this);

              callback = {
                on: {
                  success: function(result) {
                    setDocumentoUnico(result.base64);
                  },
                  error: function(error) {
                    showMessageErrorUnico(error.message);
                  }
                }
              }

              cameraPromised.then(cameraOpener => cameraOpener.open(callback));
          break;  
          case 'CIM_FRENTE':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("CARTEIRA DE INDENTIDADE MILITAR FRENTE"));
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);
  
            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }
  
            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
            break;
          case 'CIM_VERSO':
            cameraPromised = unicoCamera.prepareDocumentCamera(public_url + "/services.json", DocumentCameraTypes.OTHERS("CARTEIRA DE INDENTIDADE MILITAR VERSO"));
            setDocumentoUnico = this.props.setDocumentoUnico.bind(this);
  
            callback = {
              on: {
                success: function(result) {
                  setDocumentoUnico(result.base64);
                },
                error: function(error) {
                  showMessageErrorUnico(error.message);
                }
              }
            }
  
            cameraPromised.then(cameraOpener => cameraOpener.open(callback));
            break;  
    }
      
      
    }

    render() {
      const containerStyle = {
        "width": "400px",
        "height": "600px",
    };

    const containerStyleSpinner = {
      'margin-top' : '50%',
    };



    return (
      <div>
        {this.state.loadSpinner  === true &&
          <div style={containerStyleSpinner}>
            <Spinner 
            mensagem = {this.state.mensagem}
            />
          </div>
        }

        <div style={containerStyle}>
            <div id="box-camera"></div>
        </div>
      </div>
    );
  }
}

export default CameraUnico;