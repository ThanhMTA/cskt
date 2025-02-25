import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"

import { EquipmentType } from "../types/EquipmentType.type"



export const getEquipmentType = (query: IRequest, filter: any) => {
    return getItems<EquipmentType[]>('equipment_type_categories', {
        ...query,
        fields: ['*'],
        filter,
        sort: ['order_number'],
    })
}
export const metaEquipmentType = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('equipment_type_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getEquipmentTypeDetail = (id: any, filter: any) => {
    return getItem<any>('equipment_type_categories', id, {
        fields: ['*'],
        filter,
    })
}


export const createEquipmentType = (params: EquipmentType) => {
    return create<EquipmentType>('equipment_type_categories', {
        ...params
    })
}
export const updateEquipmentType = (id: any, params: any) => {
    return update<EquipmentType>('equipment_type_categories', id, {
        ...params
    })
}
export const removeEquipmentType = (id: any) => {
    return deleteData<EquipmentType>('equipment_type_categories', id)
}