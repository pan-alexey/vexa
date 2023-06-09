import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Application } from './application';

export const run = async () => {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }
  const App = new Application();
  if (container.hasChildNodes()) {
    console.log('hydrate');
    hydrateRoot(container, <App.BaseWidget />);
  } else {
    console.log('render');
    const root = createRoot(container);
    root.render(<App.BaseWidget />);
  }
};

run();
