import config from 'config';
import { NotVoid, get } from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import Session, { SessionDocument } from '../model/session.model';
import { UserDocument } from '../model/user.model';
import { sign, decode } from '../utils/jwt.utils';
import { findUser } from '../service/user.service';

export async function createSession(
  userId: string,
  userAgent: string
): Promise<string | NotVoid> {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
}

export function createAccessToken({
  user,
  session,
}: {
  user: Omit<UserDocument, 'password'> | LeanDocument<Omit<UserDocument, 'password'>>;
  session:
    | Omit<UserDocument, 'password'>
    | LeanDocument<Omit<SessionDocument, 'password'>>
    | any;
}): string | NotVoid {
  // build and return the new access token
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: config.get('accessTokenTtl') }
  );

  return accessToken;
}

export async function reIssueAccessToken(refreshToken: unknown): Promise<any | boolean> {
  // decode the refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, '_id')) return false;

  // get the session
  const session = await Session.findById(get(decoded, '_id'));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
): Promise<NotVoid> {
  return Session.updateOne(query, update);
}

export async function findSessions(
  query: FilterQuery<SessionDocument>
): Promise<NotVoid> {
  return Session.find(query).lean();
}
