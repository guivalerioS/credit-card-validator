import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditCardValidator from '../CreditCardValidator';
import { cardService } from '../../services/api';

vi.mock('../../services/api', () => ({
  cardService: {
    validate: vi.fn()
  }
}));

describe('CreditCardValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component correctly', () => {
      render(<CreditCardValidator />);
      
      expect(screen.getByRole('heading', { name: /credit card validator/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /card number/i })).toBeInTheDocument();
    });

  });

  describe('Card Number Formatting', () => {
    it('formats card number with spaces every 4 digits', async () => {
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532015112830366');
      expect(input).toHaveValue('4532 0151 1283 0366');
    });

    it('limits input to 19 characters (including spaces)', async () => {
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '45320151128303661234');
      expect(input).toHaveValue('4532 0151 1283 0366');
    });

    it('removes non-numeric characters on input', async () => {
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532-abc-1283');
      expect(input).toHaveValue('4532 1283');
    });
  });

  describe('Card Validation', () => {
    it('shows loading state while validating', async () => {
      vi.mocked(cardService.validate).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ isValid: true }), 50))
      );
      
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532015112830366');
      
      await waitFor(() => {
        expect(screen.getByText(/validating/i)).toBeInTheDocument();
      });
    });

    it('shows success message for valid card', async () => {
      vi.mocked(cardService.validate).mockResolvedValue({ isValid: true });
      
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532015112830366');
      
      await waitFor(() => {
        expect(screen.getByText(/✓.*valid.*card.*number/i)).toBeInTheDocument();
      });
    });

    it('shows error message for invalid card', async () => {
      vi.mocked(cardService.validate).mockResolvedValue({ isValid: false });
      
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532015112830367');
      
      await waitFor(() => {
        expect(screen.getByText(/✗.*invalid.*card.*number/i)).toBeInTheDocument();
      });
    });
  });

  describe('Card Type Detection', () => {
    it('detects Visa cards', async () => {
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532');
      
      await waitFor(() => {
        expect(screen.getByText(/visa.*card/i)).toBeInTheDocument();
      });
    });

    it('detects Mastercard cards', async () => {
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '5425');
      
      await waitFor(() => {
        expect(screen.getByText(/mastercard.*card/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      const errorMessage = 'Unable to connect to validation service. Please check your internet connection';
      vi.mocked(cardService.validate).mockRejectedValue(new Error(errorMessage));
      
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532015112830366');
      
      await waitFor(() => {
        const errorElement = screen.getByRole('alert');
        expect(errorElement).toHaveTextContent(errorMessage);
        const retryButton = screen.getByRole('button');
        expect(retryButton).toHaveTextContent(/try again/i);
      });
    });

    it('allows retry on network errors', async () => {
      const errorMessage = 'Unable to connect to validation service. Please check your internet connection';
      vi.mocked(cardService.validate)
        .mockRejectedValueOnce(new Error(errorMessage))
        .mockResolvedValueOnce({ isValid: true });
      
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532015112830366');
      
      const retryButton = await screen.findByRole('button');
      expect(retryButton).toHaveTextContent(/try again/i);
      
      await userEvent.click(retryButton);
      
      await waitFor(() => {
        expect(screen.getByText(/✓.*valid.*card.*number/i)).toBeInTheDocument();
      });
    });
  });
  describe('Accessibility', () => {
    it('announces validation results', async () => {
      vi.mocked(cardService.validate).mockResolvedValue({ isValid: true });
      
      render(<CreditCardValidator />);
      const input = screen.getByRole('textbox', { name: /card number/i });
      
      await userEvent.type(input, '4532015112830366');
      
      await waitFor(() => {
        const status = screen.getByRole('status', { name: /validation status/i });
        expect(status).toHaveTextContent(/valid.*card.*number/i);
      });
    });
  });


});