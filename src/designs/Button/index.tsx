import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import Spinner from '@components/Spinner';

interface IButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  loading?: boolean;
}
const Button: React.FC<IButton> = (props) => {
  const {
    className,
    loading = false,
    label,
    variant = 'primary',
    ...res
  } = props;
  const buttonType =
    variant === 'primary'
      ? 'flex justify-center w-full px-6 py-2 text-sm font-medium text-white bg-sky-600 border border-solid border-transparent rounded-md shadow-sm hover:bg-sky-800 disabled:bg-opacity-60 disabled:cursor-not-allowed  focus:ring-2  focus:outline-none'
      : 'px-6 py-2 w-full text-sm font-medium disabled:bg-opacity-60 disabled:cursor-not-allowed text-gray-700 bg-white border border-solid border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none ';
  return (
    <div className={className}>
      <button type="button" className={buttonType} disabled={loading} {...res}>
        <div className="mr-1 cursor-not-allowed ">{loading && <Spinner />}</div>
        {label}
      </button>
    </div>
  );
};

export default Button;
