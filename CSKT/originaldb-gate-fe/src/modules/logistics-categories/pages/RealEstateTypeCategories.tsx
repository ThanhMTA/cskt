import BaseTable from "@app/components/BaseTable";
import { useModal } from "@app/contexts/ModalContext";
import RealEstateTypeAction from "../components/RealEstateTypeAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { IMeta } from "@app/interfaces/common.interface";
import { useEffect, useState } from "react";
import { getRealEstateType, metaRealEstateType } from "../store/RealEstateType.action";
import { EyeOutlined } from "@ant-design/icons";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { RealEstateType } from "../types/RealEstateType.type";
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
    const [filter, setFilter] = useState<any>({})
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
    const [data, setData] = useState<RealEstateType[]>([]);
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [isLoading, setIsLoading] = useState(false);
    //column
    const columns: TableProps['columns'] = [
        {
            title: "Tên",
            dataIndex: "name",
            fixed: 'left',
            key: TableGeneralKeys.Name,
            render: (value: any, record: RealEstateType) => {
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
            title: "Trạng thái",
            dataIndex: "is_enable",
            key: "is_enable",
            render: (flag: boolean) => {
                return flag ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
            }
        }
    ];
    const fetchData = async (page: number, pageSize: number, filter: any) => {
        try {
            setIsLoading(true);
            const res = await Promise.all([getRealEstateType({ limit: pageSize, page }, filter), metaRealEstateType(filter)]);
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


    const handleViewDetail = (item: RealEstateType) => {
        openModal(
            <RealEstateTypeAction detail={item} action={Action.View} />,
            {
                width: '40vw',
                onModalClose(res) {
                    if (res?.success) {
                        openModal(
                            <RealEstateTypeAction detail={item} action={Action.Update} />,
                            {
                                width: '40vw',
                                onModalClose() {
                                    reloadPage();
                                },
                            }
                        )
                    } else {
                        reloadPage()
                    }
                },
            }
        )
    }
    const handleActions = (key: Action, item: RealEstateType) => {
        console.log(key)
        if (key === Action.View) {
            handleViewDetail(item);
        }
    }
    const reloadPage = () => {
        fetchData(pagination.page, pagination.pageSize, filter)
    }

    useEffect(() => {
        fetchData(pagination.page, pagination.pageSize, filter)
    }, [pagination, filter])
    return <div className="w-[900px]">
        <BaseTable
            className="mt-5"
            setFilter={setFilter}
            setPagination={setPagination}
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
                fetchData(current, pageSize, filter);
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
                    <RealEstateTypeAction action={Action.Create} />,
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