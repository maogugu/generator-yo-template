interface ILwpApiMockMap {
  [lwpUri: string]: {
    payload: {
      body: any;
      code: number;
    };
    isSuccess: boolean;
  };
}

export const lwpApiMock: ILwpApiMockMap = {
  '/r/Adaptor/DeptGuideI/getOrgTargetInfo': {
    payload: {
      body: {},
      code: 200,
    },
    isSuccess: true,
  },
};
