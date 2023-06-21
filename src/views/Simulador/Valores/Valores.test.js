import React from 'react';
import ReactDOM from 'react-dom';
import Valores from './Valores';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Valores />, div);
  ReactDOM.unmountComponentAtNode(div);
});
