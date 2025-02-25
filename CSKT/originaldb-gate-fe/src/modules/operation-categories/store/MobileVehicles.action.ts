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
import { MobileVehiclesData } from "../types/MobileVehicles.types";

const END_POINT = "mobile_vehicles";

export const getMobileVehiclesList = (query: IRequest, filter: any) => {
  return getItems<MobileVehiclesData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        org_id: ["*"],
      },
      {
        origin_id: ["*"],
      },
    ],
    filter,
  });
};
export const metaMobileVehicles = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getMobileVehiclesDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createMobileVehicles = (params: MobileVehiclesData) => {
  return create<MobileVehiclesData>(END_POINT, {
    ...params,
  });
};
export const updateMobileVehicles = (id: any, params: any) => {
  return update<MobileVehiclesData>(END_POINT, id, {
    ...params,
  });
};
export const removeMobileVehicles = (id: any) => {
  return deleteData<MobileVehiclesData>(END_POINT, id);
};
