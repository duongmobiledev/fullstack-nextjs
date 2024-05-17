import { END } from '@redux-saga/core';
import { NextPage } from 'next';
import { Fragment } from 'react';

import Receipt from '@containers/Receipt';

import LayoutDashboard from '@layouts/Dashboard';

import { wrapper } from '@redux/store';

import { PATH } from '@routes';

import { SSGContext } from '@typings';

const ReceiptsPage: NextPage = () => {
  return (
    <Fragment>
      <LayoutDashboard title="Receipt">
        <Receipt />
      </LayoutDashboard>
    </Fragment>
  );
};
export default ReceiptsPage;

// export const getStaticProps = wrapper.getStaticProps(
//   async (context: SSGContext) => {
//     const {
//       store: { dispatch, sagaTask },
//     } = context;

//     dispatch(END);
//     await sagaTask.toPromise();

//     return {
//       props: {
//         // locale,
//         // ...(await serverSideTranslations(locale, ["common", "home"])),
//       },
//       revalidate: 60,
//     };
//   }
// );
