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
import { TechnicalTeamsData } from "../types/TechnicalTeams.types";

const END_POINT = "technical_teams";

export const getTechnicalTeamsList = (query: IRequest, filter: any) => {
  return getItems<TechnicalTeamsData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      {
        org_id: ["*"],
      },
    ],
    filter,
  });
};
export const metaTechnicalTeams = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getTechnicalTeamsDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createTechnicalTeams = (params: TechnicalTeamsData) => {
  return create<TechnicalTeamsData>(END_POINT, {
    ...params,
  });
};
export const updateTechnicalTeams = (id: any, params: any) => {
  return update<TechnicalTeamsData>(END_POINT, id, {
    ...params,
  });
};
export const removeTechnicalTeams = (id: any) => {
  return deleteData<TechnicalTeamsData>(END_POINT, id);
};
