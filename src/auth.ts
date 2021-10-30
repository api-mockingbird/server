import { AuthenticationError } from 'apollo-server-errors';

import { ONE_HOUR } from './constants';
import db from './db';
import { getUserById } from './service/user.service';
import { User } from './types';
import { decode } from './utils/jwt';

export const authenticate = async (
  accessToken: string,
): Promise<User | Error> => {
  try {
    const decoded = decode(accessToken) as User;

    if (
      decoded.isTemp &&
      new Date(decoded.createdAt) < new Date(Date.now() - ONE_HOUR)
    ) {
      throw new Error();
    }

    const user = await getUserById(db, decoded.id);

    if (
      !user ||
      decoded.id !== user.id ||
      (user.isTemp &&
        new Date(user.createdAt) < new Date(Date.now() - ONE_HOUR))
    ) {
      throw new Error();
    }

    return decoded;
  } catch (e) {
    throw new AuthenticationError('Unauthenticated');
  }
};
