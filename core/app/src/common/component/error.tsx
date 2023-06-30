import React from 'react';

export const ErrorComponent: React.FC<{ name: string; msg: string }> = ({ name, msg }) => {
  return (
    <div
      style={{ display: 'none' }}
      data-widget-name={name}
      dangerouslySetInnerHTML={{ __html: 'Widget not render (render problem)' }}
    />
  );
};
