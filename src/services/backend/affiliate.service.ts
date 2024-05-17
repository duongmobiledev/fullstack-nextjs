import {
  IAffiliate,
  AFFILIATE_COLLECTION_NAME,
  AffiliateSchema,
  EAffiliateDiscount,
  EAffiliateDiscountPoint,
} from '@models/affiliate.model';
import { Model, model, Types } from 'mongoose';

class AffiliateService {
  private affiliateModel: Model<IAffiliate, {}, {}, {}, any>;

  constructor() {
    this.affiliateModel = model<IAffiliate>(
      AFFILIATE_COLLECTION_NAME,
      AffiliateSchema
    );
  }

  async checkExistAffiliateByUserId(userId: string) {
    const result = await this.affiliateModel
      .exists({ user: new Types.ObjectId(userId) })
      .exec();
    return !!result;
  }

  async createAffiliate(
    userId: string,
    discountCommission?: number,
    isPartner?: boolean
  ) {
    const discount = this.genDiscount(discountCommission ?? 0, isPartner);
    const affiliate: IAffiliate = {
      user: new Types.ObjectId(userId),
      discountCommission: discountCommission ?? 0,
      discount,
      isPartner: Boolean(isPartner),
      withdraw: 0,
      invoices: [],
    };
    return this.affiliateModel.insertMany([affiliate]);
  }

  async updateCommissionDiscount(params: {
    referrerId?: string;
    userRefCodeId?: string;
    amount: number;
    isFirstOrder: boolean;
    invoiceId: string;
  }) {
    const { referrerId, amount, userRefCodeId, isFirstOrder, invoiceId } =
      params;

    await this.updateCommissionDiscountForUserRefCode({
      amount,
      userRefCodeId,
      isFirstOrder,
      invoiceId,
    });

    await this.updateCommissionDiscountForReferrer({
      amount,
      referrerId,
      isFirstOrder,
      invoiceId,
    });
  }

  async updateWithdrawByUserId({
    userId,
    withdraw,
  }: {
    userId: string;
    withdraw: number;
  }) {
    const affiliate = await this.affiliateModel.findOne({
      user: new Types.ObjectId(userId),
    });

    if (affiliate) {
      const oldWithdraw = affiliate.withdraw;
      const balance = affiliate.discountCommission - oldWithdraw;
      if (balance >= withdraw) {
        affiliate.withdraw = oldWithdraw + withdraw;
        await affiliate.save();
      }
    }
    return await this.getAffiliateByUserId(userId);
  }

  async updateDiscountByUserId({
    userId,
    discount,
    isPartner,
  }: {
    userId: string;
    discount: EAffiliateDiscount;
    isPartner: boolean;
  }) {
    const affiliate = await this.affiliateModel.findOne({
      user: new Types.ObjectId(userId),
    });

    if (affiliate) {
      affiliate.discount = discount;
      affiliate.isPartner = isPartner;
      await affiliate.save();
    }
    return await this.getAffiliateByUserId(userId);
  }

  async getAffiliateByUserId(userId: string) {
    const exist = await this.affiliateModel
      .exists({
        user: new Types.ObjectId(userId),
      })
      .exec();

    if (!exist) {
      await this.createAffiliate(userId);
    }

    return await this.affiliateModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate([{ path: 'user', select: 'email' }])
      .exec();
  }

  async getAllAffiliates() {
    return await this.affiliateModel
      .find({})
      .populate([{ path: 'user', select: 'email' }])
      .exec();
  }

  //---------------- START PRIVATE FUNCTION --------------------

  private async updateCommissionDiscountForUserRefCode(params: {
    userRefCodeId?: string;
    amount: number;
    isFirstOrder: boolean;
    invoiceId: string;
  }) {
    /**
     * if(isFirstOrder){
     *    x = 0
     * }
     * else{
     *    x = 0.1
     * }
     */

    const { isFirstOrder, amount, userRefCodeId, invoiceId } = params;
    if (userRefCodeId) {
      const hasAffiliate = await this.checkExistAffiliateByUserId(
        userRefCodeId
      );

      const discountCommission = amount * EAffiliateDiscount.INIT;
      if (isFirstOrder) {
        if (!hasAffiliate) {
          await this.createAffiliate(userRefCodeId);
        }
      } else {
        if (hasAffiliate) {
          await this.updateCommissionByUserId(
            userRefCodeId,
            discountCommission
          );
        } else {
          await this.createAffiliate(userRefCodeId, discountCommission);
        }
        const done = await this.affiliateModel
          .updateOne(
            { user: new Types.ObjectId(userRefCodeId) },
            { $push: { invoices: new Types.ObjectId(invoiceId) } }
          )
          .exec();
      }
    }
  }

  private async updateCommissionDiscountForReferrer(params: {
    referrerId?: string;
    amount: number;
    isFirstOrder: boolean;
    invoiceId: string;
  }) {
    /**
     * Formula:
     * (ammount) x ((discount) - X)
     * if(isFirstOrder){
     *    x = 0
     * }
     * else{
     *    x = 0.1
     * }
     *
     * Range discount
     *  BEGINNER: 0 < 1M
     *  INTERMEDIATE: 1M < 50M
     *  ADVANCED: >= 50M
     */
    const { amount, isFirstOrder, referrerId, invoiceId } = params;
    if (referrerId) {
      const X = isFirstOrder ? 0 : EAffiliateDiscount.INIT;
      let discount = EAffiliateDiscount.BEGINNER;

      const affiliate = await this.affiliateModel.findOne({
        user: new Types.ObjectId(referrerId),
      });

      const hasAffiliate = Boolean(affiliate);
      if (hasAffiliate) {
        discount = affiliate.discount;
      }

      const discountCommission = amount * (discount - X);

      if (hasAffiliate) {
        await this.updateCommissionByUserId(referrerId, discountCommission);
      } else {
        await this.createAffiliate(referrerId, discountCommission, false);
      }

      await this.affiliateModel
        .updateOne(
          { user: new Types.ObjectId(referrerId) },
          { $push: { invoices: new Types.ObjectId(invoiceId) } }
        )
        .exec();
    }
  }

  private async updateCommissionByUserId(
    id: string,
    discountCommission: number
  ) {
    const affiliate = await this.affiliateModel.findOne({
      user: new Types.ObjectId(id),
    });

    const oldCommissionDiscount = affiliate.discountCommission;
    const newCommistionDiscount = oldCommissionDiscount + discountCommission;
    const newDiscount = this.genDiscount(
      newCommistionDiscount,
      affiliate.isPartner
    );
    affiliate.discount = newDiscount;
    affiliate.discountCommission = newCommistionDiscount;
    await affiliate.save();
  }

  private genDiscount(amount: number, isPartner: boolean) {
    if (isPartner) {
      return EAffiliateDiscount.ADVANCED;
    }
    if (amount >= EAffiliateDiscountPoint.ADVANCED) {
      return EAffiliateDiscount.ADVANCED;
    }
    if (amount >= EAffiliateDiscountPoint.INTERMEDIATE) {
      return EAffiliateDiscount.INTERMEDIATE;
    }
    return EAffiliateDiscount.BEGINNER;
  }

  //---------------- END PRIVATE FUNCTION --------------------
}

export default AffiliateService;
