import axios, { AxiosError } from 'axios';

interface ValidationResponse {
  isValid: boolean;
}

interface ErrorResponse {
  error: string;
  details?: unknown;
}

export const cardService = {
  validate: async (cardNumber: string): Promise<ValidationResponse> => {
    try {
      const { data } = await axios.post<ValidationResponse>(
        'http://localhost:3001/api/validate',
        { cardNumber: cardNumber.replace(/\D/g, '') }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              throw new Error('Invalid card number format');
            case 404:
              throw new Error('Validation service not found');
            case 429:
              throw new Error('Too many requests. Please try again later');
            case 500:
              throw new Error('Server error. Please try again later');
            default:
              throw new Error(`Validation failed: ${axiosError.response.data.error || 'Unknown error'}`);
          }
        } else if (axiosError.request) {
          throw new Error('Unable to connect to validation service. Please check your internet connection');
        }
      }
      throw new Error('An unexpected error occurred');
    }
  }
};