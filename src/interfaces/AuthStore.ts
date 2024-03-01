export type AuthStoreType = {
  isAuthenticated?: boolean;
  token?: string;
  userData?: any;
  setAuthData?: (payload: {token: string, userData:any}) => void;
  setToken: (payload: string) => void;
  setUser: (payload: any) => void;
  resetAuthStore: () => void;
};