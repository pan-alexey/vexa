import React from 'react';
import { ComponentProps } from '../../../types';
// import type { Context1Type } from '../context-1';
import type { RootContextType } from '../../../common/context/root';

const LazyComponent = React.lazy(() => import('./lazy'));

const Component1: React.FC<ComponentProps> = ({ contexts, children, data }) => {
  const rootContext: RootContextType = (contexts[0] as () => RootContextType)();

  return (
    <div>
      <div>Component1</div>
      <div data-name="context-length">{contexts.length}</div>
      <div data-name="context">{rootContext.version}</div>
      <div data-name="data">{JSON.stringify(data)}</div>
      <div data-name="React lazy:">
        <React.Suspense>
          <LazyComponent />
        </React.Suspense>
      </div>
      <div data-name="children">{children}</div>
    </div>
  );
};

export default Component1;
