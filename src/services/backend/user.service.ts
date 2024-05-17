import {
  ETypeNotification,
  IUser,
  UserSchema,
  USER_COLLECTION_NAME,
} from '@models/user.model';
import { FilterQuery, Model, model } from 'mongoose';

import { genAccountId } from '@common/utils/backend';

class UserService {
  private userModel: Model<IUser, {}, {}, {}, any>;

  constructor() {
    this.userModel = model<IUser>(USER_COLLECTION_NAME, UserSchema);
  }

  async saveNewUser(
    email: string,
    refreshToken: string,
    referrer?: number,
    isAdmin?: boolean
  ) {
    const isExist = await this.checkIsExist(email);
    if (!isExist) {
      let isCheck = true;
      let accountId: number;
      while (isCheck) {
        const newAccountId = genAccountId();
        isCheck = await this.checkIsExistAccountId(newAccountId);
        if (!isCheck) {
          accountId = newAccountId;
        }
      }
      const newUser: IUser = {
        accountId,
        email,
        refreshToken,
        isAdmin: isAdmin || false,
        referrer: referrer || null,
        notifications: [
          { typeNotification: ETypeNotification.INVOICES, value: false },
          { typeNotification: ETypeNotification.PROMOTIONS, value: false },
          { typeNotification: ETypeNotification.UPDATE, value: false },
        ],
      };
      const user = new this.userModel(newUser);
      return await user.save();
    }
    throw 'Account is exist!!!';
  }

  async getUsersByReferrer({
    limit,
    referrer,
    offset,
  }: {
    referrer: number;
    limit: number;
    offset: number;
  }) {
    const items = await this.userModel
      .find(
        { referrer },
        {
          refreshToken: 0,
          address: 0,
          bankAccountName: 0,
          bankAccountNumber: 0,
          bankName: 0,
          city: 0,
          country: 0,
          isAdmin: 0,
          state: 0,
          zipCode: 0,
          notifications: 0,
        },
        {
          limit,
          skip: offset,
        }
      )
      .exec();
    const total = await this.userModel.find({ referrer }).count();
    return { items, total };
  }

  async getTotalUsersByReferrer(referrer: number) {
    return await this.userModel.find({ referrer }).count();
  }
  async findById(_id: string) {
    return await this.userModel.findById(_id).exec();
  }

  async findByAccountId(accountId: number) {
    return await this.userModel.findOne({ accountId }).exec();
  }

  async findByRefreshToken(refreshToken: string) {
    return await this.userModel.findOne({ refreshToken }).exec();
  }

  async checkIsExist(email: string) {
    const res = await this.userModel.exists({ email }).exec();
    return !!res;
  }

  async checkIsExistAccountId(accountId: number) {
    const res = await this.userModel.exists({ accountId }).exec();
    return !!res;
  }

  async checkIsExistRefreshToken(refreshToken: string) {
    const res = await this.userModel.exists({ refreshToken }).exec();
    return !!res;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async getUserAdmin({
    filter,
    limit,
    offset,
  }: {
    filter: FilterQuery<IUser>;
    limit: number;
    offset: number;
  }) {
    const items = await this.userModel
      .find(
        filter,
        {
          refreshToken: 0,
          address: 0,
          bankAccountName: 0,
          bankAccountNumber: 0,
          bankName: 0,
          city: 0,
          country: 0,
          state: 0,
          zipCode: 0,
          notifications: 0,
        },
        { limit, skip: offset }
      )
      .sort({ created_at: -1 })
      .exec();
    const total = await this.userModel.find(filter).count();
    return { items, total };
  }

  async findByRegexPhoneEmailToSuggestion({
    regex,
    key,
    limit,
    offset,
  }: {
    regex: RegExp;
    key: 'email' | 'phoneNumber' | 'displayName';
    limit: number;
    offset: number;
  }) {
    try {
      const res = await this.userModel
        .find({ [key]: regex }, { [key]: 1 }, { limit, skip: offset })
        .exec();
      return res.map((item) => item[key]);
    } catch {
      return [];
    }
  }

  async findByRegexEmailAdminToSuggestion({
    regex,
    limit,
    offset,
  }: {
    regex: RegExp;
    limit: number;
    offset: number;
  }) {
    try {
      const res = await this.userModel
        .find(
          { email: regex, isAdmin: true },
          { email: 1 },
          { limit, skip: offset }
        )
        .exec();
      return res.map((item) => item.email);
    } catch {
      return [];
    }
  }

  async findByRegexAccountIdReferrerToSuggestion({
    regex,
    key,
    limit,
    offset,
  }: {
    regex: RegExp;
    key: 'accountId' | 'referrer';
    limit: number;
    offset: number;
  }) {
    try {
      const query = {
        $expr: {
          $regexMatch: {
            input: { $toString: `$${key}` },
            regex,
          },
        },
      };

      const res = await this.userModel
        .find(
          query,
          { [key]: 1 },
          {
            limit,
            skip: offset,
          }
        )
        .exec();
      return res.map((item) => item[key]);
    } catch (error) {
      return [];
    }
  }

  async findByPhoneNumber(phoneNumber: string) {
    return await this.userModel.findOne({ phoneNumber }).exec();
  }

  async updateRefreshTokenByEmail(email: string, refreshToken: string) {
    const res = await this.userModel.exists({ email }).exec();
    if (res) {
      await this.userModel
        .updateOne({ email }, { $set: { refreshToken } })
        .exec();
    } else {
      throw { message: "can't not find your email....." };
    }
  }

  async updateUserByEmail(
    email: string,
    infoNewUser: Partial<
      Omit<
        IUser,
        '_id' | 'email' | 'balance' | 'accountId' | 'created_at' | 'updated_at'
      >
    >
  ) {
    try {
      await this.userModel.updateOne({ email }, { $set: infoNewUser }).exec();

      return await this.findByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async updateUserById(
    id: string,
    infoNewUser: Partial<
      Omit<
        IUser,
        '_id' | 'email' | 'balance' | 'accountId' | 'created_at' | 'updated_at'
      >
    >
  ) {
    try {
      await this.userModel.findByIdAndUpdate(id, { $set: infoNewUser }).exec();

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
