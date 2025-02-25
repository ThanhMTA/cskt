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
import { MicrowaveLinesData } from "../types/MicrowaveLines.types";

const END_POINT = "microwave_lines";

export const getMicrowaveLinesList = (query: IRequest, filter: any) => {
  return getItems<MicrowaveLinesData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        org_manage_id: ["*"],
      },
    ],
    filter,
  });
};
export const metaMicrowaveLines = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getMicrowaveLinesDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createMicrowaveLines = (params: MicrowaveLinesData) => {
  return create<MicrowaveLinesData>(END_POINT, {
    ...params,
  });
};
export const updateMicrowaveLines = (id: any, params: any) => {
  return update<MicrowaveLinesData>(END_POINT, id, {
    ...params,
  });
};
export const removeMicrowaveLines = (id: any) => {
  return deleteData<MicrowaveLinesData>(END_POINT, id);
};
