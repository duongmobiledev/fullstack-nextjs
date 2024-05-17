import { addQuery, mergeParams } from '@common/functions';

import { ROOT_URL } from '@constants/app';

import { paths } from '@routes';

import { ILanguage } from '@typings';

export const renderURL = <P = object, Q = object>(args: {
  language: ILanguage | string;
  routeName: string;
  params: P;
  query?: Q;
}) => {
  const route = paths.find((item) => item.name === args.routeName);
  if (!route) {
    console.error(`[renderURL] Not found any route has name ${args.routeName}`);
  }
  let url = `${ROOT_URL}/${args.language}${route?.locale?.path}`;
  url = mergeParams(url, args.params);
  url = addQuery(url, args.query);
  return url;
};
export const getRouterNameByUrl = (pathname: string) => {
  const currentRouter = paths?.filter(
    (item) =>
      item?.locale?.path === pathname || item?.locale?.source === pathname
  );
  return currentRouter;
};
