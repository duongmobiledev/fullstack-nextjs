import { EWithdrawalStatus } from '@models/withdrawal-request.model';
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import {
  AffiliateService,
  ManagementHistoryService,
  UserService,
  WithdrawalRequestService,
} from '@services/backend';
import { EAminAction } from '@services/backend/management-history.service';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req;

      const { withdrawalRequestId, status } = req.body as {
        withdrawalRequestId: string;
        status: string;
      };

      const withdrawalRequestService = new WithdrawalRequestService();
      const userService = new UserService();
      const managementHistoryService = new ManagementHistoryService();

      const withdraw = await withdrawalRequestService.getWithdrawReqById(
        withdrawalRequestId
      );
      if (
        status === EWithdrawalStatus.DONE &&
        withdraw.status !== EWithdrawalStatus.DONE
      ) {
        const affiliateService = new AffiliateService();

        await affiliateService.updateWithdrawByUserId({
          //@ts-ignore
          userId: withdraw.affiliate.user._id.toString(),
          withdraw: withdraw.amount,
        });
      }

      const admin = await userService.findByEmail(email);

      await managementHistoryService.insertAction([
        {
          admin: admin._id.toString(),
          type: EAminAction.EDIT_STATUS_WITHDRAWAL_REQUEST,
          withdrawalRequestStatus: status,
          //@ts-ignore
          email: withdraw.affiliate.user.email,
        },
      ]);

      const result =
        await withdrawalRequestService.changeStatusWithdrawalRequest({
          withdrawalRequestId,
          status,
        });

      res.status(200).json(generateRes('Success', 'Nice!!', result));
    } catch (error) {
      res.status(400).json(generateRes('Failure', error, null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
