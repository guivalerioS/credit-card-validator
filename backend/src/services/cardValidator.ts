export function validateCreditCard(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }
  
    let sum = 0;
    let shouldDouble = false;
  
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
  
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
  
      sum += digit;
      shouldDouble = !shouldDouble;
    }
  
    return sum % 10 === 0;
  }