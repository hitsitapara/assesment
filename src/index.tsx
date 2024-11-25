/**
 * Entry point of the application.
 *
 * This file contains the code for bootstrapping the application.
 * It imports the main App component and renders it to the DOM.
 *
 * The ReactDOM.createRoot() function is used to create a root container
 * for the application. The root container is then used to render the App
 * component using the render() function.
 *
 * The React.StrictMode component is used to enable strict mode in the application.
 * Strict mode helps to detect unexpected side effects in the code.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
