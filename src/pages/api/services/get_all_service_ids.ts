import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';

import { ServiceService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const serviceService = new ServiceService();

      const serviceIds = await serviceService.getAllServiceId();

      res.json(generateRes('Success', 'nice!!', serviceIds));
    } catch (error) {
      res.status(404).json(generateRes('Failure', error, null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

export default controller;
