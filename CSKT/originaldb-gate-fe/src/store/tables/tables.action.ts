import { aggregateData, getItems } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { Collection, TableDetailDescription } from "@app/types/table.types"

export const getTableByName = (query: IRequest, filter: any) => {
    return getItems<Collection[]>('tables', {
        ...query,
        fields: ['*'],
        filter,
    })
}

export const getTableDetailDescription = (query: IRequest, filter: any) => {
    return getItems<TableDetailDescription[]>('tables_detail_description', {
        ...query,
        fields: ['*'],
        filter,
    })
}
export const metaTableDetailDescription = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('tables_detail_description', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}