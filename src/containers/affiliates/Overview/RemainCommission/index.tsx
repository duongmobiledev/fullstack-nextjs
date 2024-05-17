import { off } from 'process';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatCurrencyVND } from '@common/functions';

import { resetAction, setLoading } from '@redux/actions/common';

import { checkOnProcessingWithdrawRequest } from '@services/affiliate';

import { IResponse, IRootState } from '@typings';

import ModalProcess from './ModalProcessWithdraw';
import ModalWithdraw from './ModalWithdraw';

interface IRemainCommission {}

const RemainCommission: React.FC<IRemainCommission> = (props) => {
  const { overview } = useSelector((state: IRootState) => state.affilidate);
  const { actionSuccess } = useSelector((state: IRootState) => state.common);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (actionSuccess) {
      dispatch(resetAction());
      handleCloseWithdraw();
    }
  }, [actionSuccess]);

  const handleClickWithdraw = async () => {
    dispatch(setLoading(true));
    try {
      const response = await checkOnProcessingWithdrawRequest();
      dispatch(setLoading(false));
      if (response?.data?.result) {
        setOpenNotify(true);
      } else {
        setOpenWithdraw(true);
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  };
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
  };
  return (
    <>
      <div className="relative h-full px-2 pt-2 pb-8 overflow-hidden bg-white rounded-lg">
        <h5 className="text-sm font-bold text-center lg:text-lg">
          Hoa hồng chưa rút
        </h5>
        <p className="mt-4 text-lg font-bold text-center text-red-600 lg:text-xl">
          {formatCurrencyVND(overview?.balance || 0)}
        </p>

        <button
          disabled={overview?.balance === 0}
          onClick={handleClickWithdraw}
          className="absolute disabled:bg-opacity-70 disabled:cursor-not-allowed bottom-0 left-0 w-full py-0.5 text-white bg-orange-400">
          Rút
        </button>
      </div>
      <ModalWithdraw
        onClose={() => setOpenWithdraw(false)}
        open={openWithdraw}
      />
      <ModalProcess onClose={() => setOpenNotify(false)} open={openNotify} />
    </>
  );
};

export default RemainCommission;
