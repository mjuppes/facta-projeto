import React from 'react';
import ReactDOM from 'react-dom';
import Pendencias from './Pendencias';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Pendencias />, div);
  ReactDOM.unmountComponentAtNode(div);
});
