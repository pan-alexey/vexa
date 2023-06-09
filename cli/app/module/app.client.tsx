import React from 'react';
import { Application } from '@vexa/core-app/module/client/application';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import widget from '~widget'; // Подключаем код виджета c использованием alias

import { createRoot, hydrateRoot } from 'react-dom/client';
export const run = async () => {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }

  const App = new Application();

  // @ts-ignore
  App.registerDevWidget(__name__ as string, widget);

  const state = (window as any).__state__;

  const layout = App.getLayout(state.layout);

  if (container.hasChildNodes()) {
    console.log('hydrate');
    hydrateRoot(container, layout);
  } else {
    console.log('render');
    const root = createRoot(container);
    root.render(layout);
  }
};

run();
