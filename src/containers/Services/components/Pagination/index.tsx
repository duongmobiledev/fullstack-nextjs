import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DEFAULT_LIMIT } from '@constants/app';

import { loadDataServices } from '@redux/actions/services';

import { IRootState } from '@typings';

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
interface IPaginationProps {}

const Pagination: React.FC<IPaginationProps> = (props) => {
  const state = useSelector((state: IRootState) => state.services);
  const dispatch = useDispatch();
  const onLoadMore = () => {
    if (state.dataService.length < state.total) {
      dispatch(
        loadDataServices({
          offset: state.dataService.length,
          limit: DEFAULT_LIMIT,
        })
      );
    }
  };
  return (
    <>
      <div className=" display: flex max-w-full items-center justify-center py-5	">
        <button
          onClick={() => {
            onLoadMore();
          }}>
          <dt className="font-base mt-5 text-base text-blue-600">Xem Thêm</dt>
        </button>
      </div>
    </>
  );
};

export default Pagination;
