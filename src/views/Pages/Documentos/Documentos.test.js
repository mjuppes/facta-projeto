import React from 'react';
import ReactDOM from 'react-dom';
import Documentos from './Documentos';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Documentos />, div);
  ReactDOM.unmountComponentAtNode(div);
});
