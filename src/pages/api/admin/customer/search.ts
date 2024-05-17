import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import { UserService } from '@services/backend';

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
      const { key, value: valueQuery } = req.query as {
        key: EUserKeyFilter;
        value: string;
      };
      const userService = new UserService();

      const value = valueQuery as string;

      if (value.length !== 0) {
        const arg = {
          limit: 10,
          offset: 0,
          regex: RegExp(`^${value}`, `i`),
        };
        let result: number[] | string[];
        switch (key) {
          case EUserKeyFilter.DISPLAY_NAME:
          case EUserKeyFilter.EMAIL:
          case EUserKeyFilter.PHONE_NUMBER:
            result = await userService.findByRegexPhoneEmailToSuggestion({
              key,
              ...arg,
            });
            break;
          case EUserKeyFilter.ACCOUNT_ID:
          case EUserKeyFilter.REFERRER:
            result = await userService.findByRegexAccountIdReferrerToSuggestion(
              {
                key,
                ...arg,
              }
            );
            break;

          default:
            break;
        }
        res.status(200).json(generateRes('Success', 'Nice!!', result));
      } else {
        res.status(200).json(generateRes('Success', 'Nice!!', []));
      }
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
