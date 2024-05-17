import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { ServiceService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { name, offset: offsetParam, limit: limitParam } = req.query;

      const limit = Number(limitParam || 10);
      const offset = Number(offsetParam || 0);

      const serviceService = new ServiceService();
      const result = await serviceService.getServicesByName({
        name: name as string,
        limit,
        offset,
      });
      res.json(generateRes('Success', 'nice!!', result));
    } catch (error) {
      res
        .status(200)
        .json(generateRes('Success', 'nice!!', { items: [], total: 0 }));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyToken(controller);
export default handler;
