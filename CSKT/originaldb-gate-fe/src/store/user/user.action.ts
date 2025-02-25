import {
  IMeta,
  IMetaDistinct,
  IRequest,
} from "@app/interfaces/common.interface";
import { getUsers, me, removeUser } from "@app/core/api";
import { DirectusUsers } from "@app/types/types";
import { UserModel } from "@app/core/models/User";
import { UserInfo } from "@app/types/user.types";

export const getUserInfo = (req?: IRequest) => {
  return me<UserInfo>({
    ...req,
    fields: [
      "*",
      {
        role: ["*"],
        personal_id: [
          "*",
          {
            org_id: ["*", { parent_id: ["*"] }],
          },
        ],
      },
    ],
  });
};
export const getListUser = (req: IRequest, filter: any) => {
  return getUsers<UserModel[]>({
    ...req,
    fields: ["*", { role: ["*"] }],
    filter,
  }).then((res) => UserModel.fromArray(res));
};

export const paginationUser = async (
  req: IRequest,
  filter: any
): Promise<IMeta> => {
  const data = await getUsers<IMetaDistinct[]>({
    ...req,
    aggregate: {
      countDistinct: "id",
    },
    filter,
  });
  return { count: data[0]?.countDistinct?.id || 0 };
};
export const removeDirectusUser = (id: string) => {
  return removeUser<DirectusUsers>(id);
};
