import { EAffiliateDiscount } from '@models/affiliate.model';
import {
  EInvoiceLanguage,
  EInvoiceStatus,
  IInvoice,
} from '@models/invoice.model';
import { concat } from 'lodash';
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
      const { orderId } = req.body;
      const email = req.email;

      const userService = new UserService();
      const serviceService = new ServiceService();
      const invoiceService = new InvoiceService();

      const invoice = await invoiceService.getInvoiceByOrderId(orderId);
      if (invoice.status !== EInvoiceStatus.PENDING) {
        res
          .status(400)
          .json(generateRes('Failure', 'Only transmit pending orders!!', null));
        return;
      }
      const service = await serviceService.getServiceById(
        invoice.service._id.toString()
      );

      const user = await userService.findByEmail(email);

      const clientIp = req.socket.localAddress;

      const merchTxnRef = `ASV_${DateTime.now().toUnixInteger()}`;

      await invoiceService.updateInvoice(orderId, {
        merchTxnRef: concat(invoice.merchTxnRef, merchTxnRef),
      });

      const payload: OnePayCheckoutPayload = {
        againLink: process.env.NEXT_PUBLIC_HOST,
        amount: invoice.amount,
        clientIp,
        customerEmail: email.substring(0, 24),
        customerId: user._id.toString(),
        customerPhone: user.phoneNumber,
        orderId,
        returnUrl: `${process.env.NEXT_PUBLIC_URL_API}/payment-service/response`,
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
