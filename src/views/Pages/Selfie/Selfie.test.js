import React from 'react';
import ReactDOM from 'react-dom';
import Selfie from './Selfie';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Selfie />, div);
  ReactDOM.unmountComponentAtNode(div);
});
