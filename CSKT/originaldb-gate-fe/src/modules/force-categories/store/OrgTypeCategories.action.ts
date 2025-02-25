import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { OrgTypeCategoriesData } from "../types/OrgTypeCategories.types";

const END_POINT = "org_type_categories";

export const getOrgTypeList = (query: IRequest, filter: any) => {
    return getItems<OrgTypeCategoriesData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaOrgType = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getOrgTypeDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createOrgType = (params: OrgTypeCategoriesData) => {
    return create<OrgTypeCategoriesData>(END_POINT, {
        ...params
    })
}
export const updateOrgType = (id: any, params: any) => {
    return update<OrgTypeCategoriesData>(END_POINT, id, {
        ...params
    })
}
export const removeOrgType = (id: any) => {
    return deleteData<OrgTypeCategoriesData>(END_POINT, id)
}