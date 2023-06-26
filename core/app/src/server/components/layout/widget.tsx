import React from 'react';
// import { RootContext } from '../../../common/context';
import { Context } from './context';

export const makeWidget = ({
  element,
  props,
  context,
  slots,
}: {
  element: React.ElementType;
  props: unknown;
  context: Context;
  slots: Record<string, React.ReactElement>;
}): React.ReactElement => {
  const Context = context.provider;
  const Element = element;
  const elementSlots = slots || {};

  return (
    <Context>
      <Element props={props} hooks={context.hooks} slots={slots} />
    </Context>
  );
};
