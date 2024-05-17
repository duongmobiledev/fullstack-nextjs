import produce from 'immer';
import { AnyAction } from 'redux';

import {
  setTokenLocalStorage,
  setAccessTokenLocalStorage,
  setUserCookie,
  clearCookie,
} from '@common/utils/auth';

import * as types from '@redux/types/auth';

import { IUser } from '@typings';

interface IAuthState {
  isExpiredAuth: boolean;
  user: IUser | null;
  refreshFailure: boolean;
  updateSuccess: boolean;
  refreshSuccess: boolean;
}

const initialState: IAuthState = {
  isExpiredAuth: false,
  user: null,
  refreshFailure: false,
  refreshSuccess: false,
  updateSuccess: false,
};

const authReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.EXPIRED_AUTH:
        draft.isExpiredAuth = true;
        break;
      case types.RESET_EXPIRED_AUTH:
        draft.isExpiredAuth = false;
        break;
      case types.UPDATE_PROFILE_SUCCESS:
        draft.updateSuccess = true;
        break;
      case types.RESET_UPDATE_PROFILE_SUCCESS:
        draft.updateSuccess = false;
        break;
      case types.LOGIN_AUTHORIZE_SUCCESS:
        const refeshToken = action.payload;
        setTokenLocalStorage(refeshToken);
        break;
      case types.GET_PROFILE_USER_SUCCESS:
        draft.user = action.payload;
        break;

      //refresh
      case types.REFRESH_TOKEN_SUCCESS:
        setAccessTokenLocalStorage(action.payload);
        draft.refreshSuccess = true;
        break;
      case types.RESET_REFRESH:
        draft.refreshSuccess = false;
        break;
      case types.REFRESH_TOKEN_FAILED:
        draft.refreshFailure = action.payloadd;
        break;
    }
  });

export default authReducer;
