import {
    aggregateData,
    create,
    deleteData,
    getItem,
    getItems,
    update,
  } from "@app/core/api";
  import {
    IMeta,
    IMetaDistinct,
    IRequest,
  } from "@app/interfaces/common.interface";
  
  import { BC } from "../types/BinhChung.type";
  
  export const getBC= (query: IRequest, filter: any) => {
    return getItems<BC[]>("Binh_Chung", {
      ...query,
      fields: [
        "*",
        {
          admin_unit_id: ["*"],
          district_id: ["*"],
        },
      ],
      filter,
      sort: ["-date_created"],
    });
  };
  export const metaBC= async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>("Binh_Chung", {
      aggregate: { countDistinct: "id" },
      query: {
        filter,
      },
    });
    return { count: data[0].countDistinct?.id };
  };
  export const getBCDetail = (id: any, filter: any) => {
    return getItem<any>("Binh_Chung", id, {
      fields: [
        "*",
        
      ],
      filter,
    });
  };
  
  export const createBC= (params: BC) => {
    return create<BC>("Binh_Chung", {
      ...params,
    });
  };
  export const updateBC= (id: any, params: any) => {
    return update<BC>("Binh_Chung", id, {
      ...params,
    });
  };
  export const removeBC= (id: any) => {
    return deleteData<BC>("Binh_Chung", id);
  };
  