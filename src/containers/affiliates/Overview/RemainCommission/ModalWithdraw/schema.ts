import * as yup from 'yup';

import { IWithdrawRequest } from '@typings';

export const schema = yup
  .object()
  .shape<{ [key in keyof IWithdrawRequest]: any }>({
    amount: yup
      .string()
      .required('Vui lòng nhập số tiền !')
      .nullable()
      .test(
        'balance',
        'Số tiền rút không được lớn hơn số dư',
        (value, context) => {
          if (Number(value!) > context.parent.balance) {
            return false;
          }
          return true;
        }
      ),
    bankAccountNumber: yup.string().required('Vui lòng nhập số tài khoản !'),
    bankAccountName: yup.string().required('Vui lòng nhập tên tài khoản !'),
    bankName: yup.string().required('Vui lòng nhập tên ngân hàng !'),
    facebookLink: yup.string().required('Vui lòng nhập link facebook !'),
  });
