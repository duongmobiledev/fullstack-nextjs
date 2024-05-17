import { CouponType } from '@models/coupon.model';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { CouponService, UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { code, serviceId } = req.query;
    const { email } = req;
    if (code) {
      let isValid = false;
      let error: string = '';
      let coupon: CouponType | null = null;
      const couponService = new CouponService();
      const userService = new UserService();
      try {
        const user = await userService.findByEmail(email);
        isValid = await couponService.checkValidPromoCoupon(
          code as string,
          serviceId as string,
          user._id.toString()
        );
        coupon = await couponService.getOriginCouponByCode(code as string);
      } catch (err) {
        error = JSON.stringify(err);
      }
      res.json(generateRes('Success', 'nice!!', { isValid, coupon, error }));
    } else {
      res
        .status(400)
        .json(generateRes('Failure', 'Pass code coupon...please', null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyToken(controller);

export default handler;
