import {
  CouponInputType,
  CouponType,
  ECouponType,
  EPromotionType,
} from '@models/coupon.model';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import {
  CouponService,
  ManagementHistoryService,
  UserService,
} from '@services/backend';
import { EAminAction } from '@services/backend/management-history.service';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const couponService = new CouponService();
      const userService = new UserService();
      const managementHistoryService = new ManagementHistoryService();

      const couponInput = req.body as CouponInputType;
      // validate coupon input
      const checkBaseResult = await couponService.checkBaseInfoCoupon(
        couponInput
      );
      if (checkBaseResult.invalidCoupon) {
        res
          .status(200)
          .json(
            generateRes('Failure', 'Invalid coupon code!!', checkBaseResult)
          );
        return;
      } else {
        //create coupon by type coupon
        let newCoupon: CouponType = {} as CouponType;
        switch (couponInput.type) {
          case ECouponType.RENEWAL:
            newCoupon = await couponService.createRenewalCoupon(couponInput);
            break;
          case ECouponType.PROMO:
            if (couponInput.value.discountBy === EPromotionType.PERCENT) {
              newCoupon = await couponService.createPromoCouponDiscountPercent(
                couponInput
              );
            } else {
              newCoupon = await couponService.createPromoCouponDiscountPrice(
                couponInput
              );
            }
            break;
          default:
            break;
        }

        const admin = await userService.findByEmail(req.email);
        await managementHistoryService.insertAction([
          {
            admin: admin._id.toString(),
            type: EAminAction.CREATE_COUPON,
            couponCode: couponInput.code,
          },
        ]);
        res.status(200).json(
          generateRes('Success', 'Nice!!', {
            invalidCoupon: false,
            coupon: newCoupon,
          })
        );
        return;
      }
    } catch (error) {
      res
        .status(200)
        .json(generateRes('Failure', 'Check value coupon ....', error));
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
