/** @jest-environment jsdom */
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.setImmediate = require('timers').setImmediate;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const reactDom = require('react-dom/server.node');
jest.mock('react-dom/server', () => ({
  renderToPipeableStream: reactDom.renderToPipeableStream,
}));

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { renderComponent } from '../server/render';
import Component1 from '../__fixtures__/Component1';

describe('jsdom hydrate', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterAll(() => {
    (console.error as unknown as { mockRestore: () => void }).mockRestore();
  });

  afterEach(() => {
    (console.error as unknown as { mockClear: () => void }).mockClear();
  });

  test('Hydrate ok', async () => {
    // Emulate SSR render;
    const container = document.createElement('div');
    container.innerHTML = `<div data-testid="root"><div>123</div></div>`;
    document.body.appendChild(container);

    // Emulate Browser Hydrate
    render(
      <div data-testid="root">
        <div>123</div>
      </div>,
      { container, hydrate: true },
    );

    // Check console without error
    expect((console.error as unknown as jest.SpyInstance).mock.calls.length).toBe(0);
  });

  test('Hydrate error', async () => {
    // Emulate SSR render;
    const container = document.createElement('div');
    container.innerHTML = `<div data-testid="root"><div>12345</div></div>`;
    document.body.appendChild(container);

    // Emulate Browser Hydrate
    render(
      <div data-testid="root">
        <div>1234</div>
      </div>,
      { container, hydrate: true },
    );

    // Check console with error
    expect((console.error as unknown as jest.SpyInstance).mock.calls.length).not.toBe(0);
  });
});

describe('render hydrate', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterAll(() => {
    (console.error as unknown as { mockRestore: () => void }).mockRestore();
  });

  afterEach(() => {
    (console.error as unknown as { mockClear: () => void }).mockClear();
  });

  test('Hydrate ok', async () => {
    // Emulate SSR render;
    const container = document.createElement('div');
    const nodeHtml = await renderComponent(<Component1 />);
    container.innerHTML = `<div data-testid="root">${nodeHtml}</div>`;
    document.body.appendChild(container);

    // Emulate Browser Hydrate (and wait lazy load resolve)
    const { getByText } = render(
      <div data-testid="root">
        <Component1 />
      </div>,
      { container, hydrate: true },
    );
    await waitFor(() => expect(getByText('Lazy component 1')).toBeInTheDocument());

    const browserHtml = screen.getByTestId('root').innerHTML;

    expect(nodeHtml).toBe(browserHtml);
    expect((console.error as unknown as jest.SpyInstance).mock.calls.length).toBe(0);
  });
});
