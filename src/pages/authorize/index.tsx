import { NextPage } from 'next';
import { Fragment } from 'react';

import Meta from '@components/Meta';

import Authorize from '@containers/Authorize';

const AuthorizePage: NextPage = () => {
  return (
    <Fragment>
      <Meta title="Authorize" />
      <Authorize />
    </Fragment>
  );
};
export default AuthorizePage;
