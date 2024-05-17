import * as yup from 'yup';

import { IPackage, IService } from '@typings';

export interface IFormValue {
  email?: string;
  name: string;
  phone: string;
  discount: number | string;

  time?: string;
  suggestedAudienceLimit?: number | string;
  createAudienceLimit?: number | string;
  libraryLimit?: number | string;
  package?: IPackage | null;
  service?: IService | null;
}
export const schema = yup.object().shape<{ [key in keyof IFormValue]: any }>({
  time: yup.string().when('service', {
    is: (value) => value !== null,
    then: yup.string().required('Vui lòng chọn thời hạn'),
  }),
  suggestedAudienceLimit: yup.string().when('service', {
    is: (value) => value !== null,
    then: yup.string().required('Vui lòng nhập giới hạn'),
  }),
  createAudienceLimit: yup.string().when('service', {
    is: (value) => value !== null,
    then: yup.string().required('Vui lòng nhập giới hạn'),
  }),
  libraryLimit: yup.string().when('service', {
    is: (value) => value !== null,
    then: yup.string().required('Vui lòng nhập giới hạn'),
  }),
  package: yup.object().when('service', {
    is: (value) => value !== null,
    then: yup
      .object()
      .nullable()
      .shape<{ [key in keyof IPackage]: any }>({
        _id: yup.string().required('Vui lòng chọn gói'),
      }),
  }),
  name: yup.string().required('Vui lòng nhập tên'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  discount: yup.string().required('Vui lòng nhập % chiết khấu'),
});
