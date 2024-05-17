import SimpleSchema from 'simpl-schema';

import { IOnePayConfig, OnePay, OnePayCheckoutPayload } from './OnePay';
import { urlRegExp } from './utils';

class OnePayInternational extends OnePay {
  /**
   * OnePayInternational test config
   *
   * _Cấu hình dùng thử OnePayInternational_
   */
  static TEST_CONFIG: IOnePayConfig = {
    accessCode: '6BEB2546',
    merchant: 'TESTONEPAY',
    paymentGateway: 'https://mtf.onepay.vn/vpcpay/vpcpay.op',
    secureSecret: '6D0870CDE5F24F34F3915FB0045120DB',
  };

  /**
   * Instantiate a OnePayInternational checkout helper
   *<br>
   * _Khởi tạo hàm thanh toán OnePayInternational_
   * @param  {IOnePayConfig} config check OnePay.configSchema for data type requirements. <br> _Xem OnePay.configSchema để biết yêu cầu kiểu dữ liệu_
   * @return
   */
  constructor(config: IOnePayConfig = {} as IOnePayConfig) {
    super(config, 'international');
  }

  /**
   * Validate checkout payload against specific schema. Throw ValidationErrors if invalid against checkoutSchema.
   *
   * _Kiểm tra tính hợp lệ của dữ liệu thanh toán dựa trên schema đã được đồng bộ với tài liệu của nhà cung cấp.
   * Hiển thị lỗi nếu không hợp lệ với checkoutSchema._
   * @param {OnePayCheckoutPayload} payload
   * @override
   */
  validateCheckoutPayload(payload: OnePayCheckoutPayload) {
    OnePayInternationalCheckoutSchema.validate(payload);
  }

  /**
   * Return default checkout Payloads
   *
   * _Lấy checkout payload mặc định cho cổng thanh toán này_
   * @return {OnePayCheckoutPayload} default payload object <br> _Dữ liệu mặc định của đối tượng_
   */
  get checkoutPayloadDefaults(): OnePayCheckoutPayload {
    /* prettier-ignore */
    return {
			currency: OnePay.CURRENCY_VND,
			customerEmail: null, // do not use '' since it will be validated with Email RegExp
			customerPhone: '',
			locale: OnePay.LOCALE_VN,
			title: 'VPC 3-Party',
			customerId: '',
			vpcAccessCode: '',
			vpcCommand: OnePay.COMMAND,
			vpcMerchant: '',
			vpcVersion: OnePay.VERSION,
		} as OnePayCheckoutPayload;
  }

  /**
   * Verify return query string from OnePay using enclosed vpc_SecureHash string
   * <br>
   * _Hàm thực hiện xác minh tính đúng đắn của các tham số trả về từ onepay Payment_
   *
   * @param {*} query
   * @returns { Promise<OnePayInternationalReturnObject> } Promise object which resolved with normalized returned data object, with additional fields like isSuccess. <br> _Promise khi hoàn thành sẽ trả về object data từ cổng thanh toán, được chuẩn hóa tên theo camelCase và đính kèm thuộc tính isSuccess_
   */
  async verifyReturnUrl(query: any): Promise<OnePayInternationalReturnObject> {
    const verifyResults = await super.verifyReturnUrl(query);
    const returnObject = {
      // these are common normalized properties, others are kept as is
      amount: parseInt(query.vpc_Amount, 10) / 100,
      card: query.vpc_Card,
      command: query.vpc_Command,
      currencyCode: 'VND',
      gatewayTransactionNo: query.vpc_TransactionNo,
      locale: query.vpc_Locale,
      merchant: query.vpc_Merchant,
      message: query.vpc_Message,
      orderId: query.vpc_OrderInfo,
      responseCode: query.vpc_TxnResponseCode,
      secureHash: query.vpc_SecureHash,
      transactionId: query.vpc_MerchTxnRef,
      version: query.vpc_Version,
    };
    return Object.assign(returnObject, query, verifyResults);
  }
}

interface OnePayInternationalReturnObject {
  isSuccess: boolean;
  amount: number;
  command: string;
  card: string;
  currencyCode: string;
  gatewayTransactionNo: string;
  locale: string;
  merchant: string;
  message: string;
  orderId: string;
  responseCode: string;
  secureHash: string;
  transactionId: string;
  version: string;
}

//
/**
 * The schema is based on field data requirements from OnePay's dev document
 *
 * @typedef {SimpleSchema} OnePayInternationalCheckoutSchema
 */
/* prettier-ignore */
const OnePayInternationalCheckoutSchema = new SimpleSchema({
	againLink            : { type: String, max: 64, regEx: urlRegExp },
	// NOTE: there is an inconsistency in OnePayDom vs. Intl that we had to test to find out,
	// while intl allows 10 digits, domestic only allows max 9 digits (999.999.999VND)
	amount               : { type: SimpleSchema.Integer, max: 9999999999 },
	clientIp             : { type: String, max: 15 },
	currency             : { type: String, allowedValues: ['VND'] },
	customerEmail        : { type: String, optional: true, max: 24, regEx: SimpleSchema.RegEx.Email },
	customerId           : { type: String, optional: true, max: 64 },
	customerPhone        : { type: String, optional: true, max: 16 },
	deliveryAddress      : { type: String, optional: true, max: 64 },
	deliveryCity         : { type: String, optional: true, max: 64 },
	deliveryCountry      : { type: String, optional: true, max: 8 },
	deliveryProvince     : { type: String, optional: true, max: 64 },
	locale               : { type: String, allowedValues: ['vn', 'en'] },
	orderId              : { type: String, max: 32 },
	returnUrl            : { type: String, max: 255, regEx: urlRegExp }, // NOTE: returnURL is documented with 64 chars limit but seem not a hard limit, and 64 is too few in some scenario
	ipnUrl            : { type: String, max: 255, regEx: urlRegExp }, // NOTE: returnURL is documented with 64 chars limit but seem not a hard limit, and 64 is too few in some scenario
	title                : { type: String, optional: true, max: 255 }, // NOTE: no max limit documented for this field, this is just a safe value
	transactionId        : { type: String, max: 34 },
	vpcAccessCode        : { type: String, max: 8 },
	vpcCommand           : { type: String, max: 16 },
	vpcMerchant          : { type: String, max: 16 },
	vpcVersion           : { type: String, max: 2 },
});

export { OnePayInternational };
