import React from 'react';
import ReactDOM from 'react-dom';
import Digital from './Digital';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Digital />, div);
  ReactDOM.unmountComponentAtNode(div);
});
