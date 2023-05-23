import React from 'react';
import styles from './styles.css';

const name = 'lazy';
const LazyComponent = React.lazy(() => import('./components/' + name));

const Widget: React.FC = () => {
  return <div test={1} className={styles.root}>
    <div>Name: widget</div>
    <div data-name="React lazy:">
        <React.Suspense>
          <LazyComponent />
        </React.Suspense>
      </div>
  </div>
}

export default Widget;
