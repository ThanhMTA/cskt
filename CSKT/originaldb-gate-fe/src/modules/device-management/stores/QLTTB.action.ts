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
import { TTBData } from "../types/TTB.type";
import { VitriData } from "@app/modules/force-categories/types/vitris.types";

export const getTTB = (query: IRequest, filter: any) => {
    return getItems<TTBData[]>("trang_thiet_bi", {
        ...query,
        fields: [
            "*",
            {
                // admin_unit_id: ["*"],
                condition_id: ["*"],// tình trạng
            },
            {
                org_id: ["*"],// đơn vị biên chế
            },
            {

                species_id: ["*"],// chủng loại
            },
            {
                unit_id: ["*"],// đơn vị tính
            },
            {
                investor_id: ["*"],// nguồn đầu tư
            },
          
            {
                manager_id: ["*"], // người quản lý
            },
            {
                manufacturer_id: ["*"], // hãng sản xuất
            },
            {
                place_id: ["*"],// vị trí hiện tại
            },
            {
                group_id: ["*"],
            }

        ],
        filter,
        sort: ["date_created"],
    });
};
export const metaTTB = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>("trang_thiet_bi", {
        aggregate: { countDistinct: "id" },
        query: {
            filter,
        },
    });
    return { count: data[0].countDistinct?.id };
};
export const getTTBDetail = (id: any, filter: any) => {
    return getItem<any>("trang_thiet_bi", id, {
        fields: [
            "*",
            {
                // admin_unit_id: ["*"],
                condition_id: ["*"],// tình trạng
            },
            {
                org_id: ["*"],// đơn vị biên chế
            },
            {

                species_id: ["*"],// chủng loại
            },
            {
                unit_id: ["*"],// đơn vị tính
            },
            {
                investor_id: ["*"],// nguồn đầu tư
            },
            {
                manager_id: ["*"], // người quản lý
            },
            {
                manufacturer_id: ["*"], // hãng sản xuất
            },
            {
                place_id: ["*"],// vị trí hiện tại
            },
            {
                group_id: ["*"],
            }
            ,
            {
                store_id: ["*"],
            }
        ],
        filter,
    });
};

export const createTTB = (params: TTBData) => {
    return create<TTBData>("trang_thiet_bi", {
        ...params,
    });
};
export const updateTTB = (id: any, params: any) => {
    return update<TTBData>("trang_thiet_bi", id, {
        ...params,
    });
};
export const updateTTBPlace = (id: any, placeId: any) => {
    return update<TTBData>("trang_thiet_bi", id, {
        place_id: placeId,
    });
};
export const removeTTB = (id: any) => {
    return deleteData<TTBData>("trang_thiet_bi", id);
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
  