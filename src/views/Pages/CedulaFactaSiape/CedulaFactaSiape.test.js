import React from 'react';
import ReactDOM from 'react-dom';
import CedulaFactaSiape from './CedulaFactaSiape';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CedulaFactaSiape />, div);
  ReactDOM.unmountComponentAtNode(div);
});
