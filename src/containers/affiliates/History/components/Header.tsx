interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = (props) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="py-3.5 min-w-[20px] pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
          STT
        </th>
        <th
          scope="col"
          className="py-3.5 min-w-[50px] text-left pl-4 pr-3  text-sm font-semibold text-gray-900 sm:pl-6">
          ID
        </th>
        <th
          scope="col"
          className="py-3.5 min-w-[150px] pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
          Thời gian yêu cầu
        </th>
        <th
          scope="col"
          className="py-3.5 min-w-[150px] pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
          Thông tin nhận thanh toán
        </th>
        <th
          scope="col"
          className="py-3.5 min-w-[100px] pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-6">
          Số tiền
        </th>
        <th
          scope="col"
          className="py-3.5 min-w-[100px] pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
          Trạng thái
        </th>
      </tr>
    </thead>
  );
};
export default Header;
