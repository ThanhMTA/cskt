import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Flex, Table, Button, Space, Form, InputNumber, Input, Tree, Divider, Popconfirm, Select } from 'antd';
import type { GetProp, TransferProps, TreeDataNode } from 'antd';
import { getTBVTCategoriesList, metaTBVTCategories } from "@app/modules/force-categories/store/TBVTCategories.action";
import { TBVTCategoriesData } from "@app/modules/force-categories/types/TBVTCategories.types";
import { listToTree, makeid } from "@app/core/helper";
import { updateTechnicalOrganizations } from "../stores/TechnicalOrganization.action";
import { TableKey } from "@app/enums";
import { BiTrash } from "react-icons/bi";
import { GetRef } from "antd/lib";
import { MinusOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";
import { TBVTCategoriesType } from "@app/modules/force-categories/enums/TBVTCategories.enum";
import { QUALITY_SCOPE_OPTIONS } from "../constants/level.constant";
import { useMessage } from "@app/contexts/MessageContext";


type TBVTTechnicalActionType = {
    data?: any[];
    technical_org?: any;
};
interface TreeTransferProps {
    dataSource: TreeDataNode[];
    targetKeys: TransferProps['targetKeys'];
    onChange: TransferProps['onChange'];
}
type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
interface TableTransferProps extends TransferProps<TransferItem> {
    isLoading: boolean
    setIsLoading: any,
    data: any,
    setDataSource: any
    targetKeys: any
    setTargetKeys: any
    setSearch: any
}

type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface EditableRowProps {
    index: number;
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
interface EditableCellProps {
    children: any,
    placeholder: string,
    dataIndex: string,
    recordId: string,
    editable: boolean,
    isEdittingAmount: boolean,
    isEdittingSerial: boolean,
    record: any,
    setEdit: any,
    setEditingRowSerial: any,
    setEditingRowAmount: any,
    handleSave: (record: any) => void;
}

const EditableCell: React.FC<
    React.PropsWithChildren<EditableCellProps & any>
> = ({
    children,
    placeholder,
    dataIndex,
    editable,
    isEdittingAmount,
    isEdittingSerial,
    isEdittingManufacturingYear,
    isEdittingQuality,
    isEdittingTimeOfRepair,
    isEdittingNote,
    setEditingRowSerial,
    setEditingRowAmount,
    setEditingRowManufacturingYear,
    setEditingRowQuality,
    setEditingRowTimeOfRepair,
    setEditingRowNote,
    record,
    handleSave,
    setEdit,
    recordId,
    ...restProps
}) => {
        const form = useContext(EditableContext)!;
        const ref = useRef<any>(null);
        useEffect(() => {
            ref?.current?.focus();
            form.setFieldValue(dataIndex, record?.[dataIndex] || "");
        }, [
            isEdittingAmount,
            isEdittingSerial,
            form,
            record,
            ref,
            dataIndex
        ]);

        const save = async () => {
            try {
                const values = await form.validateFields();
                handleSave(values, record);
                // setEditingRowAmount(null)
                // setEditingRowSerial(null)
            } catch (errInfo) {
                console.log("Save failed:", errInfo);
            }
        };
        const onBlueEdit = () => {
            setEditingRowAmount(null)
            setEditingRowSerial(null)
            setEditingRowManufacturingYear(null)
            setEditingRowQuality(null)
            setEditingRowTimeOfRepair(null)
            setEditingRowNote(null)
        }
        let childNode = children;
        if (editable) {
            childNode = (
                <div
                    className="items-center justify-start h-5 cursor-pointer flex"
                    style={{ paddingRight: 24 }}
                    onClick={() => setEdit(recordId)}
                >
                    {children}
                </div>
            );

            if (isEdittingAmount && dataIndex === 'amount') {
                childNode = (
                    <Form form={form}>
                        <Form.Item style={{ margin: 0 }} name={dataIndex}>
                            <InputNumber
                                className="flex w-full"
                                size='small'
                                placeholder={placeholder}
                                ref={ref}
                                onPressEnter={save}
                                onBlur={save}
                            />
                        </Form.Item>
                    </Form>
                );
            }
            if (isEdittingSerial && dataIndex === 'serial_number') {
                childNode = (
                    <Form form={form}>
                        <Form.Item style={{ margin: 0 }} name={dataIndex}>
                            <Input
                                className="flex w-full"
                                size='small'
                                placeholder={placeholder}
                                ref={ref}
                                onPressEnter={save}
                                onBlur={save}
                            />
                        </Form.Item>
                    </Form>
                );
            }
            if (isEdittingTimeOfRepair && dataIndex === 'time_of_repair') {
                childNode = (
                    <Form form={form}>
                        <Form.Item style={{ margin: 0 }} name={dataIndex}>
                            <InputNumber
                                className="flex w-full"
                                size='small'
                                placeholder={placeholder}
                                ref={ref}
                                onPressEnter={save}
                                onBlur={save}
                            />
                        </Form.Item>
                    </Form>
                );
            }
            if (isEdittingManufacturingYear && dataIndex === 'manufacturing_year') {
                childNode = (
                    <Form form={form}>
                        <Form.Item style={{ margin: 0 }} name={dataIndex}>
                            <Input
                                className="flex w-full"
                                size='small'
                                placeholder={placeholder}
                                ref={ref}
                                onPressEnter={save}
                                onBlur={() => {
                                    save();
                                    onBlueEdit();
                                }}
                            />
                        </Form.Item>
                    </Form>
                );
            }
            if (isEdittingNote && dataIndex === 'note') {
                childNode = (
                    <Form form={form}>
                        <Form.Item style={{ margin: 0 }} name={dataIndex}>
                            <Input
                                className="flex w-full"
                                size='small'
                                placeholder={placeholder}
                                ref={ref}
                                onPressEnter={save}
                                onBlur={() => {
                                    save();
                                    onBlueEdit();
                                }}
                            />
                        </Form.Item>
                    </Form>
                );
            }
            if (isEdittingQuality && dataIndex === 'quality') {
                childNode = (
                    <Form form={form}>
                        <Form.Item style={{ margin: 0 }} name={dataIndex}>
                            <Select
                                className="flex w-full"
                                size='small'
                                placeholder={placeholder}
                                ref={ref}
                                options={QUALITY_SCOPE_OPTIONS}
                                onChange={save}
                            />
                        </Form.Item>
                    </Form>
                );
            }
        }
        return <td {...restProps}>{childNode}</td>;
    };

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const generateTree = (
    treeNodes: TreeDataNode[] = [],
    checkedKeys: TreeTransferProps['targetKeys'] = [],
): TreeDataNode[] => {
    return (
        treeNodes.map(({ children, ...props }) => ({
            ...props,
            disabled: checkedKeys.includes(props.key as string),
            children: generateTree(children, checkedKeys),
        }))
    )
}

// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const {
        isLoading,
        setIsLoading,
        dataSource = [],
        data = [],
        setDataSource,
        targetKeys,
        setTargetKeys,
        setSearch
    } = props;

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const [editingRowSerial, setEditingRowSerial] = useState<string | null>(null);
    const [editingRowAmount, setEditingRowAmount] = useState<string | null>(null);
    const [editingRowManufacturingYear, setEditingRowManufacturingYear] = useState<string | null>(null);
    const [editingRowQuality, setEditingRowQuality] = useState<string | null>(null);
    const [editingRowTimeOfRepair, setEditingRowTimeOfRepair] = useState<string | null>(null);
    const [editingRowNote, setEditingRowNote] = useState<string | null>(null);
    const [source, setSource] = useState<any[]>([]);
    const [openSearch, setOpenSearch] = useState<boolean>(false);

    const defaultColumns: any = [
        {
            title: 'Tên dụng cụ, phương tiện đo',
            dataIndex: "name",
            key: makeid(),
            fixed: 'left',
            width: '20%',
            render: (name: string, record: any) => {
                return (
                    <div>
                        <div className="font-extrabold block">{record.code}</div>
                        <div className=" text-gray-700">{record.name}{record.unit ? ` (${record.unit})` : ''}</div>
                    </div>
                );
            }
        },
        {
            title: <p className="font-bold">Số lượng</p>,
            dataIndex: "amount",
            placeholder: "Nhập số lượng",
            editable: true,
            key: makeid(),
            width: '5%',
            render: (amount: any) => Math.round(amount * 100) / 100 || 0
        },
        {
            title: <p className="font-bold">Serial number</p>,
            dataIndex: "serial_number",
            placeholder: "Nhập serial number",
            editable: true,
            width: '10%',
            key: makeid(),
        },
        {
            title: <p className="font-bold">Năm sản suất</p>,
            dataIndex: "manufacturing_year",
            placeholder: "Năm sản xuất",
            editable: true,
            width: '10%',
            key: makeid(),
        },
        {
            title: <p className="font-bold">Cấp chất lượng</p>,
            dataIndex: "quality",
            placeholder: "Chọn cấp",
            width: '10%',
            editable: true,
            key: makeid(),
        },
        {
            title: <p className="font-bold">Số lần sửa chữa</p>,
            dataIndex: "time_of_repair",
            placeholder: "Số lần sửa chữa",
            editable: true,
            width: '10%',
            key: makeid(),
        },
        {
            title: <p className="font-bold">Ghi chú</p>,
            dataIndex: "note",
            placeholder: "Ghi chú",
            editable: true,
            key: makeid(),
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
                                const prevTarget = [...targetKeys]
                                if (prevTarget?.filter((x: any) => x.key === item.key).length === 1) {
                                    setSource(prevTarget.filter((x: any) => x.key !== item.key));
                                }
                                setTargetKeys(prevTarget.filter((x: any) => x.id !== item.id))
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

                        <Button
                            htmlType="button"
                            size="small"
                            onClick={() => {
                                const prevTarget = [...targetKeys]
                                const index = prevTarget.findIndex((i) => i.id === item.id);
                                const newData = [
                                    ...prevTarget.slice(0, index + 1),
                                    {
                                        ...item,
                                        id: makeid(),
                                        amount: 1,
                                        serial_number: null,
                                        manufacturing_year: null,
                                        time_of_repair: null,
                                        note: null
                                    },
                                    ...prevTarget.slice(index + 1)
                                ]
                                setTargetKeys(newData)
                            }}
                            className="px-1 button-icon"
                        >
                            <PlusCircleOutlined />
                        </Button>
                    </Space>
                </div>
            ),
        }
    ];

    const handleSave = (payload: any, record: any) => {
        const newRecord: any = {
            ...record,
            ...payload
        };

        const index = targetKeys.findIndex((item: any) => record.id === item.id);
        targetKeys[index] = { ...newRecord };
        setTargetKeys([...targetKeys])
        if (index !== targetKeys?.length - 1) {
            if (Object.keys(payload)[0] === 'amount')
                setEditingRowAmount(targetKeys[index + 1]?.id);
            else if (Object.keys(payload)[0] === 'serial_number')
                setEditingRowSerial(targetKeys[index + 1]?.id)
            else if (Object.keys(payload)[0] === 'manufacturing_year')
                setEditingRowManufacturingYear(targetKeys[index + 1]?.id)
            else if (Object.keys(payload)[0] === 'quality')
                setEditingRowQuality(targetKeys[index + 1]?.id)
            else if (Object.keys(payload)[0] === 'note')
                setEditingRowNote(targetKeys[index + 1]?.id)
            else if (Object.keys(payload)[0] === 'time_of_repair')
                setEditingRowTimeOfRepair(targetKeys[index + 1]?.id)
        } else {
            setEditingRowAmount(null)
            setEditingRowSerial(null)
            setEditingRowManufacturingYear(null)
            setEditingRowQuality(null)
            setEditingRowTimeOfRepair(null)
            setEditingRowNote(null)

        }
    }
    const columns = defaultColumns.map((col: any) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => {
                const stateSetters: any = {
                    'amount': setEditingRowAmount,
                    'serial_number': setEditingRowSerial,
                    'manufacturing_year': setEditingRowManufacturingYear,
                    'quality': setEditingRowQuality,
                    'time_of_repair': setEditingRowTimeOfRepair,
                    'note': setEditingRowNote,
                };

                const setEdit = (id: string = "") => {
                    Object.keys(stateSetters).forEach((key) => {
                        stateSetters[key](col.dataIndex === key ? id : null);
                    });
                };
                return {
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    placeholder: col.placeholder,
                    isEdittingAmount: record.id === editingRowAmount,
                    isEdittingSerial: record.id === editingRowSerial,
                    isEdittingManufacturingYear: record.id === editingRowManufacturingYear,
                    isEdittingQuality: record.id === editingRowQuality,
                    isEdittingTimeOfRepair: record.id === editingRowTimeOfRepair,
                    isEdittingNote: record.id === editingRowNote,
                    title: col.title,
                    handleSave,
                    setEdit,
                    setEditingRowAmount,
                    setEditingRowSerial,
                    setEditingRowManufacturingYear,
                    setEditingRowQuality,
                    setEditingRowTimeOfRepair,
                    setEditingRowNote,
                    recordId: record.id,
                };
            },
        };
    });

    const onMoveToRight = (_: any, { node }: any) => {
        const { children, ...withoutChildren } = node;
        setTargetKeys((prev: any) => [...prev, { ...withoutChildren, id: makeid(), amount: 1, serial_number: null }])
        setSource((prev: any) => [...prev, { ...withoutChildren, id: makeid(), amount: 1, serial_number: null }])
    }
    const fetchChildData = async (parentId: string, resolve: any) => {
        const hasChildData = dataSource.some(
            (item: any) => item.parent_id === parentId
        );

        if (hasChildData) {
            return;
        }
        try {
            const initFilter: any = {
                _and: [
                    {
                        type: {
                            _in: [TBVTCategoriesType.VT, TBVTCategoriesType.TB2]
                        }
                    },
                    { parent_id: parentId }
                ]
            };
            const response: any = await getTBVTCategoriesList({ limit: -1 }, initFilter);
            setDataSource((prevDataSource: any) => {
                const newElements = response.map((item: any) => ({
                    ...item,
                    key: item.id,
                    // title: `${item.code} - ${item.name} ${item.unit ? `(${item.unit})` : ''}`,
                    title: (
                        <div>
                            <div className="font-extrabold block">{item.code}</div>
                            <div className="-mt-2 text-gray-700">{item.name}{item.unit ? ` (${item.unit})` : ''}</div>
                        </div>
                    ),
                    amount: data?.find((x: any) => x.key === item.id)?.amount || 0,
                    serial_number: data?.find((x: any) => x.key === item.id)?.serial_number || null
                }));
                return [...prevDataSource, ...newElements];
            });
        } catch (error) {
            resolve()
        } finally {
            resolve()
        }
    };
    const onLoadData = ({ key }: any) =>
        new Promise<void>((resolve) => {
            fetchChildData(key, resolve)
        });
    useEffect(() => {
        setSource(targetKeys)
    }, [targetKeys])

    return (
        <div className="grid grid-cols-3 gap-3 w-full">
            <div className="col-span-1 flex-col rounded border ">
                <div className="flex p-2 items-center h-[50px] justify-between">
                    <span>{`Danh mục VTKT [${dataSource.length}]`}</span>
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
                    <Tree
                        blockNode
                        defaultExpandAll
                        checkable
                        checkStrictly
                        checkedKeys={source.map((item: any) => item.key)}
                        treeData={generateTree(listToTree(dataSource), source.map((item: any) => item.key))}
                        onCheck={onMoveToRight}
                        onSelect={onMoveToRight}
                        // onExpand={(key, info: { expanded: any, node: any }) => {
                        //     fetchChildData(info.node?.id)
                        // }}
                        loadData={onLoadData}
                    />
                </div>

            </div>
            <div className="col-span-2 flex-col rounded border ">
                <div className="flex p-2 items-center h-[50px] justify-between">
                    <span>{`Danh sách dụng cụ, phương tiện đo [${targetKeys.length}]`}</span>
                </div>
                <Divider className="my-0" />
                <BaseTable
                    hiddenIndex={true}
                    components={components}
                    columns={columns as ColumnTypes}
                    loading={isLoading}
                    dataSource={targetKeys}
                    pagination={false}
                    size="middle"
                    x={1500}
                    rowClassName="hover:bg-secondary group"
                    className="flex cursor-pointer"
                />
            </div>
        </div>
    );
};

const TBVTTechnicalAction: React.FC<TBVTTechnicalActionType> = ({
    data,
    technical_org,
}) => {
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();
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
            if (targetKeys?.some((item: any) => item.quality == null)) {
                openMessage({
                    type: 'warning',
                    content: `Cấp chất lượng không được để trống!`
                });
                return;
            }

            const tbvt_categories = targetKeys?.map((item: any) => ({
                tbvt_categories_id: item?.key,
                amount: item?.amount,
                serial_number: item?.serial_number,
                manufacturing_year: item?.manufacturing_year,
                note: item?.note,
                quality: item?.quality,
                time_of_repair: item?.time_of_repair,
            }));

            await updateTechnicalOrganizations(technical_org?.technical_id?.id, { tbvt_categories });
            handleSuccess();
        } catch (error: any) {
            console.log('error: ', error)
        }
    }
    const fetchData = async (
    ) => {
        try {
            setIsLoading(true);
            const initFilter: any = {
                _and: [
                    {
                        type: {
                            _in: [TBVTCategoriesType.VT, TBVTCategoriesType.TB2]
                        }
                    },
                    {
                        parent_id: {
                            _null: true
                        }
                    }
                ]
            };

            if (search?.length > 0) {
                initFilter._and.push({
                    name: {
                        _icontains: search
                    }
                });
            }
            const response: any = await Promise.all([
                await getTBVTCategoriesList({ limit: -1 }, initFilter),
                await metaTBVTCategories(initFilter)
            ])
            setDataSource(response[0].map((item: any) => ({
                ...item,
                key: item.id,
                title: (
                    <div>
                        <div className="font-extrabold text-black block">{item.code}</div>
                        <div className="-mt-2 text-gray-700">{item.name}{item.unit ? ` (${item.unit})` : ''}</div>
                    </div>
                ),
                amount: data?.find((x: any) => x.key === item.id)?.amount || 0,
                serial_number: data?.find((x: any) => x.key === item.id)?.serial_number || null
            })));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false)
            console.log('error: ', error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [search])
    useEffect(() => {
        setTargetKeys(data);
    }, [data])

    return (
        <Flex align="start" gap="middle" vertical>
            <div className="flex flex-row justify-between w-full items-center px-[10px]">
                <p className="modal-title">{`Cập nhật danh sách dụng cụ phương tiện đo ${technical_org?.name}`}</p>
                <Button className="rounded px-[30px]" type="primary" size="small" onClick={onFinish}>
                    <span>Lưu</span>
                </Button>
            </div>
            <TableTransfer
                data={data}
                dataSource={dataSource}
                setDataSource={setDataSource}
                setSearch={setSearch}
                targetKeys={targetKeys}
                setTargetKeys={setTargetKeys}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </Flex>
    );

}
export default TBVTTechnicalAction;
