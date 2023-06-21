import React from 'react';
import ReactDOM from 'react-dom';
import DocTest from './DocTest';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DocTest />, div);
  ReactDOM.unmountComponentAtNode(div);
});
