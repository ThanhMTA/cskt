import {
  aggregateData,
  create,
  customGetApi,
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
import { TBVTCategoriesData } from "../types/TBVTCategories.types";

const END_POINT = "tbvt_categories";

export const getTBVTCategoriesList = async (query: IRequest, filter: any) => {
  const res = await getItems<TBVTCategoriesData[]>(END_POINT, {
    ...query,
    // alias: {
    //   parent: "parent_id",
    // },
    fields: [
      "*",
      { origin_id: ["*"] },
      { parent_id: ["*"] },
      { unit_id: ["*"] },
      { species_id: ["*"] },
      {
        major_categories: [
          {
            major_categories_id: ["id", "name"],
          },
        ],
      },
    ],
    sort: ["order_number", "code"],
    filter,
  });
  const res_map = res.map((value: TBVTCategoriesData) => ({
    ...value,
    //@ts-ignore
    parent_id: value?.parent_id?.id,
    parent: value?.parent_id,
  }));
  return res_map;
};
export const metaTBVTCategories = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getTBVTCategoriesDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createTBVTCategories = (params: TBVTCategoriesData) => {
  console.log("params: ", params);
  return create<TBVTCategoriesData>(END_POINT, {
    ...params,
  });
};
export const updateTBVTCategories = (id: any, params: any) => {
  return update<TBVTCategoriesData>(END_POINT, id, {
    ...params,
  });
};
export const removeTBVTCategories = (id: any) => {
  return deleteData<TBVTCategoriesData>(END_POINT, id);
};

export const getTBVTCode = async (tbvnId: string) => {
  return await customGetApi(`api/tbvt-categories/${tbvnId}/generate/`, {});
};
