import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"

import { MilitaryDistrict } from "../types/MilitaryDistrict.type"



export const getMilitaryDistrict = (query: IRequest, filter: any) => {
    return getItems<MilitaryDistrict[]>('military_district_categories', {
        ...query,
        fields: ['*'],
        filter,
        sort: ["-date_created"],
    })
}
export const metaMilitaryDistrict = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('military_district_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getMilitaryDistrictDetail = (id: any, filter: any) => {
    return getItem<any>('military_district_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createMilitaryDistrict = (params: MilitaryDistrict) => {
    return create<MilitaryDistrict>('military_district_categories', {
        ...params
    })
}
export const updateMilitaryDistrict = (id: any, params: any) => {
    return update<MilitaryDistrict>('military_district_categories', id, {
        ...params
    })
}
export const removeMilitaryDistrict = (id: any) => {
    return deleteData<MilitaryDistrict>('military_district_categories', id)
}