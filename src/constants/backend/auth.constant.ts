export const MAX_AGE_LOGIN_TOKEN = 5 * 60; // second
export const MAX_AGE_ACCESS_TOKEN = 15 * 60; // second

export enum ROLE_SCOPE {
  ADMIN = 'read write admin',
  USER = 'read write',
  READ_ONLY = 'read',
}

export const ADMIN_WHITE_LIST = [
  'g99.team.dev@gmail.com',
  'nhatlam310399@gmail.com',
];
