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
import { TechnicalCategoryData } from "../types/TechnicalCategory.types";

const END_POINT = "technical_category";

export const getTechnicalCategoryList = (query: IRequest, filter: any) => {
  return getItems<TechnicalCategoryData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        org_id: ["*"],
      },
    ],
    filter,
  });
};
export const metaTechnicalCategory = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getTechnicalCategoryDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createTechnicalCategory = (params: TechnicalCategoryData) => {
  return create<TechnicalCategoryData>(END_POINT, {
    ...params,
  });
};
export const updateTechnicalCategory = (id: any, params: any) => {
  return update<TechnicalCategoryData>(END_POINT, id, {
    ...params,
  });
};
export const removeTechnicalCategory = (id: any) => {
  return deleteData<TechnicalCategoryData>(END_POINT, id);
};
