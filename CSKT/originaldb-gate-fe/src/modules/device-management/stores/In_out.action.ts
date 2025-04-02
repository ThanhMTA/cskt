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


const getReceivedHandovers = async (filter: any) => {
    let updatedFilter: any = { type_handover: { _eq: "Nhận" } };

    // Chỉ giữ lại các điều kiện liên quan đến `time`
    if (filter?.time) {
        updatedFilter = {
            ...updatedFilter,
            time: filter.time
        };
    }

    return getItems<handoverData[]>("handover_record", {
        fields: ["id"],
        filter: updatedFilter
    }).then(res => res.map(item => item.id)); // Lấy danh sách id của biên bản
};

const getHandoverList = async (handoverIds: string[]) => {
    return getItems<handoverListData[]>("handover_list", {
        fields: ["id_tb"],
        filter: { id_handover: { _in: handoverIds } }
    }).then(res => res.map(item => item.id_tb)); // Lấy danh sách id của trang thiết bị
};
const getReceivedTTB = async (query: IRequest, extraFilter: any, ttbIds: string[]) => {
    // Khởi tạo filter với điều kiện `id: { _in: ttbIds }`
    let filter: any = { id: { _in: ttbIds } };

    // Nếu có các điều kiện lọc khác, thêm vào `_and`
    if (extraFilter && Object.keys(extraFilter).length > 0) {
        filter = {
            _and: [
                filter, // Giữ điều kiện lọc theo `ttbIds`
                extraFilter, // Thêm điều kiện bổ sung
            ],
        };
    }

    return getItems<TTBData[]>("trang_thiet_bi", {
        ...query,
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
        filter, // Sử dụng filter đã được cập nhật
        sort: ["date_created"],
    });
};

export const getReceivedTTBList = async (query: IRequest, extraFilter: any) => {
    const handoverIds = await getReceivedHandovers(extraFilter); // Bước 1: Lấy danh sách biên bản bàn giao
    if (handoverIds.length === 0) return []; // Không có biên bản nào

    const ttbIds = await getHandoverList(handoverIds); // Bước 2: Lấy danh sách thiết bị từ biên bản
    if (ttbIds.length === 0) return []; // Không có thiết bị nào

    return getReceivedTTB(query, extraFilter, ttbIds); // Bước 3: Lấy danh sách thiết bị với bộ lọc
};

export const getHandoverList1 = async (query: IRequest, filter: any, type_handover: string) => {

    // const updatedFilter1 = { ...filter };

    // // Nếu filter chứa _and, loại bỏ các điều kiện không mong muốn
    // if (updatedFilter1._and) {
    //     updatedFilter1._and = updatedFilter1._and.filter((condition: any) => {
    //         return !condition.name && !condition.org_id; // Loại bỏ name và org_id
    //     });
    // }

    // // Xóa luôn nếu `name` hoặc `org_id` tồn tại ở ngoài
    // delete updatedFilter1.name;
    // delete updatedFilter1.org_id;
    // if (type_handover) {
    //     updatedFilter1.type_handover = { _eq: type_handover };
    // }
    const updatedFilter1: any = {};

    // Chỉ giữ lại các điều kiện liên quan đến time và type_handover
    if (filter.time) {
        updatedFilter1.time = filter.time;
    }
    if (filter.type_handover) {
        updatedFilter1.type_handover = filter.type_handover;
    }

    // Nếu có type_handover từ biến bên ngoài, thêm vào điều kiện lọc
    if (type_handover) {
        updatedFilter1.type_handover = { _eq: type_handover };
    }

    const handoverRecords = await getItems<handoverData[]>("handover_record", {
        fields: ["id"],
        // filter: Object.keys(updatedFilter1).length > 0 ? updatedFilter1 : undefined, // Chỉ truyền filter nếu còn điều kiện hợp lệ
        // filter
        filter: updatedFilter1,
    });

    const updatedFilter = { ...filter };

    // Nếu filter chứa _and, loại bỏ time khỏi các điều kiện bên trong
    if (updatedFilter._and) {
        updatedFilter._and = updatedFilter._and.filter((condition: any) => !condition.time);
    }

    // Xóa luôn nếu `time` tồn tại ở ngoài
    delete updatedFilter.time;

    const TTBRecords = await getItems<TTBData[]>("trang_thiet_bi", {
        fields: ["id"],
        filter: updatedFilter
        // filter
    });

    // const TTBRecords = await getItems<TTBData[]>("trang_thiet_bi", {
    //     fields: ["id"],
    //     // filter // Chỉ truyền filter nếu có
    //     filter
    // });

    const handoverIds = handoverRecords.map((record) => record.id);
    const ttbIds = TTBRecords.map((record) => record.id); // Chỉ lấy danh sách id

    if (handoverIds.length === 0 || ttbIds.length === 0) return []; // Không có dữ liệu phù hợp

    // Bước 3: Lọc danh sách handover_list theo id_handover và id_tb
    return getItems<handoverListData[]>("handover_list", {
        ...query,
        fields: ["*",
            {
                id_tb: [
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

            },
            {
                id_handover:

                    [
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
            }
            //   { 

            //   }
        ],
        filter: {
            id_handover: { _in: handoverIds },
            id_tb: { _in: ttbIds }
        },
        sort: ["date_created"],
    });
};
export const metaHandoverList = async (filter: any, type_handover: string): Promise<IMeta> => {
    // const updatedFilter1 = { ...filter };

    // // Loại bỏ điều kiện không mong muốn trong `_and`
    // if (updatedFilter1._and) {
    //     updatedFilter1._and = updatedFilter1._and.filter((condition: any) => {
    //         return !condition.name && !condition.org_id;
    //     });
    // }

    // // Xóa `name` và `org_id` nếu tồn tại
    // delete updatedFilter1.name;
    // delete updatedFilter1.org_id;

    // // Thêm `type_handover` vào bộ lọc nếu có
    // if (type_handover) {
    //     updatedFilter1.type_handover = { _eq: type_handover };
    // }
    const updatedFilter1: any = {};

    // Chỉ giữ lại các điều kiện liên quan đến time và type_handover
    if (filter.time) {
        updatedFilter1.time = filter.time;
    }
    if (filter.type_handover) {
        updatedFilter1.type_handover = filter.type_handover;
    }

    // Nếu có type_handover từ biến bên ngoài, thêm vào điều kiện lọc
    if (type_handover) {
        updatedFilter1.type_handover = { _eq: type_handover };
    }
    // 🔹 Lọc danh sách `handover_record`
    const handoverRecords = await getItems<handoverData[]>("handover_record", {
        fields: ["id"],
        filter: updatedFilter1,
    });

    const updatedFilter = { ...filter };

    // Loại bỏ `time` khỏi `_and`
    if (updatedFilter._and) {
        updatedFilter._and = updatedFilter._and.filter((condition: any) => !condition.time);
    }

    // Xóa `time` nếu tồn tại
    delete updatedFilter.time;

    // 🔹 Lọc danh sách `trang_thiet_bi`
    const TTBRecords = await getItems<TTBData[]>("trang_thiet_bi", {
        fields: ["id"],
        filter: updatedFilter,
    });

    // Lấy danh sách ID từ `handover_record` và `trang_thiet_bi`
    const handoverIds = handoverRecords.map((record) => record.id);
    const ttbIds = TTBRecords.map((record) => record.id);

    // Nếu không có dữ liệu phù hợp, trả về count = 0
    if (handoverIds.length === 0 || ttbIds.length === 0) return { count: 0 };

    // 🔹 Tính số lượng trong `handover_list`
    const data = await aggregateData<IMetaDistinct[]>("handover_list", {
        aggregate: { countDistinct: "id_tb" },
        query: {
            filter: {
                id_handover: { _in: handoverIds },
                id_tb: { _in: ttbIds },
            },
        },
    });

    return { count: data[0]?.countDistinct?.id ?? 0 };
};
export const getHandoverDetail = async (id_handover: any) => {
    return getItems<handoverListData[]>("handover_list", {
        fields: ["*",
            {
                id_tb: [
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

            },
            {
                id_handover:

                    [
                        "*",
                        {
                            // admin_unit_id: ["*"],
                            org_delivery_id: ["*"],// đơn vị giao
                        },
                        {
                            org_receive_id: ["*"],// đơn vị nhận
                        },
                        {

                            deliverer_id: [
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
                            ],// người giao
                        },
                        {
                            receiver_id: [
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
                            ],// người nhận
                        },


                    ],
            }
            //   { 

            //   }
        ],
        filter: {
            id_handover: { _eq: id_handover }

        },
        sort: ["date_created"],
    });
};
export const metaHandoverDetail = async (id_handover: any): Promise<IMeta> => {
    // 🔹 Tính số lượng trong `handover_list`
    const data = await aggregateData<IMetaDistinct[]>("handover_list", {
        aggregate: { countDistinct: "id_tb" },
        query: {
            filter: {
                id_handover: { _eq: id_handover },

            },
        },
    });

    return { count: data[0]?.countDistinct?.id ?? 0 };
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
