import {
  EWithdrawalStatus,
  IWithdrawalRequest,
  WithdrawalRequestSchema,
  WITHDRAW_REQUEST_COLLECTION_NAME,
} from '@models/withdrawal-request.model';
import { FilterQuery, Model, model, Types } from 'mongoose';

class WithdrawalRequestService {
  private withdrawRequestModel: Model<IWithdrawalRequest, {}, {}, {}, any>;

  constructor() {
    this.withdrawRequestModel = model<IWithdrawalRequest>(
      WITHDRAW_REQUEST_COLLECTION_NAME,
      WithdrawalRequestSchema
    );
  }

  async getAllWithdrawalRequestAdmin({
    filter,
    limit,
    offset,
  }: {
    filter: FilterQuery<IWithdrawalRequest>;
    offset: number;
    limit: number;
  }) {
    const items = await this.withdrawRequestModel
      .find(filter, {}, { limit, skip: offset })
      .sort({ created_at: -1 })
      .populate([
        {
          path: 'affiliate',
          populate: [{ path: 'user', select: 'email' }],
        },
      ])
      .exec();

    const total = await this.withdrawRequestModel.find(filter).count();

    return { items, total };
  }

  async checkHasOnProcessingWithdraw(affiliateId: string) {
    const result = await this.withdrawRequestModel
      .exists({
        affiliate: new Types.ObjectId(affiliateId),
        status: EWithdrawalStatus.PROCESSING,
      })
      .exec();
    return !!result;
  }

  async changeStatusWithdrawalRequest({
    withdrawalRequestId,
    status,
  }: {
    withdrawalRequestId: string;
    status: string;
  }) {
    if (
      status !== EWithdrawalStatus.DONE &&
      status !== EWithdrawalStatus.FAIL &&
      status !== EWithdrawalStatus.PROCESSING
    ) {
      throw Error('status is not EWithdrawalStatus');
    }
    const withdrawRequest = await this.withdrawRequestModel.findById(
      withdrawalRequestId
    );
    withdrawRequest.status = status;
    await withdrawRequest.save();
    return withdrawRequest;
  }

  async getWithdrawReqById(withdrawRequestId: string) {
    return await this.withdrawRequestModel
      .findById(withdrawRequestId)
      .populate([
        {
          path: 'affiliate',
          populate: [{ path: 'user', select: ['_id', 'email'] }],
        },
      ])
      .exec();
  }

  async getSuggestionId({
    value,
    limit,
    offset,
  }: {
    value: string;
    offset: number;
    limit: number;
  }) {
    const query = {
      $expr: {
        $regexMatch: {
          input: { $toString: `$_id` },
          regex: RegExp(`^${value}`, `i`),
        },
      },
    };
    const res = await this.withdrawRequestModel
      .find(query, { _id: 1 }, { limit, skip: offset })
      .exec();

    return res.map((item) => {
      return item._id.toString();
    });
  }

  async getSuggestionEmail({ value, limit }: { value: string; limit: number }) {
    const res = await this.withdrawRequestModel
      .find({})
      .populate({
        path: 'affiliate',
        populate: [
          {
            path: 'user',
            match: { email: RegExp(`^${value}`, `i`) },
          },
        ],
      })
      .exec();

    const results = [];

    res.forEach((item) => {
      const affiliate = item.affiliate;
      const user = affiliate['user'];

      if (user) {
        const value = user['email'];
        if (value && results.length < limit && !results.includes(value)) {
          results.push(value);
        }
      }
    });

    return results;
  }

  async getWithdrawRequestsByAffiliate({
    affiliateId,
    limit,
    offset,
  }: {
    affiliateId: string;
    offset: number;
    limit: number;
  }) {
    const items = await this.withdrawRequestModel
      .find(
        { affiliate: new Types.ObjectId(affiliateId) },
        {},
        { limit, skip: offset }
      )
      .populate([
        {
          path: 'affiliate',
          populate: [{ path: 'user', select: 'email' }],
        },
      ])
      .exec();
    const total = await this.withdrawRequestModel
      .find({ affiliate: new Types.ObjectId(affiliateId) })
      .count();

    return { items, total };
  }

  async createWithdrawRequest(request: {
    affiliate: string;
    amount: number;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    facebookLink: string;
  }) {
    const withdrawRequest: IWithdrawalRequest = {
      bankAccountName: request.bankAccountName,
      bankAccountNumber: request.bankAccountNumber,
      bankName: request.bankName,
      facebookLink: request.facebookLink,
      amount: request.amount,
      affiliate: new Types.ObjectId(request.affiliate),
      status: EWithdrawalStatus.PROCESSING,
    };

    return await this.withdrawRequestModel.insertMany([withdrawRequest]);
  }

  async getAll() {
    return await this.withdrawRequestModel
      .find({}, { _id: 0 })
      .populate([
        {
          path: 'affiliate',
          populate: [{ path: 'user', select: 'email' }],
        },
      ])
      .exec();
  }
}

export default WithdrawalRequestService;
