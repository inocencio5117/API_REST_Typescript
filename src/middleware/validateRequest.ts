import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import log from '../logger';

export const validateRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (err: any) {
      log.error(err);
      return res.status(400).send(err.erros);
    }
  };
