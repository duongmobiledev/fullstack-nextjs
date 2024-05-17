import { useRouter } from 'next/router';
import path from 'path';
import { useCallback } from 'react';

import { paths } from '@routes';

export const useRedirect = () => {
  const router = useRouter();
  const redirect = useCallback(
    (
      routeName: string,
      params: object = {},
      query: object = {},
      shallow: boolean = true
    ) => {
      const currentPath = paths.find((item) => item.name === routeName);

      if (!currentPath) {
        console.error(
          `[Link Error] Don't find any route which has name is "${routeName}"`
        );
      }

      let href = path.join(`/${currentPath.path}`);

      if (Object.keys(params).length) {
        for (const key in params) {
          const value = params[key];
          href = href.replace(`/:${key}`, `/${value}`);
        }
      }

      href = href.replace(/(\/:)\w+/g, '/-');

      if (Object.keys(query).length) {
        const queryString = renderQueryStringFromObject(query);
        href += `?${queryString}`;
      }

      router.push(href, undefined, { shallow });
    },
    []
  );
  return redirect;
};

const renderQueryStringFromObject = (query: object) => {
  return new URLSearchParams(query as any)?.toString();
};
