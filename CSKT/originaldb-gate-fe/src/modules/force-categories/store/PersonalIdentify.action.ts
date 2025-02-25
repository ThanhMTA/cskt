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
import { PersonalIdentifyData } from "../types/PersonalIdentify.types";

const END_POINT = "personal_identifies";

export const getPersonalIdentifyList = (query: IRequest, filter: any) => {
  return getItems<PersonalIdentifyData[]>(END_POINT, {
    ...query,
    fields: [
      "*",
      { rank_id: ["*"] },
      { position_id: ["*"] },
      { org_id: ["*"] },
      { degree_id: ["*"] },
    ],
    filter,
  });
};
export const metaPersonalIdentify = async (filter: any): Promise<IMeta> => {
  const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
    aggregate: { countDistinct: "id" },
    query: {
      filter,
    },
  });
  return { count: data[0].countDistinct?.id };
};
export const getPersonalIdentifyDetail = (id: any, filter: any) => {
  return getItem<any>(END_POINT, id, {
    fields: ["*"],
    filter,
  });
};

export const createPersonalIdentify = (params: PersonalIdentifyData) => {
  return create<PersonalIdentifyData>(END_POINT, {
    ...params,
  });
};
export const updatePersonalIdentify = (id: any, params: any) => {
  return update<PersonalIdentifyData>(END_POINT, id, {
    ...params,
  });
};
export const removePersonalIdentify = (id: any) => {
  return deleteData<PersonalIdentifyData>(END_POINT, id);
};
