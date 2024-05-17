import { TableHistory } from './components';

interface IHistoryAdminProps {}

export const HistoryAdmin: React.FC<IHistoryAdminProps> = (props) => {
  return (
    <div className="px-4 sm:px-6 lg:p-8 bg-white	">
      <TableHistory />
    </div>
  );
};
export default HistoryAdmin;
