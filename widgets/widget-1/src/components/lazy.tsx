import React from 'react';

const a = [1, 2, 3];
const LazyComponent: React.FC = () => {
  return (
    <div>
      <div>Lazy component 1</div>
      {a.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export default LazyComponent;
