import React from 'react';
import styles from './index2.css';

const a = [1,2, 3, 4, 5];
const LazyComponent: React.FC = () => {
  return (
    <div className={styles.root}>
      <div>Lazy component 2</div>
      <div className={styles.lazy}>
        {a.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default LazyComponent;
