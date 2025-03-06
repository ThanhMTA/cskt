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

import { CanBoCategoriesData } from "../types/CanBoCategories.types";

export const getCanBo = (query: IRequest, filter: any) => {
    return getItems<CanBoCategoriesData[]>("can_bo", {
        ...query,
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
        filter,
        sort: ["-date_created"],
    });
};
export const metaCanBo = async (filter: any): Promise<IMeta> => {
    const data = await aggregateData<IMetaDistinct[]>("can_bo", {
        aggregate: { countDistinct: "id" },
        query: {
            filter,
        },
    });
    return { count: data[0].countDistinct?.id };
};
export const getCanBoDetail = (id: any, filter: any) => {
    return getItem<any>("can_bo", id, {
        fields: [
            "*",
            {
                // admin_unit_id: ["*"],
                capbac_id: ["*"],

            },
            {
                chucvu_id: ["*"],// lấy tất cả thông tin trong bảng chức vụ có liên quan 
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
        filter,
    });
};

export const createCanBo = (params: CanBoCategoriesData) => {
    return create<CanBoCategoriesData>("can_bo", {
        ...params,
    });
};
export const updateCanBo = (id: any, params: any) => {
    return update<CanBoCategoriesData>("can_bo", id, {
        ...params,
    });
};
export const removeCanBo = (id: any) => {
    return deleteData<CanBoCategoriesData>("can_bo", id);
};
