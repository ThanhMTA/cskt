import BaseTable from "@app/components/BaseTable";
import { useModal } from "@app/contexts/ModalContext";
import MilitaryDistrictAction from "../components/MilitaryDistrictAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { IMeta } from "@app/interfaces/common.interface";
import { useEffect, useState } from "react";
import { getMilitaryDistrict, metaMilitaryDistrict } from "../store/MilitaryDistrict.action";
import { EyeOutlined } from "@ant-design/icons";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { MilitaryDistrict } from "../types/MilitaryDistrict.type";
import { TableProps } from "antd/lib";
import { TableGeneralKeys } from "@app/enums/table.enum";



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
    const [data, setData] = useState<MilitaryDistrict[]>([]);
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<any>({});
    const columns: TableProps['columns'] = [
        {
            title: "Tên quân khu",
            dataIndex: "name",
            fixed: 'left',
            key: TableGeneralKeys.Name,
            render: (value: any, record: MilitaryDistrict) => {
                return (
                    <span
                        className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
                        onClick={() => handleActions(Action.View, record)}
                    >
                        {value ?? ""}
                    </span>
                );
            },
        },
        {
            title: "Tên viết tắt",
            dataIndex: "short_name",
            key: TableGeneralKeys.ShortName,
        },
        {
            title: "Trạng thái",
            dataIndex: "is_enable",
            key: "is_enable",
            render: (flag: boolean) => flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
        },
    ];
    const fetchData = async (page: number, pageSize: number, filter: any) => {
        try {
            setIsLoading(true);
            const res = await Promise.all([getMilitaryDistrict({ limit: pageSize, page }, filter), metaMilitaryDistrict(filter)]);
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


    const handleViewDetail = (item: MilitaryDistrict) => {
        openModal(
            <MilitaryDistrictAction detail={item} action={Action.View} />,
            {
                width: '40vw',
                onModalClose(res) {
                    if (res?.success) {
                        openModal(
                            <MilitaryDistrictAction detail={item} action={Action.Update} />,
                            {
                                width: '40vw',
                                onModalClose(res) {
                                    if (res?.success) {
                                        reloadPage();
                                    } else {
                                        reloadPage();
                                    }
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
    const handleActions = (key: Action, item: MilitaryDistrict) => {
        console.log(key)
        if (key === Action.View) {
            handleViewDetail(item);
        }
    }
    const reloadPage = () => {
        fetchData(pagination.page, pagination.pageSize, filter)
        // fetchData(pagination.page, pagination.pageSize)
    }
    useEffect(() => {
        // fetchData(1, DEFAULT_PAGESIZE)
        fetchData(1, pagination.pageSize, filter)
    }, [filter])
    return <div className="w-[900px]">
        <BaseTable
            className="mt-5"
            isReloadButton={true}
            setFilter={setFilter}
            setPagination={setPagination}
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
            rowKey={'id'}
            filterColumns={[TableGeneralKeys.Name]}
            btnCreate={true}
            handleCreate={() => {
                openModal(
                    <MilitaryDistrictAction action={Action.Create} />,
                    {
                        width: '40vw',
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