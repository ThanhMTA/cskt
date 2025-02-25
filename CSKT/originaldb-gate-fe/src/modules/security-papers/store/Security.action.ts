import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { Security } from "../types/Security.type"



export const getSecurity = (query: IRequest, filter: any) => {
    return getItems<Security[]>('security_categories', {
        ...query,
        fields: ['*'],
        filter
    })
}
export const metaSecurity = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('security_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getSecurityDetail = (id: any, filter: any) => {
    return getItem<any>('security_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createSecurity = (params: Security) => {
    return create<Security>('security_categories', {
        ...params
    })
}
export const updateSecurity = (id: any, params: any) => {
    return update<Security>('security_categories', id, {
        ...params
    })
}
export const removeSecurity = (id: any) => {
    return deleteData<Security>('security_categories', id)
}