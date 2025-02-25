import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { Urgency } from "../types/Urgency.type"



export const getUrgency = (query: IRequest, filter: any) => {
    return getItems<Urgency[]>('urgency_categories', {
        ...query,
        fields: ['*'],
        filter
    })
}
export const metaUrgency = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('urgency_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getUrgencyDetail = (id: any, filter: any) => {
    return getItem<any>('urgency_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createUrgency = (params: Urgency) => {
    return create<Urgency>('urgency_categories', {
        ...params
    })
}
export const updateUrgency = (id: any, params: any) => {
    return update<Urgency>('urgency_categories', id, {
        ...params
    })
}
export const removeUrgency = (id: any) => {
    return deleteData<Urgency>('urgency_categories', id)
}