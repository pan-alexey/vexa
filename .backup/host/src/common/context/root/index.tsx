import * as React from 'react';
import { ContextInterface } from '../../../types/global';

export type RootContextType = {
  version: string;
};

const Root = React.createContext<RootContextType | null | string>(null);

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const version = '0.1.1';

  return <Root.Provider value={{ version }}>{children}</Root.Provider>;
};

const useContext = () => {
  return React.useContext(Root) as RootContextType;
};

export const Context: ContextInterface<RootContextType> = {
  useContext,
  Provider,
};
