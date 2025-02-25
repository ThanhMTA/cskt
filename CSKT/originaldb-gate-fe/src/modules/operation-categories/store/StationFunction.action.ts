import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface";
import { StationFunctionData } from "../types/StationFunction.types";

const END_POINT = "station_function_categories";

export const getStationFunctionList = (query: IRequest, filter: any) => {
    return getItems<StationFunctionData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaStationFunction = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getStationFunctionDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createStationFunction = (params: StationFunctionData) => {
    return create<StationFunctionData>(END_POINT, {
        ...params
    })
}
export const updateStationFunction = (id: any, params: any) => {
    return update<StationFunctionData>(END_POINT, id, {
        ...params
    })
}
export const removeStationFunction = (id: any) => {
    return deleteData<StationFunctionData>(END_POINT, id)
}