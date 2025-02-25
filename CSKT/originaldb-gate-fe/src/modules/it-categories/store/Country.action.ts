import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { Country } from "../types/Country.type"


export const getCountry = (query: IRequest, filter: any) => {
    return getItems<Country[]>('country_categories', {
        ...query,
        fields: ['*'],
        filter,
        sort: ["-date_created"],
    })
}
export const metaCountry = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('country_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getCountryDetail = (id: any, filter: any) => {
    return getItem<any>('country_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createCountry = (params: Country) => {
    return create<Country>('country_categories', {
        ...params
    })
}
export const updateCountry = (id: any, params: any) => {
    return update<Country>('country_categories', id, {
        ...params
    })
}
export const removeCountry = (id: any) => {
    return deleteData<Country>('country_categories', id)
}