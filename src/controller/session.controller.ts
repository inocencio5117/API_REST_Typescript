import { Request, Response } from 'express';
import { validatePassword } from '../service/user.service';
import { createAccessToken, createSession } from '../service/session.service';
import config from 'config';
import { sign } from '../utils/jwt.utils';

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
