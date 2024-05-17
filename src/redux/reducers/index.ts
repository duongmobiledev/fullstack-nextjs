import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, CombinedState, combineReducers, Reducer } from 'redux';

import affialteAdmin from './admin/affilate';
import bannerAdmin from './admin/banner';
import couponAdmin from './admin/coupon';
import customer from './admin/customer';
import historyAdmin from './admin/history';
import order from './admin/order';
import affilidate from './affilidate';
import auth from './auth';
import common from './common';
import coupon from './coupon';
import license from './license';
import onePay from './onepay';
import services from './services';

const reducers = combineReducers({
  common,
  auth,
  services,
  license,
  coupon,
  onePay,
  affilidate,
  couponAdmin,
  order,
  bannerAdmin,
  affialteAdmin,
  historyAdmin,
  customer,
});
const rootReducer: Reducer<CombinedState<IRootState>, AnyAction> = (
  state,
  action
) => {
  /**
   * @description We are using Next-Redux-Wrapper and Saga
   * so, server will execute the dispatch in server, after dispatch new state will be passed to
   * client by dispatch the HYDRATE
   */
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };

    return nextState;
  } else {
    return reducers(state, action);
  }
};
export default rootReducer;

/**
 * @description Use IRootState to set interface for callback's state
 *  in useSelector
 * @example
 *      const { cat } = useSelector(( state: IRootState ) => state.animal);
 */
export type IRootState = ReturnType<typeof reducers>;
