import React from 'react';
// import { RootContext } from '../../../common/context';
import { Context } from './context';

export const makeWidget = (
  Element: React.ElementType,
  props: unknown,
  context: Context,
  // parrent: React.ReactElement[],
): React.ReactElement => {
  // const widget = [];
  // const { useContext, Provider } = RootContext;
  // return (
  //   // <Provider props={{ contextProps: 'test' }}>
  //     <Element $rootContext={useContext} props={props} />
  //   // </Provider>
  // );

  return (
    <context.provider>
      <Element props={props} hooks={context.hooks} />
    </context.provider>
  );
};
