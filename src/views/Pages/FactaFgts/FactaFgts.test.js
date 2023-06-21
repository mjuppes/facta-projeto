import React from 'react';
import ReactDOM from 'react-dom';
import FactaFgts from './FactaFgts';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FactaFgts />, div);
  ReactDOM.unmountComponentAtNode(div);
});
