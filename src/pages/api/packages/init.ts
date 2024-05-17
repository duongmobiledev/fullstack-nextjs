import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';

import { PackageService } from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const packageService = new PackageService();

      let packages = await packageService.getPackages();

      if (packages.length === 0) {
        await packageService.initPackage();
        packages = await packageService.getPackages();
      }

      res.json(generateRes('Success', 'nice!!', packages));
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
