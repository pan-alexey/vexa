import React from 'react';
import moment from 'moment';
import styles from './styles.module.css';

interface ComponentProps {
  contexts: unknown[];
  data?: unknown;
  children?: React.ReactNode;

  slots: Record<string, React.ReactNode>
}
const name = 'lazy';
const LazyComponent = React.lazy(() => import('./components/' + name));
// 2sd
const Component: React.FC<ComponentProps> = ({ data, slots, contexts }) => {
  const [time, setTime] = React.useState('');
  if (contexts) {
    // @ts-ignore
    const useContext1 = contexts[0]();
  }


  return (
    <div className={styles.root}>
      <div>Widget #3.0.0</div>
      <div>data: ${JSON.stringify(data)}</div>
      <div>time {time}</div>
      <div>context</div>
      <div data-name="React lazy:">
        <React.Suspense>
          <LazyComponent />
        </React.Suspense>
      </div>
      <div data-name="children" className={styles.children}></div>
      
    </div>
  );
};

export default Component;
