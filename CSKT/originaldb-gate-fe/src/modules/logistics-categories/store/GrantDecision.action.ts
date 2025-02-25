import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"

import { GrantDecision } from "../types/GrantDecision.type"



export const getGrantDecision = (query: IRequest, filter: any) => {
    return getItems<GrantDecision[]>('grant_decision_categories', {
        ...query,
        fields: ['*'],
        filter,
        sort: ['order_number'],
    })
}
export const metaGrantDecision = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('grant_decision_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getGrantDecisionDetail = (id: any, filter: any) => {
    return getItem<any>('grant_decision_categories', id, {
        fields: ['*'],
        filter,
    })
}


export const createGrantDecision = (params: GrantDecision) => {
    return create<GrantDecision>('grant_decision_categories', {
        ...params
    })
}
export const updateGrantDecision = (id: any, params: any) => {
    return update<GrantDecision>('grant_decision_categories', id, {
        ...params
    })
}
export const removeGrantDecision = (id: any) => {
    return deleteData<GrantDecision>('grant_decision_categories', id)
}