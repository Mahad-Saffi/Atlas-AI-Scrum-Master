import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from './ChatInterface';
import { aiService } from '../../services/aiService';
import { vi } from 'vitest';

// Mock the aiService
vi.mock('../../services/aiService');
const mockedAiService = aiService as jest.Mocked<typeof aiService>;

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ChatInterface', () => {
  beforeEach(() => {
    // Set a dummy token for testing
    localStorage.setItem('jwt', 'dummy_token');
  });

  test('renders initial message from AI', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Welcome! What project are you thinking of building today?/i)).toBeInTheDocument();
  });

  test('sends a message and displays AI response', async () => {
    mockedAiService.discover.mockResolvedValue({ sender: 'ai', text: 'Mocked AI response' });

    render(<ChatInterface />);

    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send/i);

    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(sendButton);

    // Check if user message appears
    expect(screen.getByText(/Hello AI/i)).toBeInTheDocument();

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText(/Mocked AI response/i)).toBeInTheDocument();
    });

    // Check if aiService.discover was called correctly
    expect(mockedAiService.discover).toHaveBeenCalledWith('Hello AI', 'dummy_token');
  });
});
