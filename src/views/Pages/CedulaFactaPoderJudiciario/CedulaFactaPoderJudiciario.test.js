import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaPoderJudiciario from './CedulaFactaPoderJudiciario';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaPoderJudiciario />, div);
  ReactDOM.unmountComponentAtNode(div);
});
