import { Dialog, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Fragment, useState } from 'react';

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
interface IReceiptProps {}

const Receipt: React.FC<IReceiptProps> = (props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div>Receipt</div>
    </>
  );
};

export default Receipt;
