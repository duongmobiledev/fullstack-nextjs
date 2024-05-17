import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PACKAGE_FEATURE_COLLECTION_NAME = 'packageFeatures';

export interface IPackageFeature {
  name: string;
  description?: string;
}

const PackageFeatureSchema = new Schema<IPackageFeature>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { PackageFeatureSchema };
