import React from 'react';
import { RootContext } from '../../../common/context';

export const makeWidget = (
  Element: React.ElementType,
  props: unknown,
  // parrent: React.ReactElement[],
): React.ReactElement => {
  const widget = [];
  const { useContext, Provider } = RootContext;

  return (
    <Provider props={{ contextProps: 'test' }}>
      <Element $rootContext={useContext} props={props} />
    </Provider>
  );
};
