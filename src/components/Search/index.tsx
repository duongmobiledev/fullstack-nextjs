import { Listbox, Transition } from '@headlessui/react';
import { debounce } from 'lodash';
import { useState, useCallback, Fragment } from 'react';

import { classNames } from '@common/functions/string';

import Select from '@designs/Select';

import { useClickOutSide } from '@hooks/useClickOutside';

import { Input } from './InputDebounce';

interface Props {
  options: IOption[];
  onFetchAPI: (key: string, value: string) => Promise<string[]>;
  onSelect: (key: string, value: string) => void;
}
export interface IOption {
  value: string;
  label: string;
}
export const Search = (props: Props) => {
  const { options, onFetchAPI, onSelect } = props;
  const { elementRef, isVisible, setElementVisible } = useClickOutSide(false);
  const [filterSelected, setFilterSelected] = useState<IOption>(options?.[0]);
  const [loading, setLoading] = useState(false);
  const [optionsSuggest, setOptionsSuggest] = useState<string[]>([]);
  const [optionSelected, setOptionSelected] = useState<string>('');

  const handleChange = async (key: string, value: string) => {
    if (value?.length === 0) {
      setOptionsSuggest([]);
      setOptionSelected('');
      setElementVisible(false);
      onSelect && onSelect('', '');
    } else {
      setLoading(true);
      onFetchAPI(key, value).then((res) => {
        setOptionsSuggest(res);
        setElementVisible(true);
        setLoading(false);
      });
    }
  };
  const handleSelect = (option: IOption) => {
    setFilterSelected(option);
  };
  const handleClickOption = (option: string) => () => {
    setOptionSelected(option);
    onSelect && onSelect(filterSelected?.value, option);
    setElementVisible(false);
  };

  const handleFocus = () => {
    if (optionsSuggest?.length > 0) {
      setElementVisible(true);
    }
  };
  const handleBlur = () => setElementVisible(false);
  return (
    <div className="grid items-end grid-cols-12 gap-2">
      <div className="flex items-center col-span-12 gap-2 lg:col-span-5 xl:col-span-3">
        <h1 className="text-sm font-semibold text-gray-900 min-w-max ">
          Tìm theo
        </h1>
        <Select
          className=""
          label=""
          options={options}
          optionSelected={filterSelected}
          onSelect={handleSelect}
          optionTarget="label"
        />
      </div>
      <div
        ref={elementRef}
        className="relative col-span-12 lg:col-span-7 xl:col-span-6">
        <Input
          onBlur={handleBlur}
          onFocus={handleFocus}
          loading={loading}
          valueSelected={optionSelected}
          onChange={handleChange}
          valueFilter={filterSelected?.value}
        />
        <Listbox value={optionSelected} onChange={handleClickOption}>
          <Transition
            show={isVisible}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options
              className={`absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm top-full`}>
              {optionsSuggest?.length > 0 ? (
                optionsSuggest?.map((option, index) => (
                  <Listbox.Option
                    key={String(index)}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 text-left pr-9'
                      )
                    }
                    value={option}>
                    {({ selected, active }) => (
                      <p
                        onClick={handleClickOption(option)}
                        className={classNames(
                          selected ? 'font-semibold' : 'font-normal',
                          'block truncate'
                        )}>
                        {option}
                      </p>
                    )}
                  </Listbox.Option>
                ))
              ) : (
                <Listbox.Option
                  className="relative py-2 pl-3 text-left text-gray-400 cursor-default select-none pr-9"
                  value={''}>
                  <span className="font-normal">Không tìm thấy dữ liệu</span>
                </Listbox.Option>
              )}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    </div>
  );
};
