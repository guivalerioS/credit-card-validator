import { describe, it, expect } from 'vitest';
import { validateCreditCard } from '../cardValidator';

describe('Credit Card Validator', () => {
  it('should validate valid credit card numbers', () => {
    const validNumbers = [
      '4532015112830366',
      '4916337563926287', 
      '5425233430109903',
      '2223000048410010', 
      '374245455400126',
      '6011111111111117',
    ];

    validNumbers.forEach(number => {
      expect(validateCreditCard(number)).toBe(true);
    });
  });

  it('should invalidate incorrect credit card numbers', () => {
    const invalidNumbers = [
        '4532015112830367',
        '1234567890123456',
      ];

    invalidNumbers.forEach(number => {
      expect(validateCreditCard(number)).toBe(false);
    });
  });

  it('should handle different input formats', () => {
    expect(validateCreditCard('4532015112830366')).toBe(true);
    expect(validateCreditCard('4532 0151 1283 0366')).toBe(true);
    expect(validateCreditCard('4532-0151-1283-0366')).toBe(true);
  });

  it('should validate card number length', () => {
    expect(validateCreditCard('411111')).toBe(false);
    expect(validateCreditCard('41111111111111111111')).toBe(false);
  });

  it('should handle invalid characters', () => {
    expect(validateCreditCard('4532abc112830366')).toBe(false);
    expect(validateCreditCard('4532@#$%12830366')).toBe(false);
  });
});