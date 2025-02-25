import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { AdministrativeUnit } from "../types/AdministrativeUnit.type"



export const getAdministrativeUnit = (query: IRequest, filter: any) => {
    return getItems<AdministrativeUnit[]>('administrative_unit_categories', {
        ...query,
        fields: ['*'],
        filter,
        sort: ["-date_created"],
    })
}
export const metaAdministrativeUnit = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('administrative_unit_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getAdministrativeUnitDetail = (id: any, filter: any) => {
    return getItem<any>('administrative_unit_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createAdministrativeUnit = (params: AdministrativeUnit) => {
    return create<AdministrativeUnit>('administrative_unit_categories', {
        ...params
    })
}
export const updateAdministrativeUnit = (id: any, params: any) => {
    return update<AdministrativeUnit>('administrative_unit_categories', id, {
        ...params
    })
}
export const removeAdministrativeUnit = (id: any) => {
    return deleteData<AdministrativeUnit>('administrative_unit_categories', id)
}