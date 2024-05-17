import { NextPage } from 'next';
import { Fragment } from 'react';

import CustomerAdmin from '@containers/admins/Customer';

import AdminLayout from '@layouts/Admin';
import LayoutDashboard from '@layouts/Dashboard';

const CustomerPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="History">
        <AdminLayout>
          <CustomerAdmin />
        </AdminLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default CustomerPage;
