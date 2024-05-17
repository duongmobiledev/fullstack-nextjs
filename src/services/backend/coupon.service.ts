import {
  CouponInputType,
  CouponSchema,
  CouponType,
  COUPON_COLLECTION_NAME,
  ECouponType,
  EPromotionType,
} from '@models/coupon.model';
import { assign, forEach } from 'lodash';
import { DateTime } from 'luxon';
import { FilterQuery, Model, model, Types } from 'mongoose';

class CouponService {
  private couponModel: Model<CouponType, {}, {}, {}, any>;

  constructor() {
    this.couponModel = model<CouponType>(COUPON_COLLECTION_NAME, CouponSchema);
  }

  async checkBaseInfoCoupon(couponInput: CouponInputType) {
    const invalidCode = await this.checkInvalidCouponCode(couponInput.code);
    const invalidLimit = !Boolean(couponInput.limit);
    const invalidExpiredDay = this.checkInvalidUntil(couponInput.validUntil);
    const invalidServices = this.checkInvalidServiceIds(couponInput.services);
    const isOk =
      !invalidCode && !invalidLimit && !invalidExpiredDay && !invalidServices;
    if (isOk) {
      return { invalidCoupon: false };
    }
    return {
      invalidCoupon: true,
      error: {
        invalidCode,
        invalidExpiredDay,
        invalidLimit,
        invalidServices,
      },
    };
  }

  private checkInvalidServiceIds(serviceIds?: string[]) {
    if (!serviceIds || serviceIds.length === 0) return true;
    let res = false;
    forEach(serviceIds, (item) => {
      if (res) {
        return true;
      }
      res = !Types.ObjectId.isValid(item);
    });
    return res;
  }
  private checkInvalidUntil(validUntil?: number) {
    const expiredDate = DateTime.fromSeconds(validUntil);
    const diffNow = expiredDate.diffNow('days').days;
    return diffNow <= 0;
  }

  async checkInvalidCouponCode(code?: string) {
    if (code) {
      const res = await this.couponModel.exists({ code }).exec();
      return !!res;
    }
    return true;
  }

  async createRenewalCoupon(couponInput: CouponInputType) {
    if (this.isRenewalCoupon(couponInput)) {
      const coupon = assign<CouponInputType, Partial<CouponType>>(couponInput, {
        status: true,
        used: 0,
        users: [],
        value: {
          extraTimestamp: couponInput.value.extraTimestamp,
          package: new Types.ObjectId(couponInput.value.package),
          dailyLimit: couponInput.value.dailyLimit,
        },
      });
      const newCoupon = new this.couponModel(coupon);
      const res = await newCoupon.save();
      return res;
    } else {
      throw Error('It is not a renewal coupon!!');
    }
  }
  private isRenewalCoupon(couponInput: CouponInputType) {
    const isOk =
      couponInput.type === ECouponType.RENEWAL &&
      !!couponInput.value.extraTimestamp &&
      Boolean(couponInput.value.dailyLimit) &&
      !!couponInput.value.package;
    return isOk;
  }

  async createPromoCouponDiscountPrice(couponInput: CouponInputType) {
    if (this.isPromoCouponDiscountPrice(couponInput)) {
      const coupon = assign<CouponInputType, Partial<CouponType>>(couponInput, {
        status: true,
        users: [],
        used: 0,
        value: {
          discountBy: EPromotionType.PRICE,
          price: couponInput.value.price,
        },
      });
      const newCoupon = new this.couponModel(coupon);
      const res = await newCoupon.save();
      return res;
    } else {
      throw Error('It is not a promo price coupon!!');
    }
  }

  private isPromoCouponDiscountPrice(couponInput: CouponInputType) {
    const isOk =
      couponInput.type === ECouponType.PROMO &&
      couponInput.value.discountBy === EPromotionType.PRICE &&
      !!couponInput.value.price;
    return isOk;
  }

  async createPromoCouponDiscountPercent(couponInput: CouponInputType) {
    if (this.isPromoCouponDiscountPercent(couponInput)) {
      const coupon = assign<CouponInputType, Partial<CouponType>>(couponInput, {
        status: true,
        users: [],
        used: 0,
        value: {
          discountBy: EPromotionType.PERCENT,
          percent: couponInput.value.percent,
        },
      });
      const newCoupon = new this.couponModel(coupon);
      const res = await newCoupon.save();
      return res;
    } else {
      throw Error('It is not a promo price coupon!!');
    }
  }

  private isPromoCouponDiscountPercent(couponInput: CouponInputType) {
    const isOk =
      couponInput.type === ECouponType.PROMO &&
      couponInput.value.discountBy === EPromotionType.PERCENT &&
      !!couponInput.value.percent;
    return isOk;
  }

  async getCoupons() {
    return await this.couponModel
      .find({})
      .populate([
        { path: 'services' },
        { path: 'value', populate: [{ path: 'package' }] },
      ])
      .exec();
  }
  async getCouponsAdmin({
    filter,
    limit,
    offset,
  }: {
    filter: FilterQuery<CouponType>;
    limit: number;
    offset: number;
  }) {
    const items = await this.couponModel
      .find(filter, {}, { limit, skip: offset })
      .populate([
        { path: 'services', select: 'name' },
        { path: 'value', populate: [{ path: 'package' }] },
      ])
      .sort({ created_at: -1 })
      .exec();
    const total = await this.couponModel.find(filter).count();
    return { items, total };
  }

  async getCouponByCode(code: string) {
    return await this.couponModel
      .findOne({ code })
      .populate([
        { path: 'services', select: 'name' },
        { path: 'value', populate: [{ path: 'package' }] },
      ])
      .exec();
  }
  async getOriginCouponByCode(code: string) {
    return await this.couponModel.findOne({ code }).exec();
  }

  async getByRegexCodeToSuggestion({
    regex,
    limit,
    offset,
  }: {
    regex: RegExp;
    limit: number;
    offset: number;
  }) {
    const res = await this.couponModel
      .find({ code: regex }, { code: 1 }, { limit, skip: offset })
      .exec();

    return res.map((item) => item.code);
  }

  async checkValidRenewalCoupon(
    code: string,
    serviceId: string,
    userId: string
  ) {
    try {
      let coupon = await this.getOriginCouponByCode(code as string);

      if (coupon.type !== ECouponType.RENEWAL) return false;

      const hasService = coupon.services
        .map((item) => item._id.toString())
        .includes(serviceId);

      if (!hasService) return false;

      return this.checkValidCoupon(coupon, userId);
    } catch (error) {
      return false;
    }
  }

  async checkValidPromoCoupon(code: string, serviceId: string, userId: string) {
    let coupon = await this.getOriginCouponByCode(code as string);

    const hasService = coupon.services
      .map((item) => item._id.toString())
      .includes(serviceId);

    if (coupon.type !== ECouponType.PROMO || !hasService) return false;

    return this.checkValidCoupon(coupon, userId);
  }

  async checkValidCoupon(coupon: CouponType, userId: string) {
    if (coupon.status) {
      if (
        DateTime.fromSeconds(coupon.validUntil).diffNow('seconds').seconds >= 0
      ) {
        if (coupon.used < coupon.limit) {
          const wasUsed = coupon.users
            .map((item) => item.toString())
            .includes(userId);

          return !wasUsed;
        }
      }
    }
    return false;
  }

  async applyPromoCoupon(code: string, userId: Types.ObjectId) {
    const coupon = await this.getOriginCouponByCode(code);
    if (coupon) {
      await this.couponModel
        .updateOne({ code }, { $inc: { used: 1 }, $push: { users: userId } })
        .exec();
    }
  }

  async applyRenewalCoupon(code: string, userId: Types.ObjectId) {
    const coupon = await this.getOriginCouponByCode(code);
    if (coupon) {
      await this.couponModel
        .updateOne({ code }, { $inc: { used: 1 }, $push: { users: userId } })
        .exec();
    }
  }
}

export default CouponService;
