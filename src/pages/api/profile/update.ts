import { IUser } from '@models/user.model';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { checkBody, verifyToken } from '@common/utils/backend/middlewares';
import { UpdateUserBodySchema } from '@common/utils/backend/validations';

import { UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const userService = new UserService();
      const user = req.body as IUser;
      const newInfoUser = _.omit(user, [
        'refreshToken',
        'accountId',
        'email',
        'isAdmin',
        'balance',
        'referrer',
        'created_at',
        'updated_at',
      ]);
      const email = req.email;
      const result = await userService.updateUserByEmail(email, newInfoUser);
      res.json(generateRes('Success', 'nice!!', result));
    } catch (error) {
      res.status(404).json(generateRes('Failure', error, null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyToken(checkBody(controller, UpdateUserBodySchema));
export default handler;
