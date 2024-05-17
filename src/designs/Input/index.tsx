import { DetailedHTMLProps, InputHTMLAttributes, KeyboardEvent } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface IInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  name: string;
  register: UseFormRegister<any>;
  required: boolean;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  type?: string;
}

const Input: React.FC<IInputProps> = (props) => {
  const {
    label,
    name,
    register,
    required,
    placeholder,
    className,
    errorMessage,
    inputClassName,
    type = 'string',
    ...res
  } = props;
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number') {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    }
  };
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-left text-gray-700">
          {label}
          <span className="ml-1 text-red-500">{required && '*'}</span>
        </label>
      )}
      <div className="mt-1 ">
        <input
          autoComplete="off"
          placeholder={placeholder}
          className={` block w-full appearance-none px-3 py-2 mt-1 border border-gray-300 border-solid rounded-md shadow-sm disabled:bg-gray-200 placeholder:text-gray-400 outline-none focus:border-cyan-400 focus:ring-cyborder-cyan-400 sm:text-sm ${inputClassName} ${
            errorMessage && 'border-red-500 focus:border-red-500'
          }`}
          onKeyPress={handleKeyPress}
          {...register(name)}
          {...res}
        />
      </div>
      <p className="mt-1 text-xs text-left text-red-500">{errorMessage}</p>
    </div>
  );
};

export default Input;
