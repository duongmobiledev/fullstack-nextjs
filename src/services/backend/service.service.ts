import {
  IService,
  SERVICE_COLLECTION_NAME,
  ServiceSchema,
} from '@models/service.model';
import { forEach } from 'lodash';
import { FilterQuery, Model, model, Types } from 'mongoose';

class ServiceService {
  private serviceModel: Model<IService, {}, {}, {}, any>;

  constructor() {
    this.serviceModel = model<IService>(SERVICE_COLLECTION_NAME, ServiceSchema);
  }

  async initService(packages: Types.ObjectId[]) {
    // Fake data ------

    const initService: IService = {
      name: 'Audinsights',
      description:
        'Phân tích tập khách hàng và tạo đối tượng quảng cáo được tối ưu từ bài viết',
      price: 200000,
      packages,
    };
    // Fake data ------
    return await this.serviceModel.insertMany(initService);
  }

  async getTotalService() {
    return await this.serviceModel.count();
  }

  async getServices({
    limit: limitArg,
    offset: offsetArg,
  }: {
    offset?: number;
    limit?: number;
  }) {
    const limit = limitArg || 20;
    const offset = offsetArg || 0;

    const arr = await this.serviceModel
      .find({}, { packages: 0 }, { limit, skip: offset })
      .populate('packages')
      .exec();

    return arr;
  }

  async getServicesByName({
    name,
    limit: limitArg,
    offset: offsetArg,
  }: {
    name?: string;
    offset?: number;
    limit?: number;
  }) {
    const limit = limitArg || 20;
    const offset = offsetArg || 0;

    const filter: FilterQuery<IService> = {};
    if (name && name.length !== 0) {
      filter.name = RegExp(`^${name}`, `i`);
    }

    const items = await this.serviceModel
      .find(filter, { _id: 1, name: 1 }, { limit, skip: offset })
      .exec();

    const total = await this.serviceModel.find(filter).count();

    return { items, total };
  }

  async getServiceById(_id: string) {
    return this.serviceModel.findById(_id).populate('packages').exec();
  }
  async getAllServiceId() {
    const services = await this.serviceModel
      .find({}, { description: 0, name: 0, packages: 0, price: 0 })
      .exec();
    return services.map((item) => item.id);
  }
}

export default ServiceService;
