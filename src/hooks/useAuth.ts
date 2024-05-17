import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isAuthenticated } from '@common/utils/auth';

import { getProfileUser } from '@redux/actions/auth';

import { IUser } from '@typings';

import { IRootState } from './../redux/reducers/index';

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  const [profile, setProfile] = useState<IUser | null>(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state: IRootState) => state.auth);
  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [isAuth]);

  useEffect(() => {
    if (user) {
      setProfile(user);
    } else {
      dispatch(getProfileUser());
    }
  }, [user]);

  return { isAuth, profile };
};
export default useAuth;
