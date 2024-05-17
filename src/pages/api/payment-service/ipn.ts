import { EInvoiceStatus } from '@models/invoice.model';
import { IUser } from '@models/user.model';
import { DateTime } from 'luxon';
import type { NextApiRequest, NextApiResponse } from 'next';

import { EAffiliateDiscount } from '@common/enum';
import { generateRes } from '@common/utils/backend';

import {
  AffiliateService,
  InvoiceService,
  LicenseService,
  OnePayDomestic,
  PackageService,
  UserService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = req.query;

      const userService = new UserService();
      const invoiceService = new InvoiceService();
      const licenseService = new LicenseService();
      const packageService = new PackageService();
      const affiliateService = new AffiliateService();
      const onePay = new OnePayDomestic(OnePayDomestic.TEST_CONFIG);

      const verify = await onePay.verifyReturnUrl(response);

      const invoice = await invoiceService.getInvoiceByOrderId(verify.orderId);

      const userId = invoice.user._id.toString();
      const serviceId = invoice.service._id.toString();
      const isFirstOrder = await invoiceService.isFirstUserInvoice(userId);

      const status = verify.isSuccess
        ? EInvoiceStatus.SUCCESS
        : EInvoiceStatus.FAILURE;

      const userRefCodeDiscount = isFirstOrder
        ? 0
        : invoice.userRefCodeDiscount;

      const x = isFirstOrder ? 0 : EAffiliateDiscount.INIT;
      const referrerDiscount = invoice.referrerDiscount - x;

      await invoiceService.updateInvoice(verify.orderId, {
        status,
        message: verify.message,
        txnResponseCode: verify.responseCode,
        userRefCodeDiscount,
        referrerDiscount,
      });

      let licenseId = null;
      let orderId = null;

      if (verify.isSuccess) {
        let userRefCodeId: string | undefined = undefined;
        if (invoice?.userRefCode) {
          const userRefCode = await userService.findByAccountId(
            invoice.userRefCode
          );
          userRefCodeId = userRefCode?._id?.toString();
        }

        let referrerId: string | undefined = undefined;
        if (invoice?.referrerCode) {
          const referrer = await userService.findByAccountId(
            invoice.referrerCode
          );
          referrerId = referrer?._id?.toString();
        }

        await affiliateService.updateCommissionDiscount({
          referrerId,
          amount: invoice.amount,
          userRefCodeId,
          isFirstOrder,
          invoiceId: invoice?._id?.toString(),
        });

        const oldLicense = await licenseService.getLicenseByAccountIdNService(
          userId,
          serviceId
        );

        const numberOfMonths = invoice.numberOfMonths || 0;
        const numberOfMonthsUpgrade = invoice.numberOfMonthsUpgrade || 0;

        const invoiceId = await invoiceService.getInvoiceIdByOrderId(
          verify.orderId
        );

        if (oldLicense) {
          const months = invoice.isUpgrade
            ? numberOfMonthsUpgrade
            : numberOfMonths;

          const expirationTimestamp = DateTime.fromSeconds(
            oldLicense.expirationTimestamp
          )
            .plus({
              months,
            })
            .toUnixInteger();

          await licenseService.update(oldLicense.id, {
            expirationTimestamp,
            invoice: invoiceId,
            package: invoice.package,
          });
          licenseId = oldLicense._id.toString();
        } else {
          const expirationTimestamp = DateTime.now()
            .plus({
              months: numberOfMonths,
            })
            .toUnixInteger();

          const packageId = invoice.package._id.toString();

          const dailyLimit = await packageService.getDailyLimit(packageId);

          const result = await licenseService.save({
            expirationTimestamp,
            serviceId,
            userId,
            packageId,
            dailyLimit,
            invoiceId: invoiceId.toString(),
          });
          licenseId = result[0]._id.toString();
        }
      } else {
        orderId = verify.orderId;
      }
    } catch (error) {
      console.error('ipn error', error);
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

export default controller;
