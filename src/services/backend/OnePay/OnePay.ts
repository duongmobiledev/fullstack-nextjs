import SimpleSchema from 'simpl-schema';
import { URL } from 'url';

import { toUpperCase, pack, hashHmac } from './utils';

export interface IOnePayConfig {
  accessCode: string;
  merchant: string;
  paymentGateway: string;
  secureSecret: string;
}

type OnePayType = 'domestic' | 'international';

/**
 * This is the base class for OnePay's domestic and intl payment gateways
 * @private
 */
class OnePay {
  config: IOnePayConfig;
  type: OnePayType;
  static VERSION = '2';
  static COMMAND = 'pay';
  static CURRENCY_VND = 'VND';
  static LOCALE_EN = 'en';
  static LOCALE_VN = 'vn';

  /**
   * Instantiate a OnePay checkout helper
   * <br>
   * _Khởi tạo class thanh toán OnePay_
   *
   * @param  {IOnePayConfig} config check OnePay.configSchema for data type requirements. <br> _Xem OnePay.configSchema để biết yêu cầu kiểu dữ liệu._
   * @return
   */
  constructor(
    config: IOnePayConfig = {} as IOnePayConfig,
    type: OnePayType = 'domestic'
  ) {
    this.config = config;
    this.type = type; // 'domestic' or 'international'
    // check config validity and throw errors if any
    OnePayConfigSchema.validate(this.config);
  }

  /**
   *
   * @param {*} responseCode Response code from gateway. <br> _Mã trả về từ cổng thanh toán._
   * @param {*} locale Same locale at the buildCheckoutUrl. Note, 'vn' for Vietnamese. <br> _Cùng nơi với hàm buildCheckoutUrl. Lưu ý, Việt Nam là 'vn'_
   * @return {string}  A string contains error status converted from response code. <br> _Một chuỗi chứa trạng thái lỗi được chuyển lại từ response code_
   */
  static getReturnUrlStatus(
    responseCode: string,
    locale: string = 'vn'
  ): string {
    const responseCodeTable = {
      0: {
        vn: 'Giao dịch thành công',
        en: 'Transaction is successful',
      },
      1: {
        vn: 'Giao dịch không thành công,Ngân hàng phát hành thẻ không cấp phép cho giao dịch hoặc thẻ chưa được kích hoạt dịch vụ thanh toán trên Internet. Vui lòng liên hệ ngân  hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết.',
        en: 'The transaction is unsuccessful. This transaction has been declined by issuer bank or card have been not registered online payment services. Please contact your bank for further clarification.',
      },
      2: {
        en: 'The transaction is unsuccessful. This transaction has been declined by issuer bank. Please contact your bank for further clarification',
        vn: 'Giao dịch không thành công, Ngân hàng phát hành thẻ từ chối cấp phép cho giao dịch. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ để biết chính xác nguyên nhân Ngân hàng từ chối.',
      },
      3: {
        vn: 'Giao dịch không thành công, Cổng thanh toán không nhận được kết quả trả về từ ngân hàng phát hành thẻ. Vui lòng liên hệ với ngân hàng theo số điện thoại sau mặt thẻ để biết chính xác trạng thái giao dịch và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. OnePAY did not received payment result from Issuer bank. Please contact your bank for details and try again',
      },
      4: {
        vn: 'Giao dịch không thành công do thẻ hết hạn sử dụng hoặc nhập sai thông tin tháng/ năm hết hạn của thẻ. Vui lòng kiểm tra lại thông tin và thanh toán lại',
        en: 'The transaction is unsuccessful. Your card is expired or You have entered incorrect expired date. Please check and try again',
      },
      5: {
        vn: 'Giao dịch không thành công, Thẻ không đủ hạn mức hoặc tài khoản không đủ số dư để thanh toán. Vui lòng kiểm tra lại thông tin và thanh toán lại',
        en: 'The transaction is unsuccessful. This transaction cannot be processed due to insufficient funds. Please try another card',
      },
      6: {
        vn: 'Giao dịch không thành công, Quá trình xử lý giao dịch phát sinh lỗi từ ngân hàng phát hành thẻ. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết.',
        en: 'The transaction is unsuccessful. An error was encountered while processing your transaction. Please contact your bank for further clarification.',
      },
      7: {
        vn: 'Giao dịch không thành công, Đã có lỗi phát sinh trong quá trình xử lý giao dịch. Vui lòng thực hiện thanh toán lại.',
        en: 'The transaction is unsuccessful. An error was encountered while processing your transaction. Please contact your bank for further clarification',
      },
      8: {
        vn: 'Giao dịch không thành công. Số thẻ không đúng. Vui lòng kiểm tra và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. You have entered incorrect card number. Please try again.',
      },
      9: {
        vn: 'Giao dịch không thành công. Tên chủ thẻ không đúng. Vui lòng kiểm tra và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. You have entered incorrect card holder name. Please try again.',
      },
      10: {
        vn: 'Giao dịch không thành công. Thẻ hết hạn/Thẻ bị khóa. Vui lòng kiểm tra và thực hiện thanh toán lại.',
        en: 'The transaction is unsuccessful. The card is expired/locked. Please try again.',
      },
      11: {
        vn: 'Giao dịch không thành công. Thẻ chưa đăng ký sử dụng dịch vụ thanh toán trên Internet. Vui lòng liên hê ngân hàng theo số điện thoại sau mặt thẻ để được hỗ trợ.',
        en: 'The transaction is unsuccessful. You have been not registered online payment services. Please contact your bank for details.',
      },
      12: {
        vn: 'Giao dịch không thành công. Ngày phát hành/Hết hạn không đúng. Vui lòng kiểm tra và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. You have entered incorrect Issue date or Expire date. Please try again',
      },
      13: {
        vn: 'Giao dịch không thành công. thẻ/ tài khoản đã vượt quá hạn mức thanh toán. Vui lòng kiểm tra và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. The transaction amount exceeds the maximum transaction/amount limit. Please try another card',
      },
      21: {
        vn: 'Giao dịch không thành công. Số tiền không đủ để thanh toán. Vui lòng kiểm tra và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. This transaction cannot be processed due to insufficient funds in your account. Please try another card',
      },
      22: {
        vn: 'Giao dịch không thành công. Thông tin tài khoản không đúng. Vui lòng kiểm tra và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. This transaction cannot be processed due to invalid account. Please try again.',
      },
      23: {
        vn: 'Giao dịch không thành công. Tài khoản bị khóa. Vui lòng liên hê ngân hàng theo số điện thoại sau mặt thẻ để được hỗ trợ',
        en: 'The transaction is unsuccessful. This transaction cannot be processed due to account locked. Please contact your bank for further clarification.',
      },
      24: {
        vn: 'Giao dịch không thành công. Tài khoản bị khóa. Vui lòng liên hê ngân hàng theo số điện thoại sau mặt thẻ để được hỗ trợ',
        en: 'The transaction is unsuccessful. You have entered incorrect card number. Please try again',
      },
      25: {
        vn: 'Giao dịch không thành công. Thông tin thẻ không đúng. Vui lòng kiểm tra và thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. You have entered incorrect OTP. Please try again',
      },
      253: {
        vn: 'Giao dịch không thành công. Quá thời gian thanh toán. Vui lòng thực hiện thanh toán lại',
        en: 'The transaction is unsuccessful. Transaction timed out. Please try again.',
      },
      99: {
        vn: 'Giao dịch không thành công. Người sử dụng hủy giao dịch',
        en: 'The transaction is unsuccessful. The transaction has been cancelled by card holder. Please try again.',
      },
      B: {
        vn: 'Giao dịch không thành công do không xác thực được 3D-Secure. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết',
        en: 'The transaction is unsuccessful. The card used in this transaction is not authorized 3D-Secure complete. Please contact your bank for further clarification',
      },
      E: {
        vn: 'Giao dịch không thành công do nhập sai CSC (Card Security Card) hoặc ngân hàng từ chối cấp phép cho giao dịch. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết.',
        en: 'The transaction is unsuccessful. You have entered wrong CSC or Issuer Bank declided transaction. Please contact your bank for further clarification',
      },
      F: {
        vn: 'Giao dịch không thành công do không xác thực được 3D-Secure. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết',
        en: 'The transaction is unsuccessful. Due to 3D Secure Authentication Failed. Please contact your bank for further clarification.',
      },
      Z: {
        vn: 'Giao dịch bị từ chối. Vui lòng liên hệ OnePAY để được hỗ trợ (Email: support@onepay.vn / Hotline: 1900 633 927).',
        en: 'Your transaction was declined. Please contact OnePAY for assistance (Email: support@onepay.vn / Hotline: 1900 633 927).',
      },
      Other: {
        vn: 'Giao dịch không thành công. Vui lòng liên hệ với OnePAY để được hỗ trợ (Hotline: 1900 633 927)',
        en: 'The transaction is unsuccessful. Please contact OnePAY for details (Hotline 1900 633 927)',
      },
      default: {
        vn: 'Giao dịch thất bại',
        en: 'Unknown Failure',
      },
    };

    const respondText = responseCodeTable[responseCode];

    return respondText
      ? respondText[locale]
      : responseCodeTable.default[locale];
  }

  /**
   * Build checkout URL to redirect to the payment gateway.
   * <br>
   * _Hàm xây dựng url để redirect qua OnePay gateway, trong đó có tham số mã hóa (còn gọi là public key)._
   *
   * @param  {OnePayCheckoutPayload} payload Object that contains needed data for the URL builder, refer to typeCheck object above. <br> _Đối tượng chứa các dữ liệu cần thiết để thiết lập đường dẫn._
   * @return {Promise<URL>} buildCheckoutUrl promise
   */
  buildCheckoutUrl(payload: OnePayCheckoutPayload): Promise<URL> {
    return new Promise((resolve, reject) => {
      // Mảng các tham số chuyển tới Onepay Payment
      const data = Object.assign({}, this.checkoutPayloadDefaults, payload);
      const config = this.config;

      data.vpcMerchant = config.merchant;
      data.vpcAccessCode = config.accessCode;

      // Input type checking, define the schema and use it in subclass
      try {
        this.validateCheckoutPayload(data);
      } catch (error) {
        reject(error.message);
      }

      // convert amount to OnePay format (100 = 1VND):
      data.amount = Math.floor(data.amount * 100);

      // IMPORTANT: the keys' order must be exactly like below
      // Note: we can also sort the keys alphabetically like in PHP, but by listing the keys
      // in fixed order, we don't worry about missmatch checksum hashing
      /* prettier-ignore */
      const arrParam = {
				AgainLink: data.againLink,
				Title: data.title,
				vpc_AccessCode: data.vpcAccessCode,
				vpc_Amount: String(data.amount),
				vpc_Command: data.vpcCommand,
				vpc_Currency: data.currency,
				vpc_Customer_Email: data.customerEmail,
				vpc_Customer_Id: data.customerId,
				vpc_Customer_Phone: data.customerPhone,
				vpc_Locale: data.locale,
				vpc_MerchTxnRef: data.transactionId,
				vpc_Merchant: data.vpcMerchant,
				vpc_OrderInfo: data.orderId,
				vpc_ReturnURL: data.returnUrl,
				IPN_URL: data.ipnUrl,
				vpc_TicketNo: data.clientIp,
				vpc_Version: data.vpcVersion,
			};

      if (this.type === 'international') {
        // special case: Intl gateway don't checksum **vps_Currency**, so we have to delete it from params :(
        delete arrParam.vpc_Currency;
      }

      // Step 2. Create the target redirect URL at OnePay server
      const redirectUrl = new URL(config.paymentGateway);
      const secureCode = [];

      Object.keys(arrParam).forEach((key) => {
        const value = arrParam[key];

        if (value == null || value.length === 0) {
          // skip empty params (but they must be optional)
          return;
        }

        redirectUrl.searchParams.append(key, value); // no need to encode URI with URLSearchParams object

        if (
          value.length > 0 &&
          (key.substr(0, 4) === 'vpc_' || key.substr(0, 5) === 'user_')
        ) {
          // secureCode is digested from vpc_* params but they should not be URI encoded
          secureCode.push(`${key}=${value}`);
        }
      });

      /* Step 3. calculate the param checksum with hash_hmac*/
      if (secureCode.length > 0) {
        redirectUrl.searchParams.append(
          'vpc_SecureHash',
          toUpperCase(
            hashHmac(
              'SHA256',
              secureCode.join('&'),
              pack(config.secureSecret, 'hex')
            )
          )
        );
      }

      resolve(redirectUrl);
    });
  }

  /**
   * Validate checkout payload against specific schema. Throw ValidationErrors if invalid against checkoutSchema
   * <br>
   * Build the schema in subclass.
   * <br>
   * _Kiểm tra tính hợp lệ của dữ liệu thanh toán dựa trên schema đã được đồng bộ với tài liệu của nhà cung cấp.
   * Hiển thị lỗi nếu không hợp lệ với checkoutSchema._
   * <br>
   * _Schema sẽ được tạo trong class con._
   * @param {OnePayCheckoutPayload} payload
   */
  validateCheckoutPayload(payload: OnePayCheckoutPayload) {
    throw new Error('validateCheckoutPayload() requires overloading');
  }

  /**
   * Return default checkout Payloads
   *
   * _Lấy checkout payload mặc định cho cổng thanh toán này_
   * @return {OnePayCheckoutPayload} default payloads
   */
  get checkoutPayloadDefaults() {
    return {};
  }

  /**
   * Verify return query string from OnePay using enclosed vpc_SecureHash string
   *
   * _Hàm thực hiện xác minh tính đúng đắn của các tham số trả về từ cổng thanh toán_
   *
   * @param  {*} query Query data object from GET handler (`response.query`). <br> _Object query trả về từ GET handler_
   * @return {Promise<Object>} Promise object which resolved with normalized returned data object, with additional fields like isSuccess. <br> _Promise khi hoàn thành sẽ trả về object data từ cổng thanh toán, được chuẩn hóa tên theo camelCase và đính kèm thuộc tính isSuccess_
   */
  verifyReturnUrl(query: any): Promise<object> {
    return new Promise((resolve) => {
      const data = Object.assign({}, query);
      const config = this.config;
      const vpcTxnSecureHash = data.vpc_SecureHash;
      delete data.vpc_SecureHash;

      if (
        config.secureSecret.length > 0 &&
        data.vpc_TxnResponseCode !== '7' &&
        data.vpc_TxnResponseCode !== 'No Value Returned'
      ) {
        const secureCode = [];

        Object.keys(data)
          .sort() // need to sort the key by alphabetically
          .forEach((key) => {
            const value = data[key];

            if (
              value.length > 0 &&
              (key.substr(0, 4) === 'vpc_' || key.substr(0, 5) === 'user_')
            ) {
              secureCode.push(`${key}=${value}`);
            }
          });

        if (
          toUpperCase(vpcTxnSecureHash) ===
          toUpperCase(
            hashHmac(
              'SHA256',
              secureCode.join('&'),
              pack(config.secureSecret, 'hex')
            )
          )
        ) {
          // for the transaction to succeed, its checksum must be valid, then response code must be '0'
          resolve({ isSuccess: data.vpc_TxnResponseCode === '0' });
        }
      }

      // this message prop will override whatever in Subclass
      resolve({ isSuccess: false });
    });
  }
}
/**
 * OnePay configSchema
 * @type {SimpleSchema}
 */

const OnePayConfigSchema: SimpleSchema = new SimpleSchema({
  accessCode: { type: String },
  merchant: { type: String },
  paymentGateway: { type: String, regEx: SimpleSchema.RegEx.Url },
  secureSecret: { type: String },
});

export { OnePay };
export interface OnePayCheckoutPayload {
  againLink: string;
  amount: number;
  clientIp: string;
  customerEmail: string;
  customerId: string;
  customerPhone: string;
  orderId: string;
  returnUrl: string;
  ipnUrl: string;
  title: string;
  transactionId: string;
  currency?: string;
  vpcMerchant?: string;
  vpcAccessCode?: string;
  vpcCommand?: string;
  locale?: string;
  vpcVersion?: string;
}
