import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaTesouro from './CedulaFactaTesouro';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaTesouro />, div);
  ReactDOM.unmountComponentAtNode(div);
});
