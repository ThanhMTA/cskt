import { IMeta, IRequest } from "@app/interfaces/common.interface";
import { CustomPermissions, DirectusRoles, DirectusUsers } from "./types";
import { UserModel } from "@app/core/models/User";

export type UserInfo = DirectusUsers & {
  permissions: CustomPermissions[];
};
export type UserState = {
  error?: any;
  isLoading?: boolean;
  isLoadingGetList?: boolean;
  userInfo?: UserInfo;
  users?: UserModel[];
  usersMeta?: IMeta;
  roles?: DirectusRoles[];
};

export type UserAction = {
  getUserInformation: (req?: IRequest) => Promise<UserInfo>;
  getRolesList: (req?: IRequest) => Promise<DirectusRoles[]>;
  setClearUserInfo: () => void;
  // resetHoiNghiStore: () => void
};
export type UserStore = UserState & UserAction;
