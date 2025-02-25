import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { PolesData } from "../types/Poles.types";

const END_POINT = "poles";

export const getPolesList = (query: IRequest, filter: any) => {
    return getItems<PolesData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaPoles = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getPolesDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createPoles = (params: PolesData) => {
    return create<PolesData>(END_POINT, {
        ...params
    })
}
export const updatePoles = (id: any, params: any) => {
    return update<PolesData>(END_POINT, id, {
        ...params
    })
}
export const removePoles = (id: any) => {
    return deleteData<PolesData>(END_POINT, id)
}