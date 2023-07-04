import React from 'react';
import moment from 'moment';
import styles from './styles.module.css';

interface ComponentProps {
  contexts: unknown[];
  props?: unknown;
  slots: Record<string, React.ReactNode>;
  hooks: Array<{ name: string; useContext: () => unknown }>;
}
const name = 'lazy';
const LazyComponent = React.lazy(() => import('./components/' + name));
// 2sd
const Component: React.FC<ComponentProps> = ({ props, hooks, slots }) => {
  const [count, setCount] = React.useState(1);
  const [time, setTime] = React.useState('');

  React.useEffect(() => {
    setTime(moment().format());
  }, []);

  const handelCount = () => {
    setCount(count + 1);
  };

  const ctx1 = hooks[1]
    ? (hooks[1].useContext() as { props: unknown; value: string; setValue: (value: string) => void })
    : null;

  const ctx2 = hooks[2]
    ? (hooks[2].useContext() as { props: unknown; value: string; setValue: (value: string) => void })
    : null;

  console.log('context', ctx1, ctx2);
  // const context = hooks.length === 1 ? (hooks[1].useContext() as { value: string; setValue: () => void }) : null;

  return (
    <div className={styles.root}>
      <div>
        Widget #1 <button onClick={handelCount}>Count [{count}]</button>
      </div>
      <div>data: ${JSON.stringify(props)}</div>
      <div>time {time}</div>
      {ctx1 && (
        <div>
          <div onClick={() => ctx1.setValue(String(Math.random()))}>context value {ctx1.value}</div>
          <div>Context props {JSON.stringify(ctx1.props)}</div>
        </div>
      )}

      {ctx2 && (
        <div>
          <div onClick={() => ctx2.setValue(String(Math.random()))}>context value {ctx2.value}</div>
          <div>Context props {JSON.stringify(ctx2.props)}</div>
        </div>
      )}
      <div data-name="React lazy:">
        <React.Suspense>
          <LazyComponent />
        </React.Suspense>
      </div>
      <div data-name="children" className={styles.children}>
        {slots.slots1}
      </div>
    </div>
  );
};

export default Component;
