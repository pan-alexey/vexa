import { ComponentProps } from '../../types';
import { ContextInterface } from '../../types/global';
import { Context as Context1 } from './context-1';
import { Context as Context2 } from './context-2';
// import Component1 from './component-1';

export const components: Record<string, React.FC<ComponentProps>> = {};

export const contexts: Record<string, ContextInterface<unknown>> = {
  context1: Context1,
  context2: Context2,
};
