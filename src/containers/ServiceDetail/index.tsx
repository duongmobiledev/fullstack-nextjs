import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import NotFound from '@containers/404';

import { loadDataDetailServices } from '@redux/actions/services';

import { IRootState } from '@typings';

import ProductInformation from './components/ProductInformation';

export default function ServiceDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state: IRootState) => state.services);
  const {
    query: { id },
  } = router;

  useEffect(() => {
    dispatch(loadDataDetailServices({ id: id as string }));
  }, []);
  if (state.errorDetail) {
    return <NotFound title="Lỗi" content="Không tìm thấy sản phẩm nào" />;
  }

  return (
    <div className="bg-white rounded-md	">
      <div className="mx-auto py-5 px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8">
        <ProductInformation />
      </div>
    </div>
  );
}
