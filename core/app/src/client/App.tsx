import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Registry } from './components/registry';
import { Layout } from './components/layout';
interface ApplicationProps {
  publicTemplate: string;
  devModuleNames: Array<string>;
}

export interface Widget {
  name: string;
  props: unknown;
  slots?: Record<string, Widget[]>;
}

class Application {
  private publicTemplate: string;
  readonly registry: Registry;
  readonly layout: Layout;

  constructor(props: ApplicationProps) {
    this.publicTemplate = props.publicTemplate;

    this.registry = new Registry({
      publicTemplate: props.publicTemplate,
      devModuleNames: props.devModuleNames,
    });

    this.layout = new Layout({
      registry: this.registry,
    });
  }
}

export const App = async (Widget?: React.ElementType) => {
  const container = document.getElementById('app');
  if (!container) {
    return;
  }

  const APP_STATE = (window as unknown as { __APP_STATE__: unknown }).__APP_STATE__ as {
    publicTemplate: string;
    state: unknown;
    devModuleNames?: Array<string>;
  };

  // for dev modules
  const devModuleNames = APP_STATE.devModuleNames || [];
  const application = new Application({
    publicTemplate: APP_STATE.publicTemplate,
    devModuleNames,
  });

  // for dev modules
  if (devModuleNames[0] && Widget) {
    application.registry.injectWidget(devModuleNames[0], Widget);
  }

  const Layout = await application.layout.make(APP_STATE.state);

  // const root = createRoot(container);
  // root.render(<React.Fragment>{Layout}</React.Fragment>);

  if (container.hasChildNodes()) {
    hydrateRoot(container, <React.Fragment>{Layout}</React.Fragment>);
  } else {
    const root = createRoot(container);
    root.render(<React.Fragment>{Layout}</React.Fragment>);
  }
};
