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
import { StationTypeData } from "../types/StationType.types";

const END_POINT = "station_type_categories";

export const getStationTypeList = async (query: IRequest, filter: any) => {
  const res = await getItems<StationTypeData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        parent_id: ["*"],
      },
    ],
    filter,
  });
  const res_map = res.map((value: StationTypeData) => ({
    ...value,
    //@ts-ignore
    parent_id: value?.parent_id?.id,
    parent: value?.parent_id,
  }));
  return res_map;
};
export const metaStationType = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getStationTypeDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createStationType = (params: StationTypeData) => {
  return create<StationTypeData>(END_POINT, {
    ...params,
  });
};
export const updateStationType = (id: any, params: any) => {
  return update<StationTypeData>(END_POINT, id, {
    ...params,
  });
};
export const removeStationType = (id: any) => {
  return deleteData<StationTypeData>(END_POINT, id);
};
