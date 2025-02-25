import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { TechnicalTeamsData } from "@app/modules/technical-categories/types/TechnicalTeams.types";
const END_POINT = "actors";

export const getActorsList = (query: IRequest, filter: any) => {
    return getItems<any[]>(END_POINT, {
        ...query,
        fields: ['*',{
            tables:['*',{
                tables_id:['*']
            }]
        }],
        filter,
    })
}

export const metaActors = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getActorsDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createActors = (params: TechnicalTeamsData) => {
    return create<TechnicalTeamsData>(END_POINT, {
        ...params
    })
}
export const updateActors = (id: any, params: any) => {
    return update<TechnicalTeamsData>(END_POINT, id, {
        ...params
    })
}
export const removeActors = (id: any) => {
    return deleteData<TechnicalTeamsData>(END_POINT, id)
}

export const getActorsDirectusRoles = (filter: any) => {
    return getItems<any>('actors_directus_roles', {
        fields: ['*',{
            directus_roles_id:['*'],
            actors_id:['*',{
                tables:['*',{
                    tables_id:['*']
                }]
            }]
        }],
        filter,
    })
}
export const getAvailableRoles = (filter: any) => {
    return getItems<any>('available_roles', {
        fields: ['*',{
            role_id:['*']
        }],
        filter,
    })
}