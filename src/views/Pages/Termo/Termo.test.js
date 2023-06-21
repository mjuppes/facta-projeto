import React from 'react';
import ReactDOM from 'react-dom';
import Termo from './Termo';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Termo />, div);
  ReactDOM.unmountComponentAtNode(div);
});
