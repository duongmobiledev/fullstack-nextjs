import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { WithdrawalRequestService } from '@services/backend';

enum EAffiliateKeyFilter {
  EMAIL = 'email',
  ID_WR = 'withdrawalRequestId',
}

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { key, value: valueQuery } = req.query as {
        key: EAffiliateKeyFilter;
        value: string;
      };
      const withdrawalRequestService = new WithdrawalRequestService();

      const value = valueQuery as string;

      if (value.length !== 0) {
        let result: string[];
        switch (key) {
          case EAffiliateKeyFilter.EMAIL:
            result = await withdrawalRequestService.getSuggestionEmail({
              limit: 10,
              value,
            });
            break;
          case EAffiliateKeyFilter.ID_WR:
            result = await withdrawalRequestService.getSuggestionId({
              value,
              limit: 10,
              offset: 0,
            });
            break;

          default:
            break;
        }
        res.status(200).json(generateRes('Success', 'Nice!!', result));
      } else {
        res.status(200).json(generateRes('Success', 'Nice!!', []));
      }
    } catch (error) {
      res.status(200).json(generateRes('Success', 'Nice!!', []));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
