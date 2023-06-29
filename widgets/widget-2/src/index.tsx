import React from 'react';
import moment from 'moment';
import styles from './styles.module.css';

interface ComponentProps {
  contexts: unknown[];
  data?: unknown;
  children?: React.ReactNode;
}
const name = 'lazy';
const LazyComponent = React.lazy(() => import('./components/' + name));
// 2sd
const Component: React.FC<ComponentProps> = ({ data, children, contexts }) => {
  if (contexts) {
    // @ts-ignore
    const useContext1 = contexts[0]();
    console.log('useContext1', useContext1);
  } else {
    // throw new Error('Custom error');
  }

  console.log(1);
  return (
    <div className={styles.root}>
      <div>Widget #2.0.0</div>
      <div>data: ${JSON.stringify(data)}</div>
      <div>context</div>
      <div data-name="React lazy:">
        <React.Suspense>
          <LazyComponent />
        </React.Suspense>
      </div>
      <div data-name="children" className={styles.children}>{children}</div>
    </div>
  );
};

export default Component;
