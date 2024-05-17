export type IAppearanceTypes = 'error' | 'info' | 'success' | 'empty' | 'warn';

export interface IToast {
  type: IAppearanceTypes;
  title?: string;
  message?: string;
}
