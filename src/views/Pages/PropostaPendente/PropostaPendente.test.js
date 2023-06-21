import React from 'react';
import ReactDOM from 'react-dom';
import PropostaPendente from './PropostaPendente';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PropostaPendente />, div);
  ReactDOM.unmountComponentAtNode(div);
});
