import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

import { generateRes } from '../response';
import { corsMiddleware } from './cors.middleware';

export const checkBody = (
  controller: NextApiHandler,
  schema: yup.ObjectSchema<any>
) =>
  corsMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
    const contentBodyIsValid = await schema.isValid(req.body);

    if (!contentBodyIsValid) {
      res
        .status(400)
        .end(generateRes('Failure', 'Check your payload...', null));
    }
    controller(req, res);
  });
