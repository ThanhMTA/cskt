import { getItems } from "@app/core/api";
import { IRequest } from "@app/interfaces/common.interface";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";

const END_POINT = "technical_type";

export const getTechnicalTypeTree = async (query: IRequest, filter: any) => {
  let customFilter: any = {
    _and: [
      {
        ...filter,
      },
    ],
  };
  return getItems<TechnicalOrganizationData[]>(END_POINT, {
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
      "short_name",
      "parentId",
      "parent_id",
    ],
    filter: customFilter,
    limit: -1,
    sort: ["order_number"],
  });
};

export const getTechnicalTypeList = async (query: IRequest, filter: any) => {
  return getItems<TechnicalOrganizationData[]>(END_POINT, {
    ...query,
    fields: ["*"],
    filter,
    sort: ["order_number"],
  });
};
