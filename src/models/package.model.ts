import mongoose, { Types } from 'mongoose';

import { PACKAGE_FEATURE_COLLECTION_NAME } from './pack-feature.model';

const Schema = mongoose.Schema;

export const PACKAGE_COLLECTION_NAME = 'packages';

export interface IPackage {
  name: string;
  price: number;
  packageFeature: Types.ObjectId[];
  level: number;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    packageFeature: [
      { type: Schema.Types.ObjectId, ref: PACKAGE_FEATURE_COLLECTION_NAME },
    ],
    level: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { PackageSchema };
