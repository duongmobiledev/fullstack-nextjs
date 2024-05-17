import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@components/Dialog';
import Spinner from '@components/Spinner';

import Button from '@designs/Button';

import { getPackageAllRequest } from '@redux/actions/license';

import { IRootState } from '@typings';

interface ModalPackagesProps {
  isOpen: boolean;
  onClose: () => void;
  onClickItem: (value, key) => void;
}
export const ModalPackages = (props: ModalPackagesProps) => {
  const { onClose, isOpen, onClickItem } = props;
  const dispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.license);

  useEffect(() => {
    dispatch(getPackageAllRequest());
  }, []);

  return (
    <Dialog onClose={onClose} open={isOpen} title="Chọn gói bản quyền">
      <div className="flex flex-col gap-2">
        {state.packageAll?.length === 0 ? (
          <div className="flex items-center justify-center max-w-full py-5 ">
            <Spinner />
          </div>
        ) : (
          <div />
        )}
        {state.packageAll?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {state.packageAll?.map((e, index) => (
              <button
                onClick={() => {
                  onClickItem(e?._id, e?.name);
                  onClose();
                }}
                key={e?._id}
                className="gap-2 p-5 mt-2 border-2 border-dashed rounded-md">
                <p className="text-left">Số {index + 1}</p>
                <p className="text-left">Tên: {e?.name}</p>
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}

        <div className="flex justify-end w-full">
          <Button onClick={onClose} className="w-20 mt-8" label="Đóng"></Button>
        </div>
      </div>
    </Dialog>
  );
};
