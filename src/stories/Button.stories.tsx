import type { Meta, StoryObj } from '@storybook/react';
import '../app/globals.css';
import { Button } from '../components/Button';

const meta = {
  title: 'Base/Button',
  component: Button as any,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: 'w-full',
    children: 'Hello World',
    onClick: () => {},
  }
}
