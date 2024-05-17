import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';

import Link from '@designs/Link';

import { PATH } from '@routes';

import { ITab } from '@typings';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const AffiliatesLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { pathname } = useRouter();

  const tabs: ITab[] = [
    {
      key: 'OVERVIEW',
      name: 'Overview',
      routeName: PATH.AFFILIATES.OVERVIEW,
    },
    {
      key: 'HISTORY',
      name: 'History',
      routeName: PATH.AFFILIATES.HISTORY,
    },
  ];
  const curPath = tabs.find((item) =>
    pathname.toLocaleUpperCase().includes(item?.routeName)
  );
  return (
    <div className="mt-3">
      <div className="block">
        <nav
          className="flex border-b border-solid divide-x border-zinc-200 isolate"
          aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              routeName={tab.routeName}
              className={classNames(
                tab.routeName === curPath?.routeName
                  ? 'text-cyan-500 bg-white rounded-tl-md rounded-tr-md'
                  : 'text-gray-500 hover:text-cyan-500',
                'group  relative min-w-0  overflow-hidden py-4 px-6 text-sm font-medium text-center  '
              )}>
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.routeName === curPath?.routeName
                    ? 'bg-cyan-500'
                    : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5'
                )}
              />
            </Link>
          ))}
        </nav>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default AffiliatesLayout;
