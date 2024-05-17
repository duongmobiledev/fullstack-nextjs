import { LoadingWaiting } from '@icons';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeKeyLocal } from '@common/utils/auth';

import { useRedirect } from '@hooks/useRedirect';

import { loginWithAuthorize, resetExpired } from '@redux/actions/auth';
import { resetAction } from '@redux/actions/common';

import { PATH } from '@routes';

import { ILoginAuthorize, IRootState } from '@typings';

interface IAuthorizeProps {}

const Authorize: React.FC<IAuthorizeProps> = (props) => {
  const dispatch = useDispatch();
  const route = useRouter();
  const redirect = useRedirect();
  const { jwt, callback_url } = route.query;
  const { actionSuccess } = useSelector((state: IRootState) => state.common);
  const { isExpiredAuth = false } = useSelector(
    (state: IRootState) => state.auth
  );

  useEffect(() => {
    if (jwt) {
      removeKeyLocal();
      setTimeout(() => {
        handleLoginWithAuthorize(jwt as string);
      }, 3000);
    }
  }, [jwt]);

  useEffect(() => {
    if (actionSuccess) {
      dispatch(resetAction());
      if (!isExpiredAuth) {
        if (callback_url as string) {
          route.replace(callback_url as string);
        }
        redirect(PATH.SERVICES);
      }
    }
    if (isExpiredAuth) {
      dispatch(resetExpired());
      redirect(PATH.LOGIN);
    }
  }, [actionSuccess, isExpiredAuth]);

  const handleLoginWithAuthorize = (token: string) => {
    const payload: ILoginAuthorize = {
      loginToken: token,
    };

    dispatch(loginWithAuthorize(payload));
  };
  return (
    <div className="bg-white">
      <div className="px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mx-auto">
          <div className="relative inline w-fit">
            <LoadingWaiting />
            <h2 className="absolute text-xl font-semibold tracking-wide text-center text-indigo-600 uppercase transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              Đang xác thực
            </h2>
          </div>

          <p className="max-w-xl mx-auto mt-3 text-gray-500 text-md">
            Vui lòng chờ trong giây lát.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authorize;
