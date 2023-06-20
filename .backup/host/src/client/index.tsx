import React from 'react';
import { createRoot } from 'react-dom/client';
import { registry } from './base';
import App from './App';

export const app = async (widgets: Array<{ name: string; widget: React.ElementType }> = []) => {
  registry.initLocalWidgets(widgets);

  await registry.init();

  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
};
