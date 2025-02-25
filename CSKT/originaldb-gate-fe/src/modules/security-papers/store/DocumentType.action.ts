import { aggregateData, create, deleteData, getItem, getItems, update } from "@app/core/api"
import { IMeta, IMetaDistinct, IRequest } from "@app/interfaces/common.interface"
import { DocumentType } from "../types/DocumentType.type"



export const getDocumentType = (query: IRequest, filter: any) => {
    return getItems<DocumentType[]>('document_type_categories', {
        ...query,
        fields: ['*'],
        filter
    })
}
export const metaDocumentType = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>('document_type_categories', {
        aggregate: { countDistinct: 'id' },
        query: {
            filter
        }
    })
    return { count: data[0].countDistinct?.id };
}
export const getDocumentTypeDetail = (id: any, filter: any) => {
    return getItem<any>('document_type_categories', id, {
        fields: ['*',
 
        ],
        filter,
    })
}


export const createDocumentType = (params: DocumentType) => {
    return create<DocumentType>('document_type_categories', {
        ...params
    })
}
export const updateDocumentType = (id: any, params: any) => {
    return update<DocumentType>('document_type_categories', id, {
        ...params
    })
}
export const removeDocumentType = (id: any) => {
    return deleteData<DocumentType>('document_type_categories', id)
}