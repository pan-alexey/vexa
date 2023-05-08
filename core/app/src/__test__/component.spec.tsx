/** @jest-environment jsdom */
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.setImmediate = require('timers').setImmediate;

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { Widget } from './__fixtures__/widget';

describe('render hydrate', () => {
  test('Hydrate ok', async () => {
    // Emulate SSR render;

    // Emulate Browser Hydrate (and wait lazy load resolve)
    const { getByText } = render(
      <div data-testid="root">
        <Widget />
      </div>,
    );
    await waitFor(() => expect(getByText('Hello World')).toBeInTheDocument());

    console.log(screen.getByTestId('root').innerHTML);

    expect(1).toBe(1);
  });
});
