import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../app/globals.css';

const Button = () => (
  <button className="p-2 border-2 border-gray-400 rounded-lg m-2 w-full text-center hover:bg-gray-400 hover:text-white">ボタン</button>
)

const meta = {
  title: 'Base/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
