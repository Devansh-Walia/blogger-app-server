# Backend JK

A robust NestJS backend application featuring authentication with multiple strategies, user management, and posts functionality.

## Features

- 🔐 **Authentication**
  - JWT-based authentication
  - Google OAuth integration
  - Facebook OAuth integration
- 👥 **User Management**
  - User registration
  - Profile management
- 📝 **Posts Module**
  - CRUD operations for posts
  - User-specific posts management
- ✅ **Comprehensive Testing**
  - Unit tests
  - E2E tests with Jest
  - Integration tests with Cypress

## Tech Stack

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for database management
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Passport](http://www.passportjs.org/) - Authentication middleware
- [Jest](https://jestjs.io/) - Testing framework
- [Cypress](https://www.cypress.io/) - E2E testing framework

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd backend-jk
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

## Environment Configuration

Configure the following environment variables in your `.env` file:

### Database Configuration

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `NODE_ENV` - Environment (development/production/test)

### JWT Configuration

- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRATION` - Token expiration time

### OAuth Configuration

#### Google

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL

#### Facebook

- `FACEBOOK_APP_ID` - Facebook App ID
- `FACEBOOK_APP_SECRET` - Facebook App secret
- `FACEBOOK_CALLBACK_URL` - Facebook OAuth callback URL

### Frontend Configuration

- `FRONTEND_URL` - Frontend application URL

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start the application in watch mode
- `npm run start:debug` - Start the application in debug mode
- `npm run start:prod` - Start the application in production mode
- `npm run format` - Format code using Prettier
- `npm run lint` - Lint code using ESLint

### Testing Scripts

- `npm run test` - Run unit tests
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:cov` - Run unit tests with coverage
- `npm run test:debug` - Debug unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:all` - Run all tests (unit, e2e, and cypress)
- `npm run cypress:open` - Open Cypress test runner
- `npm run cypress:run` - Run Cypress tests headlessly

## API Documentation

The API includes the following main modules:

### Auth Module

- Authentication endpoints for login/register
- OAuth endpoints for Google and Facebook authentication
- JWT token management

### Users Module

- User management endpoints
- Profile operations

### Posts Module

- CRUD operations for posts
- User-specific post management

## Testing

The project includes a comprehensive test suite:

1. **Unit Tests**: Test individual components using Jest
2. **E2E Tests**: Test API endpoints using Jest
3. **Integration Tests**: Test full user flows using Cypress

Run all tests using:

```bash
npm run test:all
```

## License

[UNLICENSED]
