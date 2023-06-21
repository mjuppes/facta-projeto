import React from 'react';
import ReactDOM from 'react-dom';
import Andamento from './Andamento';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Andamento />, div);
  ReactDOM.unmountComponentAtNode(div);
});
