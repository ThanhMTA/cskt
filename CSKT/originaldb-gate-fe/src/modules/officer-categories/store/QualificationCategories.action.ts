import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { QualificationCategoriesData } from "../types/QualificationCategories.types";

const endpoint = "qualification_categories";

export const getQualificationList = (query: IRequest, filter: any) => {
    return getItems<QualificationCategoriesData[]>(endpoint, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaQualification = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(endpoint, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getQualificationDetail = (id: any, filter: any) => {
    return getItem<any>(endpoint, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createQualification = (params: QualificationCategoriesData) => {
    return create<QualificationCategoriesData>(endpoint, {
        ...params
    })
}
export const updateQualification = (id: any, params: any) => {
    return update<QualificationCategoriesData>(endpoint, id, {
        ...params
    })
}
export const removeQualification = (id: any) => {
    return deleteData<QualificationCategoriesData>(endpoint, id)
}