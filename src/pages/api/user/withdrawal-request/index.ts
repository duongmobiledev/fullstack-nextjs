import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import {
  AffiliateService,
  UserService,
  WithdrawalRequestService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req;
      const { offset: offsetParam, limit: limitParam } = req.query;
      const affiliateService = new AffiliateService();
      const userService = new UserService();
      const withdrawalRequestService = new WithdrawalRequestService();

      const user = await userService.findByEmail(email);

      const affiliate = await affiliateService.getAffiliateByUserId(
        user._id.toString()
      );

      const offset = Number(offsetParam || '0');
      const limit = Number(limitParam || '20');

      const result =
        await withdrawalRequestService.getWithdrawRequestsByAffiliate({
          affiliateId: affiliate._id.toString(),
          limit,
          offset,
        });

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

const handler = verifyToken(controller);

export default handler;
