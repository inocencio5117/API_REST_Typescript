import { Request, Response } from 'express';
import { validatePassword } from '../service/user.service';
import {
  createAccessToken,
  createSession,
  updateSession,
  findSessions,
} from '../service/session.service';
import { sign } from '../utils/jwt.utils';
import { get } from 'lodash';
import config from 'config';

export async function createUserSessionHandler(
  req: Request,
  res: Response
): Promise<Request | Response | undefined> {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send('Invalid username or password');

  // create a session
  const session = await createSession(user._id, req.get('user-agent') || '');

  // create access tokens
  const accessToken = createAccessToken({
    user,
    session,
  });

  const refreshToken = sign(session, {
    expiresIn: config.get('refreshTokenTtl'),
  });

  // send refresh & access tokens back
  return res.send({ accessToken, refreshToken });
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
): Promise<Response> {
  const sessionId = get(req, 'user.session');

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionHandler(
  req: Request,
  res: Response
): Promise<Response> {
  const userId = get(req, 'user._id');

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
