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
  const Element = element;
  const elementSlots = slots || {};

  return <Element props={props} hooks={context.hooks} slots={elementSlots} />;
};
