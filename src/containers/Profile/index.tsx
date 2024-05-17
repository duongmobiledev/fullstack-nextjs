import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { removeKeyLocal } from '@common/utils/auth';

import { countryList } from '@constants/country';
import { genders } from '@constants/gender';

import Button from '@designs/Button';

import useAuth from '@hooks/useAuth';
import { useRedirect } from '@hooks/useRedirect';

import { updateProfile } from '@redux/actions/auth';

import { PATH } from '@routes';

import {
  ICountry,
  IGender,
  IUserProfile,
  INotification,
  IRootState,
} from '@typings';

import Information from './Informations';
import Notifications from './Notifications';
import { ProfileContext } from './context';

interface IProfileProps {}
export interface FormData {
  displayName: string;
  phoneNumber: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
  email?: string;
  gender?: string;
}

const schema = yup.object().shape<{ [key in keyof FormData]: any }>({
  displayName: yup.string().required('Trường này không được bỏ trống !'),
  phoneNumber: yup.string().required('Trường này không được bỏ trống !'),
  city: yup.string().required('Trường này không được bỏ trống !'),
  state: yup.string().required('Trường này không được bỏ trống !'),
  zipCode: yup.string().required('Trường này không được bỏ trống !'),
  address: yup.string().required('Trường này không được bỏ trống !'),
});
const Profile: React.FC<IProfileProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const redirect = useRedirect();
  const dispatch = useDispatch();
  const [reset, setReset] = useState(false);
  const [errorSelect, setErrorSelect] = useState('');
  const [gender, setGender] = useState<IGender>(genders[1]);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [notify, setNotify] = useState<INotification[]>([
    { typeNotification: 'invoices', value: false },
    { typeNotification: 'promotions', value: false },
    { typeNotification: 'updates', value: false },
  ]);
  const { isLoading } = useSelector((state: IRootState) => state.common);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      const { notifications } = profile || {};
      setNotify(notifications);
      setGender(genders[profile.gender]);
    }
  }, [profile]);

  const onChangeNotify = (notifySelected: INotification) => {
    const newArr = [].concat(notify);

    const indexItem = newArr.findIndex(
      (item) => item.typeNotification === notifySelected.typeNotification
    );
    newArr.splice(indexItem, 1, notifySelected);

    setNotify(newArr);
  };
  const onSubmit = (data: FormData) => {
    const { city, displayName, phoneNumber, zipCode, state, address } = data;
    if (!country) {
      setErrorSelect('Trường này không được bỏ trống !');
      return;
    }

    const payload: IUserProfile = {
      city,
      displayName,
      phoneNumber,
      zipCode,
      state,
      address,
      country: country?.name,
      gender: gender?.code || 1,
      notifications: notify,
    };
    dispatch(updateProfile(payload));
  };
  const onChangeCountry = (countrySelected: ICountry) =>
    setCountry(countrySelected);
  const onChangeGender = (genderSelected: IGender) => setGender(genderSelected);

  const handleLogout = () => {
    removeKeyLocal();
    redirect(PATH.LOGIN);
  };
  const handleCancel = () => {
    const {
      displayName,
      phoneNumber,
      zipCode,
      city,
      email,
      address,
      state,
      country,
      notifications,
    } = profile || {};
    setValue('email', email);
    setValue('city', city);
    setValue('displayName', displayName);
    setValue('zipCode', zipCode);
    setValue('phoneNumber', phoneNumber);
    setValue('address', address);
    setValue('state', state);
    const countryFilter = countryList.filter((item) => item.name === country);
    onChangeCountry(countryFilter[0]);
    onChangeGender(genders[profile.gender]);
    setReset(true);
  };
  const onReset = () => setReset(false);
  return (
    <ProfileContext.Provider
      value={{
        reset,
        country,
        gender,
        notify,
        error: errorSelect,
        onChangeCountry,
        onChangeGender,
        onChangeNotify,
        onReset,
      }}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Information setValue={setValue} errors={errors} register={register} />
        <Notifications />
        <div className="flex justify-between gap-2 px-4 pb-5">
          <div className="flex justify-start">
            <Button
              type="button"
              onClick={handleLogout}
              variant="primary"
              label="Đăng xuất"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleCancel}
              type="button"
              variant="secondary"
              label="Hủy"
            />
            <Button type="submit" variant="primary" label="Lưu" />
          </div>
        </div>
      </form>
    </ProfileContext.Provider>
  );
};

export default Profile;
