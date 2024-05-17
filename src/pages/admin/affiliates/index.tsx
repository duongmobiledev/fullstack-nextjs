import { NextPage } from 'next';
import { Fragment } from 'react';

import AffiliateAdmin from '@containers/admins/Affilate';

import AdminLayout from '@layouts/Admin';
import LayoutDashboard from '@layouts/Dashboard';

const AffiliatesAdminPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="AffiliatesAdmin">
        <AdminLayout>
          <AffiliateAdmin />
        </AdminLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default AffiliatesAdminPage;
