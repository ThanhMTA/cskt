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


export const getTTB =  async(query: IRequest, filter: any) => {
    const result = await getItems<any[]>("organizations", {
        fields: ["id"],
        filter: { name: { _eq: "a11" }, ...filter },
    });
    // Lấy ID từ kết quả trả về
    const id = result[0] || null;
// console.log("ktra:", id)
    // Kiểm tra nếu không tìm thấy ID
    if (!id) {
        return [];
    }
    const updatedFilter1 = { ...filter };

    // Nếu filter chứa _and, loại bỏ các điều kiện không mong muốn
    if (updatedFilter1._and) {
        updatedFilter1._and = updatedFilter1._and.filter((condition: any) => {
            return !condition.place_id ; // Loại bỏ name và org_id
        });
    }   
    // Xóa luôn nếu `name` hoặc `org_id` tồn tại ở ngoài
    delete updatedFilter1.place_id;
    if (id) {
        updatedFilter1.place_id = { _in: id };
    }
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
        filter: { 
            place_id: { _in:id }
        },
        // filter: updatedFilter1,
        sort: ["date_created"],
    });
};
export const metaTTB = async (filter: any): Promise<IMeta> => {
    const result = await getItems<any[]>("organizations", {
        fields: ["id"],
        filter: { name: { _eq: "a11" }, ...filter },
    });
    // Lấy ID từ kết quả trả về
    const id = result[0] || null;
// console.log("ktra:", id)
    // Kiểm tra nếu không tìm thấy ID
   
    const data = await aggregateData<IMetaDistinct[]>("trang_thiet_bi", {
        aggregate: { countDistinct: "id" },
        query: {
            filter: {
                place_id: { _in:id }
            },
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
      throw new Error(
        error?.message?.message || "Đã xảy ra lỗi khi truy vấn vị trí (vi_tri)"
      );
    }
  };