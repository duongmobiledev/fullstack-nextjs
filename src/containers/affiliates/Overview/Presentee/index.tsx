import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '@components/Pagination';

import { DEFAULT_LIMIT } from '@constants/app';

import { getPresentees } from '@redux/actions/affiliate';

import { PATH } from '@routes';

import { IGetListAPIPagination, IRootState } from '@typings';

interface IPresentee {}
const SIZE_PER_PAGE = 10;
const Presentee: React.FC<IPresentee> = (props) => {
  const { users } = useSelector((state: IRootState) => state.affilidate);
  const [currentIndexPresentee, setCurrentIndexPresentee] = useState<number>(1);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    query: { pagePresentee },
  } = router;

  useEffect(() => {
    if (pagePresentee != undefined) {
      if (Number(pagePresentee as string) != currentIndexPresentee) {
        setCurrentIndexPresentee(Number(pagePresentee as string));
      }
    }
  }, []);
  useEffect(() => {
    getListPresenteesAPI(0);
  }, []);
  const getListPresenteesAPI = (page: number) => {
    const payload: IGetListAPIPagination = {
      limit: SIZE_PER_PAGE,
      offset: page * SIZE_PER_PAGE,
    };
    dispatch(getPresentees(payload));
  };
  const onReloadPage = (index: number) => {
    getListPresenteesAPI(index);
    setCurrentIndexPresentee(index);
    router.push({
      pathname: PATH.AFFILIATES.OVERVIEW,
      query: { pagePresentee: index },
    });
  };
  return (
    <div className="mt-8 ">
      <h5 className="font-bold text-md lg:text-xl">
        Danh sách người bạn đã giới thiệu
      </h5>
      <div className="flex flex-col mt-2">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 w-[100px] min-w-[100px] pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                      STT
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 min-w-[150px] text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 min-w-[200px] text-center text-sm font-semibold text-gray-900">
                      Thời gian đăng ký
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.items?.length > 0 ? (
                    users?.items?.map((item, index) => (
                      <tr key={item?._id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-center text-gray-900 whitespace-nowrap sm:pl-6">
                          {index + 1}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {item?.email}
                        </td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                          {DateTime.fromISO(item?.created_at).toFormat(
                            'HH:mm dd/MM/yyyy'
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 pl-4 pr-3 italic text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {users?.items?.length > SIZE_PER_PAGE && (
                <Pagination
                  limit={SIZE_PER_PAGE}
                  onCallBack={(index) => onReloadPage(index)}
                  total={users?.total}
                  page={currentIndexPresentee}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentee;
