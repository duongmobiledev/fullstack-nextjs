import { connect } from 'mongoose';

import AffiliateService from './affiliate.service';
import CouponService from './coupon.service';
import InvoiceService from './invoice.service';
import LicenseService from './license.service';
import ManagementHistoryService from './management-history.service';
import PackageService from './package.service';
import ServiceService from './service.service';
import UiService from './ui.service';
import UserService from './user.service';
import WithdrawalRequestService from './withdraw-request.service';

class DatabaseService {
  isReady: boolean = false;

  private setIsReady(state: boolean) {
    this.isReady = state;
  }

  async initialize() {
    try {
      await connect(process.env.MONGO_CONNECTION_STRING);

      new UiService();
      new UserService();
      new ServiceService();
      new CouponService();
      new PackageService();
      new InvoiceService();
      new LicenseService();
      new AffiliateService();
      new WithdrawalRequestService();
      new ManagementHistoryService();

      this.setIsReady(true);
      console.log('📥 =>> Data Source has been initialized!');
    } catch (error) {
      throw error;
    }
  }
}

const instance = new DatabaseService();
export default instance;
