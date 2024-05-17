import { useEffect, useState } from 'react';
import { Control, FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import DatePicker from '@designs/DatePicker';
import Input from '@designs/Input';
import Select from '@designs/SelectForm';

import { getPackagePage } from '@redux/actions/license';
import { loadDataServices } from '@redux/actions/services';

import { IGetPackagePage, IRootState, IService } from '@typings';

import { IFormValue } from '../schema';

interface ISelectLicense {
  control: Control<IFormValue>;
  errors: FieldErrorsImpl<IFormValue>;
  register: UseFormRegister<IFormValue>;
}

const SelectLicense: React.FC<ISelectLicense> = (props) => {
  const { errors, control, register } = props;
  const { dataService } = useSelector((state: IRootState) => state.services);
  const { packagePages } = useSelector((state: IRootState) => state.license);
  const [serviceSelected, setServiceSelected] = useState<IService | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (dataService?.length === 0) {
      dispatch(loadDataServices({ limit: 1000, offset: 0 }));
    }
  }, []);

  const handleSelectService = (option: IService) => {
    setServiceSelected(option);
    const params: IGetPackagePage = {
      serviceId: option?._id,
    };
    dispatch(getPackagePage(params));
  };

  return (
    <div className="">
      <p className="mb-3 text-left">Bản quyền</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Select
          className="col-span-1"
          label="Sản phẩm"
          options={dataService}
          optionTarget="name"
          control={control as any}
          name="service"
          placeholder="Bản quyền"
          onSelect={handleSelectService}
        />
        <Select
          className="col-span-1"
          label="Gói"
          options={packagePages?.packages}
          optionTarget="name"
          control={control as any}
          name="package"
          placeholder="Gói"
          required
          errorMessage={errors?.package?._id?.message}
          disabled={serviceSelected === null}
        />
        <DatePicker
          className="col-span-1"
          direction="top"
          name="time"
          minDate={new Date()}
          placeholder="Thời gian"
          control={control as any}
          required
          errorMessage={errors?.time?.message}
          label="Thời gian"
          disabled={serviceSelected === null}
        />
        <Input
          className="col-span-1"
          label="Giới hạn đề xuất"
          placeholder="Nhập giới hạn"
          name="suggestedAudienceLimit"
          type="number"
          register={register}
          required
          errorMessage={errors?.suggestedAudienceLimit?.message}
        />
        <Input
          className="col-span-1"
          label="Giới hạn tạo"
          placeholder="Nhập giới hạn"
          name="createAudienceLimit"
          type="number"
          register={register}
          required
          errorMessage={errors?.createAudienceLimit?.message}
        />
        <Input
          className="col-span-1"
          label="Giới hạn thư viện"
          placeholder="Nhập giới hạn"
          name="libraryLimit"
          type="number"
          register={register}
          required
          errorMessage={errors?.libraryLimit?.message}
        />
      </div>
    </div>
  );
};

export default SelectLicense;
