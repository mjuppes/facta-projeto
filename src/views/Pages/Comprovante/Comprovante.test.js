import React from 'react';
import ReactDOM from 'react-dom';
import Comprovante from './Comprovante';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Comprovante />, div);
  ReactDOM.unmountComponentAtNode(div);
});
