import { NextPage } from 'next';
import { Fragment } from 'react';

import HistoryAdmin from '@containers/admins/History';

import AdminLayout from '@layouts/Admin';
import LayoutDashboard from '@layouts/Dashboard';

const HistoryAdminPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="HistoryAdmin">
        <AdminLayout>
          <HistoryAdmin />
        </AdminLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default HistoryAdminPage;
