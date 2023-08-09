import type { Meta, StoryObj } from '@storybook/react';
import '../app/globals.css';
import { Modal } from '../components/Modal';

const meta = {
  title: 'Base/Modal',
  component: Modal,
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Hello World',
    isOpen: true,
    closeModal: () => {},
  },
};
