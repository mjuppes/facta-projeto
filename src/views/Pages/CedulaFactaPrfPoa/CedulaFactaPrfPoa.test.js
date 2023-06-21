import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaPrfPoa from './CedulaFactaPrfPoa';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaPrfPoa />, div);
  ReactDOM.unmountComponentAtNode(div);
});
