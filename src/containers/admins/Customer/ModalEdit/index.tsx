import { yupResolver } from '@hookform/resolvers/yup';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@components/Dialog';

import Button from '@designs/Button';
import Input from '@designs/Input';
import SwitchButton from '@designs/SwitchButton';

import { updateCustomer } from '@redux/actions/admin';
import { resetAction } from '@redux/actions/common';

import { ICustomer, IRootState, IUpdateCustomer } from '@typings';

import SelectLicense from './SelectLicense';
import { IFormValue, schema } from './schema';

interface IModalEditCustomer {
  open: boolean;
  onClose: () => void;
  data: ICustomer;
}

const ModalEditCustomer: React.FC<IModalEditCustomer> = (props) => {
  const { onClose, open, data } = props;
  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IFormValue>({
    resolver: yupResolver(schema),
    defaultValues: {
      service: null,
    },
  });
  const [checkedAdmin, setCheckedAdmin] = useState(true);
  const dispatch = useDispatch();
  const { actionSuccess } = useSelector((state: IRootState) => state.common);

  useEffect(() => {
    if (actionSuccess) {
      dispatch(resetAction());
      handleCloseModal();
    }
  }, [actionSuccess]);

  useEffect(() => {
    if (open && data) {
      setValue('email', data?.user.email);
      setValue('name', data?.user?.displayName);
      setValue('phone', data?.user?.phoneNumber?.replace(/\s/g, ''));

      setValue('discount', data?.discount);
      setCheckedAdmin(data?.user.isAdmin);
    }
  }, [open]);

  const onSubmit = (values: IFormValue) => {
    let isoTime;
    if (values?.time) {
      isoTime = new Date(values?.time).toISOString();
    }
    const params: IUpdateCustomer = {
      userId: data?.user?._id,
      discount: Number(values?.discount),
      displayName: values?.name,
      phoneNumber: values?.phone,
      isAdmin: checkedAdmin,
      license: {
        dailyLimit: {
          createAudienceLimit: Number(values?.createAudienceLimit),
          libraryLimit: Number(values?.libraryLimit),
          suggestedAudienceLimit: Number(values?.suggestedAudienceLimit),
        },
        expirationTimestamp: DateTime.fromISO(isoTime).toUnixInteger(),
        packageId: values?.package?._id,
        serviceId: values?.service?._id,
      },
    };
    if (!values?.service || values?.service === null) {
      delete params.license;
    }
    dispatch(updateCustomer(params));
  };
  const handleChecked = (value: boolean) => setCheckedAdmin(value);

  const handleCloseModal = () => {
    reset({
      discount: '',
      email: '',
      createAudienceLimit: '',
      libraryLimit: '',
      suggestedAudienceLimit: '',
      name: '',
      package: {
        _id: '',
      },
      phone: '',
      service: null,
      time: '',
    });
    onClose();
  };
  return (
    <Dialog
      className="lg:min-w-[500px]"
      title="Cập nhật khách hàng"
      open={open}
      onClose={handleCloseModal}>
      <form
        noValidate
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          required
          name="email"
          disabled
          register={register}
        />
        <Input
          label="Tên khách hàng"
          placeholder="Nhập tên khách hàng"
          name="name"
          register={register}
          required
          errorMessage={errors?.name?.message}
        />
        <Input
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          name="phone"
          type="number"
          register={register}
          required
          errorMessage={errors?.phone?.message}
        />
        <Input
          label="% chiết khấu"
          placeholder="Nhập % chiết khấu"
          name="discount"
          type="number"
          register={register}
          required
          errorMessage={errors?.discount?.message}
        />
        <div>
          <SwitchButton
            label="Admin ?"
            initValue={checkedAdmin}
            onToggle={handleChecked}
          />
        </div>
        <SelectLicense register={register} errors={errors} control={control} />
        <div className="flex justify-between mt-4">
          <Button onClick={handleCloseModal} label="Hủy" variant="secondary" />
          <Button type="submit" label="Cập nhật" />
        </div>
      </form>
    </Dialog>
  );
};

export default ModalEditCustomer;
