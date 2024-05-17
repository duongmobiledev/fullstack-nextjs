import { setCookie } from 'cookies-next';
import dns from 'dns';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { checkBody } from '@common/utils/backend/middlewares';
import { RequestLoginBodySchema } from '@common/utils/backend/validations';

import { MAX_AGE_LOGIN_TOKEN, ROLE_SCOPE } from '@constants/backend';

import {
  JWTService,
  NodemailerService,
  RecaptchaService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    body: { email: mail, callback_url },
  } = req;

  const email = mail?.toLowerCase() || mail;

  if (method === 'POST') {
    const recaptchaService = new RecaptchaService(
      req.body['g-recaptcha-response']
    );
    const checkRecaptcha = await recaptchaService.verify();
    if (checkRecaptcha.success) {
      const hostMail = email.split('@')[1];
      const callback = async (err: NodeJS.ErrnoException) => {
        if (!err) {
          try {
            const loginToken = JWTService.createJWT(
              ROLE_SCOPE.READ_ONLY,
              email,
              MAX_AGE_LOGIN_TOKEN
            );
            const callback = (err: Error) => {
              if (err) {
                res.status(500).json(generateRes('Failure', err.message, null));
              } else {
                res.json(
                  generateRes('Success', `Sent mail to ${req.body.email}`, {
                    loginToken,
                  })
                );
              }
            };

            const ref = req.body.ref as number;
            if (ref) {
              setCookie('referrer', ref.toString(), {
                maxAge: MAX_AGE_LOGIN_TOKEN,
                req,
                res,
              });
            }

            const callbackUrl = callback_url
              ? `&callback_url=${callback_url}`
              : '';

            NodemailerService.sendMailTo(
              {
                subject: 'LINK LOGIN ASV PASSPORT',
                text: process.env.MAGIC_LINK + loginToken + callbackUrl,
                to: email,
              },
              callback
            );
          } catch (error) {
            res
              .status(500)
              .json(generateRes('Failure', 'Sever exception....', error));
          }
        } else {
          res
            .status(400)
            .json(generateRes('Failure', 'Your email invalid', null));
        }
      };
      dns.resolveMx(hostMail, callback);
    } else {
      res.status(403).json(generateRes('Failure', 'You is not a human', null));
    }
  } else {
    res
      .status(405)
      .end(generateRes('Failure', `Method ${method} Not Allowed`, null));
  }
}

const handler = checkBody(controller, RequestLoginBodySchema);
export default handler;
