import BaseTable from "@app/components/BaseTable";
import { useModal } from "@app/contexts/ModalContext";
import EngineRoomAction from "../components/EngineRoomAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { IMeta } from "@app/interfaces/common.interface";
import { useEffect, useState } from "react";
import { getEngineRoom, metaEngineRoom } from "../store/EngineRoom.action";
import { EyeOutlined } from "@ant-design/icons";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { EngineRoom } from "../types/EngineRoom.type";
import { TableProps } from "antd/lib";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { getFullAddressString, makeid } from "@app/core/helper";
import { Organizations } from "@app/types/types";
import { Ward } from "../types/Ward.type";

const ACTION_TABLE: ITableAction[] = [
    {
        key: Action.View,
        icon: <EyeOutlined />,
        tooltip: 'Chi tiết'
    },
];
export default function Page() {
    const { openModal } = useModal();
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
    const [data, setData] = useState<EngineRoom[]>([]);
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<any>({})
    const columns: TableProps['columns'] = [
        {
            title: "Tên",
            dataIndex: "name",
            key: TableGeneralKeys.Name,
            fixed: 'left',
            render: (value: any, record: EngineRoom) => {
                return (
                    <span
                        className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
                        onClick={() => handleActions(Action.View, record)}
                    >
                        {value ?? ""}
                    </span>
                );
            },
            sorter: true,
        },
        {
            title: "Tên viết tắt",
            dataIndex: "short_name",
            key: TableGeneralKeys.ShortName,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone_number",
            key: "phone_number",
        },
        {
            title: "Cách liên lạc",
            dataIndex: "contact_method",
            key: "contact_method",
        },
        {
            title: "Đơn vị cấp trên quản lý",
            dataIndex: "org_id",
            key: "org_id",
            render: (value: Organizations) => value?.name ?? ""
        },
        {
            title: "Kinh độ (Độ N)",
            dataIndex: "longitude",
            key: "longitude",
        },
        {
            title: "Vĩ độ (Độ E)",
            dataIndex: "latitude",
            key: "latitude",
        },
        {
            title: "Đơn vị khai thác",
            dataIndex: "org_use_id",
            key: "org_use_id",
            render: (value: Organizations) => value?.name ?? ""
        },
        {
            title: "Đơn vị đảm bảo kỹ thuật",
            dataIndex: "org_technical_id",
            key: "org_technical_id",
            render: (value: Organizations) => value?.name ?? ""
        },
        {
            title: "Đơn vị hỗ trợ bảo đảm kỹ thuật",
            dataIndex: "org_support_id",
            key: "org_support_id",
            render: (value: Organizations) => value?.name ?? ""
        },
        {
            title: "Địa bàn",
            dataIndex: "ward_id",
            key: "ward_id",
            width: 300,
            render: (value: Ward) => getFullAddressString(value)
        },
        {
            title: "Vị trí phòng máy",
            dataIndex: "address",
            key: "address",
            width: 200,
        },
        {
            title: "Diện tích PMC (m2)",
            dataIndex: "area",
            key: "area",
        },
        {
            title: "Số lượng máy chủ vật lý",
            dataIndex: "n_phy_server",
            key: "n_phy_server",
        },
        {
            title: "Số lượng máy chủ ảo",
            dataIndex: "n_vir_server",
            key: "n_vir_server",
        },
        {
            title: "Tổng số lượng ứng dụng, dịch vụ",
            dataIndex: "sum_app_service",
            key: "sum_app_service",
        },
        {
            title: "Năng lực xử lý CPU (GHz)",
            dataIndex: "ability_cpu",
            key: "ability_cpu",
        },
        {
            title: "Tổng dung lượng RAM (GB)",
            dataIndex: "sum_ram",
            key: "sum_ram",
        },
        {
            title: "Băng thông (Mbps)",
            dataIndex: "bandwidth",
            key: "bandwidth",
        },
        {
            title: "Tài nguyên lưu trữ (TB)",
            dataIndex: "n_storage",
            key: "n_storage",
        },
        {
            title: "Số lượng tủ RACK",
            dataIndex: "n_rack",
            key: "n_rack",
        },
        {
            title: "Mật độ tài nguyên lưu trữ (%)",
            dataIndex: "n_percent_density",
            key: "n_percent_density",
        },
        {
            title: "Hồ sơ kỹ thuật",
            dataIndex: "url_file_path",
            key: "url_file_path",
        },
        {
            title: "Có đảm bảo nguồn điện",
            dataIndex: "has_power_source",
            key: "has_power_source",
            render: (flag: boolean) => {
                return flag ? <span className="text-green-600">Có</span> : <span className="text-red">Không có</span>
            }
        },
        {
            title: "Có chống sét",
            dataIndex: "has_lighting_protect",
            key: "has_lighting_protect",
            render: (flag: boolean) => {
                return flag ? <span className="text-green-600">Có</span> : <span className="text-red">Không có</span>
            }
        },
        {
            title: "Có phòng cháy, chữa cháy",
            dataIndex: "has_fighting_protect",
            key: "has_fighting_protect",
            render: (flag: boolean) => {
                return flag ? <span className="text-green-600">Có</span> : <span className="text-red">Không có</span>
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "is_enable",
            key: "is_enable",
            render: (flag: boolean) => {
                return flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
            }
        },
        {
            title: "Số thứ tự",
            dataIndex: "order_number",
            key: "order_number",
        },
        {
            title: "Đánh giá khả năng khai thác, vận hành (Điểm mạnh, yếu)",
            dataIndex: "comment",
            key: "comment",
        },
    ]?.map(i => {
        return {
            ...i,
            key: i?.key || makeid()
        }
    });
    const fetchData = async (page: number, pageSize: number, filter: any) => {
        try {
            setIsLoading(true);
            const res = await Promise.all([
                getEngineRoom({ limit: pageSize, page }, filter),
                metaEngineRoom(filter)]);
            if (res[1]) {
                setMeta({ count: res[1].count })
            }
            setData(res[0])
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    }
    const handleViewDetail = (item: EngineRoom) => {
        openModal(
            <EngineRoomAction id={item?.id} action={Action.View} />,
            {
                width: '80vw',
                onModalClose(res) {
                    if (res?.success) {
                        openModal(
                            <EngineRoomAction id={item?.id} action={Action.Update} />,
                            {
                                width: '80vw',
                                onModalClose() {
                                    reloadPage();
                                },
                            }
                        )
                    } else {
                        reloadPage();
                    }
                },
            }
        )
    }
    const handleActions = (key: Action, item: EngineRoom) => {
        console.log(key)
        if (key === Action.View) {
            handleViewDetail(item);
        }
    }
    const reloadPage = () => {
        fetchData(pagination.page, pagination.pageSize, filter)
    }
    useEffect(() => {
        // fetchData(1, DEFAULT_PAGESIZE)
        fetchData(1, pagination.pageSize, filter)
    }, [filter])
    return <div className="w-[900px]">
        <BaseTable
            setFilter={setFilter}
            setPagination={setPagination}
            className="mt-5"
            isReloadButton={true}
            dataSource={[...data]}
            columns={columns}
            paginationCustom={
                {
                    current: pagination.page,
                    pageSize: pagination.pageSize,
                    total: meta?.count
                }
            }
            onChange={({ current, pageSize }: any) => {
                setPagination({ page: current, pageSize });
                // fetchData(current, pageSize);
                fetchData(pagination.page, pagination.pageSize, filter)
            }}
            actionList={ACTION_TABLE}
            actionClick={handleActions}
            isAction={false}
            loading={isLoading}
            scroll={{ x: 5000 }}
            rowKey={'id'}
            filterColumns={[TableGeneralKeys.Name]}
            btnCreate={true}
            handleCreate={() => {
                openModal(
                    <EngineRoomAction action={Action.Create} />,
                    {
                        width: '80vw',
                        onModalClose(res) {
                            if (res?.success) {
                                reloadPage();
                            }
                        },
                    }
                )
            }}
        />
    </div>
}