import { all } from 'redux-saga/effects';

import admin from './admin';
import affiliate from './affiliate';
import auth from './auth';
import coupon from './coupon';
import license from './license';
import onePay from './onePay';
import services from './services';

export default function* rootSaga() {
  yield all([
    auth(),
    services(),
    license(),
    coupon(),
    onePay(),
    affiliate(),
    admin(),
  ]);
}
