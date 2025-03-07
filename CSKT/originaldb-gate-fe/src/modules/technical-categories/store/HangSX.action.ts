import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { HangSXData } from "../types/HangSX.types";

const END_POINT = "hang_san_xuat";

export const getHangSXList = (query: IRequest, filter: any) => {
    return getItems<HangSXData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaHangSX = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getHangSXDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createHangSX = (params: HangSXData) => {
    return create<HangSXData>(END_POINT, {
        ...params
    })
}
export const updateHangSX = (id: any, params: any) => {
    return update<HangSXData>(END_POINT, id, {
        ...params
    })
}
export const removeHangSX = (id: any) => {
    return deleteData<HangSXData>(END_POINT, id)
}