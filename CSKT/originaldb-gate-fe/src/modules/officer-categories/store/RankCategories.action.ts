import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { RankCategoriesData } from "../types/RankCategories.types";

const endpoint = "rank_categories";

export const getRankList = (query: IRequest, filter: any) => {
    return getItems<RankCategoriesData[]>(endpoint, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaRank = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(endpoint, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getRankDetail = (id: any, filter: any) => {
    return getItem<any>(endpoint, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createRank = (params: RankCategoriesData) => {
    return create<RankCategoriesData>(endpoint, {
        ...params
    })
}
export const updateRank = (id: any, params: any) => {
    return update<RankCategoriesData>(endpoint, id, {
        ...params
    })
}
export const removeRank = (id: any) => {
    return deleteData<RankCategoriesData>(endpoint, id)
}