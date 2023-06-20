import React from 'react';
import { WidgetContext } from '../../../types';
import { contexts } from '../__fixtures__/index';
export interface MakeContextProps {
  parentContext: WidgetContext;
  currentContext: {
    name: string;
    props: Record<string, unknown>;
  };
}

export const makeContext = ({ parentContext, currentContext }: MakeContextProps): WidgetContext => {
  const parentHooks = parentContext.hooks;
  const ParentProvider = parentContext.provider;

  const Component = contexts[currentContext.name]; // TODO: use registry;
  const props = currentContext.props;

  const provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <ParentProvider>
        <Component.Provider props={props}>{children}</Component.Provider>
      </ParentProvider>
    );
  };

  const hooks = [...parentHooks, Component.useContext];

  return {
    provider,
    hooks,
  };
};
