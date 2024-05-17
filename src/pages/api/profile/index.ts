import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userService = new UserService();
      const email = req.email;
      const user = await userService.findByEmail(email);

      res.json(generateRes('Success', 'nice!!', user));
    } catch (error) {
      res.status(404).json(generateRes('Failure', error, null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyToken(controller);
export default handler;
