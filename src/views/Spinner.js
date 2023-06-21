import React, { Component } from 'react';
import {Oval} from "react-loader-spinner";



class Spinner extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const mensagem = this.props.mensagem;

    const loaderWrapper = {
      "padding": "16px",
      "display": "flex",
      "justify-content": "center"
    };

    return(
      <div>
      <div style={loaderWrapper}>
        <Oval
          color="#63c2de"
          height={100}
          width={100}
          secondaryColor="#20a8d8"
        />
        </div>
        <span>{mensagem}</span>
      </div>

    )
  }
}
export default Spinner;