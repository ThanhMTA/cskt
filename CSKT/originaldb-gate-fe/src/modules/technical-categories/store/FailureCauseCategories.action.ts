import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { FailureCauseCategoriesData } from "../types/FailureCauseCategories.types";

const END_POINT = "failure_cause_categories";

export const getFailureCauseList = (query: IRequest, filter: any) => {
    return getItems<FailureCauseCategoriesData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaFailureCause = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getFailureCauseDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createFailureCause = (params: FailureCauseCategoriesData) => {
    return create<FailureCauseCategoriesData>(END_POINT, {
        ...params
    })
}
export const updateFailureCause = (id: any, params: any) => {
    return update<FailureCauseCategoriesData>(END_POINT, id, {
        ...params
    })
}
export const removeFailureCause = (id: any) => {
    return deleteData<FailureCauseCategoriesData>(END_POINT, id)
}