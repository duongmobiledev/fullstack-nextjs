import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, PropsWithChildren } from 'react';

import Button from '@designs/Button';

interface IDialogProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  className?: string;
}

const DialogCpn: React.FC<IDialogProps> = (props) => {
  const { onClose, open, children, onConfirm, title, className } = props;
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel
                className={`relative p-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full w-full sm:p-6 ${className}`}>
                <div>
                  <div className="relative text-center ">
                    <Dialog.Title
                      as="h3"
                      className="pb-1 text-xl font-bold leading-6 text-left text-gray-900 border-b border-gray-200 border-solid">
                      {title}
                    </Dialog.Title>
                    <div
                      onClick={onClose}
                      className="absolute top-0 right-0 cursor-default ">
                      <img src="/svg/close.svg" width={24} height={24} />
                    </div>
                    <div className="mt-5">{children}</div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DialogCpn;
