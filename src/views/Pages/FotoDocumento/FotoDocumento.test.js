import React from 'react';
import ReactDOM from 'react-dom';
import FotoDocumento from './FotoDocumento';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FotoDocumento />, div);
  ReactDOM.unmountComponentAtNode(div);
});
