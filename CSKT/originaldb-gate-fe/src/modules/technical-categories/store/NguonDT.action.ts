import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { NguonDTData } from "../types/NguonDT.types";

const END_POINT = "nguon_dau_tu";

export const getNguonDTList = (query: IRequest, filter: any) => {
    return getItems<NguonDTData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaNguonDT = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getNguonDTDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createNguonDT = (params: NguonDTData) => {
    return create<NguonDTData>(END_POINT, {
        ...params
    })
}
export const updateNguonDT = (id: any, params: any) => {
    return update<NguonDTData>(END_POINT, id, {
        ...params
    })
}
export const removeNguonDT = (id: any) => {
    return deleteData<NguonDTData>(END_POINT, id)
}