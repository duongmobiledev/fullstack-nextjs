import { NextPage } from 'next';
import { Fragment } from 'react';

import History from '@containers/affiliates/History';

import AffiliatesLayout from '@layouts/Affilidates';
import LayoutDashboard from '@layouts/Dashboard';

const HistoryPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="History">
        <AffiliatesLayout>
          <History />
        </AffiliatesLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default HistoryPage;
