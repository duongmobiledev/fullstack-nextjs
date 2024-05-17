import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { ManagementHistoryService, UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query as {
        email: string;
      };
      const managementHistoryService = new ManagementHistoryService();

      if (email.length !== 0) {
        const result = await managementHistoryService.getEmailsSuggestion({
          limit: 10,
          value: email,
        });

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
