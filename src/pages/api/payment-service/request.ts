import { EAffiliateDiscount, IAffiliate } from '@models/affiliate.model';
import {
  EInvoiceLanguage,
  EInvoiceStatus,
  IInvoice,
} from '@models/invoice.model';
import { IUser } from '@models/user.model';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import {
  AffiliateService,
  CouponService,
  InvoiceService,
  OnePayCheckoutPayload,
  OnePayDomestic,
  ServiceService,
  UserService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        serviceId,
        amount,
        packageId,
        numberOfMonths,
        numberOfMonthsUpgrade,
        couponCode,
        isSupport1v1,
        isUpgrade,
        userRefCode,
      } = req.body;
      const email = req.email;

      const userService = new UserService();
      const serviceService = new ServiceService();
      const invoiceService = new InvoiceService();
      const couponService = new CouponService();
      const affiliateService = new AffiliateService();

      const service = await serviceService.getServiceById(serviceId);

      const user = await userService.findByEmail(email);

      let referrer: IUser | undefined = undefined;
      if (user.referrer) {
        try {
          referrer = await userService.findByAccountId(user.referrer);
        } catch (error) {
          referrer = undefined;
        }
      }

      let userRef: IUser | undefined = undefined;
      if (userRefCode) {
        try {
          userRef = await userService.findByAccountId(userRefCode);
        } catch (error) {
          userRef = undefined;
        }
      }

      const clientIp = req.socket.localAddress;

      const merchTxnRef = `ASV_${DateTime.now().toUnixInteger()}`;
      const orderId = new Types.ObjectId().toString();

      if (couponCode) {
        await couponService.applyPromoCoupon(couponCode, user._id);
      }

      let affiliateReferrer: IAffiliate | undefined = undefined;
      if (referrer) {
        try {
          affiliateReferrer = await affiliateService.getAffiliateByUserId(
            //@ts-ignore
            referrer._id.toString()
          );
        } catch (error) {
          affiliateReferrer = undefined;
        }
      }

      const invoice: IInvoice = {
        amount: amount,
        locale: EInvoiceLanguage.VI,
        merchTxnRef: [merchTxnRef],
        message: '_',
        orderId,
        user: user._id,
        package: new Types.ObjectId(packageId),
        service: new Types.ObjectId(serviceId),
        status: EInvoiceStatus.PENDING,
        txnResponseCode: '_',
        currencyCode: 'VND',
        couponCode,
        numberOfMonths,
        numberOfMonthsUpgrade,
        isSupport1v1,
        isUpgrade,
        referrerCode: user.referrer,
        userRefCode: userRef?.accountId,
        referrerDiscount:
          affiliateReferrer?.discount || EAffiliateDiscount.BEGINNER,
        userRefCodeDiscount: userRef ? EAffiliateDiscount.INIT : 0,
      };

      await invoiceService.insertInvoice(invoice);

      const payload: OnePayCheckoutPayload = {
        againLink: process.env.NEXT_PUBLIC_HOST,
        amount: amount,
        clientIp,
        customerEmail: email.substring(0, 24),
        customerId: user._id.toString(),
        customerPhone: user.phoneNumber,
        orderId,
        returnUrl: `${process.env.NEXT_PUBLIC_URL_API}/payment-service/response`,
        ipnUrl: `${process.env.NEXT_PUBLIC_URL_API}/payment-service/ipn`,
        title: service.name,
        transactionId: merchTxnRef,
      };

      const onePay = new OnePayDomestic(OnePayDomestic.TEST_CONFIG);

      const link = await onePay.buildCheckoutUrl(payload);

      res.json(generateRes('Success', 'nice!!', { link }));
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
