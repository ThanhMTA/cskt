import { customGetApi, readActivitiesItem } from "@app/core/api";
import { serializeFilter } from "@app/core/helper";
import { IRequest } from "@app/interfaces/common.interface";
import { DirectusActivity } from "@app/types/types";

export const getListHistories = (query: IRequest, filter: any) => {
  return readActivitiesItem<DirectusActivity[]>({
    ...query,
    fields: [
      "*",
      {
        user: ["first_name", "last_name"],
      },
      {
        revisions: ["data"],
      },
    ],
    filter,
    sort: ["timestamp"],
  });
};
export const metaHistory = async (filter: any) => {
  const filterParams = filter ? serializeFilter(filter) : "";
  const query = `activity?aggregate[countDistinct]=id${filterParams}`;
  const data: any = await customGetApi(query, {});
  return { count: data[0].countDistinct?.id };
};
