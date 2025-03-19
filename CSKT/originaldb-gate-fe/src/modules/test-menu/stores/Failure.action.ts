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

// import { CanBoCategoriesData } from "../types/CanBoCategories.types";
import { FailureData } from "../types/Failure.type";
import { VitriData } from "@app/modules/force-categories/types/vitris.types";
const END_POINT = "failure_management";

// export const getFailure = (query: IRequest, filter: any) => {
//     return getItems<FailureData[]>(END_POINT, {
//         ...query,
//         fields: [
//             "*",
//             {
//                 // admin_unit_id: ["*"],
//                 TTB_id: ["*"],// trang thiết bị
//             },
//         ],
//         filter,
//         sort: ["date_created"],
//     });
// };
export const getFailure = ( ttbId: string) => {
    return getItems<FailureData[]>(END_POINT, {
    
      fields: [
        "*",
        {
          TTB_id: ["*"], // lấy đầy đủ thông tin của thiết bị
        },
      ],
      filter: {
        TTB_id: {
          id: {
            _eq: ttbId, // lọc theo id của thiết bị
          },
        },
      },
      sort: ["-time"],
    });
  };
  
export const metaFailure = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>(END_POINT, {
        aggregate: { countDistinct: "id" },
        query: {
            filter,
        },
    });
    return { count: data[0].countDistinct?.id };
};
export const getFailureDetail = (id: any, filter: any) => {
    return getItem<any>(END_POINT, id, {
        fields: [
            "*",
            {
                // admin_unit_id: ["*"],
                TTB_id: ["*"],// trang thiết bị
            },
        ],
        filter,
    });
};

export const createFailure = (params: FailureData) => {
    return create<FailureData>(END_POINT, {
        ...params,
    });
};
export const updateFailure = (id: any, params: any) => {
    return update<FailureData>(END_POINT, id, {
        ...params,
    });
};
export const removeFailure = (id: any) => {
    return deleteData<FailureData>(END_POINT, id);
};
export const getCommonCategory = (collection: string) => {
    return getItems<any[]>(collection, {
        alias: {
            value: "id",
            key: "id",
            label: "name",
        },
        fields: ["id", "name", "label", "value", "key"],
        limit: -1,
    });
};

// export const getPlaceTree = () => {

//     return getItems<VitriData[]>("vi_tri", {

//         alias: {
//             parentId: "parent_id",
//             value: "id",
//             key: "id",
//             title: "name",
//         },
//         fields: [

//             "id",
//             "name",
//             // "value",
//             // "title",
//             // "parentId",
//             "parent_id",
//             //   "order_number",
//             //   "tree_path",
//         ],
//         limit: -1,
//         // filter: filter,
//         sort: ["order_number", "code"],
//     });
// };
export const getPlaceTree = async () => {
    try {
      const result = await getItems<VitriData[]>("vi_tri", {
        alias: {
          parentId: "parent_id",
          value: "id",
          key: "id",
          title: "name",
        },
        fields: ["id", "name", "parent_id"],
        limit: -1,
        sort: ["order_number"],
      });
      return result;
    } catch (error: any) {
      console.error("❌ Lỗi khi lấy dữ liệu vị trí:", error);
  
      // Có thể throw lại lỗi rõ ràng hơn nếu cần
      throw new Error(
        error?.message?.message || "Đã xảy ra lỗi khi truy vấn vị trí (vi_tri)"
      );
    }
  };
  