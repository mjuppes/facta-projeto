import React from 'react';
import ReactDOM from 'react-dom';
import AssinaturaDigital from './AssinaturaDigital';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AssinaturaDigital />, div);
  ReactDOM.unmountComponentAtNode(div);
});
