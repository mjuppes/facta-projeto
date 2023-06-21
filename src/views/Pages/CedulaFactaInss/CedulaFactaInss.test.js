import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaInss from './CedulaFactaInss';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaInss />, div);
  ReactDOM.unmountComponentAtNode(div);
});
