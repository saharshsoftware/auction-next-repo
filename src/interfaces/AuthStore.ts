export type AuthStoreType = {
  isNewUser?: boolean;
  setNewUserStatus: (status: boolean) => void;
  authRefreshTrigger: number;
  triggerAuthRefresh: () => void;
};