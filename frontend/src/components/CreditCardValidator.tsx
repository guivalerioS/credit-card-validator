import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { cardService } from '../services/api';
import { useCardType } from '../hooks/useCardType';
import { useDebounce } from '../hooks/useDebounce';
import { useAccessibleNotification } from '../hooks/useAccessibleNotification';
import { LoadingSpinner } from './LoadingSpinner';

interface ValidationState {
  isValid: boolean | null;
  isLoading: boolean;
  error: {
    message: string;
    code?: string;
    retry?: boolean;
  } | null;
}

const CreditCardValidator: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: null,
    isLoading: false,
    error: null
  });
  
  const { cardType } = useCardType(cardNumber);
  const debouncedCardNumber = useDebounce(cardNumber, 600);
  const notify = useAccessibleNotification();

  const handleValidation = async (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    
    if (cleanNumber.length < 13) {
      setValidationState(prev => ({ ...prev, isValid: null, error: null }));
      return;
    }

    setValidationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await cardService.validate(cleanNumber);
      setValidationState({
        isValid: response.isValid,
        isLoading: false,
        error: null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      const isConnectionError =  errorMessage.includes('internet');

      setValidationState({
        isValid: null,
        isLoading: false,
        error: {
          message: errorMessage,
          retry: isConnectionError
        }
      });
    }
  };
  useEffect(() => {
    handleValidation(debouncedCardNumber);
  }, [debouncedCardNumber]);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const { isValid, isLoading, error } = validationState;

  const getValidationStatus = () => {
    if (isLoading) return 'validating';
    if (error) return 'error';
    if (isValid === true) return 'valid';
    if (isValid === false) return 'invalid';
    return 'idle';
  };

  const status = getValidationStatus();

  const statusStyles = {
    idle: 'border-gray-300 text-gray-400',
    validating: 'border-blue-300 text-blue-500',
    valid: 'border-green-500 text-green-500',
    invalid: 'border-red-500 text-red-500',
    error: 'border-red-500 text-red-500'
  };

  return (
    <div 
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      role="main"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 
          className="text-2xl font-bold text-center mb-8"
          tabIndex={0}
        >
          Credit Card Validator
        </h1>

        <div className="space-y-6">
          <div>
            <label 
              htmlFor="cardNumber" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="Enter card number"
                className={`w-full pl-4 pr-12 py-2 border-2 rounded-md transition-colors duration-200
                  ${statusStyles[status]}
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                maxLength={19}
                aria-invalid={status === 'invalid'}
                aria-describedby="validation-status card-type"
                autoComplete="cc-number"
              />
              <div 
                className={`absolute right-3 top-2.5 transition-colors duration-200 ${statusStyles[status]}`}
                aria-hidden="true"
              >
                {isLoading ? (
                  <LoadingSpinner className="text-blue-500" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
              </div>
            </div>

            <div 
              className="mt-2 min-h-6 flex items-center gap-2"
              id="card-type"
              role="status"
            >
              {cardType !== 'unknown' && (
                <span className="text-sm font-medium capitalize text-gray-700">
                  {cardType} card
                </span>
              )}
            </div>

           {status !== 'idle' && !error && (
              <div
                id="validation-status"
                className={`mt-2 text-sm font-medium ${
                  status === 'valid' ? 'text-green-600' :
                  status === 'invalid' ? 'text-red-600' :
                  'text-blue-600'
                }`}
                role="status"
                aria-label="Validation status"
              >
                {status === 'valid' && '✓ Valid card number'}
                {status === 'invalid' && '✗ Invalid card number'}
                {status === 'validating' && (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Validating
                  </span>
                )}
              </div>
            )}

            {error && (
              <div
                className="mt-2"
                role="alert"
              >
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span>{error.message}</span>
                  {error.retry && (
                    <button
                      type="button"
                      onClick={() => handleValidation(cardNumber)}
                      className="px-2 py-1 text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {notify(
            status === 'valid' ? 'Card number is valid' :
            status === 'invalid' ? 'Card number is invalid' :
            '', 
            { role: 'status' }
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardValidator;