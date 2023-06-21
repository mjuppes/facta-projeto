import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaFacil from './CedulaFactaFacil';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaFacil />, div);
  ReactDOM.unmountComponentAtNode(div);
});
