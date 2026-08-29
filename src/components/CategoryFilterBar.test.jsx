import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import '@testing-library/jest-dom';
import CategoryFilterBar from './CategoryFilterBar';

describe('CategoryFilterBar component', () => {
  const categories = ['react', 'redux', 'testing'];

  it('should render all categories including "Semua"', () => {
    render(
      <CategoryFilterBar 
        categories={categories} 
        active="all" 
        onSelect={() => {}} 
      />
    );

    expect(screen.getByText('Semua')).toBeInTheDocument();
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('should call onSelect with "all" when "Semua" button is clicked', () => {
    const onSelectMock = vi.fn();
    render(
      <CategoryFilterBar 
        categories={categories} 
        active="react" 
        onSelect={onSelectMock} 
      />
    );

    const semuaButton = screen.getByText('Semua');
    fireEvent.click(semuaButton);

    expect(onSelectMock).toHaveBeenCalledWith('all');
  });

  it('should call onSelect with the correct category when a category button is clicked', () => {
    const onSelectMock = vi.fn();
    render(
      <CategoryFilterBar 
        categories={categories} 
        active="all" 
        onSelect={onSelectMock} 
      />
    );

    const reactButton = screen.getByText('react');
    fireEvent.click(reactButton);

    expect(onSelectMock).toHaveBeenCalledWith('react');
  });

  it('should apply "is-active" class to the active category', () => {
    render(
      <CategoryFilterBar 
        categories={categories} 
        active="redux" 
        onSelect={() => {}} 
      />
    );

    const reduxButton = screen.getByText('redux');
    expect(reduxButton).toHaveClass('is-active');

    const semuaButton = screen.getByText('Semua');
    expect(semuaButton).not.toHaveClass('is-active');
  });
});
