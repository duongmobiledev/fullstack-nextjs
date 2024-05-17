import { useSelector } from 'react-redux';

import Spinner from '@components/Spinner';

import { IRootState } from '@typings';

interface ILoadingAppProps {}

const LoadingApp: React.FC<ILoadingAppProps> = (props) => {
  const { isLoading } = useSelector((state: IRootState) => state.common);
  return (
    isLoading && (
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center bg-white cursor-wait bg-opacity-70">
        <Spinner />
        <p> Loading...</p>
      </div>
    )
  );
};

export default LoadingApp;
