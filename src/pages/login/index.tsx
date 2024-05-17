import { NextPage } from 'next';
import { Fragment } from 'react';

import Meta from '@components/Meta';

import Login from '@containers/Login';

const HomePage: NextPage = () => {
  return (
    <Fragment>
      <Meta title="Login" />
      <Login />
    </Fragment>
  );
};
export default HomePage;
