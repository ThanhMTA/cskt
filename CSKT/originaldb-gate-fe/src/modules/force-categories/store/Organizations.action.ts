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
import { OrganizationsData } from "../types/Organizations.types";

const END_POINT = "organizations";

export const getOrganizationsList = async (query: IRequest, filter: any) => {
  const res = await getItems<OrganizationsData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        parent_id: ["*"],
      },
      {
        military_district_id: ["*"],
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
  const res_map = res.map((value: OrganizationsData) => ({
    ...value,
    //@ts-ignore
    parent_id: value?.parent_id?.id,
    parent: value?.parent_id,
  }));
  return res_map;
};
export const metaOrganizations = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getOrganizationsDetail = (id: any, filter: any) => {
  return getItem<OrganizationsData>(END_POINT, id, {
    fields: [
      "*",
      {
        parent_id: ["*"],
      },
      {
        military_distric_id: ["*"],
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

export const createOrganizations = (params: OrganizationsData) => {
  return create<OrganizationsData>(END_POINT, {
    ...params,
  });
};
export const updateOrganizations = (id: any, params: any) => {
  return update<OrganizationsData>(END_POINT, id, {
    ...params,
  });
};
export const removeOrganizations = (id: any) => {
  return deleteData<OrganizationsData>(END_POINT, id);
};

export const getOrganizationCode = async (orgId?: string) => {
  return await customPostApi(
    "api/organizations/code/generate/",
    {},
    {
      id: orgId || "",
    }
  );
};
