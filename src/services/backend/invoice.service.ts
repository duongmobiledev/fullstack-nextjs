import {
  EInvoiceStatus,
  IInvoice,
  InvoiceSchema,
  INVOICE_COLLECTION_NAME,
} from '@models/invoice.model';
import { omit } from 'lodash';
import { FilterQuery, Model, model, Types } from 'mongoose';

class InvoiceService {
  private invoiceModel: Model<IInvoice, {}, {}, {}, any>;

  constructor() {
    this.invoiceModel = model<IInvoice>(INVOICE_COLLECTION_NAME, InvoiceSchema);
  }

  async getAll() {
    return await this.invoiceModel
      .find({})
      .populate([
        { path: 'user', select: 'email' },
        { path: 'service' },
        { path: 'package' },
      ])
      .exec();
  }

  async getInvoiceAdmin({
    filter,
    limit,
    offset,
  }: {
    filter: FilterQuery<IInvoice>;
    limit: number;
    offset: number;
  }) {
    const items = await this.invoiceModel
      .find(
        filter,
        {
          _id: 0,
          locale: 0,
          merchTxnRef: 0,
          updated_at: 0,
          txnResponseCode: 0,
          message: 0,
        },
        { limit, skip: offset }
      )
      .sort({ created_at: -1 })
      .populate([
        { path: 'user', select: ['email', 'phoneNumber'] },
        { path: 'service', select: 'name' },
        { path: 'package' },
      ])
      .exec();
    const total = await this.invoiceModel.find(filter).count();
    return { items, total };
  }

  async getByOrderIdRegexToSuggestion({
    regex,
    limit,
    offset,
  }: {
    regex: RegExp;
    limit: number;
    offset: number;
  }) {
    const res = await this.invoiceModel
      .find({ orderId: regex }, { orderId: 1 }, { limit, skip: offset })
      .exec();

    return res.map((item) => item.orderId);
  }

  async getEmailOrPhoneToSuggestion({
    type,
    value,
    limit,
  }: {
    type: 'phoneNumber' | 'email';
    value: string;
    limit: number;
  }) {
    const regex = RegExp(`^${value}`, `i`);
    const res = await this.invoiceModel
      .find({}, { user: 1 })
      .populate({
        path: 'user',
        match: { [type]: regex },
      })
      .exec();

    const results = [];
    res.forEach((item) => {
      const user = item.user;
      if (user) {
        const value = item.user[type];
        if (value && results.length < limit && !results.includes(value)) {
          results.push(value);
        }
      }
    });

    return results;
  }

  async getInvoiceByUserAndService({
    userId,
    serviceId,
    limit,
    offset,
  }: {
    userId: string;
    serviceId: string;
    limit: number;
    offset: number;
  }) {
    const items = await this.invoiceModel
      .find(
        {
          user: new Types.ObjectId(userId),
          service: new Types.ObjectId(serviceId),
        },
        {
          _id: 0,
          locale: 0,
          merchTxnRef: 0,
          service: 0,
          user: 0,
          updated_at: 0,
          txnResponseCode: 0,
          message: 0,
        },
        { limit, skip: offset }
      )
      .populate([{ path: 'package' }])
      .exec();

    const total = await this.invoiceModel
      .find({
        user: new Types.ObjectId(userId),
        service: new Types.ObjectId(serviceId),
      })
      .count();

    return { items, total };
  }

  async insertInvoice(invoice: IInvoice) {
    return await this.invoiceModel.insertMany([invoice]);
  }

  async updateInvoice(orderId: string, newInvoice: Partial<IInvoice>) {
    return await this.invoiceModel.updateOne(
      { orderId },
      { $set: { ...newInvoice } }
    );
  }

  async checkExistInvoiceByOrderId(orderId: string) {
    const result = await this.invoiceModel.exists({ orderId }).exec();
    return !!result;
  }

  async isFirstUserInvoice(userId: string) {
    const result = await this.invoiceModel
      .exists({
        user: new Types.ObjectId(userId),
        status: EInvoiceStatus.SUCCESS,
      })
      .exec();
    return !result;
  }

  async getInvoicesByReferrer({
    limit,
    offset,
    ids,
    accountId,
  }: {
    ids: string[];
    limit: number;
    offset: number;
    accountId: number;
  }) {
    const invoices = await this.invoiceModel
      .find(
        {
          _id: ids,
        },
        {
          merchTxnRef: 0,
          txnResponseCode: 0,
          package: 0,
          service: 0,
          _id: 0,
          updated_at: 0,
          message: 0,
          numberOfMonths: 0,
          numberOfMonthsUpgrade: 0,
          isSupport1v1: 0,
          isUpgrade: 0,
        },
        {
          limit,
          skip: offset,
        }
      )
      .populate([
        { path: 'user', select: 'email' },
        { path: 'service' },
        { path: 'package', populate: ['packageFeature'] },
      ])
      .exec();

    const total = await this.invoiceModel
      .find({
        _id: ids,
      })
      .count();

    const items = invoices.map((item) => {
      let discount = 0;
      if (item.referrerCode === accountId) {
        discount += item.referrerDiscount;
      }
      if (item.userRefCode === accountId) {
        discount += item.userRefCodeDiscount;
      }
      //@ts-ignore
      const result = omit(item._doc, [
        'userRefCodeDiscount',
        'referrerDiscount',
      ]);
      return { ...result, discount };
    });
    return {
      items,
      total,
    };
  }

  async getTotalSuccessInvoicesByReferrer(referrer: number) {
    return await this.invoiceModel
      .find({
        referrerCode: referrer,
        status: EInvoiceStatus.SUCCESS,
      })
      .count();
  }

  async getInvoiceByOrderId(orderId: string) {
    return await this.invoiceModel
      .findOne({ orderId })
      .populate([
        { path: 'user', select: ['email', 'accountId', 'referrer'] },
        { path: 'service' },
        { path: 'package', populate: ['packageFeature'] },
      ])
      .exec();
  }
  async getInvoiceIdByOrderId(orderId: string) {
    const res = await this.invoiceModel.findOne({ orderId }).exec();
    return res._id;
  }
}

export default InvoiceService;
