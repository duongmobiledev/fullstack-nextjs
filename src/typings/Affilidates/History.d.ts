export interface IDataHistoryWithDraw {
  items: IHistoryWithDraw[];
  total: number;
}
export interface IHistoryWithDraw {
  _id?: string;
  affiliate?: IAffiliate;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  facebookLink?: string;
  amount?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IAffiliate {
  _id?: string;
  user?: IUser;
  discount?: number;
  commissionDiscount?: number;
  isPartner?: boolean;
  withdraw?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IUser {
  _id?: string;
  email?: string;
}

export interface IRequestHistory {
  offset: number;
  limit: number;
}
