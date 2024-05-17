import { USER_KEY, USER_ACCESS_KEY } from '@constants/app';

export const getTokenLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_KEY);
  }
};
export const getAccessTokenLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_ACCESS_KEY);
  }
};

export const removeKeyLocal = () => {
  if (typeof window !== 'undefined') {
    return localStorage.clear();
  }
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  // return true;
  const useRefeshToken = getTokenLocalStorage();

  if (!useRefeshToken || useRefeshToken === '') {
    return false;
  } else {
    return true;
  }
};

export const setTokenLocalStorage = (refeshToken: string): void => {
  localStorage.setItem(USER_KEY, refeshToken || '');
};
export const setAccessTokenLocalStorage = (token: string): void => {
  localStorage.setItem(USER_ACCESS_KEY, token || '');
};
