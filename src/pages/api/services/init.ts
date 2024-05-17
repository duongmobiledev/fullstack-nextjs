import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';

import { PackageService, ServiceService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const serviceService = new ServiceService();

      const packageService = new PackageService();

      let packages = await packageService.getPackages();

      if (packages.length === 0) {
        await packageService.initPackage();
        packages = await packageService.getPackages();
      }

      let services = await serviceService.getServices({
        limit: 100,
        offset: 0,
      });

      if (services.length === 0) {
        services = await serviceService.initService(
          packages.map((item) => item._id)
        );
      }

      res.json(generateRes('Success', 'nice!!', services));
    } catch (error) {
      res.status(404).json(generateRes('Failure', error, null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

export default controller;
