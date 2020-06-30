interface IApiMockMap<T> {
  [method: string]: {
    payload: T;
    isSuccess: boolean;
  };
}

export const apiMockMap: IApiMockMap<any>  = {
  'device.notification.toast': {
    payload: {
      success: true,
    },
    isSuccess: true,
  },
};
