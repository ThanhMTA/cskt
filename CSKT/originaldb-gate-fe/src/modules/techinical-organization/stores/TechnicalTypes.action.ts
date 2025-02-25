import {
  aggregateData,
  create,
  deleteData,
  getItem,
  getItems,
  update,
} from "@app/core/api";
import { TechnicalTypesData } from "../types/TechnicalTypes.type";
import { IMeta, IMetaDistinct } from "@app/interfaces/common.interface";

const END_POINT = "technical_types";

export const createTechnicalTypes = (params: TechnicalTypesData) => {
  return create<TechnicalTypesData>(END_POINT, {
    ...params,
  });
};
export const updateTechnicalTypes = (id: string, params: any) => {
  return update<TechnicalTypesData>(END_POINT, id, {
    ...params,
  });
};
export const metaTechnicalTypes = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getTechnicalTypes = async (filter: any) => {
  const res = await getItems<TechnicalTypesData[]>(END_POINT, {
    limit: -1,
    filter,
    fields: [
      "*",
      {
        technical_id: [
          "*",
          {
            org_manage_id: ["*"],
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
      },
      {
        major_id: ["*"],
      },
      {
        type_id: ["*"],
      },
      {
        personal_identifies: ["*"],
      },
    ],
  });
  return res.map((item) => ({
    ...item,
    ...item.technical_id,
    parentId: item.technical_id?.parent_id,
    key: item?.technical_id?.id,
    title: item?.technical_id?.name,
    value: item?.id,
    parent_id: item.technical_id?.parent_id,
    id: item.id,
  }));
};
export const getTechnicalTypesDetail = async (id: any, filter: any) => {
  const res = await getItem<any>(END_POINT, id, {
    fields: [
      "*",
      {
        technical_id: [
          "*",
          {
            org_manage_id: ["*"],
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
      },
      {
        major_id: ["*"],
      },
      {
        type_id: ["*"],
      },
    ],
    filter,
  });
  return {
    ...res,
    ...res.technical_id,
    id: res.id,
  };
};

export const removeTechnicalTypes = (id: any) => {
  return deleteData<TechnicalTypesData>(END_POINT, id);
};
