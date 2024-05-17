export type ResponseType<T> = {
  message: string;
  data?: T;
  success: boolean;
};

export const generateRes = <T>(
  status: 'Success' | 'Failure',
  message: string,
  data?: T
): ResponseType<T> => {
  return { success: status === 'Success', message, data };
};
