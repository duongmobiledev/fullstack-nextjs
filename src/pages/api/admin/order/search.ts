import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { InvoiceService } from '@services/backend';

enum EInvoiceKeyFilter {
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  ORDER_ID = 'orderId',
}

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { key, value: valueQuery } = req.query;
      const invoiceService = new InvoiceService();

      const value = valueQuery as string;

      if (value.length !== 0) {
        const limit = 10;
        switch (key) {
          case EInvoiceKeyFilter.EMAIL:
          case EInvoiceKeyFilter.PHONE_NUMBER:
            const result = await invoiceService.getEmailOrPhoneToSuggestion({
              type: key,
              limit,
              value,
            });
            res.status(200).json(generateRes('Success', 'Nice!!', result));
            return;
          case EInvoiceKeyFilter.ORDER_ID:
            const resultOrderId =
              await invoiceService.getByOrderIdRegexToSuggestion({
                limit,
                offset: 0,
                regex: RegExp(`^${value}`, 'i'),
              });
            res
              .status(200)
              .json(generateRes('Success', 'Nice!!', resultOrderId));
            return;
          default:
            res.status(200).json(generateRes('Success', 'Nice!!', []));
            return;
        }
      } else {
        res.status(200).json(generateRes('Success', 'Nice!!', []));
      }
      return;
    } catch (error) {
      res.status(200).json(generateRes('Success', 'Nice!!', []));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
