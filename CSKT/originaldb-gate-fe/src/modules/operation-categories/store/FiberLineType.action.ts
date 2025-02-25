import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface";
import { FiberLineTypeData } from "../types/FiberLineType.types";

const END_POINT = "fiber_line_type_categories";

export const getFiberLineTypeList = (query: IRequest, filter: any) => {
    return getItems<FiberLineTypeData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaFiberLineType = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getFiberLineTypeDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createFiberLineType = (params: FiberLineTypeData) => {
    return create<FiberLineTypeData>(END_POINT, {
        ...params
    })
}
export const updateFiberLineType = (id: any, params: any) => {
    return update<FiberLineTypeData>(END_POINT, id, {
        ...params
    })
}
export const removeFiberLineType = (id: any) => {
    return deleteData<FiberLineTypeData>(END_POINT, id)
}