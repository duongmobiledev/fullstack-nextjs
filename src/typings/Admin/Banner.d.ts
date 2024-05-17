export interface IUploadBannerRequest {
  file: FormData;
}
export interface IBanner {
  _id?: string;
  serviceBannerUri?: string;
  serviceBannerPath?: string;
  created_at?: string;
  updated_at?: string;
}
