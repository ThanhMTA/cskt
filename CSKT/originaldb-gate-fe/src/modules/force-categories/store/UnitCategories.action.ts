import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { ReasonCategoriesData } from "../types/ReasonCategories.types";

const END_POINT = "unit_categories";

export const getUnitList = (query: IRequest, filter: any) => {
    return getItems<ReasonCategoriesData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaUnit = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getUnitDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createUnit = (params: ReasonCategoriesData) => {
    return create<ReasonCategoriesData>(END_POINT, {
        ...params
    })
}
export const updateUnit = (id: any, params: any) => {
    return update<ReasonCategoriesData>(END_POINT, id, {
        ...params
    })
}
export const removeUnit = (id: any) => {
    return deleteData<ReasonCategoriesData>(END_POINT, id)
}