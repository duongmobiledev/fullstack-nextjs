import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';

import Link from '@designs/Link';

import { PATH } from '@routes';

import { ITab } from '@typings';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const AdminLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { pathname } = useRouter();

  const tabs: ITab[] = [
    {
      key: 'CUSTOMER',
      name: 'Khách hàng',
      routeName: PATH.ADMIN.CUSTOMER,
    },
    {
      key: 'ORDER',
      name: 'Đơn hàng',
      routeName: PATH.ADMIN.ORDER,
    },

    {
      key: 'COUPON',
      name: 'Coupon',
      routeName: PATH.ADMIN.COUPON,
    },
    {
      key: 'AFFILIATES',
      name: 'Affiliates',
      routeName: PATH.ADMIN.AFFILIATES,
    },
    {
      key: 'BANNER',
      name: 'Banner',
      routeName: PATH.ADMIN.BANNER,
    },
    {
      key: 'HISTORY',
      name: 'Lịch sử admin',
      routeName: PATH.ADMIN.HISTORY_ADMIN,
    },
  ];
  const curPath = tabs.find((item) =>
    pathname.toLocaleUpperCase().includes(item?.routeName)
  );

  return (
    <div className="mt-3">
      <div className="block">
        <nav
          className="flex overflow-x-auto border-b border-solid divide-x border-zinc-200 isolate"
          aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              routeName={tab.routeName}
              className={classNames(
                tab.routeName === curPath?.routeName
                  ? 'text-cyan-500 bg-white rounded-tl-md rounded-tr-md'
                  : 'text-gray-500 hover:text-cyan-500',
                'group  relative w-fit min-w-fit overflow-hidden py-4 px-6 text-sm font-medium text-center  '
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

export default AdminLayout;
