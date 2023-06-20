import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Application } from './application';

export const run = async () => {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }

  const state = (window as unknown as { __state__: Array<unknown>}).__state__ ; 
  const App = new Application();

  const Layout = App.getLayout(state);
  if (container.hasChildNodes()) {
    hydrateRoot(container, <React.Fragment>{Layout}</React.Fragment>);
  } else {
    const root = createRoot(container);
    root.render(<React.Fragment>{Layout}</React.Fragment>);
  }
};

run();
