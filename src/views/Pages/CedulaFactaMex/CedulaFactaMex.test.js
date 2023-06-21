import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaMex from './CedulaFactaMex';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaMex />, div);
  ReactDOM.unmountComponentAtNode(div);
});
