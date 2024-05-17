import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { ServiceService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { offset: offsetParam, limit: limitParam } = req.query;

      const limit = Number(limitParam || 20);
      const offset = Number(offsetParam || 0);

      const serviceService = new ServiceService();

      const items = await serviceService.getServices({ limit, offset });

      const total = await serviceService.getTotalService();
      res.json(generateRes('Success', 'nice!!', { items, total }));
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
