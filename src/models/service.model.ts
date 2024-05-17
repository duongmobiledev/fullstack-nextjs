import mongoose, { Types } from 'mongoose';

import { PACKAGE_COLLECTION_NAME } from './package.model';

const Schema = mongoose.Schema;

export const SERVICE_COLLECTION_NAME = 'services';

export interface IService {
  name: string;
  description: string;
  price: number;
  packages: Types.ObjectId[];
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    packages: [{ type: Schema.Types.ObjectId, ref: PACKAGE_COLLECTION_NAME }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { ServiceSchema };
