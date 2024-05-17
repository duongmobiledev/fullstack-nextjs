import { put, call } from 'redux-saga/effects';

import {
  createCouponAdminError,
  createCouponAdminSuccess,
  loadCouponAdminListError,
  loadCouponAdminListSuccess,
  loadCouponAdminSearchSuccess,
} from '@redux/actions/admin';
import { getHistoryError } from '@redux/actions/affiliate';
import { setLoading, setNotify } from '@redux/actions/common';

import {
  createCouponAdminAPI,
  getCouponListAdminAPI,
  getCouponSearchAdminAPI,
} from '@services/admin/coupon';

import { IResponse } from '@typings';

export function* createCouponAdmin(payload: any) {
  const params = payload.payload;
  try {
    yield put(setLoading(true));
    const response: IResponse = yield call(createCouponAdminAPI, params);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(
        setNotify({
          type: 'success',
          title: 'Success',
          message: 'Tạo mã coupon thành công, Kiểm tra ngay!',
        })
      );
      yield put(createCouponAdminSuccess());
    } else {
      if (data.error.invalidCode) {
        yield put(
          setNotify({
            type: 'error',
            title: 'Failure',
            message: 'Hiệu lực ngày đến lỗi, Vui lòng chọn ngày khác ',
          })
        );
      }
      if (data.error.invalidExpiredDay) {
        yield put(
          setNotify({
            type: 'error',
            title: 'Failure',
            message: 'Số ngày lỗi, Vui lòng chọn ngày khác ',
          })
        );
      }
      if (data.error.invalidLimit) {
        yield put(
          setNotify({
            type: 'error',
            title: 'Failure',
            message: 'Giới hạn ngày lỗi, Vui lòng chọn ngày khác ',
          })
        );
      }
      if (data.error.invalidServices) {
        yield put(
          setNotify({
            type: 'error',
            title: 'Failure',
            message: 'Sản phẩm tạo lỗi, Vui lòng chọn lại ',
          })
        );
      }
      if (!data) {
        yield put(
          setNotify({
            type: 'error',
            title: 'Failure',
            message: 'Tạo mã không thành công, Vui lòng thử lại!',
          })
        );
      }

      yield put(createCouponAdminError());
    }
  } catch (e) {
    console.log(e);
    yield put(createCouponAdminError());
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Failure',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}
/////

export function* loadCouponListAdmin(payload: any) {
  const params = payload.payload;
  try {
    yield put(setLoading(true));

    const response: IResponse = yield call(getCouponListAdminAPI, params);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(loadCouponAdminListSuccess(data));
      setNotify({
        type: 'success',
        title: 'Success',
        message: 'Tạo mã coupon thành công, Kiểm tra ngay!',
      });
    } else {
      yield put(loadCouponAdminListError());
    }
  } catch (e) {
    console.log(e);
    yield put(loadCouponAdminListError());
    yield put(setLoading(false));
    setNotify({
      type: 'error',
      title: 'Failure',
      message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
    });
  }
}
////
export function* loadCouponSearchAdmin(payload: any) {
  const params = payload.payload;
  try {
    const response: IResponse = yield call(getCouponSearchAdminAPI, params);

    const { data, status, success } = response || {};
    if (success) {
      yield put(loadCouponAdminSearchSuccess(data));
    }
  } catch (e) {
    console.log(e);
    yield put(loadCouponAdminListError());
    yield put(setLoading(false));
    setNotify({
      type: 'error',
      title: 'Failure',
      message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
    });
  }
}
