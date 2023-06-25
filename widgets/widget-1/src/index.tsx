import React from 'react';
import moment from 'moment';
import styles from './styles.module.css';

interface ComponentProps {
  contexts: unknown[];
  props?: unknown;
  children?: React.ReactNode;
  hooks: Array<{ name: string; useContext: () => unknown }>;
}
const name = 'lazy';
const LazyComponent = React.lazy(() => import('./components/' + name));
// 2sd
const Component: React.FC<ComponentProps> = ({ props, children, hooks }) => {
  // console.log('hooks', hooks[0].useContext());
  const rootContext = hooks[0].useContext() as { value: string };

  let parentContext: { value: unknown } = { value: null };
  if (hooks[1]) {
    parentContext = hooks[1].useContext() as { value: string };
  }

  return (
    <div className={styles.root}>
      <div>Widget #1.0</div>
      <div>data: ${JSON.stringify(props)}</div>
      <div>time {moment().format()}</div>
      <div>rootContext value {rootContext.value}</div>
      <div>parentContext value111 {parentContext.value as string | null}</div>
      <div data-name="React lazy:">
        <React.Suspense>
          <LazyComponent />
        </React.Suspense>
      </div>
      <div data-name="children" className={styles.children}>
        {children}
      </div>
    </div>
  );
};

export default Component;
