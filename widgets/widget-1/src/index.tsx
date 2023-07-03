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
const Component: React.FC<ComponentProps> = ({ props, children, hooks, slots }) => {
  const [count, setCount] = React.useState(1);
  const [time, setTime] = React.useState('');

  React.useEffect(() => {
    setTime(moment().format());
  }, []);

  const handelCount = () => {
    setCount(count + 1);
  };

  // console.log('hooks', hooks[0].useContext());
  // const rootContext = hooks[0].useContext() as { value: string };
  // let parentContext: { value: unknown } = { value: null };
  // if (hooks[1]) {
  //   parentContext = hooks[1].useContext() as { value: string };
  //   // console.log('parentContext', parentContext);
  // }
  // console.log('styles', styles);
  // console.log('slots', slots);

  return (
    <div className={styles.root}>
      <div>
        Widget #1 <button onClick={handelCount}>Count [{count}]</button>
      </div>
      <div>data: ${JSON.stringify(props)}</div>
      <div>time {time}</div>
      {/* <div>rootContext value {rootContext.value}</div>
      <div>parentContext value111 {parentContext.value as string | null}</div> */}
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
