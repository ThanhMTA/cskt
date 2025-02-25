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
import { IncidentTypeCategoryData } from "../types/IncidentTypeCategory.types";

const END_POINT = "incident_type";

export const getIncidentTypeCategoryList = (query: IRequest, filter: any) => {
  return getItems<IncidentTypeCategoryData[]>(END_POINT, {
    ...query,
    fields: [
      "*"
    ],
    filter,
  });
};
export const metaIncidentTypeCategory = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getIncidentTypeCategoryDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createIncidentTypeCategory = (params: IncidentTypeCategoryData) => {
  return create<IncidentTypeCategoryData>(END_POINT, {
    ...params,
  });
};
export const updateIncidentTypeCategory = (id: any, params: any) => {
  return update<IncidentTypeCategoryData>(END_POINT, id, {
    ...params,
  });
};
export const removeIncidentTypeCategory = (id: any) => {
  return deleteData<IncidentTypeCategoryData>(END_POINT, id);
};
