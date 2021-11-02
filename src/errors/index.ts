import { ApolloError } from 'apollo-server-errors';

export class TooManyMockEndpointsError extends ApolloError {
  constructor(message: string) {
    super(message, 'TOO_MANY_MOCK_ENDPOINTS');

    Object.defineProperty(this, 'name', { value: 'TooManyMockEndpointsError' });
  }
}
