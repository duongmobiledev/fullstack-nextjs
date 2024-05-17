import { NextPage } from 'next';
import { Fragment } from 'react';

import Services from '@containers/Services';

import LayoutDashboard from '@layouts/Dashboard';

const ServicesPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Services">
        <Services />
      </LayoutDashboard>
    </Fragment>
  );
};
export default ServicesPage;
