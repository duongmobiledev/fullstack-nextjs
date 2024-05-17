import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@components/Dialog';
import Spinner from '@components/Spinner';

import { DEFAULT_LIMIT } from '@constants/app';

import Pagination from '@containers/Services/components/Pagination';

import Button from '@designs/Button';

import { loadDataServices } from '@redux/actions/services';

import { IRootState, IService } from '@typings';

interface ModalServicesProps {
  isOpen: boolean;
  onClose: () => void;
  onClickItem: (value: string[]) => void;
}
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
export const ModalServices = (props: ModalServicesProps) => {
  const { onClose, isOpen, onClickItem } = props;
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.services);
  const [data, setData] = useState<IService[]>([]);
  useEffect(() => {
    if (state.dataService.length == 0) {
      dispatch(loadDataServices({ offset: 0, limit: DEFAULT_LIMIT }));
    }
  }, []);
  useEffect(() => {
    const _temp: IService[] = [];
    state.dataService?.map((e) => {
      _temp.push({
        isActive: false,
        _id: e?._id,
        description: e?.description,
        license: e?.license,
        name: e?.name,
        packages: e?.packages,
        price: e?.price,
      });
    });
    setData([...data, ..._temp]);
  }, [state.dataService]);

  const onClick = (index: number) => {
    let _temp: IService[] = data;
    _temp[index].isActive = !_temp[index].isActive;
    setData([..._temp]);
  };
  return (
    <Dialog onClose={onClose} open={isOpen} title="Chọn sản phẩm">
      <div className="flex flex-col gap-2 ">
        {state.loading ? (
          <div className="flex items-center justify-center max-w-full py-5 ">
            <Spinner />
          </div>
        ) : (
          <div />
        )}
        {data?.length > 0 ? (
          <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
            {data?.map((e, index) => (
              <button
                onClick={() => {
                  onClick(index);
                  // onClickItem(e?._id);
                  // onClose();
                }}
                key={e?._id}
                className={classNames(
                  e?.isActive ? 'bg-cyan-600' : 'bg-white',
                  'gap-2 p-5 mt-2 border-2 border-dashed rounded-md'
                )}>
                <p className="text-left">No. {index + 1}</p>
                <p className="text-left">Tên: {e?.name}</p>
              </button>
            ))}
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

        <div className="flex justify-center w-full">
          <Button
            onClick={() => {
              const temp: string[] = [];
              for (var i = 0; i < data.length; i++) {
                if (data[i].isActive) {
                  temp.push(data[i]._id);
                }
              }
              onClickItem(temp);
              onClose();
            }}
            className="w-48 mt-8"
            label="Xác nhận"></Button>
        </div>
      </div>
    </Dialog>
  );
};
