import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { NhomTBKTData } from "../types/NhomTBKT.types";

const END_POINT = "Nhom_TBKT";

export const getNhomTBKTList = (query: IRequest, filter: any) => {
    return getItems<NhomTBKTData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaNhomTBKT = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getNhomTBKTDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createNhomTBKT = (params: NhomTBKTData) => {
    return create<NhomTBKTData>(END_POINT, {
        ...params
    })
}
export const updateNhomTBKT = (id: any, params: any) => {
    return update<NhomTBKTData>(END_POINT, id, {
        ...params
    })
}
export const removeNhomTBKT = (id: any) => {
    return deleteData<NhomTBKTData>(END_POINT, id)
}