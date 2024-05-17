import { useRouter } from 'next/router';
import path from 'path';
import { KeyboardEvent, MouseEvent, PropsWithChildren } from 'react';

import { paths } from '@routes';

export interface ILinkProps extends PropsWithChildren {
  /**
   * this is "name" of route which you want to direct
   * take all name route from @routes/index.js
   */
  routeName: string;
  /**
   * Query is a variable which you wanna assign for your url
   * @example { slug: "hello", page: 5} --> /home?slug=hello&page=5
   */
  params?: object;
  /**
   * shadow will make page don't have to refresh when change page
   * @note shadow should be disable when you want link to dynamic route
   */
  query?: object;
  /**
   * params is passed to dynamic route.
   * @example { slug: "home-in-city" } --> /product/home-in-city
   */
  disableShadow?: boolean;
  className?: string;
}

const Link: React.FC<ILinkProps> = (props) => {
  const router = useRouter();
  const {
    routeName,
    disableShadow = false,
    className = '',
    query = {},
    params = {},
  } = props;

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

  // incase we replace all params but it still has /:abc in url,
  // replace it by -.

  href = href.replace(/(\/:)\w+/g, '/-');

  if (Object.keys(query).length) {
    const queryString = renderQueryStringFromObject(query);
    href += `?${queryString}`;
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!disableShadow) {
      e.preventDefault();
      router.push(href);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === '13') {
      e.preventDefault();
      router.push(href);
    }
  };
  return (
    <a
      href={href}
      className={`block cursor-pointer ${className}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}>
      {props.children}
    </a>
  );
};

export default Link;

const renderQueryStringFromObject = (query: object) => {
  return new URLSearchParams(query as any)?.toString();
};
