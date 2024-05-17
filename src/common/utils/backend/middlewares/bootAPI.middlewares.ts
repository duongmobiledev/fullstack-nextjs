import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { DataService, JWTService, NodemailerService } from '@services/backend';

export const bootAPI =
  (controller: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    let isReady =
      JWTService.isReady && NodemailerService.isReady && DataService.isReady;

    if (!NodemailerService.isReady) {
      NodemailerService.initialize();
    }

    while (!isReady) {
      if (!JWTService.isReady) {
        JWTService.initialize();
      }
      if (!DataService.isReady) {
        await DataService.initialize();
      }

      console.log('---------------------------');
      console.log('JWTService.isReady', JWTService.isReady);
      console.log('NodemailerService.isReady', NodemailerService.isReady);
      console.log('DataService.isReady', DataService.isReady);
      console.log('---------------------------');

      isReady =
        JWTService.isReady && NodemailerService.isReady && DataService.isReady;
    }

    if (isReady) {
      controller(req, res);
    }
  };
