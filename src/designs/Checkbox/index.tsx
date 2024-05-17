import { memo, useState } from 'react';

interface ICheckboxProps {
  label: string;
  desc?: string;
  initChecked: boolean;
  onChecked: () => void;
  className?: string;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

const CheckboxCpn: React.FC<ICheckboxProps> = (props) => {
  const {
    initChecked,
    label,
    onChecked,
    className,
    desc,
    disabled = false,
    errorMessage,
    required,
  } = props;
  const handleChecked = () => {
    onChecked && onChecked();
  };
  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            onChange={handleChecked}
            id="checkbox"
            disabled={disabled}
            checked={initChecked}
            name="checkbox"
            type="checkbox"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700">{label}</label>
          <p className="text-gray-500">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckboxCpn;
