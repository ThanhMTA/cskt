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
import { SpliceClosuresData } from "../types/SpliceClosures.types";

const END_POINT = "splice_closures";

export const getSpliceClosuresList = async (query: IRequest, filter: any) => {
  const data = await getItems<SpliceClosuresData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        repair_org_id: ["*"],
      },
      {
        tbvt_id: ["*"],
      },
      {
        fiber_line_id: ["*"],
      },
      {
        reason_id: ["*"],
      },
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
  return data.map((item: SpliceClosuresData) => ({
    ...item,
    name: item.tbvt_id?.name,
  }));
};
export const metaSpliceClosures = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getSpliceClosuresDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: [
      "*",
      {
        repair_org_id: ["*"],
      },
      {
        tbvt_id: ["*"],
      },
      {
        fiber_line_id: ["*"],
      },
      {
        reason_id: ["*"],
      },
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

export const createSpliceClosures = (params: SpliceClosuresData) => {
  return create<SpliceClosuresData>(END_POINT, {
    ...params,
  });
};
export const updateSpliceClosures = (id: any, params: any) => {
  return update<SpliceClosuresData>(END_POINT, id, {
    ...params,
  });
};
export const removeSpliceClosures = (id: any) => {
  return deleteData<SpliceClosuresData>(END_POINT, id);
};
