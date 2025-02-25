import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { DrainTankTypeData } from "../types/DrainTankType.types";

const END_POINT = "drain_tank_type";

export const getDrainTankTypeList = (query: IRequest, filter: any) => {
    return getItems<DrainTankTypeData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaDrainTankType = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getDrainTankTypeDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createDrainTankType = (params: DrainTankTypeData) => {
    return create<DrainTankTypeData>(END_POINT, {
        ...params
    })
}
export const updateDrainTankType = (id: any, params: any) => {
    return update<DrainTankTypeData>(END_POINT, id, {
        ...params
    })
}
export const removeDrainTankType = (id: any) => {
    return deleteData<DrainTankTypeData>(END_POINT, id)
}