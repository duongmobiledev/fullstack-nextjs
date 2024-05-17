import mongoose, { Types } from 'mongoose';

import { INVOICE_COLLECTION_NAME } from './invoice.model';
import { PACKAGE_COLLECTION_NAME } from './package.model';
import { SERVICE_COLLECTION_NAME } from './service.model';
import { USER_COLLECTION_NAME } from './user.model';

const Schema = mongoose.Schema;

export const LICENSE_COLLECTION_NAME = 'licenses';

export interface IDailyLimit {
  suggestedAudienceLimit?: number;
  createAudienceLimit?: number;
  libraryLimit?: number;
}
export interface ILicense {
  user: Types.ObjectId;
  service: Types.ObjectId;
  invoice?: Types.ObjectId;
  package?: Types.ObjectId;
  expirationTimestamp: number; // UNIX
  lastResetDailyLimitTimestamp?: number; // UNIX
  dailyLimit?: IDailyLimit;
}

const LicenseSchema = new Schema<ILicense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: SERVICE_COLLECTION_NAME,
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: PACKAGE_COLLECTION_NAME,
      required: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: INVOICE_COLLECTION_NAME,
      required: false,
    },
    expirationTimestamp: { type: Number, required: true },
    lastResetDailyLimitTimestamp: { type: Number, required: false },
    dailyLimit: {
      suggestedAudienceLimit: { type: Number, required: false },
      createAudienceLimit: { type: Number, required: false },
      libraryLimit: { type: Number, required: false },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { LicenseSchema };
