import React from 'react';
import ReactDOM from 'react-dom';
import PreSelfie from './PreSelfie';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PreSelfie />, div);
  ReactDOM.unmountComponentAtNode(div);
});
