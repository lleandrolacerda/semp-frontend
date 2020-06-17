import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders PRODF', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/PRODF SEMP/i);
  expect(linkElement).toBeInTheDocument();
});
