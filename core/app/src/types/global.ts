import React from 'react';

export interface ContextInterface<ContextType> {
  useContext: () => ContextType;
  Provider: React.FC<{ children: React.ReactNode; props?: unknown }>;
}
