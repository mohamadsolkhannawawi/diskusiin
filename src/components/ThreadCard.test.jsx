import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import '@testing-library/jest-dom';
import ThreadCard from './ThreadCard';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {voteThread} from '../states/threads/threadsSlice';
import {showAlert} from '../states/shared/alertSlice';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/threads/threadsSlice', () => ({
  voteThread: vi.fn(),
}));

vi.mock('../states/shared/alertSlice', () => ({
  showAlert: vi.fn(),
}));

describe('ThreadCard component', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'How to use React?',
    body: 'Can someone explain?',
    category: 'react',
    createdAt: '2023-01-01T00:00:00.000Z',
    ownerName: 'Alice',
    ownerAvatar: 'avatar.jpg',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 5,
  };

  const mockNavigate = vi.fn();
  const mockDispatch = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    vi.clearAllMocks();
  });

  it('should render thread information correctly', () => {
    useSelector.mockReturnValue({id: 'user-1'}); // Mock authUser

    render(<ThreadCard thread={mockThread} />);

    expect(screen.getByText('How to use React?')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('5 komentar')).toBeInTheDocument();
  });

  it('should navigate to thread detail when card is clicked', () => {
    useSelector.mockReturnValue({id: 'user-1'});

    render(<ThreadCard thread={mockThread} />);
    const cardMain = screen.getByText('How to use React?').closest('button');
    fireEvent.click(cardMain);

    expect(mockNavigate).toHaveBeenCalledWith('/threads/thread-1');
  });

  it('should disable vote buttons if user is not logged in', () => {
    useSelector.mockReturnValue(null); // No auth user

    render(<ThreadCard thread={mockThread} />);
    const buttons = screen.getAllByRole('button');
    const upvoteButton = buttons[1]; 
    
    expect(upvoteButton).toBeDisabled();
  });

  it('should call voteThread if user is logged in and clicks vote', () => {
    useSelector.mockReturnValue({id: 'user-1'});

    render(<ThreadCard thread={mockThread} />);
    
    const buttons = screen.getAllByRole('button');
    const upvoteButton = buttons[1];
    
    fireEvent.click(upvoteButton);
    expect(voteThread).toHaveBeenCalledWith('thread-1', 'up');
    expect(mockDispatch).toHaveBeenCalled();
  });
});
