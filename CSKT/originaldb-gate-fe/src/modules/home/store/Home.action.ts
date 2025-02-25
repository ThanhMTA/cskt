import { getItems } from "@app/core/api"
import { IRequest } from "@app/interfaces/common.interface"

export const getTablesDevices = (collection: string, query: IRequest, filter: any) => {
    return getItems<any[]>(collection, {
        ...query,
        fields: ['*'],
        filter,
    })
}