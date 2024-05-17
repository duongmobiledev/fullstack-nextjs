import Router from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
});

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function () {
  return null;
}
