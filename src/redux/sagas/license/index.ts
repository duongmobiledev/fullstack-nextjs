import { all, takeLatest } from 'redux-saga/effects';

import * as types from '@redux/types/license';

import {
  getPackageAll,
  getPackagePage,
  payment,
  paymentAgain,
  getMyInvoiceByServiceSaga,
  cancelPaymentRequestSaga,
} from './license';

export default function* license() {
  yield all([
    takeLatest(types.GET_PACKAGE_PAGE, getPackagePage),
    takeLatest(types.PAYMENT, payment),
    takeLatest(types.GET_PACKAGE_ALL_REQUEST, getPackageAll),
    takeLatest(types.GET_MY_INVOICE_BY_SERVICE, getMyInvoiceByServiceSaga),
    takeLatest(types.CANCEL_PAYMENT_REQUEST, cancelPaymentRequestSaga),
    takeLatest(types.PAYMENT_AGAIN, paymentAgain),
  ]);
}
