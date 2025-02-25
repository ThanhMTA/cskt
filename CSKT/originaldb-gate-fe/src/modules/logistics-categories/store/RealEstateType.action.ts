import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"

import { RealEstateType } from "../types/RealEstateType.type"



export const getRealEstateType = (query: IRequest, filter: any) => {
    return getItems<RealEstateType[]>('real_estate_type_categories', {
        ...query,
        fields: ['*'],
        filter,
        sort: ['order_number'],
    })
}
export const metaRealEstateType = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('real_estate_type_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getRealEstateTypeDetail = (id: any, filter: any) => {
    return getItem<any>('real_estate_type_categories', id, {
        fields: ['*'],
        filter,
    })
}


export const createRealEstateType = (params: RealEstateType) => {
    return create<RealEstateType>('real_estate_type_categories', {
        ...params
    })
}
export const updateRealEstateType = (id: any, params: any) => {
    return update<RealEstateType>('real_estate_type_categories', id, {
        ...params
    })
}
export const removeRealEstateType = (id: any) => {
    return deleteData<RealEstateType>('real_estate_type_categories', id)
}