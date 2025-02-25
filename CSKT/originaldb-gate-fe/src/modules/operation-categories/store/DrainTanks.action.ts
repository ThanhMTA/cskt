import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { DrainTanksData } from "../types/DrainTanks.types";

const END_POINT = "drain_tanks";

export const getDrainTanksList = (query: IRequest, filter: any) => {
    return getItems<DrainTanksData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaDrainTanks = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getDrainTanksDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createDrainTanks = (params: DrainTanksData) => {
    return create<DrainTanksData>(END_POINT, {
        ...params
    })
}
export const updateDrainTanks = (id: any, params: any) => {
    return update<DrainTanksData>(END_POINT, id, {
        ...params
    })
}
export const removeDrainTanks = (id: any) => {
    return deleteData<DrainTanksData>(END_POINT, id)
}