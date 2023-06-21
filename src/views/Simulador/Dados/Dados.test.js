import React from 'react';
import ReactDOM from 'react-dom';
import Dados from './Dados';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dados />, div);
  ReactDOM.unmountComponentAtNode(div);
});
