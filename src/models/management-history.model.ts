import mongoose, { Types } from 'mongoose';

import { USER_COLLECTION_NAME } from './user.model';

const Schema = mongoose.Schema;

export const MANAGEMENT_HISTORY_COLLECTION_NAME = 'managementHistory';

export interface IManagementHistory {
  user: Types.ObjectId;
  action: string;
  metadata?: string;
}

const ManagementSchema = new Schema<IManagementHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    action: { type: String, required: true },
    metadata: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { ManagementSchema };
