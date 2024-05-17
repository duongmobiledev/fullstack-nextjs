// Lib import
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'nprogress/nprogress.css';
import 'react-nice-dates/build/style.css';

import '@common/styles/global/index.css';
//CSS custom
import '@common/styles/typography/index.css';

import LoadingApp from '@components/LoadingApp';
import Notification from '@components/Notification';

import { wrapper } from '@redux/store';

const TopProgressBar = dynamic(
  () => {
    return import('@components/TopProgressBar');
  },
  { ssr: false }
);
const WebApp = (props: AppProps) => {
  const { Component, pageProps } = props;
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"></meta>

        <meta charSet="utf-8" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <TopProgressBar />
      <Notification />
      <LoadingApp />
      <Component {...pageProps} />
    </>
  );
};

export default wrapper.withRedux(WebApp);

declare module 'next' {
  interface NextApiRequest {
    email: string;
  }
}
