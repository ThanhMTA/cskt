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
import { OpticalFiberLinesData } from "../types/OpticalFiberLines.types";

const END_POINT = "optical_fiber_lines";

export const getOpticalFiberLinesList = (query: IRequest, filter: any) => {
  return getItems<OpticalFiberLinesData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        org_id: ["*"],
      },
      {
        org_use_id: ["*"],
      },
      {
        org_technical_id: ["*"],
      },
      {
        org_suport_id: ["*"],
      },
      {
        type_id: ["*"],
      },
    ],
    filter,
  });
};
export const metaOpticalFiberLines = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getOpticalFiberLinesDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createOpticalFiberLines = (params: OpticalFiberLinesData) => {
  return create<OpticalFiberLinesData>(END_POINT, {
    ...params,
  });
};
export const updateOpticalFiberLines = (id: any, params: any) => {
  return update<OpticalFiberLinesData>(END_POINT, id, {
    ...params,
  });
};
export const removeOpticalFiberLines = (id: any) => {
  return deleteData<OpticalFiberLinesData>(END_POINT, id);
};
