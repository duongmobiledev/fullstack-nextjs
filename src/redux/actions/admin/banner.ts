import { IUploadBannerRequest, IBanner } from 'src/typings/Admin/Banner';

import * as types from '@redux/types/admin/banner';

export const uploadBannerRequest = (payload: IUploadBannerRequest) => ({
  type: types.UPLOAD_BANNER_REQUEST,
  payload,
});
export const uploadBannerSuccess = (payload: IBanner) => ({
  type: types.UPLOAD_BANNER_SUCCESS,
  payload,
});
