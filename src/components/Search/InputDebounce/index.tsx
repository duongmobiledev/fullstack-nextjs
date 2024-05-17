import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import Spinner from '@components/Spinner';

interface Props {
  onBlur: () => void;
  onFocus: () => void;
  onChange: (key: string, value: string) => void;
  valueSelected: string;
  valueFilter: string;
  loading: boolean;
}
export const Input = (props: Props) => {
  const { onChange, onFocus, onBlur, valueSelected, loading, valueFilter } =
    props;
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(valueSelected);
  }, [valueSelected]);

  const handleChangeInput = (event: ChangeEvent<any>) => {
    const value = event.target.value;
    setValue(value);
    debouceInput(value, valueFilter);
  };
  const debouceInput = useCallback(
    debounce((value: string, key: string) => {
      onChange(key, value);
    }, 300),
    []
  );
  return (
    <div className="relative flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
      <input
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
        autoComplete="off"
        className="block w-full p-0 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 sm:text-sm"
        placeholder="Nhập để tìm"
        onChange={handleChangeInput}
      />
      {loading && (
        <div className="absolute -translate-y-1/2 right-2 top-1/2">
          <Spinner />
        </div>
      )}
    </div>
  );
};
