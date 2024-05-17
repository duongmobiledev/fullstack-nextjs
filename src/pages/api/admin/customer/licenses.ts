import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { LicenseService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId, limit: limitParams, offset: offsetParams } = req.query;

      const licenseService = new LicenseService();

      const limit = Number(limitParams || 20);
      const offset = Number(offsetParams || 0);

      const result = await licenseService.getLicenseByUserId({
        userId: userId as string,
        limit,
        offset,
      });
      res.status(200).json(generateRes('Success', 'Nice!!', result));
    } catch (error) {
      res
        .status(200)
        .json(generateRes('Success', 'Nice!!', { items: [], total: 0 }));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
