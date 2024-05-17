import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import {
  AffiliateService,
  InvoiceService,
  UserService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { email } = req;
      const { limit: limitParams, offset: offsetParams } = req.query;
      const userService = new UserService();
      const invoiceService = new InvoiceService();
      const affiliateService = new AffiliateService();

      const user = await userService.findByEmail(email);

      const affiliate = await affiliateService.getAffiliateByUserId(
        user._id.toString()
      );

      const ids = affiliate.invoices.map((item) => item._id.toString());

      const limit = Number(limitParams || 20);
      const offset = Number(offsetParams || 0);

      const result = await invoiceService.getInvoicesByReferrer({
        limit,
        offset,
        ids,
        accountId: user.accountId,
      });

      res.json(generateRes('Success', 'nice!!', result));
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
