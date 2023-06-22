import * as React from 'react';
import { ContextInterface } from '../../../types/global';

export type Context2Type = {
  value: string;
  setValue: (newValue: string) => void;
};
const Context1 = React.createContext<Context2Type | null>(null);

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<string>('context2');

  const setValue = (newValue: string) => {
    setState(newValue);
  };

  return <Context1.Provider value={{ value: state, setValue }}>{children}</Context1.Provider>;
};

const useContext = () => {
  return React.useContext(Context1) as Context2Type;
};

export const Context: ContextInterface<Context2Type> = {
  useContext,
  Provider,
};
