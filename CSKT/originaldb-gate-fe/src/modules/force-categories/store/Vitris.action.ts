import {
  aggregateData,
  create,
  customPostApi,
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
import { VitriData} from "../types/vitris.types";

const END_POINT = "vi_tri";

export const getVitriList = async (query: IRequest, filter: any) => {
  const res = await getItems<VitriData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        parent_id: ["*"],
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
    sort: ["order_number", "code"],
    filter,
  });
  const res_map = res.map((value: VitriData) => ({
    ...value,
    //@ts-ignore
    parent_id: value?.parent_id?.id,
    parent: value?.parent_id,
  }));
  return res_map;
};
export const metaVitri = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getVitriDetail = (id: any, filter: any) => {
  return getItem<VitriData>(END_POINT, id, {
    fields: [
      "*",
      {
        parent_id: ["*"],
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

export const createVitri = (params: VitriData) => {
  return create<VitriData>(END_POINT, {
    ...params,
  });
};
export const updateVitri = (id: any, params: any) => {
  return update<VitriData>(END_POINT, id, {
    ...params,
  });
};
export const removeVitri = (id: any) => {
  return deleteData<VitriData>(END_POINT, id);
};

// export const getOrganizationCode = async (orgId?: string) => {
//   return await customPostApi(
//     "api/organizations/code/generate/",
//     {},
//     {
//       id: orgId || "",
//     }
//   );
// };
