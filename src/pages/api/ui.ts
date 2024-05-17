import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { corsMiddleware } from '@common/utils/backend/middlewares/cors.middleware';

import { UiService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const uiService = new UiService();

      const result = await uiService.getUi();

      res.status(200).json(generateRes('Success', 'Nice!!', result));
    } catch (error) {
      res.status(200).json(generateRes('Success', 'Nice!!', null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = corsMiddleware(controller);

export default handler;
