import React from 'react';
import { createRoot } from 'react-dom/client';
import { WeddingProvider } from './components.jsx';
import InvitationMarkup from './InvitationMarkup.jsx';
import './styles.css';

function App() {
  return (
    <WeddingProvider>
      <InvitationMarkup />
    </WeddingProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
