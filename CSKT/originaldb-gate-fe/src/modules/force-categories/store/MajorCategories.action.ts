import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { MajorCategoriesData } from "../types/MajorCategories.types";

const END_POINT = "major_categories";

export const getMajorList = (query: IRequest, filter: any) => {
    let customFilter: any = {
        _and: [
          {
            ...filter,
          },
        ],
      };
      return getItems<MajorCategoriesData[]>(END_POINT, {
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
        ],
        filter: customFilter,
      });
    // return getItems<MajorCategoriesData[]>(END_POINT, {
    //     ...query,
    //     fields: ['*'],
    //     filter,
    // })
}
export const metaMajor = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getMajorDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createMajor = (params: MajorCategoriesData) => {
    return create<MajorCategoriesData>(END_POINT, {
        ...params
    })
}
export const updateMajor = (id: any, params: any) => {
    return update<MajorCategoriesData>(END_POINT, id, {
        ...params
    })
}
export const removeMajor = (id: any) => {
    return deleteData<MajorCategoriesData>(END_POINT, id)
}