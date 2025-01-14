import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { cardService } from '../api';

vi.mock('axios');

describe('cardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validate', () => {
    it('should send card number without spaces', async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: { isValid: true } });

      await cardService.validate('4532 0151 1283 0366');

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/validate',
        { cardNumber: '4532015112830366' }
      );
    });

    it('should return validation result', async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: { isValid: true } });

      const result = await cardService.validate('4532015112830366');

      expect(result).toEqual({ isValid: true });
    });

    it('should handle server errors', async () => {
      const error = {
        response: {
          status: 500,
          data: { error: 'Internal Server Error' }
        }
      };
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(cardService.validate('4532015112830366')).rejects.toThrow();
    });

    it('should handle validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { error: 'Invalid card number' }
        }
      };
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(cardService.validate('invalid')).rejects.toThrow();
    });

    it('should clean non-numeric characters before sending', async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: { isValid: true } });

      await cardService.validate('4532-0151-1283-0366');

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/validate',
        { cardNumber: '4532015112830366' }
      );
    });
  });
});