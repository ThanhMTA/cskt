import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { UnitCategoriesData } from "../types/UnitCategories.types"

const END_POINT = "reason_categories";

export const getReasonList = (query: IRequest, filter: any) => {
    return getItems<UnitCategoriesData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaReason = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getReasonDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createReason = (params: UnitCategoriesData) => {
    return create<UnitCategoriesData>(END_POINT, {
        ...params
    })
}
export const updateReason = (id: any, params: any) => {
    return update<UnitCategoriesData>(END_POINT, id, {
        ...params
    })
}
export const removeReason = (id: any) => {
    return deleteData<UnitCategoriesData>(END_POINT, id)
}