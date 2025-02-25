import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"

import { Region } from "../types/Region.type"



export const getRegion = (query: IRequest, filter: any) => {
    return getItems<Region[]>('region_categories', {
        ...query,
        fields: ['*'],
        filter,
        sort: ["-date_created"],
    })
}
export const metaRegion = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('region_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getRegionDetail = (id: any, filter: any) => {
    return getItem<any>('region_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createRegion = (params: Region) => {
    return create<Region>('region_categories', {
        ...params
    })
}
export const updateRegion = (id: any, params: any) => {
    return update<Region>('region_categories', id, {
        ...params
    })
}
export const removeRegion = (id: any) => {
    return deleteData<Region>('region_categories', id)
}