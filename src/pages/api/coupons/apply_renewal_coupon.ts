import { DateTime } from 'luxon';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import {
  CouponService,
  LicenseService,
  PackageService,
  UserService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { serviceId, code } = req.body;
      const email = req.email;

      const couponService = new CouponService();
      const userService = new UserService();
      const packageService = new PackageService();
      const user = await userService.findByEmail(email);
      const isValid = await couponService.checkValidRenewalCoupon(
        code,
        serviceId,
        user._id.toString()
      );

      if (isValid) {
        const userService = new UserService();
        const user = await userService.findByEmail(email);
        const coupon = await couponService.getOriginCouponByCode(code);

        const extraTimestamp = coupon.value.extraTimestamp || 0;
        const licenseService = new LicenseService();

        const userId = user._id.toString();
        const oldLicense = await licenseService.getLicenseByAccountIdNService(
          userId,
          serviceId
        );

        if (oldLicense) {
          const expirationTimestamp =
            Math.max(
              oldLicense.expirationTimestamp,
              DateTime.now().toUnixInteger()
            ) + extraTimestamp;

          if (oldLicense.package.equals(coupon.value.package)) {
            await licenseService.updateExpirationTimestamp(
              oldLicense._id.toString(),
              expirationTimestamp
            );
          } else {
            res.json(
              generateRes('Failure', '...!!', {
                isNotSamePackage: true,
              })
            );
            return;
          }
        } else {
          const expirationTimestamp =
            DateTime.now().toUnixInteger() + extraTimestamp;

          const packageId = coupon.value.package.toString();
          const dailyLimit = await packageService.getDailyLimit(packageId);
          await licenseService.save({
            expirationTimestamp,
            serviceId,
            userId,
            packageId,
            dailyLimit,
          });
        }

        await couponService.applyRenewalCoupon(code, user._id);

        const newLicense = await licenseService.getLicenseByAccountIdNService(
          userId,
          serviceId
        );

        res.json(generateRes('Success', 'nice!!', newLicense));
      } else {
        res.status(400).json(generateRes('Failure', 'invalid_coupon', null));
      }
    } catch (error) {
      res.status(500).end(generateRes('Failure', error, null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyToken(controller);

export default handler;
