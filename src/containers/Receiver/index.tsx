import { useEffect } from 'react';

import { USER_ACCESS_KEY, USER_KEY } from '@constants/app';

interface IReceiver {}

const Receiver: React.FC<IReceiver> = (props) => {
  const origin = 'https://audinsights.app';
  useEffect(() => {
    function receiveMessage(e) {
      if (e.origin !== origin) {
        return;
      }
      const refreshToken = localStorage.getItem(USER_KEY);
      const accessToken = localStorage.getItem(USER_ACCESS_KEY);
      window.parent.postMessage(
        {
          refreshToken,
          accessToken,
        },
        origin
      );
    }
    window.addEventListener('message', receiveMessage);
  }, []);

  return <></>;
};

export default Receiver;
