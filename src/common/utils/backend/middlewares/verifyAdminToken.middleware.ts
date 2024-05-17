import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { ROLE_SCOPE } from '@constants/backend';

import { JWTService } from '@services/backend';

import { corsMiddleware } from './cors.middleware';

export const verifyAdminToken = (controller: NextApiHandler): NextApiHandler =>
  corsMiddleware((req: NextApiRequest, res: NextApiResponse) => {
    const bearerHeader = req.headers.authorization;

    if (!bearerHeader) {
      return res.status(401).json({
        status: 'Failure',
        message: 'Access Denied',
      });
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    try {
      const verified = JWTService.verify(bearerToken);
      if (verified.scope === ROLE_SCOPE.ADMIN) {
        req.email = verified.sub;
        controller(req, res);
      } else {
        res.status(403).json({
          status: 'Failure',
          message: 'You do not have access!!!',
        });
      }
    } catch (error) {
      res.status(401).json({
        status: 'Failure',
        message: 'Invalid Token',
      });
    }
  });
