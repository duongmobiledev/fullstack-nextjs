import { IWithdrawalRequest } from '@models/withdrawal-request.model';
import { FilterQuery, Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import {
  AffiliateService,
  UserService,
  WithdrawalRequestService,
} from '@services/backend';

enum EAffiliateKeyFilter {
  EMAIL = 'email',
  ID_WR = 'withdrawalRequestId',
}

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const {
        key,
        value: valueQuery,
        limit: limitParams,
        offset: offsetParams,
      } = req.query as {
        key: EAffiliateKeyFilter;
        value: string;
        offset?: string;
        limit?: string;
      };
      const userService = new UserService();
      const affiliateService = new AffiliateService();
      const withdrawalRequestService = new WithdrawalRequestService();

      const value = valueQuery as string;

      const filter: FilterQuery<IWithdrawalRequest> = {};

      switch (key) {
        case EAffiliateKeyFilter.EMAIL:
          const user = await userService.findByEmail(value);
          const affiliate = await affiliateService.getAffiliateByUserId(
            user._id.toString()
          );
          filter.affiliate = affiliate._id;
          break;
        case EAffiliateKeyFilter.ID_WR:
          filter._id = new Types.ObjectId(value);
          break;
        default:
          break;
      }

      const limit = Number(limitParams || 20);
      const offset = Number(offsetParams || 0);

      const result =
        await withdrawalRequestService.getAllWithdrawalRequestAdmin({
          filter,
          limit,
          offset,
        });

      res.status(200).json(generateRes('Success', 'Nice!!', result));
    } catch (error) {
      res
        .status(200)
        .json(generateRes('Success', 'Hmm!!', { items: [], total: 0 }));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
