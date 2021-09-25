import { Express, Request, Response } from 'express';

export default function (app: Express): void {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  //register user

  //login user

  //get the user sessions

  //logout
}
