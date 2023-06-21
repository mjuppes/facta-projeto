import React from 'react';
import ReactDOM from 'react-dom';
import FaceTest from './FaceTest';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FaceTest />, div);
  ReactDOM.unmountComponentAtNode(div);
});
