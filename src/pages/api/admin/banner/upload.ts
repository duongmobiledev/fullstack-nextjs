import formidable from 'formidable';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import {
  ManagementHistoryService,
  S3Service,
  UiService,
  UserService,
} from '@services/backend';
import { EAminAction } from '@services/backend/management-history.service';

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data: {
      err: any;
      fields: formidable.Fields;
      files: formidable.Files;
    } = await new Promise((resolve, reject) => {
      const form = formidable();

      form.parse(req, (err, fields, files) => {
        if (err) reject({ err });
        resolve({ err, fields, files });
      });
    });

    if (data.err) {
      res
        .status(400)
        .json(generateRes('Failure', 'body must use form-data !!!', null));
    } else {
      try {
        const file = data?.files?.file as formidable.File;
        if (file) {
          const userService = new UserService();
          const managementHistoryService = new ManagementHistoryService();
          const s3Service = new S3Service();
          const uiService = new UiService();

          const oldUi = await uiService.getUi();
          if (oldUi) {
            await s3Service.deleteFile(oldUi.serviceBannerPath);
          }

          const path = `banner/${file.originalFilename}`;
          const fileData = fs.createReadStream(file.filepath);

          const { Location } = await s3Service.uploadFile(fileData, path);
          const result = await uiService.upsertBanner(Location, path);

          fs.unlink(file.filepath, (err) => {
            if (err) {
              console.error('error upload banner...', err);
            }
          });

          const admin = await userService.findByEmail(req.email);
          await managementHistoryService.insertAction([
            {
              admin: admin._id.toString(),
              type: EAminAction.UPLOAD_BANNER,
            },
          ]);

          res.status(200).json(generateRes('Success', 'Nice!!', result));
        } else {
          res
            .status(400)
            .json(generateRes('Failure', 'Not found file!!!', null));
        }
      } catch (error) {
        res
          .status(400)
          .json(generateRes('Failure', 'Upload file fail!!!', null));
      }
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${req.method} Not Allowed`, null));
  }
}

const handler = verifyAdminToken(controller);

export default handler;
