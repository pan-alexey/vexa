import React, { useState } from 'react';
// import styles from './styles.css';

const name = 'lazy';
const LazyComponent = React.lazy(() => import('./components/' + name));

interface WidgetProps {
  slots: Record<string, unknown>;
}

const Widget: React.FC<WidgetProps> = ({ slots = {} }) => {
  const [count, setCount] = useState(1);

  const handleClick = () => {
    setCount(count + 1);
  }

  React.useEffect(() => {
    setCount(10);
  }, []);

  return <div className={styles.root}>
    <div>Name: widget.cms.navbar</div>
    <div onClick={handleClick}>count: ({count})</div>
    <div className={styles.slot1}>slots1: </div>
    <div className={styles.slot1}>slots2:</div>

    <div data-name="React lazy:">
        <React.Suspense>
          <LazyComponent />
        </React.Suspense>
      </div>
  </div>
}

export default Widget;
