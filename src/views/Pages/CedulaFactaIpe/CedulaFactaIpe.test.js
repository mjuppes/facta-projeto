import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaIpe from './CedulaFactaIpe';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaIpe />, div);
  ReactDOM.unmountComponentAtNode(div);
});
