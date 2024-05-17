import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { LicenseService, ServiceService, UserService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const email = req.email;

      const serviceService = new ServiceService();
      const userService = new UserService();
      const licenseService = new LicenseService();

      const service = await serviceService.getServiceById(id as string);

      const user = await userService.findByEmail(email);
      let license = null;

      try {
        license = await licenseService.getLicenseByAccountIdNService(
          user._id.toString(),
          id as string
        );
      } catch (error) {}

      res.json(
        generateRes('Success', 'nice!!', {
          _id: service._id.toString(),
          name: service.name,
          description: service.description,
          price: service.price,
          packages: service.packages,
          license: license
            ? {
                _id: license?._id?.toString(),
                expirationTimestamp: license?.expirationTimestamp,
                dailyLimit: license?.dailyLimit,
                user: license?.user,
                numberOfMonths: license.invoice?.numberOfMonths,
                package: license?.package,
                isSupport1v1: license.invoice?.isSupport1v1,
              }
            : null,
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
