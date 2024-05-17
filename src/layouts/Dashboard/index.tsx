import withAuth from '@HOC/withAuth';
import { Dialog, Transition } from '@headlessui/react';
import { MenuAlt2Icon, XIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import { Fragment, useState, PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getTokenLocalStorage,
  getAccessTokenLocalStorage,
} from '@common/utils/auth';

import Meta from '@components/Meta';

import useAuth from '@hooks/useAuth';
import { useRedirect } from '@hooks/useRedirect';

import {
  getProfileUser,
  refreshToken,
  resetRefresh,
  resetUpdateProfileSuccess,
} from '@redux/actions/auth';
import { resetAction, setNotify } from '@redux/actions/common';

import { PATH } from '@routes';

import { IRootState } from '@typings';

import {
  SearchInput,
  SideBarItem,
  ViewLayout,
  ViewProfile,
} from './components';

interface ILayoutDashboardProps extends PropsWithChildren {
  title: string;
}

const LayoutDashboard: React.FC<ILayoutDashboardProps> = (props) => {
  const { title, children } = props;
  const dispatch = useDispatch();
  const redirect = useRedirect();
  const { user, updateSuccess, refreshSuccess } = useSelector(
    (state: IRootState) => state.auth
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onClickSideBar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (getTokenLocalStorage()) {
      if (!getAccessTokenLocalStorage()) {
        getAccessToken();
      }
    }
  }, [getTokenLocalStorage()]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(resetUpdateProfileSuccess());
      dispatch(getProfileUser());
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (refreshSuccess) {
      dispatch(resetRefresh());
    }
  }, [refreshSuccess]);

  const getAccessToken = () => {
    const token = getTokenLocalStorage();
    dispatch(refreshToken({ refreshToken: token || '' }));
  };
  return (
    <>
      <Meta title={title} />
      <div className="w-full h-full bg-zinc-100 ">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full">
                <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-cyan-700">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                      <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={onClickSideBar}>
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <SideBarItem isDeskTop={false} />
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-cyan-700">
            <SideBarItem isDeskTop={true} />
          </div>
        </div>
        <div className="flex flex-col flex-1 h-screen md:pl-64 bg-zinc-100">
          <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 md:hidden"
              onClick={onClickSideBar}>
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="flex justify-end flex-1 px-4">
              {/* <SearchInput isDeskTop={true} /> */}
              <ViewProfile user={user} />
            </div>
          </div>
          <div className="bg-zinc-100">
            <ViewLayout>{children}</ViewLayout>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(LayoutDashboard);
