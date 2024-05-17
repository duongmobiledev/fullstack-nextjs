import { NextPage } from 'next';
import { Fragment } from 'react';

import NotFound from '@containers/404';

const HomePage: NextPage = () => {
  return (
    <Fragment>
      <NotFound />
    </Fragment>
  );
};
export default HomePage;
