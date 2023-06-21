import React from 'react';
import ReactDOM from 'react-dom';
import Audio from './Audio';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Audio />, div);
  ReactDOM.unmountComponentAtNode(div);
});
