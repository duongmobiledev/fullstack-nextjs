import { createContext } from 'react';

import { IGender, ICountry, INotification } from '@typings';

export interface INotificationCheckbox {
  update: boolean;
  invoices: boolean;
  promotions: boolean;
}
interface IProfileContext {
  reset: boolean;
  onReset: () => void;
  error: string;
  gender: IGender;
  onChangeGender: (gender: IGender) => void;
  country: ICountry;
  onChangeCountry: (country: ICountry) => void;
  notify: INotification[];
  onChangeNotify: (notify: INotification) => void;
}

export const ProfileContext = createContext<IProfileContext>(
  {} as IProfileContext
);
