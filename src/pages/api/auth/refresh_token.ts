import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { checkBody } from '@common/utils/backend/middlewares';
import { RefreshTokenBodySchema } from '@common/utils/backend/validations';

import { MAX_AGE_ACCESS_TOKEN, ROLE_SCOPE } from '@constants/backend';

import { JWTService, UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const userService = new UserService();

      const user = await userService.findByRefreshToken(req.body.refreshToken);

      const scope = user.isAdmin ? ROLE_SCOPE.ADMIN : ROLE_SCOPE.USER;

      const accessToken = JWTService.createJWT(
        scope,
        user.email,
        MAX_AGE_ACCESS_TOKEN
      );

      res.status(200).json(generateRes('Success', 'nice!!', { accessToken }));
    } catch (error) {
      res
        .status(200)
        .json(generateRes('Failure', 'Refresh token not found!', null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}
const handler = checkBody(controller, RefreshTokenBodySchema);
export default handler;
