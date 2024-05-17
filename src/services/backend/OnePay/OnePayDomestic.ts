import SimpleSchema from 'simpl-schema';

import { IOnePayConfig, OnePay, OnePayCheckoutPayload } from './OnePay';
import { urlRegExp } from './utils';

class OnePayDomestic extends OnePay {
  constructor(config: IOnePayConfig = {} as IOnePayConfig) {
    super(config, 'domestic');
  }

  static TEST_CONFIG: IOnePayConfig = {
    accessCode: 'D67342C2',
    merchant: 'ONEPAY',
    paymentGateway: 'https://mtf.onepay.vn/onecomm-pay/vpc.op',
    secureSecret: 'A3EFDFABA8653DF2342E8DAC29B51AF0',
  };
  /**
   * Validate checkout payload against specific schema. Throw ValidationErrors if invalid against checkoutSchema.
   *
   * _Kiểm tra tính hợp lệ của dữ liệu thanh toán dựa trên schema đã được đồng bộ với tài liệu của nhà cung cấp.
   * Hiển thị lỗi nếu không hợp lệ với checkoutSchema._
   * @param {OnePayCheckoutPayload} payload
   * @override
   */
  validateCheckoutPayload(payload: OnePayCheckoutPayload) {
    OnePayDomesticCheckoutSchema.validate(payload);
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
   * @returns { Promise<OnePayDomesticReturnObject> } Promise object which resolved with normalized returned data object, with additional fields like isSuccess. <br> _Promise khi hoàn thành sẽ trả về object data từ cổng thanh toán, được chuẩn hóa tên theo camelCase và đính kèm thuộc tính isSuccess_
   */
  async verifyReturnUrl(query: any): Promise<OnePayDomesticReturnObject> {
    const verifyResults = await super.verifyReturnUrl(query);
    const returnObject = {
      amount: parseInt(query.vpc_Amount, 10) / 100,
      command: query.vpc_Command,
      currencyCode: query.vpc_CurrencyCode,
      locale: query.vpc_Locale,
      merchant: query.vpc_Merchant,
      message: OnePayDomestic.getReturnUrlStatus(
        query.vpc_TxnResponseCode,
        query.vpc_Locale
      ),
      gatewayTransactionNo: query.vpc_TransactionNo,
      orderId: query.vpc_OrderInfo,
      responseCode: query.vpc_TxnResponseCode,
      secureHash: query.vpc_SecureHash,
      transactionId: query.vpc_MerchTxnRef,
      version: query.vpc_Version,
    };
    return Object.assign(returnObject, query, verifyResults);
  }
}

interface OnePayDomesticReturnObject {
  isSuccess: boolean;
  amount: number;
  command: string;
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

/* prettier-ignore */
/**
 * The schema is based on field data requirements from OnePay's dev document
 * <br>
 * _Cấu trúc dữ liệu được dựa trên các yêu cầu của tài liệu OnePay_
 * @type {SimpleSchema}
 */
const OnePayDomesticCheckoutSchema: SimpleSchema = new SimpleSchema({
	againLink            : { type: String, optional: true, max: 64, regEx: urlRegExp },
	// NOTE: there is an inconsistency in OnePayDom vs. Intl that we had to test to find out,
	// while intl allows 10 digits, domestic only allows max 9 digits (999.999.999VND)
	amount               : { type: SimpleSchema.Integer, max: 9999999999 },
	// NOTE: billing address is not expected in domestic but keep them here so that
	// same input data can be used for both dom. and intl. gateway
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

export { OnePayDomestic };
