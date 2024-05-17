import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { WithdrawalRequestService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { withdrawRequestId } = req.query;

      const withdrawalRequestService = new WithdrawalRequestService();

      const withdrawRequest = await withdrawalRequestService.getWithdrawReqById(
        withdrawRequestId as string
      );
      res.json(generateRes('Success', 'nice!!', withdrawRequest));
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
