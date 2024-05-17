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
      const affiliateService = new AffiliateService();
      const userService = new UserService();
      const invoiceService = new InvoiceService();

      const user = await userService.findByEmail(email);
      const affiliate = await affiliateService.getAffiliateByUserId(
        user._id.toString()
      );

      const discountCommission = affiliate.discountCommission;
      const balance = discountCommission - (affiliate.withdraw || 0);
      const discount = affiliate.discount;

      const usersPagination = await userService.getUsersByReferrer({
        limit: 10,
        offset: 0,
        referrer: user.accountId,
      });

      const ids = affiliate.invoices.map((item) => item._id.toString());

      const invoicesPagination = await invoiceService.getInvoicesByReferrer({
        limit: 10,
        offset: 0,
        ids,
        accountId: user.accountId,
      });

      res.json(
        generateRes('Success', 'nice!!', {
          linkRef: `${process.env.NEXT_PUBLIC_HOST}?ref=${user.accountId}`,
          discountCommission,
          balance,
          discount,
          users: usersPagination.items,
          invoices: invoicesPagination.items,
        })
      );
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
