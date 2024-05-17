import { END } from '@redux-saga/core';
import { NextPage } from 'next';
import { Fragment } from 'react';

import Support from '@containers/Support';

import LayoutDashboard from '@layouts/Dashboard';

import { wrapper } from '@redux/store';

import { SSGContext } from '@typings';

const SupportPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Support">
        <Support />
      </LayoutDashboard>
    </Fragment>
  );
};
export default SupportPage;

export const getStaticProps = wrapper.getStaticProps(
  async (context: SSGContext) => {
    const {
      store: { dispatch, sagaTask },
    } = context;

    dispatch(END);
    await sagaTask.toPromise();

    return {
      props: {
        // locale,
        // ...(await serverSideTranslations(locale, ["common", "home"])),
      },
      revalidate: 60,
    };
  }
);
