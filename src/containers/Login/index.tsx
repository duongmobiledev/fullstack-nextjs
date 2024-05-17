import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React, { createRef, useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { isAuthenticated } from '@common/utils/auth';

import DialogNoButton from '@components/DialogNoButton';

import Button from '@designs/Button';
import Input from '@designs/Input';

import { useRedirect } from '@hooks/useRedirect';

import { loginEmail } from '@redux/actions/auth';
import { resetAction } from '@redux/actions/common';

import { PATH } from '@routes';

import { ILoginEmail, IRootState } from '@typings';

interface ILoginProps {}
interface FormData {
  email: string;
}
const schema = yup
  .object({
    email: yup
      .string()
      .required('Trường này không được bỏ trống !')
      .email('Không đúng định dạng email !'),
  })
  .required();

const Login: React.FC<ILoginProps> = (props) => {
  const recaptchaRef = createRef();
  const dispatch = useDispatch();
  const route = useRouter();
  const redirect = useRedirect();
  const { ref, callback_url } = route.query;
  const { actionSuccess, isLoading } = useSelector(
    (state: IRootState) => state.common
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setOpenDialog(false);
    if (isAuthenticated()) {
      redirect(PATH.SERVICES);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      (recaptchaRef.current as any).reset();
    }
  }, [isLoading]);

  useEffect(() => {
    if (actionSuccess) {
      dispatch(resetAction());
      (recaptchaRef.current as any).reset();
      setOpenDialog(true);
    }
  }, [actionSuccess]);
  const onSubmit = async (data: FormData) => {
    const token = await (recaptchaRef.current as any).executeAsync();
    const payload: ILoginEmail = {
      email: data.email,
      'g-recaptcha-response': token,
      ref: Number(ref as string),
      callback_url: callback_url as string,
    };
    if (!ref) {
      delete payload.ref;
    }
    !(callback_url as string) && delete payload.callback_url;
    dispatch(loginEmail(payload));
  };

  return (
    <>
      <div className="flex h-screen min-h-full">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="w-full max-w-sm mx-auto lg:w-96">
            <div>
              <img
                className="w-auto h-12"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Đăng nhập
              </h2>
            </div>

            <div className="mt-8">
              <div className="mt-6 ">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    name="email"
                    register={register}
                    required
                    errorMessage={errors.email?.message}
                    label="Email"
                  />

                  <div className="invisible opacity-0">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      size="invisible"
                      sitekey={process.env.NEXT_PUBLIC_SITEKEY_RECAPCHA}
                    />
                  </div>
                  <Button loading={isLoading} label="Đăng nhập" type="submit" />
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex-1 hidden w-0 lg:block">
          <img
            className="absolute inset-0 w-full h-full"
            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
      <DialogNoButton
        onClose={() => setOpenDialog(false)}
        open={openDialog}
        title="Thông báo">
        <p>
          Link xác thực đã gửi đến email của bạn, vui lòng kiểm tra email để
          tiếp tục đăng nhập !
        </p>
      </DialogNoButton>
    </>
  );
};

export default Login;
