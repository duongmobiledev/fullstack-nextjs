import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import * as auth from '@common/utils/auth';

import useAuth from '@hooks/useAuth';
import { useRedirect } from '@hooks/useRedirect';

import { setNotify } from '@redux/actions/common';

import { PATH } from '@routes';

const withAuth =
  <T,>(Component: React.FC<T>) =>
  (props: T) => {
    const redirect = useRedirect();
    const { isAuth, profile } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const adminPage = router.pathname.includes('admin');

    useEffect(() => {
      if (!isAuth && typeof window !== 'undefined') {
        dispatch(
          setNotify({
            type: 'error',
            message: 'Bạn không có quyền truy cập, thử lại sau !',
            title: ' Thông báo',
          })
        );
        redirect(PATH.LOGIN);
      }
      if (adminPage) {
        if (profile && !profile?.isAdmin) {
          dispatch(
            setNotify({
              type: 'error',
              message: 'Bạn không có quyền truy cập trang này, thử lại sau !',
              title: ' Thông báo',
            })
          );
          redirect(PATH.NOT_FOUND);
        }
      }
    }, [adminPage, profile]);
    return <Component {...props} />;
  };

export default withAuth;
