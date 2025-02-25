import { readActivitiesItem } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"

export const getActivities = (req: IRequest, filter: any) => {
    return readActivitiesItem<any[]>({
        sort: '-timestamp',
        ...req,
        fields: ['*',
            {
                user: ['*', {
                    role: ['*']
                }]
            }, {
                revisions: ['*']
            }
        ],
        filter,
    })
}

export const paginationActivities = async (filter: any): Promise<IMeta> => {
    const data = await readActivitiesItem<IMetaDistinct[]>({
        aggregate: {
            countDistinct: 'id'
        },
        filter
    })
    return { count: data[0].countDistinct?.id }
}