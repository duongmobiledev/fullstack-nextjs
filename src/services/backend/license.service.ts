import {
  IDailyLimit,
  ILicense,
  LicenseSchema,
  LICENSE_COLLECTION_NAME,
} from '@models/license.model';
import { DateTime } from 'luxon';
import { Model, model, Types } from 'mongoose';

class LicenseService {
  private licenseModel: Model<ILicense, {}, {}, {}, any>;

  constructor() {
    this.licenseModel = model<ILicense>(LICENSE_COLLECTION_NAME, LicenseSchema);
  }

  async upsert({
    userId,
    dailyLimit,
    expirationTimestamp,
    packageId,
    serviceId,
    invoiceId,
  }: {
    userId: string;
    serviceId: string;
    packageId: string;
    expirationTimestamp: number; // UNIX
    dailyLimit?: IDailyLimit;
    invoiceId?: string;
  }) {
    let license = await this.licenseModel.findOne({
      service: new Types.ObjectId(serviceId),
      user: new Types.ObjectId(userId),
    });
    if (!license) {
      license = new this.licenseModel();
    }
    license.user = new Types.ObjectId(userId);
    license.service = new Types.ObjectId(serviceId);
    license.package = new Types.ObjectId(packageId);
    license.expirationTimestamp = expirationTimestamp;
    license.dailyLimit = dailyLimit || {
      createAudienceLimit: 10,
      libraryLimit: 2,
      suggestedAudienceLimit: 2,
    };

    if (invoiceId) license.invoice = new Types.ObjectId(invoiceId);

    await license.save();

    return await this.licenseModel.findOne({
      service: new Types.ObjectId(serviceId),
      user: new Types.ObjectId(userId),
    });
  }

  async updateLimit({
    userId,
    dailyLimit,
    serviceId,
    isReset,
  }: {
    userId: string;
    serviceId: string;
    dailyLimit?: IDailyLimit;
    isReset?: boolean;
  }) {
    let license = await this.licenseModel.findOne({
      service: new Types.ObjectId(serviceId),
      user: new Types.ObjectId(userId),
    });
    if (!license) {
      throw Error('License is not exist!!');
    }
    license.user = new Types.ObjectId(userId);
    license.dailyLimit = dailyLimit || {
      createAudienceLimit: 10,
      libraryLimit: 2,
      suggestedAudienceLimit: 2,
    };

    if (isReset) {
      license.lastResetDailyLimitTimestamp = DateTime.now().toUnixInteger();
    }

    await license.save();

    return await this.licenseModel.findOne({
      service: new Types.ObjectId(serviceId),
      user: new Types.ObjectId(userId),
    });
  }

  async save({
    serviceId,
    userId,
    expirationTimestamp,
    dailyLimit,
    packageId,
    invoiceId,
  }: {
    userId: string;
    serviceId: string;
    expirationTimestamp: number;
    packageId: string;
    dailyLimit?: {
      createAudienceLimit?: number;
      libraryLimit?: number;
      suggestedAudienceLimit?: number;
    };
    invoiceId?: string;
  }) {
    const newLicense: ILicense = {
      expirationTimestamp,
      service: new Types.ObjectId(serviceId),
      user: new Types.ObjectId(userId),
      package: new Types.ObjectId(packageId),
      dailyLimit,
      invoice: new Types.ObjectId(invoiceId),
    };
    return await this.licenseModel.insertMany([newLicense]);
  }

  async getLicenseByAccountIdNService(userId: string, serviceId: string) {
    try {
      return await this.licenseModel
        .findOne({
          service: serviceId,
          user: userId,
        })
        .populate([
          { path: 'user', select: 'email' },
          { path: 'service' },
          { path: 'package', populate: ['packageFeature'] },
          {
            path: 'invoice',
            populate: [
              {
                path: 'package',
                populate: ['packageFeature'],
              },
            ],
          },
        ])
        .exec();
    } catch (error) {
      return null;
    }
  }

  async getAllLicenses() {
    return await this.licenseModel
      .find({})
      .populate([
        { path: 'service', select: 'name' },
        { path: 'user', select: 'email' },
        { path: 'package', select: ['_id', 'name'] },
      ])
      .exec();
  }

  async getLicenseById(_id: string) {
    return await this.licenseModel
      .findById(_id)
      .populate([
        { path: 'service' },
        { path: 'user', select: 'email' },
        { path: 'package', populate: ['packageFeature'] },
        {
          path: 'invoice',
          populate: [
            {
              path: 'package',
              populate: ['packageFeature'],
            },
          ],
        },
      ])
      .exec();
  }

  async getLicenseByUserId({
    userId,
    limit,
    offset,
  }: {
    userId: string;
    limit: number;
    offset: number;
  }) {
    const items = await this.licenseModel
      .find(
        {
          user: new Types.ObjectId(userId),
        },
        {},
        {
          limit,
          skip: offset,
        }
      )
      .populate([
        { path: 'service' },
        { path: 'user', select: 'email' },
        { path: 'package', populate: ['packageFeature'] },
        {
          path: 'invoice',
          populate: [
            {
              path: 'package',
              populate: ['packageFeature'],
            },
          ],
        },
      ])
      .exec();
    const total = await this.licenseModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .count();
    return { items, total };
  }

  async updateExpirationTimestamp(_id: string, expirationTimestamp: number) {
    return await this.licenseModel.updateOne(
      { _id },
      { $set: { expirationTimestamp } }
    );
  }

  async update(_id: string, newLicense: Partial<ILicense>) {
    return await this.licenseModel.updateOne(
      { _id },
      { $set: { ...newLicense } }
    );
  }
}

export default LicenseService;
