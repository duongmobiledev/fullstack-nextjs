import { GetStaticPaths, NextPage } from 'next';
import { Fragment } from 'react';
import { END } from 'redux-saga';

import ServiceDetail from '@containers/ServiceDetail';

import LayoutDashboard from '@layouts/Dashboard';

import { wrapper } from '@redux/store';

import { SSGContext } from '@typings';

const ServicesDetailPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Product">
        <ServiceDetail />
      </LayoutDashboard>
    </Fragment>
  );
};
export default ServicesDetailPage;

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
export const getStaticPaths: GetStaticPaths = async ({}) => {
  // for (const locale of locales) {

  // }
  return {
    paths: [],
    fallback: true,
  };
};
