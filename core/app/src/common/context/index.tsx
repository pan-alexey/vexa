import React from 'react';

export interface ContextInterface<ContextType> {
  useContext: () => ContextType;
  Provider: React.FC<{ children: React.ReactNode; props?: unknown }>;
}

export type ContextType = {
  value: string;
  setValue: (newValue: string) => void;
  props: unknown;
};

const Context = React.createContext<ContextType | null>(null);

const Provider: React.FC<{ children: React.ReactNode; props?: unknown }> = ({ children, props }) => {
  const [state, setState] = React.useState<string>('rootContext');

  const setValue = (newValue: string) => {
    setState(newValue);
  };

  return <Context.Provider value={{ props, value: state, setValue }}>{children}</Context.Provider>;
};

const useContext = () => {
  return React.useContext(Context) as ContextType;
};

export const RootContext: ContextInterface<ContextType> = {
  useContext,
  Provider,
};
