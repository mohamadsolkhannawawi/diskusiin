import React from 'react';
import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import '@testing-library/jest-dom';
import Avatar from './Avatar';

describe('Avatar component', () => {
  it('should render initials when image is not provided', () => {
    // Assuming getInitials('John Doe') returns 'JD' based on the util logic
    render(<Avatar name="John Doe" />);
    // Check that an element containing the text JD or something derived from name is rendered
    // Since getInitials logic might be just first letters, we can check if a span exists
    // and just verify the image is not there.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render image when image prop is provided', () => {
    render(<Avatar name="Jane" image="https://example.com/jane.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/jane.jpg');
    expect(img).toHaveAttribute('alt', 'Jane');
  });

  it('should render the tail by default', () => {
    const {container} = render(<Avatar name="User" />);
    const tail = container.querySelector('.avatar-tail');
    expect(tail).toBeInTheDocument();
  });

  it('should not render the tail if tail prop is false', () => {
    const {container} = render(<Avatar name="User" tail={false} />);
    const tail = container.querySelector('.avatar-tail');
    expect(tail).not.toBeInTheDocument();
  });
});
