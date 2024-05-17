import { useSelector } from 'react-redux';

import { IPackageFeature, IRootState } from '@typings';

interface IPackageFeaturesProps {}
const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
const PackageFeatures: React.FC<IPackageFeaturesProps> = (props) => {
  const { packagePages } = useSelector((state: IRootState) => state.license);
  return (
    <div className="flex flex-col mt-8">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                    Package features
                  </th>
                  {packagePages?.packages?.map((header) => (
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      {header?.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packagePages?.contentTable?.map((ct, index) => (
                  <tr key={ct['name'] as string}>
                    <td
                      className={classNames(
                        index !== packagePages?.contentTable?.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap min-w-[300px] py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}>
                      {ct.name}
                    </td>
                    {packagePages?.packages?.map((pk) => (
                      <td
                        className={classNames(
                          index !== packagePages?.packages.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap sm:pl-6 min-w-[150px] lg:pl-8 text-center px-3 py-4 text-sm text-gray-500'
                        )}>
                        {ct?.[pk._id] && (
                          <span className="flex justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageFeatures;
