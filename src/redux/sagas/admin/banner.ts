import { call, put } from 'redux-saga/effects';
import { IUploadBannerRequest } from 'src/typings/Admin/Banner';

import { uploadBannerSuccess } from '@redux/actions/admin/banner';
import { setLoading, setNotify } from '@redux/actions/common';

import { uploadBanner } from '@services/admin/banner';

import { IResponse } from '@typings';

export function* uploadBannerApi(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(uploadBanner, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(uploadBannerSuccess(data));
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành công',
          message: 'Tải hình thành công',
        })
      );
    } else {
      yield put(
        setNotify({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thành công, Vui lòng thử lại',
        })
      );
    }
  } catch (e) {
    yield put(setLoading(false));
    console.log(e);
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}
