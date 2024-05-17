import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyToken } from '@common/utils/backend/middlewares';

import { PackageService, ServiceService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { serviceId } = req.query;
      const serviceService = new ServiceService();

      const serviceDetail = await serviceService.getServiceById(
        serviceId as string
      );

      const ids = serviceDetail.packages.map((item) => item._id.toString());

      const packageService = new PackageService();

      let packagesResult = await packageService.getPackagesByIds(ids);

      const resultTableObject: Record<
        string,
        { name: string } | Record<string, boolean>
      > = {};

      packagesResult.forEach((item) => {
        item.packageFeature.forEach((feature) => {
          const oldValue = resultTableObject[feature._id.toString()]
            ? resultTableObject[feature._id.toString()]
            : {};
          const newValue = { ...oldValue, name: feature.name };
          newValue[item._id] = true;
          resultTableObject[feature._id.toString()] = newValue;
        });
      });
      const packages = packagesResult.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        level: item.level,
      }));

      const contentTable = Object.values(resultTableObject);
      res.json(
        generateRes('Success', 'nice!!', {
          packages,
          contentTable,
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
