import React from 'react';
import ReactDOM from 'react-dom';
import FotoCnh from './FotoCnh';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FotoCnh />, div);
  ReactDOM.unmountComponentAtNode(div);
});
