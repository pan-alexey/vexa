import React from 'react';
import { RootContext } from '../../../../common/context/index';
import type { ModuleContext } from '../../registry';

export type Context = {
  provider: React.FC<{ children: React.ReactNode }>;
  hooks: Array<{ name: string; useContext: () => unknown }>;
};

export type MakeContextProps = {
  name: string;
  parentContext: Context;
  module: ModuleContext;
  props: unknown;
};

export const makeContext = ({ name, parentContext, module, props = {} }: MakeContextProps): Context => {
  const ParentProvider = parentContext.provider;

  const ModuleProvider = module.Provider;
  const moduleHook = {
    name,
    useContext: module.useContext,
  };

  const hooks = [...parentContext.hooks, moduleHook];

  const provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <ParentProvider>
        <ModuleProvider props={props}>{children}</ModuleProvider>
      </ParentProvider>
    );
  };

  return {
    provider,
    hooks,
  };
};

export const makeRootContext = (): Context => {
  const provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <RootContext.Provider>{children}</RootContext.Provider>;
  };

  const hooks = [{ name: 'root', useContext: RootContext.useContext }];

  return {
    provider,
    hooks,
  };
};
