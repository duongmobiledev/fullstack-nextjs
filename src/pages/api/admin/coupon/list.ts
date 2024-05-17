import { CouponType } from '@models/coupon.model';
import { FilterQuery } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { CouponService, UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const {
        couponCode,
        limit: limitParams,
        offset: offsetParams,
      } = req.query;
      const couponService = new CouponService();

      const filter: FilterQuery<CouponType> = {};

      if (couponCode.length !== 0) {
        filter.code = couponCode;
      }

      const limit = Number(limitParams || 20);
      const offset = Number(offsetParams || 0);

      const result = await couponService.getCouponsAdmin({
        filter,
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
