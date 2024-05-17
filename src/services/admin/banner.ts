import { IUploadBannerRequest } from 'src/typings/Admin/Banner';

import axiosUtils from '@common/utils/api';

export const uploadBanner = async (params: IUploadBannerRequest) => {
  return await axiosUtils.post('/admin/banner/upload', params.file);
};
