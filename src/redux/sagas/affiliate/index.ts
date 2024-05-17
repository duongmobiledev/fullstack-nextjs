import { all, takeLatest } from 'redux-saga/effects';

import * as types from '@redux/types/affiliate';

import { loadDataHistoryWithDraw } from './history';
import {
  getAffiliateProgramSaga,
  getInvoicesReceiveCommissionByUserSaga,
  getPresenteesSaga,
  requestWithdrawSaga,
} from './overview';

export default function* affiliate() {
  yield all([
    takeLatest(
      types.GET_INVOICES_RECEIVE_COMMISSION,
      getInvoicesReceiveCommissionByUserSaga
    ),
    takeLatest(types.GET_AFFILIATE_PROGRAM, getAffiliateProgramSaga),
    takeLatest(types.GET_PRESENTEE, getPresenteesSaga),
    takeLatest(types.REQUEST_WITHDRAW, requestWithdrawSaga),
    takeLatest(types.LOAD_DATA_HISTORY, loadDataHistoryWithDraw),
  ]);
}
