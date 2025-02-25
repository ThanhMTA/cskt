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

import { Ward } from "../types/Ward.type";

export const getWard = (query: IRequest, filter: any) => {
  return getItems<Ward[]>("ward_categories", {
    ...query,
    fields: [
      "*",
      {
        admin_unit_id: ["*"],
        district_id: ["*"],
      },
    ],
    filter,
    sort: ["-date_created"],
  });
};
export const metaWard = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>("ward_categories", {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getWardDetail = (id: any, filter: any) => {
  return getItem<any>("ward_categories", id, {
    fields: [
      "*",
      {
        district_id: ["*"],
      },
      {
        admin_unit_id: ["*"],
      },
    ],
    filter,
  });
};

export const createWard = (params: Ward) => {
  return create<Ward>("ward_categories", {
    ...params,
  });
};
export const updateWard = (id: any, params: any) => {
  return update<Ward>("ward_categories", id, {
    ...params,
  });
};
export const removeWard = (id: any) => {
  return deleteData<Ward>("ward_categories", id);
};
