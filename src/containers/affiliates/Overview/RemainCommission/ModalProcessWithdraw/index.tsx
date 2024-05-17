import Dialog from '@components/DialogNoButton';

import Button from '@designs/Button';

interface IModalProcessWithdraw {
  open: boolean;
  onClose: () => void;
}

const ModalProcessWithdraw: React.FC<IModalProcessWithdraw> = (props) => {
  const { onClose, open } = props;
  return (
    <Dialog title="Thông báo" open={open} onClose={onClose}>
      <div className="px-6 py-2">
        <h5 className="text-base font-medium">
          Yêu cầu rút của bạn đang được xử lý. Bạn sẽ nhận được hoa hồng theo
          thông tin bạn đã cung cấp trong vòng không quá 48 giờ tới
        </h5>
      </div>

      <Button
        onClick={onClose}
        label="Đóng"
        variant="secondary"
        className="mx-auto mt-3 max-w-fit"
      />
    </Dialog>
  );
};

export default ModalProcessWithdraw;
