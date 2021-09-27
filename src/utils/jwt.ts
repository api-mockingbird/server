import jwt from 'jsonwebtoken';

import { NexusGenObjects } from '../generated/nexus';

export const encode = (user: NexusGenObjects['User']) => {
  try {
    return jwt.sign(user, process.env.JWT_SECRET_KEY!, {
      expiresIn: '1h',
    });
  } catch (e) {
    throw e;
  }
};

export const decode = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!);
  } catch (e) {
    throw e;
  }
};
