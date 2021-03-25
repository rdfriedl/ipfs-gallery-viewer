import React from 'react';
import ReactDOM from 'react-dom';
import { registerSW } from 'virtual:pwa-register'

import App from './views/App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

registerSW();