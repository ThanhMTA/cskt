import { aggregateData } from "@app/core/api";
import { IMeta } from "@app/interfaces/common.interface";

export const metaCollections = async (endpoint:string, filter: any): Promise<IMeta> => {
  const data = await aggregateData<any[]>(endpoint, {
      aggregate: { countDistinct: 'id' },
      query: {
          filter
      }
  })
  return { count: data[0].countDistinct?.id };
}