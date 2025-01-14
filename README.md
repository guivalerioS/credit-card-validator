# Credit Card Validator

A modern, real-time credit card validator built with React, TypeScript, and Fastify. This project demonstrates best practices in frontend and backend development, with a focus on performance, accessibility, and user experience.

## Key Features

- ⚡ Real-time validation with debounce
- 🎭 Credit card type detection (Visa, Mastercard, etc.)
- ♿ Full accessibility support (ARIA, keyboard navigation)
- 🧪 Comprehensive test coverage
- 🚀 Performance optimized
- 🛡️ Error handling and retry mechanisms
- 💅 Clean and responsive UI

## Tech Stack

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Vitest + Testing Library
- Axios
- Lucide Icons

### Backend
- Fastify
- TypeScript
- Luhn Algorithm Implementation
- Vitest

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/guivalerioS/credit-card-validator>
cd credit-card-validator
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

3. Start the servers:
```bash
# Start backend (from backend directory)
pnpm dev

# Start frontend (from frontend directory)
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Testing

This project includes comprehensive test coverage for both frontend and backend:

```bash
# Run frontend tests
cd frontend
pnpm test

# Run backend tests
cd backend
pnpm test
```

### Test Coverage
- Frontend: Component tests, service tests, and accessibility tests
- Backend: Luhn algorithm validation, API endpoints, and error handling

## Architecture

### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── hooks/          # Custom hooks
│   └── __tests__/      # Test files
```

### Backend Structure
```
backend/
├── src/
│   ├── services/       # Business logic
│   └── __tests__/     # Test files
```

## Implementation Details

### Credit Card Validation
- Uses the Luhn algorithm for number validation
- Real-time validation with 600ms debounce
- Proper error handling and user feedback

### Performance Optimizations
- Debounced API calls
- Efficient state management
- Minimal re-renders

## Error Handling

The application handles various error scenarios:
- Network connectivity issues
- Invalid card numbers
- Server errors
- Validation errors

Each error type has appropriate user feedback and, when applicable, retry options.

## API Documentation

### Validate Credit Card
```typescript
POST /api/validate
Content-Type: application/json

{
  "cardNumber": "4532015112830366"
}

Response:
{
  "isValid": boolean
}
```

## Development Decisions

1. **Fastify over Express**: Chosen for better performance and TypeScript support.
2. **Real-time Validation**: Implements debouncing to prevent excessive API calls.
3. **Comprehensive Testing**: Both frontend and backend have thorough test coverage.
4. **Accessibility First**: Built with WCAG guidelines in mind.
5. **Error Handling**: Robust error handling with user-friendly messages.

## License

This project is licensed under the MIT License - see the LICENSE file for details.