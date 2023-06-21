import React, { Component } from 'react';
import { Col } from 'reactstrap';
import Moment from "react-moment";
//import LayoutFactaHeader from './LayoutFactaHeader';
class TimelineProgresso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exibirTimeline : true,
      ocultaAudioMostra : false
    }

    var _exibir = localStorage.getItem('@app-factafinanceira-formalizacao/exibirTimeline');
    let _fgts = localStorage.getItem('@app-factafinanceira-formalizacao/averbadorFgts');

    this.state.exibirTimeline = parseInt(_exibir);
    this.state.ocultaAudioMostra = parseInt(_fgts)

  }

  render() {

    const timelineBarra = {
     'marginTop' : '-11px',
     'marginBottom' : '-4px',
     'marginLeft' : '4px'
    };

    const class_bemVindo = this.props.bemvindo;
    const class_termosUso = this.props.uso;
    const class_termosProposta = this.props.proposta;
    const class_declaracaoResidencia = this.props.residencia;
    const class_fotos = this.props.fotos;
    const class_audio = this.props.audio; 

    
    



  
   
    return(
      <>
      <Col className="text-left p-5" style={{'display' : this.state.exibirTimeline === 1 ? 'block' : 'none'}}>
        <p className="p-0 m-0">
          <span className="text-white h4">
            <i className={class_bemVindo}></i>
            <span className="ml-3">Bem-vindo</span>
          </span>
        </p>
        <p className="h3 text-white" style={timelineBarra}>|</p>
        <p className="p-0 m-0">
          <span className="text-white h4">
            <i className={class_termosUso}></i>
            <span className="ml-3">Termos de Uso</span>
          </span>
        </p>
        <p className="h3 text-white" style={timelineBarra}>|</p>
        <p className="p-0 m-0">
          <span className="text-white h4">
            <i className={class_termosProposta}></i>
            <span className="ml-3">Termos da Proposta</span>
          </span>
        </p>
        <p className="h3 text-white" style={timelineBarra}>|</p>
        <p className="p-0 m-0">
          <span className="text-white h4">
            <i className={class_declaracaoResidencia}></i>
            <span className="ml-3">Declaração de Residência</span>
          </span>
        </p>
        <p className="h3 text-white" style={timelineBarra}>|</p>
        <p className="p-0 m-0">
          <span className="text-white h4">
            <i className={class_fotos}></i>
            <span className="ml-3">Fotos</span>
          </span>
        </p>

        { this.state.ocultaAudioMostra !== 1
              ? <>
                    <p className="h3 text-white" style={timelineBarra}>|</p>
                      <p className="p-0 m-0">
                        <span className="text-white h4">
                          <i className='fa fa-square-o'></i>
                          <span className="ml-3">Áudio/Vídeo</span>
                        </span>
                      </p> 
                </>
              : null
        }

        <p className="h3 text-white" style={timelineBarra}>|</p>
        <p className="p-0 m-0">
          <span className="text-white h4">
            <i className="fa fa-square-o"></i>
            <span className="ml-3">Confirmação</span>
          </span>
        </p>
      </Col>
      </>
    )
  }
}
export default TimelineProgresso;
