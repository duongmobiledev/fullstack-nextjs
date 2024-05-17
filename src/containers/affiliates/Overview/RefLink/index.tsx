import { CopyIcon, CheckIcon } from '@icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '@typings';

interface IRefLink {}

const RefLink: React.FC<IRefLink> = (props) => {
  const { overview } = useSelector((state: IRootState) => state.affilidate);
  const [copyDone, setCopyDone] = useState(false);
  useEffect(() => {
    if (copyDone) {
      setTimeout(() => {
        setCopyDone(false);
      }, 1000);
    }
  }, [copyDone]);
  const handleCopy = () => {
    navigator.clipboard.writeText(overview?.linkRef).then((res) => {
      setCopyDone(true);
    });
  };
  const code = overview?.linkRef?.split('ref=')?.[1];
  return (
    <div className="h-full px-6 py-2 bg-orange-400 rounded-lg">
      <h5 className="text-sm font-bold text-white lg:text-lg">
        Link giới thiệu:
      </h5>
      {overview?.linkRef && (
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-semibold text-white">
            {overview?.linkRef || ''}
          </p>
          <button onClick={handleCopy} title="Copy">
            <CopyIcon width={24} height={28}></CopyIcon>
          </button>
          {copyDone && <CheckIcon width={24} height={24} />}
        </div>
      )}
      <h5 className="mt-1 text-sm font-bold text-white lg:text-lg">
        CODE: {code || ''}
      </h5>
    </div>
  );
};

export default RefLink;
