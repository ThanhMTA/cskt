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
import { handoverData } from "../types/handover.type";
import { TTBData } from "../types/TTB.type";
import { VitriData } from "@app/modules/force-categories/types/vitris.types";
import { CanBoCategoriesData } from "@app/modules/officer-categories/types/CanBoCategories.types";
import { handoverListData } from "../types/handoverList.type";
// export const getTTBHandover = (query: IRequest, handoverId: string) => {
//     return getItems<TTBData[]>("trang_thiet_bi", {
//         ...query,
//         fields: [
//             "*",
//             { condition_id: ["*"] },  // tình trạng
//             { org_id: ["*"] },        // đơn vị biên chế
//             { species_id: ["*"] },    // chủng loại
//             { unit_id: ["*"] },       // đơn vị tính
//             { investor_id: ["*"] },   // nguồn đầu tư
//             { management_id: ["*"] }, // đơn vị quản lý
//             { manager_id: ["*"] },    // người quản lý
//             { manufacturer_id: ["*"] }, // hãng sản xuất
//             { place_id: ["*"] },      // vị trí hiện tại
//             { group_id: ["*"] }
//         ],
//         filter: {
//             _and: [
//                 { id: { _in: getItems<number[]>("handover_list", { 
//                     fields: ["ttb_id"], 
//                     filter: { handover_id: { _eq: handoverId } } 
//                 }) } }
//             ]
//         },
//         sort: ["date_created"],
//     });
// };
const getReceivedHandovers = async () => {
    return getItems<handoverData[]>("handover_record", {
        fields: ["id"],
        filter: { type_handover: { _eq: "Nhận" } }
    }).then(res => res.map(item => item.id)); // Lấy danh sách id của biên bản
};
const getHandoverList = async (handoverIds: string[]) => {
    return getItems<handoverListData[]>("handover_list", {
        fields: ["id_tb"],
        filter: { id_handover: { _in: handoverIds } }
    }).then(res => res.map(item => item.id_tb)); // Lấy danh sách id của trang thiết bị
};
const getReceivedTTB = async (ttbIds: string[]) => {
    return getItems<TTBData[]>("trang_thiet_bi", {
        fields: [
            "*",
            { condition_id: ["*"] },  // Tình trạng
            { org_id: ["*"] },        // Đơn vị biên chế
            { species_id: ["*"] },    // Chủng loại
            { unit_id: ["*"] },       // Đơn vị tính
            { investor_id: ["*"] },   // Nguồn đầu tư
            { management_id: ["*"] }, // Đơn vị quản lý
            { manager_id: ["*"] },    // Người quản lý
            { manufacturer_id: ["*"] }, // Hãng sản xuất
            { place_id: ["*"] },      // Vị trí hiện tại
            { group_id: ["*"] }
        ],
        filter: { id: { _in: ttbIds } }
    });
};
export const getReceivedTTBList = async () => {
    const handoverIds = await getReceivedHandovers(); // Bước 1
    if (handoverIds.length === 0) return []; // Không có biên bản nào

    const ttbIds = await getHandoverList(handoverIds); // Bước 2
    if (ttbIds.length === 0) return []; // Không có thiết bị nào

    return getReceivedTTB(ttbIds); // Bước 3
};


export const getTTBHandoverReceived = async (query: IRequest, filter: any) => {
    // Lấy danh sách handover_id có type_handover = "nhận"
    const handoverIds = await getItems<string[]>("handover_record", {
        fields: ["id"],
        filter: { type_handover: { _eq: "Nhận" } }
    });

    if (!handoverIds.length) return []; // Nếu không có, trả về mảng rỗng

    // Lấy danh sách ttb_id từ handover_list có handover_id thuộc danh sách trên
    const ttbIds = await getItems<number[]>("handover_list", {
        fields: ["id_tb"],
        filter: { id_handover: { _in: handoverIds } }
    });

    if (!ttbIds.length) return []; // Nếu không có, trả về mảng rỗng

    // Lấy danh sách trang thiết bị từ danh sách ttbIds
    return getItems<TTBData[]>("trang_thiet_bi", {
        ...query,
        fields: [
            "*",
            { condition_id: ["*"] },  // tình trạng
            { org_id: ["*"] },        // đơn vị biên chế
            { species_id: ["*"] },    // chủng loại
            { unit_id: ["*"] },       // đơn vị tính
            { investor_id: ["*"] },   // nguồn đầu tư
            { management_id: ["*"] }, // đơn vị quản lý
            { manager_id: ["*"] },    // người quản lý
            { manufacturer_id: ["*"] }, // hãng sản xuất
            { place_id: ["*"] },      // vị trí hiện tại
            { group_id: ["*"] }
        ],
        filter: {
            _and: {
                id: { _in: ttbIds }
            }
        },

        sort: ["date_created"],
    });
};

export const getCanBo = (org_id: string[]) => {
    return getItems<CanBoCategoriesData[]>("can_bo", {

        fields: [
            "*",

            {
                // admin_unit_id: ["*"],
                capbac_id: ["*"],

            },
            {
                chucvu_id: ["*"],
            },
            {

                donvi_id: ["*"],
            },
            {

                ward_id: [
                    "*",
                    {
                        district_id: [
                            "*",
                            {
                                province_id: ["*"],
                            },
                        ],
                    },
                ],
            }
        ],

        filter: {
            donvi_id: {
                id: {
                    // _eq:org_id, // lọc theo id của thiết bị
                    _in: org_id, // lọc theo id của thiết bị

                },
            },
        },
        sort: ["date_created"],
    });
};
export const getHandover = (query: IRequest, filter: any) => {
    return getItems<handoverData[]>("handover_record", {
        ...query,
        fields: [
            "*",
            {
                // admin_unit_id: ["*"],
                org_delivery_id: ["*"],// đơn vị giao
            },
            {
                org_receive_id: ["*"],// đơn vị nhận
            },
            {

                deliverer_id: ["*"],// người giao
            },
            {
                receiver_id: ["*"],// người nhận
            },


        ],
        filter,
        sort: ["date_created"],
    });
};

export const metaHandover = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>("handover_record", {
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
                management_id: ["*"], // đơn vị quản lý
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

export const createHandover = (params: handoverData) => {
    return create<handoverData>("handover_record", {
        ...params,
    });
};
export const createHandoverList = (params: handoverListData) => {
    return create<handoverListData>("handover_list", {
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
