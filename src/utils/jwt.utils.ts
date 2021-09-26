import jwt from 'jsonwebtoken';
import config from 'config';
import { NotVoid } from 'lodash';
import log from '../logger';

type DecodeType = {
  valid: boolean;
  expired: boolean;
  decoded: string | jwt.JwtPayload | null;
};

const privateKey = config.get('privateKey') as string;

export function sign(object: any, options?: jwt.SignOptions | undefined): NotVoid {
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string | any): DecodeType {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error: any) {
    log.error({ error });
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
}
