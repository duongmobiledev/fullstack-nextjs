import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { uploadBannerRequest } from '@redux/actions/admin/banner';

import { IRootState } from '@typings';

interface IBannerAdminProps {}
const content = {
  key1: 'file',
};
export const BannerAdmin: React.FC<IBannerAdminProps> = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.services);

  const [isError, setIsError] = useState<boolean>(false);
  const onUploadFile = (data) => {
    var _URL = window.URL || window.webkitURL;
    var img = new Image();
    img.src = data.target.files[0].name;
    img = new Image();
    var objectUrl = _URL.createObjectURL(data.target.files[0]);
    img.src = objectUrl;
    new Promise((resolve, reject) => {
      img.onload = function () {
        _URL.revokeObjectURL(objectUrl);
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        resolve({ width, height });
      };
    }).then((val) => {
      let width = Number((val as any).width);
      let height = Number((val as any).height);
      if (width / height >= 4) {
        let formData = new FormData();
        formData.append('data', JSON.stringify(content));
        formData.append('file', data.target.files[0]);
        dispatch(uploadBannerRequest({ file: formData }));
        setIsError(false);
      } else {
        setIsError(true);
      }
    });
  };

  return (
    <div className="px-4 py-4 bg-white sm:px-6 lg:px-8">
      <h1 className="text-sm font-semibold text-gray-900">
        Tải ảnh lên có tỉ lệ kích thước 4:1 để thay đổi banner
      </h1>
      <div className="flex items-center justify-center w-full mt-10 bg-white">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 border-gray-300 border-solid border-1">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Tải lên
            </p>
          </div>
          <input
            accept="image/*"
            onChange={onUploadFile}
            id="dropzone-file"
            type="file"
            className="hidden"
          />
          {isError ? (
            <p className="mb-2 text-sm text-red-500">
              Vui lòng chọn ảnh kích thước lớn hơn (4:1)
            </p>
          ) : null}
        </label>
      </div>
    </div>
  );
};
export default BannerAdmin;
