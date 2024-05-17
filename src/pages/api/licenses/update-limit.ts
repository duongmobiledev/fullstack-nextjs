import { IDailyLimit } from '@models/license.model';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { bootAPI } from '@common/utils/backend/middlewares';

import { LicenseService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, serviceId, dailyLimit } = req.body as {
        userId: string;
        serviceId: string;
        dailyLimit: IDailyLimit;
      };

      const licenseService = new LicenseService();

      if (dailyLimit && serviceId && userId) {
        const license = await licenseService.updateLimit({
          serviceId,
          dailyLimit,
          userId,
        });
        res.status(200).json(
          generateRes('Success', 'Nice!!', {
            dailyLimit: license.dailyLimit,
          })
        );
      } else {
        res
          .status(400)
          .json(
            generateRes('Failure', 'serviceId, dailyLimit, userId are require!')
          );
      }
    } catch (error) {
      res.status(400).json(generateRes('Failure', 'Somethings wrong!!', error));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = bootAPI(controller);

export default handler;
