import React from 'react';
import ReactDOM from 'react-dom';
import Totem from './Totem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Totem />, div);
  ReactDOM.unmountComponentAtNode(div);
});
