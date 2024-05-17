/* This example requires Tailwind CSS v2.0+ */
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { ErrorIcon, InfoIcon, SuccessIcons, WarnIcon } from '@icons';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setNotify } from '@redux/actions/common';

import { IRootState } from '@typings';

const Notification = () => {
  const { notify } = useSelector((state: IRootState) => state.common);
  const disapatch = useDispatch();

  useEffect(() => {
    if (notify !== null) {
      setTimeout(() => {
        disapatch(setNotify(null));
      }, 5000);
    }
  }, [notify !== null && notify.type]);
  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
        <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
          <Transition
            show={notify !== null}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notify !== null && notify.type === 'error' && (
                      <ErrorIcon className="w-6 h-6" />
                    )}
                    {notify !== null && notify.type === 'info' && (
                      <InfoIcon className="w-6 h-6" />
                    )}
                    {notify !== null && notify.type === 'success' && (
                      <SuccessIcons className="w-6 h-6" />
                    )}
                    {notify !== null && notify.type === 'warn' && (
                      <WarnIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {notify !== null && notify.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {notify !== null && notify.message}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 ml-4">
                    <button
                      type="button"
                      className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        disapatch(setNotify(null));
                      }}>
                      <XIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};
export default Notification;
