import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { CouponService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { couponCode } = req.query;
      const couponService = new CouponService();

      if (couponCode.length !== 0) {
        const result = await couponService.getByRegexCodeToSuggestion({
          limit: 10,
          offset: 0,
          regex: RegExp(`^${couponCode}`, 'i'),
        });

        res.status(200).json(generateRes('Success', 'Nice!!', result));
        return;
      } else {
        res.status(200).json(generateRes('Success', 'Nice!!', []));
      }
    } catch (error) {
      res.status(200).json(generateRes('Success', 'Nice!!', []));
      throw error;
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
