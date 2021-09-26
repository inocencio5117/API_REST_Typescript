import { Express, Request, Response } from 'express';
import { createUserHandler } from './controller/user.controller';
import validateRequest from './middleware/validateRequest';
import { createUserSchema } from './schema/user.schema';
import { createUserSessionSchema } from './schema/session.schema';
import { createUserSessionHandler } from './controller/session.controller';

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

  //logout
}
