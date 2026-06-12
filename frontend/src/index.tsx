import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind-output.css'; // <-- Import the generated output stylesheet
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);