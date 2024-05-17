import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '@components/Pagination';

import { DEFAULT_LIMIT } from '@constants/app';

import { getHistoryWithDraw } from '@redux/actions/affiliate';

import { PATH } from '@routes';

import { IRootState } from '@typings';

import { Header } from './components';
import Table from './components/Table';

interface IHistoryProps {}

const History: React.FC<IHistoryProps> = (props) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.affilidate);
  const { actionSuccess } = useSelector((state: IRootState) => state.common);

  const onReload = (index: number) => {
    setCurrentIndex(index);
    dispatch(
      getHistoryWithDraw({
        offset: (index - 1) * DEFAULT_LIMIT,
        limit: DEFAULT_LIMIT,
      })
    );
  };
  useEffect(() => {
    setCurrentIndex(0);
    dispatch(
      getHistoryWithDraw({
        offset: 0,
        limit: DEFAULT_LIMIT,
      })
    );
  }, []);

  return (
    <div className="flex flex-col mt-2">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <Header />
              <Table items={state.dataHistory?.items} />
            </table>
            {state.dataHistory?.items?.length > DEFAULT_LIMIT && (
              <Pagination
                limit={10}
                onCallBack={(index) => onReload(index)}
                total={state.dataHistory?.total}
                page={currentIndex}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
