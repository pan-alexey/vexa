import React, { useState } from 'react';
import styles from './styles.css';

const Widget: React.FC = () => {
  const [count, setCount] = useState(1);

  const handleClick = () => {
    setCount(count + 1);
  }

  React.useEffect(() => {
    setCount(10);
  }, []);

  return <div test={1} className={styles.root}>
    <div>contex.core.router</div>
    <div onClick={handleClick}>count: {count}</div>

    <div data-name="React lazy:">
      </div>
  </div>
}

export default Widget;
