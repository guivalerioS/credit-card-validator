import { useState, useEffect } from 'react';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

interface CardPattern {
  type: CardType;
  pattern: RegExp;
}

const CARD_PATTERNS: CardPattern[] = [
  { type: 'visa', pattern: /^4/ },
  { type: 'mastercard', pattern: /^(5[1-5]|2[2-7])/ },
  { type: 'amex', pattern: /^3[47]/ },
  { type: 'discover', pattern: /^6(?:011|5)/ },
];

export const useCardType = (cardNumber: string) => {
  const [cardType, setCardType] = useState<CardType>('unknown');
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\D/g, '');

    if (cleanNumber.length === 0) {
      setCardType('unknown');
      setIsValid(true);
      return;
    }

    const matchedCard = CARD_PATTERNS.find(card => card.pattern.test(cleanNumber));
    setCardType(matchedCard?.type || 'unknown');

    const isValidLength = cleanNumber.length >= 13 && cleanNumber.length <= 19;
    setIsValid(isValidLength);
  }, [cardNumber]);

  return { cardType, isValid };
};