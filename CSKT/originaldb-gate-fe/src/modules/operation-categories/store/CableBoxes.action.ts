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
import { CableBoxesData } from "../types/CableBoxes.types";

const END_POINT = "cable_boxes";

export const getCableBoxesList = (query: IRequest, filter: any) => {
  return getItems<CableBoxesData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
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
export const metaCableBoxes = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getCableBoxesDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createCableBoxes = (params: CableBoxesData) => {
  return create<CableBoxesData>(END_POINT, {
    ...params,
  });
};
export const updateCableBoxes = (id: any, params: any) => {
  return update<CableBoxesData>(END_POINT, id, {
    ...params,
  });
};
export const removeCableBoxes = (id: any) => {
  return deleteData<CableBoxesData>(END_POINT, id);
};
