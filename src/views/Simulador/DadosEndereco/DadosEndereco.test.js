import React from 'react';
import ReactDOM from 'react-dom';
import Dados from './DadosEndereco';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DadosEndereco />, div);
  ReactDOM.unmountComponentAtNode(div);
});
