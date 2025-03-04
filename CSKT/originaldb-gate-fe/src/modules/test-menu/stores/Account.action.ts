import {
  create,
  createDirectusUser,
  customGetApi,
  getItem,
  getUsers,
  updateDiretusUser,
  removeUser,
  getItems,
  readRolesItem,
} from "@app/core/api";
import { serializeFilter } from "@app/core/helper";
import { IRequest } from "@app/interfaces/common.interface";
import {
  DirectusUsers,
  Organizations,
  PersonalIdentify,
} from "@app/types/types";
import HTTP from "@app/core/http";
import { updateFile, uploadFiles } from "@directus/sdk";

const END_POINT = "personal_identifies";

export const getUsersList = async (query: IRequest, filter: any) => {
  const res = await getUsers<DirectusUsers[]>({
    ...query,
    alias: {
      value: "id",
      key: "id",
    },
    fields: [
      "*",
      "value",
      "key",
      {
        personal_id: [
          "*",
          {
            rank_id: ["*"],
          },
          {
            position_id: ["*"],
          },
          {
            org_id: ["*"],
          },
        ],
      },
      {
        role: ["*"],
      },
    ],
    filter,
  });
  return res;
};
export const getAssistantList = async (query: IRequest, filter: any) => {
  const res = await getUsers<DirectusUsers[]>({
    ...query,
    fields: [
      "*",
      {
        personal_id: [
          "*",
          {
            rank_id: ["*"],
          },
          {
            position_id: ["*"],
          },
          {
            org_id: ["*"],
          },
        ],
      },
    ],
    filter,
  });
  return res.map((item: DirectusUsers) => ({
    ...item,
    label: item?.personal_id?.full_name,
    key: item?.personal_id?.id,
    value: item?.personal_id?.id,
  }));
};
export const metaUsers = async (filter: any) => {
  const filterParams = filter ? serializeFilter(filter) : "";
  const query = `users?aggregate[countDistinct]=id${filterParams}`;
  const data: any = await customGetApi(query, {});
  return { count: data[0].countDistinct?.id };
};

export const getUserDetail = (id: string, filter: any) => {
  return getItem<Organizations>(END_POINT, id, {
    fields: [
      "*",
      {
        parent_id: ["*"],
      },
    ],
    filter,
  });
};

export const updateUser = (id: any, params: any) => {
  return updateDiretusUser<DirectusUsers>(id, {
    ...params,
  });
};
export const createUser = (params: any) => {
  return createDirectusUser<DirectusUsers>({
    ...params,
  });
};
export const delUser = (id: string) => {
  return removeUser<DirectusUsers>(id);
};
export const createPersonal = (params: PersonalIdentify) => {
  return create<PersonalIdentify>(END_POINT, {
    ...params,
  });
};
// File
export const uploadImage = (file: Blob | undefined) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    return HTTP.request(uploadFiles(formData));
  }
  return null;
};

export const updateImage = (imgId: string, file: Blob | undefined) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    return HTTP.request(updateFile(imgId, formData));
  }
  return null;
};

export const getOrganizationTree = () => {
  return getItems<Organizations[]>("organizations", {
    alias: {
      parentId: "parent_id",
      value: "id",
      key: "id",
      title: "name",
    },
    fields: [
      "id",
      "key",
      "name",
      "value",
      "title",
      "parentId",
      "parent_id",
      "order_number",
    ],
    limit: -1,
    sort: ["order_number", "code"],
  });
};
export const getRoles = () => {
  return readRolesItem<any[]>({
    alias: {
      value: "id",
      key: "id",
      label: "name",
    },
    fields: ["id", "name", "label", "value"],
    limit: -1,
  });
};
export const getCommonCategory = (collection: string) => {
  return getItems<any[]>(collection, {
    alias: {
      value: "id",
      key: "id",
      label: "name",
    },
    fields: ["id", "name", "label", "value", "key"],
    limit: -1,
  });
};
