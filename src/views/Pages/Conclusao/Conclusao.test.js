import React from 'react';
import ReactDOM from 'react-dom';
import Conclusao from './Conclusao';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Conclusao />, div);
  ReactDOM.unmountComponentAtNode(div);
});
