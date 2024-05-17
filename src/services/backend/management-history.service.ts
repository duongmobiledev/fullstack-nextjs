import {
  IManagementHistory,
  MANAGEMENT_HISTORY_COLLECTION_NAME,
  ManagementSchema,
} from '@models/management-history.model';
import { FilterQuery, Model, model, Types } from 'mongoose';

export enum EAminAction {
  EDIT_IS_ADMIN_CUSTOMER = 'EDIT_IS_ADMIN_CUSTOMER',
  EDIT_DISCOUNT_CUSTOMER = 'EDIT_DISCOUNT_CUSTOMER',
  EDIT_PHONE_CUSTOMER = 'EDIT_PHONE_CUSTOMER',
  EDIT_NAME_CUSTOMER = 'EDIT_NAME_CUSTOMER',
  EDIT_LICENSE_CUSTOMER = 'EDIT_LICENSE_CUSTOMER',
  CREATE_COUPON = 'CREATE_COUPON',
  EDIT_STATUS_WITHDRAWAL_REQUEST = 'EDIT_STATUS_WITHDRAWAL_REQUEST',
  UPLOAD_BANNER = 'UPLOAD_BANNER',
}

export type InsertAdminAction =
  | {
      type:
        | EAminAction.EDIT_DISCOUNT_CUSTOMER
        | EAminAction.EDIT_LICENSE_CUSTOMER
        | EAminAction.EDIT_NAME_CUSTOMER
        | EAminAction.EDIT_PHONE_CUSTOMER;
      couponCode?: undefined;
      isAdmin?: undefined;
      email: string;
      admin: string;
      withdrawalRequestStatus?: undefined;
    }
  | {
      type: EAminAction.EDIT_IS_ADMIN_CUSTOMER;
      couponCode?: undefined;
      isAdmin: boolean;
      email: string;
      admin: string;
      withdrawalRequestStatus?: undefined;
    }
  | {
      type: EAminAction.CREATE_COUPON;
      email?: undefined;
      isAdmin?: undefined;
      couponCode: string;
      admin: string;
      withdrawalRequestStatus?: undefined;
    }
  | {
      type: EAminAction.EDIT_STATUS_WITHDRAWAL_REQUEST;
      email: string;
      isAdmin?: undefined;
      couponCode?: undefined;
      admin: string;
      withdrawalRequestStatus: string;
    }
  | {
      type: EAminAction.UPLOAD_BANNER;
      email?: undefined;
      isAdmin?: undefined;
      couponCode?: undefined;
      admin: string;
      withdrawalRequestStatus?: undefined;
    };

class ManagementHistoryService {
  private managementHistoryModel: Model<IManagementHistory, {}, {}, {}, any>;

  constructor() {
    this.managementHistoryModel = model<IManagementHistory>(
      MANAGEMENT_HISTORY_COLLECTION_NAME,
      ManagementSchema
    );
  }

  private createAction({
    type,
    admin,
    couponCode,
    email,
    isAdmin,
    withdrawalRequestStatus,
  }: InsertAdminAction): IManagementHistory {
    let action = '';
    switch (type) {
      case EAminAction.EDIT_DISCOUNT_CUSTOMER:
        action = `Chỉnh sửa % chiết khấu của ${email}`;
        break;
      case EAminAction.EDIT_PHONE_CUSTOMER:
        action = `Chỉnh sửa số điện thoại của ${email}`;
        break;
      case EAminAction.EDIT_IS_ADMIN_CUSTOMER:
        if (isAdmin) {
          action = `Cấp quyền admin cho ${email}`;
        } else {
          action = `Xoá quyền admin của ${email}`;
        }
        break;
      case EAminAction.EDIT_NAME_CUSTOMER:
        action = `Chỉnh sửa tên của ${email}`;
        break;
      case EAminAction.EDIT_LICENSE_CUSTOMER:
        action = `Chỉnh sửa bản quyền của ${email}`;
        break;
      case EAminAction.CREATE_COUPON:
        action = `Tạo coupon ${couponCode}`;
        break;
      case EAminAction.EDIT_STATUS_WITHDRAWAL_REQUEST:
        action = `Chỉnh sửa trạng thái yêu cầu rút tiền của ${email} thành ${withdrawalRequestStatus}`;
        break;
      case EAminAction.UPLOAD_BANNER:
        action = `Chỉnh sửa banner`;
        break;
      default:
        break;
    }
    const user = new Types.ObjectId(admin);
    return { action, user };
  }

  async insertAction(actions: InsertAdminAction[]) {
    const managementHistories = actions.map((item) => this.createAction(item));
    await this.managementHistoryModel.insertMany(managementHistories);
  }

  async getManagementHistory({
    filter,
    limit,
    offset,
  }: {
    filter: FilterQuery<IManagementHistory>;
    offset: number;
    limit: number;
  }) {
    const items = await this.managementHistoryModel
      .find(filter, {}, { limit, skip: offset })
      .sort({ created_at: -1 })
      .populate([{ path: 'user', select: 'email' }])
      .exec();
    const total = await this.managementHistoryModel.find(filter).count();
    return { items, total };
  }

  async getEmailsSuggestion({
    value,
    limit,
  }: {
    value: string;
    limit: number;
  }) {
    const regex = RegExp(`^${value}`, `i`);
    const res = await this.managementHistoryModel
      .find({}, { user: 1 })
      .populate([{ path: 'user', match: { email: regex } }])
      .exec();

    const results = [];

    res.forEach((item) => {
      const user = item.user;
      if (user) {
        const value = item.user['email'];
        if (value && results.length < limit && !results.includes(value)) {
          results.push(value);
        }
      }
    });

    return results;
  }
}

export default ManagementHistoryService;
