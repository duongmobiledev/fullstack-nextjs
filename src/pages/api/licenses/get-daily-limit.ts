import { DateTime } from 'luxon';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { bootAPI } from '@common/utils/backend/middlewares';

import { LicenseService, PackageService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId, serviceId } = req.query as {
        userId: string;
        serviceId: string;
      };

      const licenseService = new LicenseService();
      const packageService = new PackageService();

      let license = await licenseService.getLicenseByAccountIdNService(
        userId as string,
        serviceId as string
      );

      const defaultDailyLimit = await packageService.getDailyLimit(
        license.package._id.toString()
      );

      const resetDailyLimit = () =>
        licenseService.updateLimit({
          serviceId,
          userId,
          dailyLimit: defaultDailyLimit,
          isReset: true,
        });

      if (!license.lastResetDailyLimitTimestamp) {
        license = await resetDailyLimit();
      } else {
        if (
          !DateTime.fromSeconds(license.lastResetDailyLimitTimestamp).hasSame(
            DateTime.now(),
            'day'
          )
        ) {
          license = await resetDailyLimit();
        }
      }

      res.status(200).json(
        generateRes('Success', 'Nice!!', {
          dailyLimit: license.dailyLimit,
        })
      );
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
