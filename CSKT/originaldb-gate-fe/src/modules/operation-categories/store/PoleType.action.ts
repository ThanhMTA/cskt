import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { PoleTypeData } from "../types/PoleType.types";

const END_POINT = "pole_type";

export const getPoleTypeList = (query: IRequest, filter: any) => {
    return getItems<PoleTypeData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaPoleType = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getPoleTypeDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createPoleType = (params: PoleTypeData) => {
    return create<PoleTypeData>(END_POINT, {
        ...params
    })
}
export const updatePoleType = (id: any, params: any) => {
    return update<PoleTypeData>(END_POINT, id, {
        ...params
    })
}
export const removePoleType = (id: any) => {
    return deleteData<PoleTypeData>(END_POINT, id)
}