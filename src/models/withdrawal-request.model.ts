import mongoose, { Types } from 'mongoose';

import { AFFILIATE_COLLECTION_NAME } from './affiliate.model';

const Schema = mongoose.Schema;

export const WITHDRAW_REQUEST_COLLECTION_NAME = 'withdrawalRequest';

export enum EWithdrawalStatus {
  PROCESSING = 'processing',
  DONE = 'done',
  FAIL = 'failed',
}

export interface IWithdrawalRequest {
  affiliate: Types.ObjectId;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  facebookLink: string;
  amount: number;
  status: EWithdrawalStatus;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    affiliate: { type: Schema.Types.ObjectId, ref: AFFILIATE_COLLECTION_NAME },
    bankName: { type: String, required: true },
    bankAccountNumber: { type: String, required: true },
    bankAccountName: { type: String, required: true },
    facebookLink: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['processing', 'done', 'failed'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { WithdrawalRequestSchema };
