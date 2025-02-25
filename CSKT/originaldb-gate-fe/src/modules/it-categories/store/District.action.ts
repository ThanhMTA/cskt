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

import { District } from "../types/District.type";

export const getDistrict = (query: IRequest, filter: any) => {
  return getItems<District[]>("district_categories", {
    ...query,
    fields: [
      "*",
      {
        admin_unit_id: ["*"],
        province_id: ["*"],
        zone_id: ["*"],
      },
    ],
    filter,
    sort: ["-date_created"],
  });
};
export const metaDistrict = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>("district_categories", {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getDistrictDetail = (id: any, filter: any) => {
  return getItem<any>("district_categories", id, {
    fields: [
      "*",
      {
        admin_unit_id: ["*"],
        province_id: ["*"],
        zone_id: ["*"],
      },
    ],
    filter,
  });
};

export const createDistrict = (params: District) => {
  return create<District>("district_categories", {
    ...params,
  });
};
export const updateDistrict = (id: any, params: any) => {
  return update<District>("district_categories", id, {
    ...params,
  });
};
export const removeDistrict = (id: any) => {
  return deleteData<District>("district_categories", id);
};
