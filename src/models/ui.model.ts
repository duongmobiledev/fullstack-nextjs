import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UI_COLLECTION_NAME = 'ui';

export interface IUi {
  serviceBannerUri?: string;
  serviceBannerPath?: string;
}

const UiSchema = new Schema<IUi>(
  {
    serviceBannerPath: { type: String },
    serviceBannerUri: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { UiSchema };
