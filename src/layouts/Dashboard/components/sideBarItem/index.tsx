import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Link from '@designs/Link';

import useAuth from '@hooks/useAuth';

import { menuDashboard, PATH, paths } from '@routes';

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
interface ISideBarItemProps {
  isDeskTop: boolean;
}
const SideBarItem: React.FC<ISideBarItemProps> = (props) => {
  const router = useRouter();
  const { profile } = useAuth();
  const [listPath, setListPath] = useState([]);
  const currentPath = router.asPath.split('/')[1];

  useEffect(() => {
    if (!profile?.isAdmin) {
      const listAdmin = menuDashboard?.filter((item) => !item?.isAdmin);
      setListPath(listAdmin);
    } else {
      setListPath(menuDashboard);
    }
  }, [profile]);
  return (
    <>
      <div className="flex items-center flex-shrink-0 px-4">
        <Link routeName={PATH.SERVICES}>
          <img
            className="w-auto h-8"
            src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
            alt="Workflow"
          />
        </Link>
      </div>
      {props.isDeskTop ? (
        <nav className="flex-1 px-2 mt-5 space-y-1 bg-transparent">
          {listPath?.map((item) => (
            <Link
              routeName={item.name}
              key={item.dashBoardName}
              className={classNames(
                item.path.includes(currentPath)
                  ? 'bg-cyan-800 text-white'
                  : 'text-cyan-100 hover:bg-cyan-600',
                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
              )}>
              <item.icon
                className={'mr-4 flex-shrink-0 h-6 w-6 text-cyan-300'}
                aria-hidden="true"
              />
              {item.dashBoardName}
            </Link>
          ))}
        </nav>
      ) : (
        <nav className="px-2 mt-5 space-y-1">
          {listPath?.map((item) => (
            <Link
              routeName={item.name}
              key={item.dashBoardName}
              className={classNames(
                item.path.includes(currentPath)
                  ? 'bg-cyan-800 text-white'
                  : 'text-cyan-100 hover:bg-cyan-600',
                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
              )}>
              <item.icon
                className={'mr-4 flex-shrink-0 h-6 w-6 text-cyan-300'}
                aria-hidden="true"
              />
              {item?.dashBoardName}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};

export default SideBarItem;
