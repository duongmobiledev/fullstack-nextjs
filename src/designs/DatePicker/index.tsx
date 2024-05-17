import { Transition } from '@headlessui/react';
import { vi } from 'date-fns/locale';
import { DateTime } from 'luxon';
import { Fragment, useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  DatePickerCalendar,
  DateRangePickerCalendarProps,
} from 'react-nice-dates';
import 'react-nice-dates/build/style.css';

import { useClickOutSide } from '@hooks/useClickOutside';

interface IDatePicker {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  direction?: 'top' | 'bottom';
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<IDatePicker> = (props) => {
  const {
    control,
    name,
    label,
    disabled,
    errorMessage,
    placeholder,
    required,
    direction = 'bottom',
    className,
    minDate,
    maxDate,
  } = props;
  const [show, setShow] = useState(false);

  const handleFocus = () => {
    setShow(!show);
  };

  return (
    <div className={className}>
      <div>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <div className="relative w-full">
              {label && (
                <label className="block text-sm font-medium text-left text-gray-700">
                  {label}
                  <span className="ml-1 text-red-500">{required && '*'}</span>
                </label>
              )}
              <input
                autoComplete="off"
                onFocus={handleFocus}
                value={
                  value ? DateTime.fromJSDate(value).toFormat('dd/MM/yyyy') : ''
                }
                disabled={disabled}
                className={`block w-full appearance-none px-3 py-2 mt-1 border border-gray-300 border-solid rounded-md shadow-sm disabled:bg-gray-200 placeholder:text-gray-400 outline-none focus:border-cyan-400 focus:ring-cyborder-cyan-400 sm:text-sm ${
                  errorMessage && 'border-red-500 focus:border-red-500'
                }`}
                placeholder={placeholder}
              />
              <Transition
                show={show}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div
                  className={`absolute z-50 w-full shadow-lg py-2 ${
                    direction === 'top' ? 'bottom' : 'top'
                  }-full left-0 bg-white duration-150`}>
                  <DatePickerCalendar
                    date={value}
                    onDateChange={(date: Date | null) => {
                      onChange(date);
                      setShow(false);
                    }}
                    locale={vi}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                  />
                </div>
              </Transition>
              {Boolean(errorMessage) && (
                <p className="mt-1 text-xs text-left text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        />
        {show && (
          <div
            onClick={() => setShow(false)}
            className="fixed top-0 left-0 z-40 w-screen h-screen bg-transparent"
          />
        )}
      </div>
    </div>
  );
};

export default DatePicker;
