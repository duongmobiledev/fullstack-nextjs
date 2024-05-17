import { IDailyLimit } from '@models/license.model';
import {
  IPackageFeature,
  PACKAGE_FEATURE_COLLECTION_NAME,
  PackageFeatureSchema,
} from '@models/pack-feature.model';
import {
  IPackage,
  PACKAGE_COLLECTION_NAME,
  PackageSchema,
} from '@models/package.model';
import mongoose, { Model, model } from 'mongoose';

class PackageService {
  private packageModel: Model<IPackage, {}, {}, {}, any>;
  private packageFeatureModel: Model<IPackageFeature, {}, {}, {}, any>;

  constructor() {
    this.packageModel = model<IPackage>(PACKAGE_COLLECTION_NAME, PackageSchema);
    this.packageFeatureModel = model<IPackageFeature>(
      PACKAGE_FEATURE_COLLECTION_NAME,
      PackageFeatureSchema
    );
  }

  async initPackageFeature() {
    const demoPackageFeatures: IPackageFeature[] = [
      { name: 'Phân tích khách hàng' },
      { name: 'Tạo đối tượng' },
      { name: 'Sự dụng thư viện mẫu' },
    ];
    return await this.packageFeatureModel.insertMany(demoPackageFeatures);
  }
  async initPackage() {
    const packageFeatures = (await this.initPackageFeature()).map(
      (item) => item.id
    );

    const standardPackage: IPackage = {
      level: 0,
      name: 'Standard',
      packageFeature: packageFeatures.slice(0, 2),
      price: 200000,
    };
    const proPackage: IPackage = {
      level: 1,
      name: 'Pro',
      packageFeature: packageFeatures,
      price: 450000,
    };

    return await this.packageModel.insertMany([standardPackage, proPackage]);
  }

  async getDailyLimit(id: string): Promise<IDailyLimit> {
    const pkg = await this.packageModel.findById(id).exec();
    if (pkg.name === 'Standard') {
      return {
        createAudienceLimit: 10,
        libraryLimit: 2,
        suggestedAudienceLimit: 2,
      };
    }
    return {
      createAudienceLimit: 40,
      libraryLimit: 40,
      suggestedAudienceLimit: 40,
    };
  }

  async getPackages() {
    return await this.packageModel.find({}).populate('packageFeature').exec();
  }

  async getPackagesByIds(ids?: string[]): Promise<
    {
      _id: string;
      name: string;
      price: number;
      packageFeature: { name: string; _id: string }[];
      level: number;
    }[]
  > {
    let filter: mongoose.FilterQuery<IPackage> = {};

    if (ids && ids.length !== 0) {
      const idQueries = ids.map((id) => new mongoose.Types.ObjectId(id));
      filter = { _id: { $in: idQueries } };
    }
    //@ts-ignore
    return this.packageModel.find(filter).populate('packageFeature').exec();
  }
}

export default PackageService;
