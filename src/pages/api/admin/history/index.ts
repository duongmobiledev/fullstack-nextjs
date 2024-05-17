import { IManagementHistory } from '@models/management-history.model';
import { DateTime } from 'luxon';
import { FilterQuery } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { ManagementHistoryService, UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const {
        email,
        fromDate,
        toDate,
        limit: limitParams,
        offset: offsetParams,
      } = req.query;

      const userService = new UserService();

      const managementHistoryService = new ManagementHistoryService();

      const filter: FilterQuery<IManagementHistory> = {};

      if (email) {
        const user = await userService.findByEmail(email as string);
        filter.user = user._id;
      }

      if (fromDate && toDate) {
        filter.created_at = {
          $gte: DateTime.fromSeconds(Number(fromDate as string)).toISO(),
          $lt: DateTime.fromSeconds(Number(toDate as string)).toISO(),
        };
      }

      const limit = Number(limitParams || 20);
      const offset = Number(offsetParams || 0);
      const result = await managementHistoryService.getManagementHistory({
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
