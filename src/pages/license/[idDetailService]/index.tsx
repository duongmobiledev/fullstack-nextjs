import { GetStaticPaths, NextPage } from 'next';
import { Fragment } from 'react';

import ChooseLicense from '@containers/ChooseLicense';

import LayoutDashboard from '@layouts/Dashboard';

const ServicesDetailPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="License">
        <ChooseLicense />
      </LayoutDashboard>
    </Fragment>
  );
};
export default ServicesDetailPage;
