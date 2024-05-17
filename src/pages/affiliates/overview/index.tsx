import { END } from '@redux-saga/core';
import { NextPage } from 'next';
import { Fragment } from 'react';

import Overview from '@containers/affiliates/Overview';

import AffiliatesLayout from '@layouts/Affilidates';
import LayoutDashboard from '@layouts/Dashboard';

const OverviewPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Overview">
        <AffiliatesLayout>
          <Overview />
        </AffiliatesLayout>
      </LayoutDashboard>
    </Fragment>
  );
};
export default OverviewPage;
