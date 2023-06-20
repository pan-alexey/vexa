import * as React from 'react';
import { ContextInterface } from '../../../types/global';

export type Context1Type = {
  value: string;
  setValue: (newValue: string) => void;
};
const Context1 = React.createContext<Context1Type | null>(null);

const Provider: React.FC<{ children: React.ReactNode; props?: unknown }> = ({ children, props }) => {
  const [state, setState] = React.useState<string>('context1');

  const setValue = (newValue: string) => {
    setState(newValue);
  };

  return <Context1.Provider value={{ value: state, setValue }}>{children}</Context1.Provider>;
};

const useContext = () => {
  return React.useContext(Context1) as Context1Type;
};

export const Context: ContextInterface<Context1Type> = {
  useContext,
  Provider,
};
