import React from 'react';
import ThreadCard from './ThreadCard';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {MemoryRouter} from 'react-router-dom';
import '../styles/index.css';

// Create a mock store for Storybook
const MockStore = ({children, initialState}) => {
  const store = configureStore({
    reducer: {
      authUser: (state = initialState.authUser) => state,
      threads: (state = initialState.threads) => state,
      shared: (state = initialState.shared || {}) => state,
      alert: (state = initialState.alert || {}) => state,
    },
    preloadedState: initialState,
  });

  return <Provider store={store}>{children}</Provider>;
};

export default {
  title: 'Components/ThreadCard',
  component: ThreadCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

const mockThread = {
  id: 'thread-1',
  title: 'Is React still the best choice in 2024?',
  body: '<p>I have been using React for years, but with Svelte and Solid out there, is it still the best?</p>',
  category: 'react',
  createdAt: new Date().toISOString(),
  ownerName: 'TechEnthusiast',
  ownerAvatar: 'https://ui-avatars.com/api/?name=Tech+Enthusiast',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  totalComments: 12,
};

const Template = (args) => (
  <MockStore initialState={args.initialState}>
    <ThreadCard thread={args.thread} />
  </MockStore>
);

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  initialState: {
    authUser: {value: null},
    threads: {items: [mockThread]},
  },
  thread: mockThread,
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  initialState: {
    authUser: {value: {id: 'user-1'}},
    threads: {items: [mockThread]},
  },
  thread: mockThread,
};

export const UpvotedByMe = Template.bind({});
UpvotedByMe.args = {
  initialState: {
    authUser: {value: {id: 'user-1'}},
    threads: {items: [{...mockThread, upVotesBy: ['user-1', 'user-2']}]},
  },
  thread: {...mockThread, upVotesBy: ['user-1', 'user-2']},
};
