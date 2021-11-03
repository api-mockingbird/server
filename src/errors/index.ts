import { ApolloError } from 'apollo-server-errors';

export class TooManyMockEndpointsError extends ApolloError {
  constructor(message = 'Number of endpoints has reached the limit') {
    super(message, 'TOO_MANY_MOCK_ENDPOINTS');

    Object.defineProperty(this, 'name', { value: 'TooManyMockEndpointsError' });
  }
}
