import React from 'react';
import Avatar from './Avatar';
import '../styles/index.css';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    name: {control: 'text'},
    image: {control: 'text'},
    size: {control: 'number'},
    tail: {control: 'boolean'},
  },
};

const Template = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'John Doe',
  size: 44,
  tail: true,
};

export const WithImage = Template.bind({});
WithImage.args = {
  name: 'Jane Smith',
  image: 'https://ui-avatars.com/api/?name=Jane+Smith',
  size: 44,
  tail: true,
};

export const NoTail = Template.bind({});
NoTail.args = {
  name: 'Anonymous',
  size: 44,
  tail: false,
};
