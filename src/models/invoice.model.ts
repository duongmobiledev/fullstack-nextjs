import mongoose, { Types } from 'mongoose';

import { PACKAGE_COLLECTION_NAME } from './package.model';
import { SERVICE_COLLECTION_NAME } from './service.model';
import { USER_COLLECTION_NAME } from './user.model';

const Schema = mongoose.Schema;

export const INVOICE_COLLECTION_NAME = 'invoices';

export enum EInvoiceStatus {
  PENDING = 'pending',
  FAILURE = 'failure',
  SUCCESS = 'success',
  CANCEL = 'cancel',
}

export enum EInvoiceLanguage {
  VI = 'vn',
  EN = 'en',
}

export interface IInvoice {
  orderId: string;
  service: Types.ObjectId;
  package: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  status: EInvoiceStatus;
  merchTxnRef: string[];
  locale: EInvoiceLanguage;
  currencyCode?: 'VND';
  txnResponseCode: string;
  message: string;
  numberOfMonths: number;
  referrerCode?: number;
  userRefCode?: number;
  couponCode?: string;
  referrerDiscount: number;
  userRefCodeDiscount?: number;
  numberOfMonthsUpgrade?: number;
  isSupport1v1?: boolean;
  isUpgrade?: boolean;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    orderId: { type: String, required: true, unique: true },
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
    user: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'failure', 'success', 'cancel'],
      required: true,
    },
    amount: { type: Number, required: true },
    numberOfMonths: { type: Number, required: true },
    numberOfMonthsUpgrade: { type: Number, required: false },
    merchTxnRef: [{ type: String, required: true }],
    currencyCode: { type: String, required: true },
    locale: { type: String, enum: ['vn', 'en'], required: true },
    message: { type: String, required: true },
    txnResponseCode: { type: String, required: true },
    isSupport1v1: { type: Boolean, required: false },
    isUpgrade: { type: Boolean, required: false },
    referrerCode: { type: Number, required: false },
    userRefCode: { type: Number, required: false },
    couponCode: { type: String, required: false },
    referrerDiscount: { type: Number, required: true },
    userRefCodeDiscount: { type: Number, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { InvoiceSchema };
