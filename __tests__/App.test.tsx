/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    const instance = ReactTestRenderer.create(<App />);
    instance.unmount();
  });
});
