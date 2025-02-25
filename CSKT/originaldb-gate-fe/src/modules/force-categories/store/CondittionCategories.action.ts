import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { ConditionCategoriesData } from "../types/ConditionCategories.types";

const END_POINT = "condition_categories";

export const getConditionList = (query: IRequest, filter: any) => {
    return getItems<ConditionCategoriesData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaCondition = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getConditionDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createCondition = (params: ConditionCategoriesData) => {
    return create<ConditionCategoriesData>(END_POINT, {
        ...params
    })
}
export const updateCondition = (id: any, params: any) => {
    return update<ConditionCategoriesData>(END_POINT, id, {
        ...params
    })
}
export const removeCondition = (id: any) => {
    return deleteData<ConditionCategoriesData>(END_POINT, id)
}