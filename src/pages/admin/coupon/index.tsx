import { NextPage } from 'next';
import { Fragment } from 'react';

import CouponAdmin from '@containers/admins/Coupon';

import AdminLayout from '@layouts/Admin';
import LayoutDashboard from '@layouts/Dashboard';

const CouponPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Coupon">
        <AdminLayout>
          <CouponAdmin />
        </AdminLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default CouponPage;
