import React from 'react';

export type State = unknown;

export const Widget3: React.FC<{ children?: React.ReactNode }> = ({ children = null }) => {
  return (
    <div>
      <div>123456789</div>
      <div>{children}</div>
    </div>
  );
};
