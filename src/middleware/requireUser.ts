import { get, NotVoid } from 'lodash';
import { Request, Response, NextFunction } from 'express';
// import log from '../logger';

const requiseUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<NotVoid> => {
  const user = get(req, 'user');

  if (!user) return res.sendStatus(403);

  return next();
};

export default requiseUser;
