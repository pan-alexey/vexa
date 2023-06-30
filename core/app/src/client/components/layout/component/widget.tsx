import React from 'react';
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

  console.log('slots', slots);
  const elementSlots = slots || {};

  return (
    <Context>
      <Element props={props} hooks={context.hooks} slots={elementSlots} />
    </Context>
  );
};
