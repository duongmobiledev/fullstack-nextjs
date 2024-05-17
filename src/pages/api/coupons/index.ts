import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { CouponService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const couponService = new CouponService();

      const coupons = await couponService.getCoupons();

      res.json(generateRes('Success', 'nice!!', coupons));
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
