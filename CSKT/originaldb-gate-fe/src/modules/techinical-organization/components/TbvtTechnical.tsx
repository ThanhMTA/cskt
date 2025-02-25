import { Button, Form, Input, InputNumber, Select, Table } from "antd";
import BaseTable from "@app/components/BaseTable";
import { Action } from "@app/enums";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ITableAction } from "@app/interfaces/table.interface";
import { BiTrash } from "react-icons/bi";
import { IMeta } from "@app/interfaces/common.interface";
import { TableGeneralKeys } from "@app/enums/table.enum";
import TBVTTechnicalAction from "./TbvtTechnicalAction";
import { useModal } from "@app/contexts/ModalContext";
import { useParams } from "react-router-dom";
import { createTechnicalTBVT, deleteTechnicalTBVT, getTechnicalTBVTDetail, metaTechnicalTBVTDetail, updateTechnicalTBVT } from "../stores/TechnicalOrganization.action";
import { TBVTCategoriesData } from "@app/modules/force-categories/types/TBVTCategories.types";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { GetRef } from "antd/lib";
import { useMessage } from "@app/contexts/MessageContext";
import { makeid } from "@app/core/helper";
import { QUALITY_SCOPE_OPTIONS } from "../constants/level.constant";
import { getTechnicalTypesDetail } from "../stores/TechnicalTypes.action";
import { TechnicalTypesData } from "../types/TechnicalTypes.type";

const ACTION_TABLE: ITableAction[] = [
    {
        key: Action.Delete,
        icon: <BiTrash />,
        // tooltip: 'Xoá'
    },
    {
        key: Action.Create,
        icon: <PlusCircleOutlined />,
        // tooltip: 'Sao chép'
    },
];

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
            isEdittingQuality,
            isEdittingManufacturingYear,
            isEdittingTimeOfRepair,
            isEdittingNote,
            dataIndex,
            form,
            ref,
            record
        ]);

        const save = async (value: any) => {
            try {
                const inputValue = value?.target?.value ?? value;
                if (inputValue && (inputValue.length > 0 || typeof inputValue === 'number')) {
                    const values = await form.validateFields();
                    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
                    if (values[dataIndex] !== record[dataIndex])
                        handleSave(values, record);
                }
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
                    onClick={() => {
                        setEdit(recordId)
                    }}
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
                                onBlur={(value) => {
                                    save(value);
                                    onBlueEdit()
                                }}
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
                                onBlur={(value) => {
                                    save(value);
                                    onBlueEdit()
                                }}
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
                                onBlur={(value) => {
                                    save(value);
                                    onBlueEdit();
                                }}
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
                                onBlur={(value) => {
                                    save(value);
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
                                onBlur={(value) => {
                                    save(value);
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
                            // onClick={save}
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


const TbvtTechnical: React.FC = () => {
    const { id } = useParams();
    const { openModal } = useModal();
    const { openMessage } = useMessage();
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [data, setData] = useState<TBVTCategoriesData[]>([]);
    const [general, setGeneral] = useState<TechnicalTypesData>();
    const [editingRowSerial, setEditingRowSerial] = useState<string | null>(null);
    const [editingRowAmount, setEditingRowAmount] = useState<string | null>(null);
    const [editingRowManufacturingYear, setEditingRowManufacturingYear] = useState<string | null>(null);
    const [editingRowQuality, setEditingRowQuality] = useState<string | null>(null);
    const [editingRowTimeOfRepair, setEditingRowTimeOfRepair] = useState<string | null>(null);
    const [editingRowNote, setEditingRowNote] = useState<string | null>(null);
    const [search, setSearch] = useState<any>(null);
    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
        placeholder?: string;
    })[] = useMemo(
        () => (
            [
                {
                    title: <p className="font-bold text-center">Dụng cụ phương tiện đo</p>,
                    dataIndex: "name",
                    key: makeid(),
                    fixed: 'left',
                    width: '20%',
                    render: (name: string, record: any) => {
                        return (
                            <>
                                {record.code} <br />
                                {record.name} ({record.unit})
                            </>
                        );
                    }
                },  
            {
                title: <p className="font-bold text-center">Số lượng</p>,
                dataIndex: "amount",
                placeholder: "Nhập số lượng",
                width:'10%',
                editable: true,
                key: makeid(),
                render: (amount: any) => Math.round(amount * 100) / 100 || 0
            },
            {
                title: <p className="font-bold text-center">Cấp CL</p>,
                dataIndex: "quality",
                placeholder: "Chọn cấp",
                width: '80px',
                editable: true,
                key: makeid(),
            },
            {
                title: <p className="font-bold text-center">S/N</p>,
                dataIndex: "serial_number",
                placeholder: "Nhập serial number",
                editable: true,
                key: makeid(),
            },
            {
                title: <p className="font-bold text-center">Năm SX</p>,
                dataIndex: "manufacturing_year",
                placeholder: "Năm sản xuất",
                editable: true,
                key: makeid(),
            },
            {
                title: <p className="font-bold text-center">Số lần S/C</p>,
                dataIndex: "time_of_repair",
                placeholder: "Số lần sửa chữa",
                editable: true,
                key: makeid(),
            },
            {
                title: <p className="font-bold text-center">Ghi chú</p>,
                dataIndex: "note",
                placeholder: "Ghi chú",
                editable: true,
                key: makeid(),
            },
            ]
        ), []
    )


    const handleOpenModal = () => {
        openModal(
            <TBVTTechnicalAction technical_org={general} data={data} />,
            {
                width: '90vw',
                onModalClose() {
                    reloadPage();
                },
            }
        )
    }
    const reloadPage = () => {
        fetchTBVTDetail()
    }

    const fetchTBVTDetail = async () => {
        try {
            setIsLoading(true);
            let filterValue;
            const data = await getTechnicalTypesDetail(id, {});
            if (data) {
                if (search?.length > 0) {
                    filterValue = {
                        technical_org_id: {
                            id: {
                                _eq: data?.technical_id?.id
                            }
                        },
                        tbvt_categories_id: {
                            name: {
                                _icontains: search
                            }
                        }
                    }
                } else {
                    filterValue = {
                        technical_org_id: {
                            id: {
                                _eq: data?.technical_id?.id
                            }
                        }
                    }
                }
                setGeneral(data);
            }
            const res = await Promise.all([
                getTechnicalTBVTDetail({ limit: -1 }, filterValue),
                metaTechnicalTBVTDetail(filterValue),
            ])

            setData(res[0].map(
                (item) => ({
                    ...item.tbvt_categories_id,
                    technical_org_id: item.technical_org_id.id,
                    id: makeid(),
                    key: item.tbvt_categories_id.id,
                    _id: item.id,
                    serial_number: item?.serial_number,
                    amount: item?.amount,
                    manufacturing_year: item?.manufacturing_year,
                    quality: item?.quality,
                    note: item?.note,
                    time_of_repair: item?.time_of_repair,
                })))
            setMeta(res[1]);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    }
    const cloneItem = async (item: any) => {
        try {
            const clonedItem =
            {
                ...item,
                id: makeid(),
                serial_number: null,
                amount: 1,
                note: null,
                time_of_repair: 0,
            };
            await createTechnicalTBVT({
                technical_org_id: item?.technical_org_id,
                tbvt_categories_id: clonedItem.key,
                amount: 1,
                time_of_repair: 0,
                note: null,
                manufacturing_year: clonedItem?.manufacturing_year,
                quality: clonedItem?.quality,
                serial_number: null
            });
            setData((prevData: any[]) => {
                const index = prevData.findIndex((i) => i.id === item.id);
                if (index === -1) return prevData;
                const newData = [
                    ...prevData.slice(0, index + 1),
                    clonedItem,
                    ...prevData.slice(index + 1)
                ];
                return newData;
            });
            setMeta((prev: IMeta) => ({
                ...prev,
                count: Number(prev.count) + 1,
            }));
        } catch (error: any) {
            console.log('error: ', error)
        }
    }
    const actionClickHandle = async (key: Action, item: any) => {
        switch (key) {
            case Action.Delete:
                await deleteTechnicalTBVT(item._id);
                fetchTBVTDetail()
                break;
            case Action.Create:
                console.log('item: ', item)
                cloneItem(item)
                break;
            default:
                break;
        }
    }
    const handleSave = async (payload: any, record: any) => {
        try {
            await updateTechnicalTBVT(record._id, payload);
            const newRecord: any = {
                ...record,
                ...payload
            };
            const index = data.findIndex((item: any) => record.id === item.id);
            data[index] = { ...newRecord };
            setData([...data])
            if (index !== data.length - 1) {
                if (Object.keys(payload)[0] === 'amount')
                    setEditingRowAmount(data[index + 1]?.id);
                else if (Object.keys(payload)[0] === 'serial_number')
                    setEditingRowSerial(data[index + 1]?.id)
                else if (Object.keys(payload)[0] === 'manufacturing_year')
                    setEditingRowManufacturingYear(data[index + 1]?.id)
                else if (Object.keys(payload)[0] === 'quality')
                    setEditingRowQuality(data[index + 1]?.id)
                else if (Object.keys(payload)[0] === 'note')
                    setEditingRowNote(data[index + 1]?.id)
                else if (Object.keys(payload)[0] === 'time_of_repair')
                    setEditingRowTimeOfRepair(data[index + 1]?.id)
            } else {
                setEditingRowAmount(null)
                setEditingRowSerial(null)
                setEditingRowManufacturingYear(null)
                setEditingRowQuality(null)
                setEditingRowTimeOfRepair(null)
                setEditingRowNote(null)

            }
            openMessage({
                type: "success",
                content: `Cập nhật thành công`,
            });

        } catch (error: any) {
            console.log('error: ', error)
        }
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
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
    useEffect(() => {
        fetchTBVTDetail()
    }, [search, id])

    return (
        <div className="bg-[white] flex flex-col">
            <div className="flex flex-col pt-2 pr-2">
                <div className="rounded bg-[white] flex items-center justify-end">
                    <div className="flex flex-row justify-between">
                        <div className={`transition-all duration-300 ${openSearch ? 'w-[320px]' : 'w-[220px]'}`}>
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
                        <div className="flex px-2">
                            <Button
                                size="small"
                                onClick={handleOpenModal}
                                type="primary"
                                className="rouned">
                                <span>Thêm mới</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <BaseTable
                components={components}
                columns={columns as ColumnTypes}
                total={meta?.count || 0}
                className="flex w-[1180px]"
                rowClassName="hover:bg-secondary group editable-row"
                actionWidth={90}
                scroll={{ x: 1500 }}
                isReloadButton={true}
                dataSource={data}
                actionClick={actionClickHandle}
                actionList={ACTION_TABLE}
                isAction={true}
                loading={isLoading}
                rowKey={'id'}
                filterColumns={[TableGeneralKeys.Name]}
                btnCreate={false}
            />


        </div>

    )
}
export default TbvtTechnical;