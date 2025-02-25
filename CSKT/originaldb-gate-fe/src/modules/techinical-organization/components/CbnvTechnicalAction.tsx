import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Button, Space, Input, Divider, Popconfirm } from 'antd';
import type { GetProp, TransferProps } from 'antd';
import { TBVTCategoriesData } from "@app/modules/force-categories/types/TBVTCategories.types";
import { makeid } from "@app/core/helper";
import { updateTechnicalOrganizations } from "../stores/TechnicalOrganization.action";
import { CBNV_CATEGORIES_FIELD_NAME } from "../constants/cbnv.constant";
import { getPersonalIdentifyList, metaPersonalIdentify } from "@app/modules/force-categories/store/PersonalIdentify.action";
import { TableKey } from "@app/enums";
import { BiTrash } from "react-icons/bi";
import BaseTable from "@app/components/BaseTable";
import { SearchOutlined } from "@ant-design/icons";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";

type CbnvTechnicalActionType = {
    data?: any[];
    technical_org?: any;
};

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
interface DataType {
    key: string,
    name: string;
    rank_id: string;
    position: string;
}
interface TableTransferProps extends TransferProps<TransferItem> {
    isLoading: boolean
    targetKeys: any
    setTargetKeys: (keys: any) => void;
    setSearch: (search: any) => void;
}

// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const {
        isLoading,
        dataSource,
        targetKeys,
        setTargetKeys,
        setSearch } = props;

    const [source, setSource] = useState<any>([])
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const baseColumns = [
        {
            title: CBNV_CATEGORIES_FIELD_NAME.FULL_NAME,
            dataIndex: "name",
        },
        {
            title: CBNV_CATEGORIES_FIELD_NAME.RANK,
            dataIndex: "rank_id",
            render: (_: any, item: any) => item?.rank_id?.name,
        },
        {
            title: CBNV_CATEGORIES_FIELD_NAME.POSITION,
            dataIndex: "position",
        },
    ];

    const left_columns: any = useMemo(() => {
        return baseColumns.map((column) => ({
            ...column,
            key: makeid(),
        }));
    }, []);

    const right_columns: any = [
        ...baseColumns,
        {
            title: CBNV_CATEGORIES_FIELD_NAME.PHONE_NUMBER,
            dataIndex: "phone_number",
        },
        {
            title: "",
            key: TableKey.Action,
            fixed: 'right',
            width: '5%',
            render: (_: any, item: any) => (
                <div className="group min-w-full flex items-center justify-center h-[23px]">
                    <Space size="middle" className="flex-row hidden group-hover:flex gap-2">
                        <Popconfirm
                            title={MESSAGE_CONTENT.DELETE}
                            onConfirm={() => {
                                const updatedTargetKeys = targetKeys.filter((key: string) => key !== item.key);
                                setTargetKeys(updatedTargetKeys);
                            }}
                            okText={BUTTON_LABEL.CORRECT}
                            cancelText={BUTTON_LABEL.NO}
                        >
                            <Button
                                htmlType="button"
                                size="small"
                                className="px-1 button-icon">
                                <BiTrash />
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
            )
        }
    ];


    const rowSelection: any = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            onMoveToRight(selectedRowKeys)
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: targetKeys.includes(record?.key),
        }),
    };

    const onMoveToRight = (selectedRowKeys: any[]) => {
        const oldKeys = [...targetKeys];
        const newKeys = selectedRowKeys.filter((key: string) => !oldKeys.includes(key));
        setTargetKeys([...oldKeys, ...newKeys]);
    };
    const fetchData = async () => {
        try {
            const response: any = await Promise.all([
                await getPersonalIdentifyList({ limit: -1 }, {}),
            ])
            setSource(response[0].map((item: any) => ({
                ...item,
                key: item.id,
            })));
        } catch (error) {
            console.log('error: ', error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="grid grid-cols-2 gap-2 w-full">
            <div className="flex-col rounded border ">
                <div className="flex p-2 items-center h-[50px] justify-between">
                    <span>{`Danh sách LLKT`}</span>
                    <div className={`transition-all duration-300 ${openSearch ? 'w-[320px]' : 'w-[120px]'}`}>
                        <div>
                            <Input
                                className="flex rounded-full border-[1px] py-1 border-solid border-gray-300 px-3 justify-center items-center transition-all duration-300"
                                placeholder="Tìm kiếm"
                                suffix={<SearchOutlined className="text-primary" />}
                                onFocus={() => setOpenSearch(true)}
                                onBlur={() => { setOpenSearch(false) }}
                                onPressEnter={(e: any) => {
                                    e.preventDefault();
                                    if (e.target.value.length > 0) {
                                        setSearch(e.target.value)
                                    } else {
                                        setSearch(null)
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <Divider className="my-0" />
                <div className="flex p-2 h-[500px] overflow-scroll">
                    <BaseTable
                        rowSelection={{ type: 'checkbox', ...rowSelection }}
                        columns={left_columns}
                        loading={isLoading}
                        dataSource={dataSource}
                        pagination={false}
                        size="middle"
                        rowClassName="hover:bg-secondary group"
                        className="flex cursor-pointer"
                    />
                </div>
            </div>
            <div className="flex-col rounded border ">
                <div className="flex p-2 items-center h-[50px] justify-between">
                    <span>{`Danh sách CB, NVCMKT  [${targetKeys.length}]`}</span>
                </div>
                <Divider className="my-0" />
                <BaseTable
                    columns={right_columns}
                    loading={isLoading}
                    dataSource={source?.filter((item: any) => targetKeys.includes(item.id))}
                    pagination={false}
                    size="middle"
                    rowClassName="hover:bg-secondary group"
                    className="flex cursor-pointer"
                />
            </div>
        </div>
    );
};




const CBNVTechnicalAction: React.FC<CbnvTechnicalActionType> = ({
    data,
    technical_org,
}) => {
    const loading = useLoading();
    const modal = useModal();
    const [dataSource, setDataSource] = useState<Partial<TBVTCategoriesData[]>>([]);
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<any>(null)
    const handleSuccess = () => {
        loading.hide()
        modal.closeModal({ success: true })
    }

    const onFinish = async () => {
        try {
            const personal_identifies = targetKeys?.map((key: any) => {
                return {
                    personal_identifies_id: key
                };
            });
            await updateTechnicalOrganizations(technical_org?.technical_id?.id, { personal_identifies })
            handleSuccess()
        } catch (error: any) {
            console.log('error: ', error)
        }
    }
    const fetchData = async () => {
        try {
            let filterValue: any = {
                _and: []
            };

            if (search?.length > 0) {
                filterValue._and.push({
                    name: {
                        _icontains: search
                    }
                });
            }

            setIsLoading(true);
            const response: any = await Promise.all([
                await getPersonalIdentifyList({ limit: -1 }, filterValue),
            ])
            setDataSource(response[0].map((item: any, index: number) => ({
                ...item,
                key: item.id,
            })));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [search])
    useEffect(() => {
        setTargetKeys(data?.map((item) => item.key));
    }, [data])

    return (
        <Flex align="start" gap="middle" vertical>
            <div className="flex flex-row justify-between w-full items-center px-[10px]">
                <p className="modal-title">{`Cập nhật danh sách CB, NVCMKT [${technical_org?.name}]`}</p>
                <Button className="rounded px-[30px]" type="primary" size="small" onClick={onFinish}>
                    <span>Lưu</span>
                </Button>
            </div>
            <TableTransfer
                dataSource={dataSource}
                setSearch={setSearch}
                targetKeys={targetKeys}
                setTargetKeys={setTargetKeys}
                isLoading={isLoading}
            />
        </Flex>
    );

}
export default CBNVTechnicalAction;
