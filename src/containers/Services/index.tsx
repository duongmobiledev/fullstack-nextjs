import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccessTokenLocalStorage } from '@common/utils/auth';

import Spinner from '@components/Spinner';

import { DEFAULT_LIMIT } from '@constants/app';

import NotFound from '@containers/404';

import { loadDataServices } from '@redux/actions/services';
import { IRootState } from '@redux/reducers';

import { Pagination, ProductItem } from './components';

interface IServicesProps {}
const Services: React.FC<IServicesProps> = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.services);

  useEffect(() => {
    if (state.dataService.length === 0) {
      dispatch(loadDataServices({ offset: 0, limit: DEFAULT_LIMIT }));
    }
  }, []);

  if (state.error) {
    return <NotFound title="Lỗi" content="Không tìm thấy sản phẩm nào" />;
  }

  return (
    <>
      <div className="bg-zinc-100">
        <div className="items-center justify-center max-w-2xl px-4 mx-auto sm:py-10 sm:px-6 lg:max-w-7xl ">
          {state.dataUI?.serviceBannerUri != null ? (
            <div className="flex items-center justify-center w-full rounded-lg ">
              <img
                className="object-cover h-100% rounded-lg"
                src={state.dataUI?.serviceBannerUri}
              />
            </div>
          ) : null}
          {state.dataService?.length > 0 ? (
            <div className="grid grid-cols-1 mt-5 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {state.dataService?.map((e) => (
                <ProductItem item={e} key={e._id} />
              ))}
            </div>
          ) : (
            <div />
          )}
          {state.loading ? (
            <div className="flex items-center justify-center max-w-full py-5 ">
              <Spinner />
            </div>
          ) : (
            <div />
          )}
          {state.dataService?.length > 0 &&
          state.dataService?.length < state.total &&
          !state.loading ? (
            <Pagination />
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
