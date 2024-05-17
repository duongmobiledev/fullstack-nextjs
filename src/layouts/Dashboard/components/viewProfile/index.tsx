import { Menu } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import { Md5 } from 'md5-typescript';
import { useRouter } from 'next/router';
import { memo } from 'react';

import Link from '@designs/Link';

import useAuth from '@hooks/useAuth';

import { PATH, paths } from '@routes';

import { IUser } from '@typings';

interface IViewProfileProps {
  user: IUser;
}

const ViewProfileCpn: React.FC<IViewProfileProps> = (props) => {
  const lstPaths = paths.slice(0, 5);
  const router = useRouter();
  const isHref = lstPaths.find((obj) => obj.name === PATH.PROFILE);
  const { profile } = useAuth();
  const handleEmail = Md5.init(profile?.email ? profile.email : 'Anonymous');
  return (
    <>
      <div className="flex items-center ml-4 md:ml-6">
        {/* <button
          type="button"
          className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="sr-only">View notifications</span>
          <BellIcon className="w-6 h-6" aria-hidden="true" />
        </button> */}
        <Menu as="div" className="relative ml-3">
          <Link routeName={PATH.PROFILE}>
            <Menu.Button
              className={
                isHref?.path == router.asPath
                  ? 'flex items-center max-w-xs text-sm bg-white rounded-full outline-none ring-2 ring-offset-2 ring-indigo-500'
                  : 'flex items-center max-w-xs text-sm bg-white'
              }>
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={`https://www.gravatar.com/avatar/${handleEmail}?r=pg&d=retro`}
                alt=""
              />
            </Menu.Button>
          </Link>
        </Menu>
      </div>
    </>
  );
};
const funCompare = (pre: IViewProfileProps, next: IViewProfileProps) => {
  if (pre.user || next.user) {
    return pre.user?.email === next.user?.email;
  }
};
export default memo(ViewProfileCpn, funCompare);
