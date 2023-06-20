import type { RemoteWidget } from '../types';

export const data: RemoteWidget[] = [
  { name: 'widget.widget4', props: {}, important: true },
  { name: 'widget.widget1', props: { test: 1 } },
  {
    name: 'context.context1',
    props: {},
    children: [
      { name: 'widget.widget1', props: { test: 2 } },
      { name: 'widget.widget2', props: { test: 3 }, children: [{ name: 'widget.widget1', props: { test: 4 } }] },
    ],
  },
  { name: 'widget.widget1', props: {} },
];
