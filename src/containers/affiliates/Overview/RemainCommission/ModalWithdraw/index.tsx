import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { formatCurrencyVND } from '@common/functions';

import Dialog from '@components/Dialog';

import Button from '@designs/Button';
import Input from '@designs/Input';

import useAuth from '@hooks/useAuth';

import { requestWithdraw } from '@redux/actions/affiliate';

import { IRootState, IWithdrawRequest } from '@typings';

import { schema } from './schema';

interface IModalWithdraw {
  open: boolean;
  onClose: () => void;
}

const ModalWithdraw: React.FC<IModalWithdraw> = (props) => {
  const { onClose, open } = props;
  const { profile } = useAuth();
  const { overview } = useSelector((state: IRootState) => state.affilidate);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<number>(0);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    clearErrors,
  } = useForm<IWithdrawRequest>({
    defaultValues: {
      email: profile?.email,
      balance: 0,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open && profile && overview) {
      setValue('balance', overview?.balance);
      setValue('email', profile?.email);
    }
  }, [overview, open, profile]);

  const onSubmit = (values: IWithdrawRequest) => {
    const payload: IWithdrawRequest = {
      amount: Number(values.amount),
      bankAccountNumber: values.bankAccountNumber,
      bankAccountName: values.bankAccountName,
      bankName: values.bankName,
      facebookLink: values?.facebookLink,
    };
    dispatch(requestWithdraw(payload));
  };
  const handleCancle = () => {
    reset({
      bankAccountNumber: '',
      amount: 0,
      bankAccountName: '',
      bankName: '',
      facebookLink: '',
    });
    clearErrors('amount');
    clearErrors('bankAccountNumber');
    clearErrors('bankAccountName');
    clearErrors('bankName');
    onClose();
    setAmount(0);
  };

  const handleChangeAmount = (event: ChangeEvent<any>) => {
    const value = event.target.value;
    setAmount(Number(value) | 0);
  };
  return (
    <Dialog
      className="lg:max-w-[900px] lg:w-full"
      title="Cập nhật thông tin thanh toán"
      open={open}
      onClose={handleCancle}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 ">
        <div className="col-span-1 pr-2">
          <h3 className="font-bold text-left">Thông tin thanh toán</h3>
          <div className="grid items-center gap-2 mt-3 grid-cos-1 md:grid-cols-3">
            <p className="col-span-1 text-left">
              Chủ tài khoản <span className="text-red-500">*</span>
            </p>
            <div className="col-span-2">
              <Input
                className="w-full"
                autoComplete="off"
                placeholder="Nhập tên chủ tài khoản"
                name="bankAccountName"
                required={true}
                register={register}
                errorMessage={errors?.bankAccountName?.message as string}
              />
            </div>
          </div>
          <div className="grid items-center gap-2 mt-3 grid-cos-1 md:grid-cols-3">
            <p className="col-span-1 text-left">
              Số tài khoản <span className="text-red-500">*</span>
            </p>
            <div className="col-span-2">
              <Input
                className="w-full"
                autoComplete="off"
                type="number"
                placeholder="Nhập số tài khoản"
                name="bankAccountNumber"
                required={true}
                register={register}
                errorMessage={errors?.bankAccountNumber?.message}
              />
            </div>
          </div>
          <div className="grid items-center gap-2 mt-3 grid-cos-1 md:grid-cols-3">
            <p className="col-span-1 text-left">
              Tên ngân hàng <span className="text-red-500">*</span>
            </p>
            <div className="col-span-2">
              <Input
                className="w-full"
                autoComplete="off"
                placeholder="Nhập tên ngân hàng"
                name="bankName"
                required={true}
                register={register}
                errorMessage={errors?.bankName?.message}
              />
            </div>
          </div>
          <div className="grid items-center gap-2 mt-3 grid-cos-1 md:grid-cols-3">
            <p className="col-span-1 text-left">Email</p>
            <div className="col-span-2">
              <Input
                disabled={true}
                className="w-full"
                autoComplete="off"
                name="email"
                required={true}
                register={register}
              />
            </div>
          </div>
          <div className="gap-2 mt-3 ">
            <p className="text-left">
              Link FB chính chủ <span className="text-red-500">*</span>
            </p>
            <Input
              className="mt-1"
              autoComplete="off"
              name="facebookLink"
              placeholder="Nhập link facebook"
              required={true}
              register={register}
              errorMessage={errors?.facebookLink?.message}
            />
          </div>
        </div>
        <div className="flex flex-col col-span-1 pl-2 mt-5 border-none lg:mt-0 lg:border-solid lg:border-l border-zinc-400">
          <h3 className="font-bold text-left">Chi tiết thanh toán</h3>
          <div>
            <div className="grid items-center grid-cols-3 gap-2 mt-3">
              <p className="col-span-1 text-left">Số dư</p>
              <div className="col-span-2 text-right">
                {formatCurrencyVND(overview?.balance)}
              </div>
            </div>
          </div>
          <div className="grid items-center grid-cols-2 gap-2 mt-3 md:grid-cols-5">
            <p className="col-span-3 text-left">
              Số dư hoa hồng muốn rút <span className="text-red-500">*</span>
            </p>
            <div className="col-span-2">
              <Input
                inputClassName="text-right"
                className="w-full"
                autoComplete="off"
                placeholder="Nhập số tiền"
                name="amount"
                required={true}
                onChange={handleChangeAmount}
                register={register}
                errorMessage={errors?.amount?.message}
              />
            </div>
          </div>
          <div className="w-full mt-8 border border-dashed border-zinc-200" />
          <h5 className="h-full mt-3 text-2xl font-bold text-right text-red-700">
            {formatCurrencyVND(amount)}
          </h5>
          <div className="flex flex-row justify-end w-full gap-2 mt-3">
            <Button
              type="button"
              onClick={handleCancle}
              label="Hủy"
              variant="secondary"
            />
            <Button type="submit" label="Yêu cầu rút" />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default ModalWithdraw;
