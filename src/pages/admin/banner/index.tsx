import { NextPage } from 'next';
import { Fragment } from 'react';

import BannerAdmin from '@containers/admins/Banner';

import AdminLayout from '@layouts/Admin';
import LayoutDashboard from '@layouts/Dashboard';

const BannerPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Banner">
        <AdminLayout>
          <BannerAdmin />
        </AdminLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default BannerPage;
