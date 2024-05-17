import mongoose, { Types } from 'mongoose';

import { INVOICE_COLLECTION_NAME } from './invoice.model';
import { USER_COLLECTION_NAME } from './user.model';

const Schema = mongoose.Schema;

export const AFFILIATE_COLLECTION_NAME = 'affiliates';

export enum EAffiliateDiscount {
  INIT = 0.1,
  BEGINNER = 0.2,
  INTERMEDIATE = 0.4,
  ADVANCED = 0.5,
}

export enum EAffiliateDiscountPoint {
  BEGINNER = 0,
  INTERMEDIATE = 1000000,
  ADVANCED = 50000000,
}

export interface IAffiliate {
  user: Types.ObjectId;
  discount: number;
  discountCommission: number;
  isPartner: boolean;
  withdraw: number;
  invoices?: Types.ObjectId[];
}

const AffiliateSchema = new Schema<IAffiliate>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
      unique: true,
    },
    discount: { type: Number, required: true },
    discountCommission: { type: Number, require: true },
    isPartner: { type: Boolean, require: true },
    withdraw: { type: Number, require: true },
    invoices: [
      {
        type: Schema.Types.ObjectId,
        ref: INVOICE_COLLECTION_NAME,
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { AffiliateSchema };
