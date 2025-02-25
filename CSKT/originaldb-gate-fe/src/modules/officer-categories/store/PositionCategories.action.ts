import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { PositionCategoriesData } from "../types/PositionCategories.types"


export const getPositionList = (query: IRequest, filter: any) => {
    return getItems<PositionCategoriesData[]>('position_categories', {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaPosition = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('position_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getPositionDetail = (id: any, filter: any) => {
    return getItem<any>('position_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createPosition = (params: PositionCategoriesData) => {
    return create<PositionCategoriesData>('position_categories', {
        ...params
    })
}
export const updatePosition = (id: any, params: any) => {
    return update<PositionCategoriesData>('position_categories', id, {
        ...params
    })
}
export const removePosition = (id: any) => {
    return deleteData<PositionCategoriesData>('position_categories', id)
}