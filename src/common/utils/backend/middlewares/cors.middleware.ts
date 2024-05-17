import Cors from 'cors';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { bootAPI } from './bootAPI.middlewares';

const initMiddleware = (
  middleware: (
    req: Cors.CorsRequest,
    res: {
      statusCode?: number;
      setHeader(key: string, value: string): any;
      end(): any;
    },
    next: (err?: any) => any
  ) => void
) => {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
};

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // OnOnly allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'PATCH'],
  })
);

export const corsMiddleware = (controller: NextApiHandler) =>
  bootAPI(async (req: NextApiRequest, res: NextApiResponse) => {
    await cors(req, res);
    controller(req, res);
  });
