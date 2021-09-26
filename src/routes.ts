import { Express, Request, Response } from 'express';
import { createUserHandler } from './controller/user.controller';
import validateRequest from './middleware/validateRequest';
import requireUser from './middleware/requireUser';
import { createUserSchema } from './schema/user.schema';
import { createUserSessionSchema } from './schema/session.schema';
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionHandler,
} from './controller/session.controller';
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from './schema/post.schema';
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  updatePostHandler,
} from './controller/post.controller';

export default function (app: Express): void {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  //register user
  app.post('/api/users', validateRequest(createUserSchema), createUserHandler);

  //login user
  app.post(
    '/api/sessions',
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  //get the user sessions
  app.get('/api/sessions', requireUser, getUserSessionHandler);

  //logout
  app.delete('/api/sessions', requireUser, invalidateUserSessionHandler);

  // create a post
  app.post(
    '/api/posts',
    [requireUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  //update post
  app.put(
    '/api/posts/:postId',
    [requireUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  //get a post
  app.get('/api/posts/:postId', getPostHandler);

  //delete a post
  app.delete(
    '/api/posts/:postId',
    [requireUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
