import BaseTable from "@app/components/BaseTable";
import { useModal } from "@app/contexts/ModalContext";
import AdministrativeUnitAction from "../components/AdministrativeUnitAction";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { IMeta } from "@app/interfaces/common.interface";
import { useEffect, useState } from "react";
import { getAdministrativeUnit, metaAdministrativeUnit } from "../store/AdministrativeUnit.action";
import { EyeOutlined } from "@ant-design/icons";
import { Action } from "@app/enums";
import { ITableAction } from "@app/interfaces/table.interface";
import { AdministrativeUnit } from "../types/AdministrativeUnit.type";
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
    const [data, setData] = useState<AdministrativeUnit[]>([]);
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<any>({})

    const columns: TableProps['columns'] = [
        {
            title: "Tên đơn vị hành chính",
            dataIndex: "name",
            fixed: 'left',
            key: TableGeneralKeys.Name,
            render: (value: any, record: AdministrativeUnit) => {
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
            render: (value) => value ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>
        },
    ];
    const fetchData = async (page: number, pageSize: number, filter: any) => {
        try {
            setIsLoading(true);
            const res = await Promise.all([getAdministrativeUnit({ limit: pageSize, page }, filter), metaAdministrativeUnit(filter)]);
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


    const handleViewDetail = (item: AdministrativeUnit) => {
        openModal(
            <AdministrativeUnitAction detail={item} action={Action.View} />,
            {
                width: '40vw',
                onModalClose(res) {
                    if (res?.success) {
                        openModal(
                            <AdministrativeUnitAction detail={item} action={Action.Update} />,
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
    const handleActions = (key: Action, item: AdministrativeUnit) => {
        if (key === Action.View) {
            handleViewDetail(item);
        }
    }
    const reloadPage = () => {
        fetchData(pagination.page, pagination.pageSize, filter)
    }
    useEffect(() => {
        fetchData(1, pagination.pageSize, filter)
    }, [filter]);
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
                    <AdministrativeUnitAction action={Action.Create} />,
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