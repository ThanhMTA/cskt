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

import { EngineRoom } from "../types/EngineRoom.type";

export const getEngineRoom = (query: IRequest, filter: any) => {
  return getItems<EngineRoom[]>("engine_room_categories", {
    ...query,
    fields: [
      "*",
      { org_id: ["*"] },
      { org_support_id: ["*"] },
      { org_technical_id: ["*"] },
      { org_use_id: ["*"] },
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
    ],
    filter,
    sort: ["-date_created"],
  });
};
export const metaEngineRoom = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>("engine_room_categories", {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getEngineRoomDetail = (id: any, filter: any) => {
  return getItem<any>("engine_room_categories", id, {
    fields: [
      "*",
      { org_id: ["*"] },
      { org_support_id: ["*"] },
      { org_technical_id: ["*"] },
      { org_use_id: ["*"] },
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
    ],
    filter,
  });
};

export const createEngineRoom = (params: EngineRoom) => {
  console.log("params: ", params);
  return create<EngineRoom>("engine_room_categories", {
    ...params,
  });
};
export const updateEngineRoom = (id: any, params: any) => {
  console.log("params: ", params);
  return update<EngineRoom>("engine_room_categories", id, {
    ...params,
  });
};
export const removeEngineRoom = (id: any) => {
  return deleteData<EngineRoom>("engine_room_categories", id);
};
