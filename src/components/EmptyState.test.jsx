import React from 'react';
import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import '@testing-library/jest-dom';
import EmptyState from './EmptyState';

describe('EmptyState component', () => {
  it('should render title correctly', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('should render description correctly when provided', () => {
    render(<EmptyState title="Oops" description="Try again later" />);
    expect(screen.getByText('Try again later')).toBeInTheDocument();
  });
});
