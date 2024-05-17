import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

import { PATH, paths } from '@routes';

interface IViewLayoutProps extends PropsWithChildren {}
const ViewLayout: React.FC<IViewLayoutProps> = (props) => {
  const router = useRouter();
  const lstPaths = paths.slice(0, 4);
  const isName = lstPaths.find((obj) => router.pathname === obj.src);

  return (
    <>
      <main>
        <div className="py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isName && isName.dashBoardName}
            </h1>
          </div>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            {props.children}
          </div>
        </div>
      </main>
    </>
  );
};

export default ViewLayout;
