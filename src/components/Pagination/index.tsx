import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

interface Props {
  total: number;
  page: number;
  onCallBack: (index: number) => void;
  limit: number;
}
const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
const Pagination = (props: Props) => {
  const { page, total, onCallBack, limit } = props;
  const totalPage = () => {
    if (total > limit) {
      if (total % limit == 0) {
        return Math.floor(total / limit);
      } else {
        return Math.floor(total / limit) + 1;
      }
    } else if (total < limit) {
      return 1;
    } else {
      return 0;
    }
  };

  const handleIndexPage = (index: number) => {
    if (totalPage() >= 1) {
      if (index < page + 2 && index >= page - 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <div className="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden ">
        {page != 1 ? (
          <button
            onClick={() => onCallBack(page - 1)}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Trở về
          </button>
        ) : (
          <div />
        )}
        {page < totalPage() ? (
          <button
            onClick={() => onCallBack(page + 1)}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Tiếp theo
          </button>
        ) : (
          <div />
        )}
      </div>

      <div className="justify-end hidden sm:flex sm:flex-1 ">
        <div className="flex items-center justify-center">
          {page != 1 ? (
            <button
              onClick={() => onCallBack(page - 1)}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-20">
              <span className="sr-only">Trở về</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          ) : (
            <div />
          )}
          {Array(totalPage())
            .fill('')
            .map((item, index) => {
              return handleIndexPage(index + 1) ? (
                <button
                  key={index}
                  className={classNames(
                    index + 1 == page
                      ? 'bg-indigo-50 border-blue-500'
                      : 'border-gray-300 bg-white',
                    'relative z-10 inline-flex items-center border   px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20'
                  )}
                  onClick={() => {
                    onCallBack(index + 1);
                  }}>
                  {index + 1}
                </button>
              ) : null;
            })}
          {page < totalPage() ? (
            <button
              onClick={() => onCallBack(page + 1)}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-20">
              <span className="sr-only">Tiếp theo</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
export default Pagination;
