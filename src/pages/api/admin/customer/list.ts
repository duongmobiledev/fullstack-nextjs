import { IAffiliate } from '@models/affiliate.model';
import { IUser } from '@models/user.model';
import { FilterQuery } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { AffiliateService, UserService } from '@services/backend';

enum EUserKeyFilter {
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  DISPLAY_NAME = 'displayName',
  ACCOUNT_ID = 'accountId',
  REFERRER = 'referrer',
}

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const {
        key,
        value: valueQuery,
        limit: limitParams,
        offset: offsetParams,
      } = req.query as {
        key: EUserKeyFilter;
        value: string;
        limit: string;
        offset: string;
      };
      const userService = new UserService();
      const affiliateService = new AffiliateService();

      const value = valueQuery as string;

      const filter: FilterQuery<IUser> = {};
      switch (key) {
        case EUserKeyFilter.DISPLAY_NAME:
        case EUserKeyFilter.EMAIL:
        case EUserKeyFilter.PHONE_NUMBER:
          filter[key] = value;
          break;
        case EUserKeyFilter.ACCOUNT_ID:
        case EUserKeyFilter.REFERRER:
          filter[key] = Number(value);
          break;
        default:
          break;
      }

      const limit = Number(limitParams || 20);
      const offset = Number(offsetParams || 0);

      const users = await userService.getUserAdmin({
        filter,
        limit,
        offset,
      });

      const affiliatePromises = [];

      users.items.forEach((item) => {
        affiliatePromises.push(
          affiliateService.getAffiliateByUserId(item?._id.toString())
        );
      });

      const refCountPromise = [];
      users.items.forEach((item) => {
        refCountPromise.push(
          userService.getTotalUsersByReferrer(item?.accountId)
        );
      });

      const affiliates: IAffiliate[] = await Promise.all(affiliatePromises);
      const refCounts: number[] = await Promise.all(refCountPromise);

      const items = users?.items.map((item, index) => {
        const balance =
          (affiliates[index]?.discountCommission || 0) -
          (affiliates[index]?.withdraw || 0);
        return {
          //@ts-ignore
          user: item._doc,
          balance,
          discount: affiliates[index]?.discount || 0,
          refCount: refCounts[index] || 0,
        };
      });
      res.status(200).json(
        generateRes('Success', 'Nice!!', {
          items: items,
          total: users.total,
        })
      );
      return;
    } catch (error) {
      res.status(200).json(
        generateRes(
          'Success',
          'Nice!!',
          generateRes('Success', 'Nice!!', {
            items: [],
            total: 0,
          })
        )
      );
      throw error;
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
