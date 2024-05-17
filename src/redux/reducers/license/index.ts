import produce from 'immer';
import { AnyAction } from 'redux';

import * as types from '@redux/types/license';

import {
  IPackage,
  IPackageAll,
  IPackagePage,
  IPaymentRespon,
  IInvoiceResponse,
} from '@typings';

interface IAuthState {
  packages: IPackage[];
  packagePages: IPackagePage | null;
  paymentRes: IPaymentRespon | null;
  packageAll: IPackageAll[] | [];
  loadingPayment: boolean;
  invoice: IInvoiceResponse | null;
}

const initialState: IAuthState = {
  packages: [],
  packagePages: null,
  paymentRes: null,
  packageAll: [],
  loadingPayment: false,
  invoice: null,
};

const licenseReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_PACKAGE_PAGE_SUCCESS:
        draft.packagePages = action.payload;
        break;
      case types.PAYMENT_RESPON:
        draft.paymentRes = action.payload;
        break;
      case types.LOADING_PAYMENT:
        draft.loadingPayment = action.payload;
        break;
      case types.GET_PACKAGE_ALL_SUCCESS:
        draft.packageAll = action.payload;
        break;
      case types.GET_MY_INVOICE_BY_SERVICE_SUCCESS:
        draft.invoice = action.payload;
        break;
    }
  });

export default licenseReducer;
