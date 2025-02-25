import {
  aggregateData,
  create,
  deleteData,
  getItem,
  getItems,
  update,
} from "@app/core/api";
import {
  IMeta,
  IMetaDistinct,
  IRequest,
} from "@app/interfaces/common.interface";
import { MajorCategoryData } from "../types/MajorCategory.types";
import { BusinessGroupData } from "../types/BusinessGroup.types";

const END_POINT = "major_categories";

export const getMajorCategoryList = (query: IRequest, filter: any) => {
  return getItems<MajorCategoryData[]>(END_POINT, {
    ...query,
    alias: {
      parentId: "parent_id",
      value: "id",
      title: "name",
    },
    fields: ["*", "parentId", "value", "title"],
    filter,
  });
};
export const getBusinessGroupList = (query: IRequest, filter: any) => {
  return getItems<BusinessGroupData[]>("business_group", {
    ...query,
    fields: ["*"],
    filter,
  });
};
export const metaMajorCategory = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getMajorCategoryDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: [
      "*",
      {
        parent_id: ["*"],
      },
      {
        group_id: ["*"],
      },
    ],
    filter,
  });
};

export const createMajorCategory = (params: MajorCategoryData) => {
  return create<MajorCategoryData>(END_POINT, {
    ...params,
  });
};
export const updateMajorCategory = (id: any, params: any) => {
  return update<MajorCategoryData>(END_POINT, id, {
    ...params,
  });
};
export const removeMajorCategory = (id: any) => {
  return deleteData<MajorCategoryData>(END_POINT, id);
};
