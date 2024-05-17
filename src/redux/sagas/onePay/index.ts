import { all, takeLatest } from 'redux-saga/effects';

import * as types from '@redux/types/onepay';

import { getLicenseDetail, getInvoiceDetail } from './onepay';

export default function* onePay() {
  yield all([
    takeLatest(types.GET_LICENSE_DETAIL_RESULT, getLicenseDetail),
    takeLatest(types.GET_INVOICE_DETAIL_RESULT, getInvoiceDetail),
  ]);
}
