import mongoose, { Types } from 'mongoose';

import { PACKAGE_COLLECTION_NAME } from './package.model';
import { SERVICE_COLLECTION_NAME } from './service.model';

const Schema = mongoose.Schema;

export const COUPON_COLLECTION_NAME = 'coupons';

export enum ECouponType {
  RENEWAL = 'renewal',
  PROMO = 'promo',
}
export enum EPromotionType {
  PRICE = 'price',
  PERCENT = 'percent',
}

type CouponValueNType =
  | {
      type: ECouponType.RENEWAL;
      value: {
        extraTimestamp: number; // seconds
        package: Types.ObjectId | string;
        dailyLimit: number;
        price?: undefined;
        percent?: undefined;
        discountBy?: undefined;
      };
    }
  | {
      type: ECouponType.PROMO;
      value: {
        percent: number;
        discountBy: EPromotionType.PERCENT;
        dailyLimit?: undefined;
        extraTimestamp?: undefined;
        package?: undefined;
        price?: undefined;
      };
    }
  | {
      type: ECouponType.PROMO;
      value: {
        discountBy: EPromotionType.PRICE;
        price: number;
        dailyLimit?: number;
        extraTimestamp?: undefined;
        package?: undefined;
        percent?: undefined;
      };
    };

export type CouponInputType = {
  code: string;
  services: string[];
  validUntil: number; // UNIX
  limit: number;
} & CouponValueNType;

export type CouponType = {
  code: string;
  users: Types.ObjectId[];
  services: Types.ObjectId[];
  status: boolean;
  validUntil: number; // UNIX
  used: number;
  limit: number;
} & CouponValueNType;

const CouponSchema = new Schema<CouponType>(
  {
    code: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, required: true }],
    services: [{ type: Schema.Types.ObjectId, ref: SERVICE_COLLECTION_NAME }],
    type: {
      type: String,
      enum: ['renewal', 'promo'],
      required: true,
    },
    status: { type: Boolean, required: true },
    validUntil: { type: Number, required: true },
    used: { type: Number, required: true },
    limit: { type: Number, required: true },
    value: {
      extraTimestamp: { type: Number, required: false },
      package: {
        type: Schema.Types.ObjectId,
        ref: PACKAGE_COLLECTION_NAME,
        required: false,
      },
      price: { type: Number, required: false },
      dailyLimit: { type: Number, required: false },
      percent: { type: Number, required: false },
      discountBy: { type: String, enum: ['price', 'percent'], required: false },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { CouponSchema };
