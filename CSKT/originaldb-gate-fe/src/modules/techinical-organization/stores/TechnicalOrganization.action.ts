import {
  aggregateData,
  create,
  deleteData,
  getItem,
  getItems,
  update,
  customGetApi
} from "@app/core/api";
import {
  IMeta,
  IMetaDistinct,
  IRequest,
} from "@app/interfaces/common.interface";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";
import { Organizations } from "@app/types/types";

const END_POINT = "technical_org";

export const getTechnicalOrgMilitaryType = async (id: string = "") => {
  return await customGetApi(`api/technical-org-military-type/${id}`, {});
};
export const getTechnicalOrgDegree = async (id: string = "") => {
  return await customGetApi(`api/technical-org-degree/${id}`, {});
};
export const getTechnicalTBVTDetail = (query: IRequest, filter: any) => {
  return getItems<any[]>("technical_org_tbvt_categories", {
    ...query,
    filter,
    fields: [
      "*",
      { technical_org_id: ["*"] },
      {
        tbvt_categories_id: [
          "*",
          { origin_id: ["*"] },
          { unit_id: ["*"] },
          { species_id: ["*"] },
        ],
      },
    ],
    sort: ["tbvt_categories_id.code", "tbvt_categories_id.order_number"],
  });
};
export const getTechnicalCBNVDetail = (query: IRequest, filter: any) => {
  return getItems<any[]>("technical_org_personal_identifies", {
    ...query,
    filter,
    fields: [
      "*",
      { technical_org_id: ["*"] },
      {
        personal_identifies_id: [
          "*",
          { rank_id: ["*"] },
          { position_id: ["*"] },
          { org_id: ["*"] },
          { degree_id: ["*"] },
          { type_id: ["*"] },
        ],
      },
    ],
  });
};

export const createTechnicalTBVT = (params: any) => {
  return create<any>("technical_org_tbvt_categories", {
    ...params,
  });
};
export const updateTechnicalTBVT = (id: any, params: any) => {
  return update<any>("technical_org_tbvt_categories", id, {
    ...params,
  });
};

export const deleteTechnicalTBVT = (id: string) => {
  return deleteData<any>("technical_org_tbvt_categories", id);
};
export const deleteTechnicalCBNV = (id: string) => {
  return deleteData<any>("technical_org_personal_identifies", id);
};

export const metaTechnicalTBVTDetail = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(
    "technical_org_tbvt_categories",
    {
      aggregate: { countDistinct: "id" },
      query: {
        filter,
      },
    }
  );
  return { count: data[0].countDistinct?.id };
};
export const metaTechnicalCBNVDetail = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(
    "technical_org_personal_identifies",
    {
      aggregate: { countDistinct: "id" },
      query: {
        filter,
      },
    }
  );
  return { count: data[0].countDistinct?.id };
};
export const getTechnicalOrganizationList = async (
  query: IRequest,
  filter: any
) => {
  return getItems<TechnicalOrganizationData[]>(END_POINT, {
    ...query,
    fields: [
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
    filter,
  });
};
export const metaTechnicalOrganizations = async (
  filter: any
): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};

export const getTechnicalOrganizationsDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: [
      "*",
      {
        org_manage_id: ["*"],
      },
      // {
      //   major_id: ["*"],
      // },
      // {
      //   type_id: ["*"],
      // },
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

export const createTechnicalOrganizations = (
  params: TechnicalOrganizationData
) => {
  return create<TechnicalOrganizationData>(END_POINT, {
    ...params,
  });
};
export const updateTechnicalOrganizations = (id: string, params: any) => {
  return update<TechnicalOrganizationData>(END_POINT, id, {
    ...params,
  });
};
export const removeTechnicalOrganizations = (id: any) => {
  return deleteData<TechnicalOrganizationData>(END_POINT, id);
};
export const getOrganizationTree = (filter: any) => {
  // let customFilter: any = {
  //   _and: [
  //     {
  //       ...filter,
  //     },
  //   ],
  // };
  // console.log("customFilter: ", customFilter);
  return getItems<Organizations[]>("organizations", {
    alias: {
      parentId: "parent_id",
      value: "id",
      key: "id",
      title: "name",
    },
    fields: [
      "id",
      "key",
      "name",
      "value",
      "title",
      "parentId",
      "parent_id",
      "order_number",
      "tree_path",
    ],
    limit: -1,
    filter: filter,
    sort: ["order_number", "code"],
  });
};
