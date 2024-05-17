import { END } from '@redux-saga/core';
import { NextPage } from 'next';
import { Fragment } from 'react';

import Profile from '@containers/Profile';

import LayoutDashboard from '@layouts/Dashboard';

import { wrapper } from '@redux/store';

import { SSGContext } from '@typings';

const ProfilePage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Profile">
        <Profile />
      </LayoutDashboard>
    </Fragment>
  );
};
export default ProfilePage;
