import { EInvoiceStatus } from '@models/invoice.model';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { InvoiceService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { orderId } = req.body;

      const invoiceService = new InvoiceService();

      const invoice = await invoiceService.getInvoiceByOrderId(orderId);
      if (invoice.status !== EInvoiceStatus.PENDING) {
        res
          .status(400)
          .json(generateRes('Failure', 'Only transmit pending orders!!', null));
        return;
      }

      await invoiceService.updateInvoice(orderId, {
        status: EInvoiceStatus.CANCEL,
      });

      invoice.status = EInvoiceStatus.CANCEL;

      res.json(generateRes('Success', 'nice!!', invoice));
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
