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

import { Province } from "../types/Province.type";

export const getProvince = (query: IRequest, filter: any) => {
  return getItems<Province[]>("province_categories", {
    ...query,
    fields: [
      "*",
      {
        admin_unit_id: ["*"],
        military_distric_id: ["*"],
        region_id: ["*"],
      },
    ],
    filter,
    sort: ["-date_created"],
  });
};
export const metaProvince = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>("province_categories", {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getProvinceDetail = (id: any, filter: any) => {
  return getItem<any>("province_categories", id, {
    fields: [
      "*",
      {
        admin_unit_id: ["*"],
        military_distric_id: ["*"],
        region_id: ["*"],
      },
    ],
    filter,
  });
};

export const createProvince = (params: Province) => {
  return create<Province>("province_categories", {
    ...params,
  });
};
export const updateProvince = (id: any, params: any) => {
  return update<Province>("province_categories", id, {
    ...params,
  });
};
export const removeProvince = (id: any) => {
  return deleteData<Province>("province_categories", id);
};
