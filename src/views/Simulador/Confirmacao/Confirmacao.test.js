import React from 'react';
import ReactDOM from 'react-dom';
import Confirmacao from './Confirmacao';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Confirmacao />, div);
  ReactDOM.unmountComponentAtNode(div);
});
