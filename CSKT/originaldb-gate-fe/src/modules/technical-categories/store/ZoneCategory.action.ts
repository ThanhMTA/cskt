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
import { ZoneCategoryData } from "../types/ZoneCategory.types";

const END_POINT = "zone_categories";

export const getZoneCategoryList = (query: IRequest, filter: any) => {
  return getItems<ZoneCategoryData[]>(END_POINT, {
    ...query,
    fields: ["*"],
    filter,
  });
};

export const metaZoneCategory = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getZoneCategoryDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createZoneCategory = (params: ZoneCategoryData) => {
  return create<ZoneCategoryData>(END_POINT, {
    ...params,
  });
};
export const updateZoneCategory = (id: any, params: any) => {
  return update<ZoneCategoryData>(END_POINT, id, {
    ...params,
  });
};
export const removeZoneCategory = (id: any) => {
  return deleteData<ZoneCategoryData>(END_POINT, id);
};
