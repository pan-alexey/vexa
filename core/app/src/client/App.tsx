import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Test } from './components/Test';
import { TestFn } from './components/TestFn';

export const App = async (Widget: React.ElementType) => {
  TestFn()
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);

    if (Widget) {
      root.render(<Widget />);
      return;
    }

    root.render(<Test />);
  }

  // if (container.hasChildNodes()) {
  //   hydrateRoot(container, <React.Fragment>{Layout}</React.Fragment>);
  // } else {
  //   const root = createRoot(container);
  //   root.render(<React.Fragment>{Layout}</React.Fragment>);
  // }
};
