import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { DefenseLandsData } from "../types/DefenseLands.types";

const END_POINT = "defense_lands";

export const getDefenseLandsList = (query: IRequest, filter: any) => {
    return getItems<DefenseLandsData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaDefenseLands = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getDefenseLandsDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createDefenseLands = (params: DefenseLandsData) => {
    return create<DefenseLandsData>(END_POINT, {
        ...params
    })
}
export const updateDefenseLands = (id: any, params: any) => {
    return update<DefenseLandsData>(END_POINT, id, {
        ...params
    })
}
export const removeDefenseLands = (id: any) => {
    return deleteData<DefenseLandsData>(END_POINT, id)
}