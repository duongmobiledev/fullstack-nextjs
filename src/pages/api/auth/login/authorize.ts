import { deleteCookie, getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes, genRefreshToken } from '@common/utils/backend';
import { checkBody } from '@common/utils/backend/middlewares';
import { LoginBodySchema } from '@common/utils/backend/validations';

import { ADMIN_WHITE_LIST } from '@constants/backend';

import { AffiliateService, JWTService, UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { loginToken } = req.body;
      const { sub } = JWTService.verify(loginToken);

      const email = sub.toLowerCase();
      const userService = new UserService();
      const affiliateService = new AffiliateService();

      const isExist = await userService.checkIsExist(email);

      let refreshToken: string;

      let isCheck = true;
      while (isCheck) {
        const newRefreshToken = genRefreshToken();
        isCheck = await userService.checkIsExistRefreshToken(newRefreshToken);
        if (!isCheck) {
          refreshToken = newRefreshToken;
        }
      }

      if (isExist) {
        await userService.updateRefreshTokenByEmail(email, refreshToken);
      } else {
        const cookieReferrer = getCookie('referrer', { req, res });

        const referrer = cookieReferrer ? Number(cookieReferrer) : undefined;
        const isAdmin = ADMIN_WHITE_LIST.includes(email);
        const newUser = await userService.saveNewUser(
          email,
          refreshToken,
          referrer,
          isAdmin
        );
        deleteCookie('referrer', { req, res });

        await affiliateService.createAffiliate(newUser._id.toString());
      }
      res.json(
        generateRes('Success', 'nice!!', {
          refreshToken,
        })
      );
    } catch (error) {
      res
        .status(500)
        .json(generateRes('Failure', 'Sever exception....', error));
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const handler = checkBody(controller, LoginBodySchema);
export default handler;
