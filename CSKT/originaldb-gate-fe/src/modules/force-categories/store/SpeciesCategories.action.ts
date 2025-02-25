import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { SpeciesCategoriesData } from "../types/SpeciesCategories.types";

const END_POINT = "species_categories";

export const getSpeciesList = (query: IRequest, filter: any) => {
    return getItems<SpeciesCategoriesData[]>(END_POINT, {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaSpecies = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getSpeciesDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createSpecies = (params: SpeciesCategoriesData) => {
    return create<SpeciesCategoriesData>(END_POINT, {
        ...params
    })
}
export const updateSpecies = (id: any, params: any) => {
    return update<SpeciesCategoriesData>(END_POINT, id, {
        ...params
    })
}
export const removeSpecies = (id: any) => {
    return deleteData<SpeciesCategoriesData>(END_POINT, id)
}