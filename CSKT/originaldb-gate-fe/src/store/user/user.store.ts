import { create } from "zustand";
import { getUserInfo } from "./user.action";
import { getPermissions, roles } from "@app/core/api";
import { CustomPermissions, DirectusRoles } from "@app/types/types";
import { UserStore } from "@app/types/user.types";
export const userStore = create<UserStore>((set) => ({
  isLoading: false,
  userInfo: undefined,
  users: [],
  isLoadingGetList: false,
  roles: undefined,
  usersMeta: {
    count: 0,
  },
  getUserInformation: async (req?) => {
    try {
      set({ isLoading: true });
      const user = await getUserInfo(req);
      const permissions: CustomPermissions[] = await getPermissions({
        fields: [
          "*",
          {
            role: {
              _eq: user?.role?.id,
            },
          },
        ],
      });

      set({
        isLoading: false,
        userInfo: {
          ...user,
          permissions,
        },
      });

      return {
        ...user,
        permissions,
      };
    } catch (e) {
      set({ isLoading: false, userInfo: undefined, usersMeta: undefined });
      return Promise.reject(e);
    }
  },
  getRolesList: async (req) => {
    try {
      const res = await roles<DirectusRoles[]>(req);
      set({
        roles: res,
      });
      return res;
    } catch (e) {
      set({ roles: undefined });
      return Promise.reject(e);
    }
  },
  setClearUserInfo: () => {
    set({
      userInfo: undefined,
      usersMeta: undefined,
      roles: undefined,
      users: [],
    });
  },
}));
