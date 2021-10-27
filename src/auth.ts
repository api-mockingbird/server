import { AuthenticationError } from 'apollo-server-errors';

import db from './db';
import { getUserById } from './service/user.service';
import { User } from './types';
import { decode } from './utils/jwt';

export const authenticate = async (
  accessToken: string,
): Promise<User | Error> => {
  try {
    const decoded = decode(accessToken) as User;
    const user = await getUserById(db, decoded.id);

    if (!user || decoded.id !== user.id) {
      throw new AuthenticationError('Unauthenticated');
    }

    return decoded;
  } catch (e) {
    throw e;
  }
};
