import { NextPage } from 'next';
import { Fragment } from 'react';

import OrderAdmin from '@containers/admins/Order';

import AdminLayout from '@layouts/Admin';
import LayoutDashboard from '@layouts/Dashboard';

const OrderPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Order">
        <AdminLayout>
          <OrderAdmin />
        </AdminLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default OrderPage;
