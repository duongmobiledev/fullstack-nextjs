import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const USER_COLLECTION_NAME = 'users';

export enum ETypeNotification {
  UPDATE = 'updates',
  INVOICES = 'invoices',
  PROMOTIONS = 'promotions',
}
export enum EGender {
  FEMALE = 0,
  MALE = 1,
}

export interface IUser {
  accountId: number;
  email: string;
  refreshToken: string;
  isAdmin?: boolean;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  facebookLink?: string;
  displayName?: string;
  phoneNumber?: string;
  gender?: EGender;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notifications?: {
    typeNotification?: ETypeNotification;
    value?: boolean;
  }[];
  referrer?: number;
}

const UserSchema = new Schema<IUser>(
  {
    accountId: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: false },
    bankAccountName: { type: String, required: false },
    facebookLink: { type: String, required: false },
    bankName: { type: String, required: false },
    bankAccountNumber: { type: String, required: false },
    displayName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    gender: { type: Number, enum: [0, 1], required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
    notifications: [
      {
        typeNotification: {
          type: String,
          enum: ['updates', 'invoices', 'promotions'],
        },
        value: Boolean,
      },
    ],
    referrer: { type: Number, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

export { UserSchema };
