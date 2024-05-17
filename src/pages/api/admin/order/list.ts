import { EInvoiceStatus, IInvoice } from '@models/invoice.model';
import { IUser } from '@models/user.model';
import e from 'cors';
import _ from 'lodash';
import { Document, FilterQuery, Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { InvoiceService, UserService } from '@services/backend';

enum EInvoiceKeyFilter {
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  ORDER_ID = 'orderId',
}

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const {
        key,
        value: valueQuery,
        limit: limitParams,
        offset: offsetParams,
      } = req.query;
      const invoiceService = new InvoiceService();
      const userService = new UserService();

      const filter: FilterQuery<IInvoice> = {};

      const value = valueQuery as string;

      let user: Document<unknown, any, IUser> &
        IUser & {
          _id: Types.ObjectId;
        };

      switch (key) {
        case EInvoiceKeyFilter.EMAIL:
          user = await userService.findByEmail(value);
          filter.user = user._id;
          break;
        case EInvoiceKeyFilter.PHONE_NUMBER:
          user = await userService.findByPhoneNumber(value);
          filter.user = user._id;

          break;
        case EInvoiceKeyFilter.ORDER_ID:
          filter.orderId = new Types.ObjectId(value);
          break;
        default:
          break;
      }

      const limit = Number(limitParams || 20);
      const offset = Number(offsetParams || 0);

      const result = await invoiceService.getInvoiceAdmin({
        filter,
        limit,
        offset,
      });

      res.status(200).json(generateRes('Success', 'Nice!!', result));
    } catch (error) {
      res
        .status(200)
        .json(generateRes('Success', 'Nice!!', { items: [], total: 0 }));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
