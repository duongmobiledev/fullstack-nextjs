import { EAffiliateDiscount } from '@models/affiliate.model';
import { IDailyLimit } from '@models/license.model';
import { IUser } from '@models/user.model';
import type { NextApiRequest, NextApiResponse } from 'next';

import { generateRes } from '@common/utils/backend';
import { verifyAdminToken } from '@common/utils/backend/middlewares';

import {
  AffiliateService,
  EAminAction,
  InsertAdminAction,
  LicenseService,
  ManagementHistoryService,
  UserService,
} from '@services/backend';

async function controller(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, license, displayName, phoneNumber, discount, isAdmin } =
        req.body as {
          userId: string;
          displayName?: string;
          phoneNumber?: string;
          discount?: EAffiliateDiscount;
          isAdmin?: boolean;
          license?: {
            serviceId: string;
            packageId: string;
            expirationTimestamp: number; // UNIX
            dailyLimit?: IDailyLimit;
          };
        };

      const licenseService = new LicenseService();
      const userService = new UserService();
      const affiliateService = new AffiliateService();
      const managementHistoryService = new ManagementHistoryService();

      const adminActions: InsertAdminAction[] = [];
      const admin = await userService.findByEmail(req.email);
      const user = await userService.findById(userId);

      if (license) {
        await licenseService.upsert({ ...license, userId });
        adminActions.push({
          admin: admin._id.toString(),
          type: EAminAction.EDIT_LICENSE_CUSTOMER,
          email: user.email,
        });
      }

      if (discount) {
        await affiliateService.updateDiscountByUserId({
          discount,
          userId,
          isPartner: discount === EAffiliateDiscount.ADVANCED,
        });
        adminActions.push({
          admin: admin._id.toString(),
          type: EAminAction.EDIT_DISCOUNT_CUSTOMER,
          email: user.email,
        });
      }

      const paramNewUser: Partial<IUser> = {};

      if (isAdmin !== null && isAdmin !== undefined) {
        paramNewUser.isAdmin = isAdmin;
        if (isAdmin !== user.isAdmin) {
          adminActions.push({
            admin: admin._id.toString(),
            type: EAminAction.EDIT_IS_ADMIN_CUSTOMER,
            email: user.email,
            isAdmin,
          });
        }
      }
      if (displayName) {
        paramNewUser.displayName = displayName;
        if (user.displayName !== displayName) {
          adminActions.push({
            admin: admin._id.toString(),
            type: EAminAction.EDIT_NAME_CUSTOMER,
            email: user.email,
          });
        }
      }
      if (phoneNumber) {
        paramNewUser.phoneNumber = phoneNumber;
        if (user.phoneNumber !== phoneNumber) {
          adminActions.push({
            admin: admin._id.toString(),
            type: EAminAction.EDIT_PHONE_CUSTOMER,
            email: user.email,
          });
        }
      }

      await userService.updateUserById(userId, paramNewUser);

      await managementHistoryService.insertAction(adminActions);

      res.status(200).json(
        generateRes('Success', 'Nice!!', {
          success: true,
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

const handler = verifyAdminToken(controller);

export default handler;
