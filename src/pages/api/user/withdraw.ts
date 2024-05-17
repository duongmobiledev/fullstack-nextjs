import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import {
  AffiliateService,
  UserService,
  WithdrawalRequestService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req;

      const {
        amount,
        bankAccountName,
        bankAccountNumber,
        bankName,
        facebookLink,
      } = req.body;

      const userService = new UserService();
      const affiliateService = new AffiliateService();
      const withdrawalRequestService = new WithdrawalRequestService();

      const user = await userService.findByEmail(email);
      const affiliate = await affiliateService.getAffiliateByUserId(
        user._id.toString()
      );

      const onProcessing =
        await withdrawalRequestService.checkHasOnProcessingWithdraw(
          affiliate._id.toString()
        );
      if (onProcessing) {
        res.json(generateRes('Failure', 'On Processing!!', { result: false }));
      } else {
        const balance =
          affiliate.discountCommission - (affiliate.withdraw || 0);
        if (amount) {
          if (balance >= amount) {
            const withdrawRequest =
              await withdrawalRequestService.createWithdrawRequest({
                affiliate: affiliate._id.toString(),
                amount,
                bankAccountName,
                bankAccountNumber,
                bankName,
                facebookLink,
              });
            res.json(
              generateRes('Success', 'Nice!!', {
                result: true,
                withdrawRequest,
              })
            );
          } else {
            res.json(
              generateRes('Failure', 'Not enough balance!!', { result: false })
            );
          }
        } else {
          res.json(
            generateRes('Failure', 'Pass params please!!', { result: false })
          );
        }
      }
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
