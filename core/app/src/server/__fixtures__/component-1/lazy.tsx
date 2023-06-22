import React from 'react';

const a = [1, 2, 3, 4, 5];
const LazyComponent1: React.FC = () => {
  return (
    <div>
      <div>Lazy component 1</div>
      {a.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export default LazyComponent1;
