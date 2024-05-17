import { IUi, UI_COLLECTION_NAME, UiSchema } from '@models/ui.model';
import { Model, model, Types } from 'mongoose';

class UiService {
  private uiModel: Model<IUi, {}, {}, {}, any>;

  constructor() {
    this.uiModel = model<IUi>(UI_COLLECTION_NAME, UiSchema);
  }

  async upsertBanner(uri: string, path: string) {
    let ui = await this.uiModel.findOne();

    if (!ui) {
      ui = new this.uiModel();
    }
    ui.serviceBannerUri = uri;
    ui.serviceBannerPath = path;
    await ui.save();
    return ui;
  }

  async getUi() {
    return await this.uiModel.findOne().exec();
  }
}

export default UiService;
