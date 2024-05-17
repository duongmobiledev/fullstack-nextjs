import { IWithdrawalRequest } from '@models/withdrawal-request.model';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { AffiliateService, UserService } from '@services/backend';
import WithdrawalRequestService from '@services/backend/withdraw-request.service';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req;

      const userService = new UserService();
      const affiliateService = new AffiliateService();
      const withdrawalRequestService = new WithdrawalRequestService();

      const user = await userService.findByEmail(email);
      const affiliate = await affiliateService.getAffiliateByUserId(
        user._id.toString()
      );
      const result =
        await withdrawalRequestService.checkHasOnProcessingWithdraw(
          affiliate._id.toString()
        );

      res.json(generateRes('Success', 'Nice!!', { result }));
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
