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
import { WorkstationsData } from "../types/Workstations.types";

const END_POINT = "workstations";

export const getWorkstationsList = async (query: IRequest, filter: any) => {
  const res = await getItems<WorkstationsData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      { org_id: ["*"] },
      { org_support_id: ["*"] },
      { org_technical_id: ["*"] },
      { org_use_id: ["*"] },
      { type_id: ["*"] },
      {
        ward_id: [
          "*",
          {
            district_id: [
              "*",
              {
                province_id: ["*"],
              },
            ],
          },
        ],
      },
      {
        parent_id: ["*"],
      },
    ],
    filter,
  });
  const res_map = res.map((value: WorkstationsData) => ({
    ...value,
    //@ts-ignore
    parent_id: value?.parent_id?.id,
    parent: value?.parent_id,
  }));
  return res_map;
};
export const metaWorkstations = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getWorkstationsDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createWorkstations = (params: WorkstationsData) => {
  return create<WorkstationsData>(END_POINT, {
    ...params,
  });
};
export const updateWorkstations = (id: any, params: any) => {
  return update<WorkstationsData>(END_POINT, id, {
    ...params,
  });
};
export const removeWorkstations = (id: any) => {
  return deleteData<WorkstationsData>(END_POINT, id);
};
