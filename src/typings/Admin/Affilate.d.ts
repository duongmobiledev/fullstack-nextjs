import { IWithdrawalStatus } from '@containers/affiliates/History/components/Table';

import { IHistoryWithDraw } from '@typings';

export interface IAffilateRequest {
  key: string;
  value: string;
  limit?: number;
  offset?: number;
}
export interface IChangeStatusAffilateRequest {
  withdrawalRequestId: string;
  status: IWithdrawalStatus;
}

export interface IDataAffilateResponse {
  items?: IHistoryWithDraw[];
  total?: number;
}
