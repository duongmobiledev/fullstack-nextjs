import Dialog from '@components/Dialog';

import Button from '@designs/Button';

interface IAlertDialogProps {
  message: string;
  onClose: () => void;
}

const AlertDialog: React.FC<IAlertDialogProps> = (props) => {
  const { message, onClose } = props;
  return (
    <Dialog title="Thông báo" open={message !== ''} onClose={onClose}>
      <div className="text-base text-center">{message}</div>
      <div className="flex justify-end mt-2">
        <Button onClick={onClose} label="Đồng ý" />
      </div>
    </Dialog>
  );
};

export default AlertDialog;
