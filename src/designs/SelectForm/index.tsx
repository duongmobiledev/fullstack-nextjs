import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import {
  DetailedHTMLProps,
  Fragment,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  Controller,
  Control,
} from 'react-hook-form';
import { Type } from 'typescript';

interface ISelectProps<T = any> {
  className?: string;
  label: string;
  options: T[];
  direction?: 'top' | 'bot';
  onSelect?: (option: T) => void;
  renderOption?: (opt: T, active?: boolean, selected?: boolean) => JSX.Element;
  renderDisplay?: (opt: T) => JSX.Element;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
  name: string;
  /**
   * @description optionTarget is key of option which will be displayed in feature
   * @default optionTarget = "name"
   */
  optionTarget: string;
  control: Control<any>;
}
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SelectForm: React.FC<ISelectProps> = (props) => {
  const {
    name,
    className,
    control,
    label,
    options,
    onSelect,
    disabled,
    required,
    errorMessage,
    optionTarget,
    renderOption,
    renderDisplay,
    direction = 'bot',
    placeholder = 'Choose item',
  } = props;

  return (
    <div className={`w-full ${className}`}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Listbox
            disabled={disabled}
            value={value}
            onChange={(event) => {
              onChange(event);
              onSelect && onSelect(event);
            }}>
            {({ open }) => (
              <>
                {label && (
                  <Listbox.Label className="block mb-1 text-sm font-medium text-left text-gray-700">
                    {label}
                    <span className="ml-1 text-red-500">{required && '*'}</span>
                  </Listbox.Label>
                )}
                <div className="relative ">
                  <Listbox.Button
                    className={`relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 border-solid rounded-md shadow-sm cursor-default disabled:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      Boolean(errorMessage) && 'border-red-500 '
                    }`}>
                    <span className="block truncate">
                      {renderDisplay ? (
                        renderDisplay(value)
                      ) : (value as any)?.[optionTarget] ? (
                        (value as any)?.[optionTarget]
                      ) : (
                        <span className="text-gray-400 ">{placeholder}</span>
                      )}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <Listbox.Options
                      className={`absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${
                        direction === 'bot' ? 'top-full' : 'bottom-full'
                      }`}>
                      {options?.map((option, index) => (
                        <Listbox.Option
                          key={String(index)}
                          className={({ active }) =>
                            classNames(
                              active
                                ? 'text-white bg-indigo-600'
                                : 'text-gray-900',
                              'cursor-default select-none relative py-2 pl-3 text-left pr-9'
                            )
                          }
                          value={option}>
                          {({ selected, active }) =>
                            renderOption ? (
                              renderOption(option, active, selected)
                            ) : (
                              <>
                                <span
                                  className={classNames(
                                    selected ? 'font-semibold' : 'font-normal',
                                    'block truncate'
                                  )}>
                                  {(option as any)?.[optionTarget]}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? 'text-white' : 'text-indigo-600',
                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                    )}>
                                    <CheckIcon
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )
                          }
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
                {Boolean(errorMessage) && (
                  <p className="mt-1 text-xs text-left text-red-500 ">
                    {errorMessage}
                  </p>
                )}
              </>
            )}
          </Listbox>
        )}
      />
    </div>
  );
};

export default SelectForm;
