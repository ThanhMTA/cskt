import { Button, Input, TableColumnsType } from "antd";
import dayjs, { Dayjs } from "dayjs";
import BaseTable from "@app/components/BaseTable";
import { Action } from "@app/enums";
import { useEffect, useState } from "react";
import { TechnicalOrganizationData } from "../types/TechnicalOrganization.type";
import { ITableAction } from "@app/interfaces/table.interface";
import { BiTrash } from "react-icons/bi";
import { IMeta } from "@app/interfaces/common.interface";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { useModal } from "@app/contexts/ModalContext";
import { CBNV_CATEGORIES_FIELD_NAME } from "../constants/cbnv.constant";
import CBNVTechnicalAction from "./CbnvTechnicalAction";
import { PersonalIdentifyData } from "@app/modules/force-categories/types/PersonalIdentify.types";
import { deleteTechnicalCBNV, getTechnicalCBNVDetail, metaTechnicalCBNVDetail } from "../stores/TechnicalOrganization.action";
import { useParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { getTechnicalTypesDetail } from "../stores/TechnicalTypes.action";

const dateFormat = 'DD/MM/YYYY';

interface DataType {
    key: number;
    full_name: string;
    date_of_join_army?: Dayjs;
    rank_id?: string;
    org_id?: string;
    degree_id?: string;
    major_id?: string;
    phone_number?: string;
}
const ACTION_TABLE: ITableAction[] = [
    {
        key: Action.Delete,
        icon: <BiTrash />,
        tooltip: 'Xoá'
    },
];
const CbnvTechnical: React.FC = () => {
    const { id } = useParams();
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [meta, setMeta] = useState<IMeta>({ count: 0 });
    const [data, setData] = useState<PersonalIdentifyData[]>([]);
    const [general, setGeneral] = useState<TechnicalOrganizationData>()
    const [search, setSearch] = useState<any>(null)
    const { openModal } = useModal();
    const columns: TableColumnsType<DataType> = [
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.FULL_NAME}</p>,
            dataIndex: "name",
        },
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.DATE_OF_JOIN_ARMY}</p>,
            dataIndex: "date_of_join_army",
            render: (text: any) => text ? dayjs(text).format(dateFormat) : "",

        },
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.TYPE}</p>,
            dataIndex: "type_id",
            render: (_, item: any) => item?.type_id?.short_name
        },
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.RANK}</p>,
            dataIndex: "rank_id",
            render: (_, item: any) => item?.rank_id?.name

        },
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.ORG}</p>,
            dataIndex: "org_id",
            render: (_, item: any) => item?.org_id?.name
        },
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.DEGREE}</p>,
            dataIndex: "degree_id",
            render: (_, item: any) => item?.degree_id?.short_name
        },
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.MAJOR}</p>,
            dataIndex: "major_id",
        },
        {
            title: <p className="font-bold">{CBNV_CATEGORIES_FIELD_NAME.PHONE_NUMBER}</p>,
            dataIndex: "phone_number",
        },
    ];
    const handleOpenModal = () => {
        openModal(
            <CBNVTechnicalAction technical_org={general} data={data} />,
            {
                width: '90vw',
                onModalClose(res) {
                    if (res?.success) {
                        reloadPage();
                    } else {
                        reloadPage();
                    }
                },
            }
        )
    }
    const actionClickHandle = async (key: Action, item: any) => {
        switch (key) {
            case Action.Delete:
                await deleteTechnicalCBNV(item._id);
                fetchCBNV()
                break;
        }

    }
    const reloadPage = () => {
        fetchCBNV()
    }
    const fetchCBNV = async () => {
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
                        personal_identifies_id: {
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

            setIsLoading(true);
            const res = await Promise.all([
                getTechnicalCBNVDetail({ limit: -1 }, filterValue),
                metaTechnicalCBNVDetail(filterValue),
            ])
            setData(res[0].map((item) => ({ ...item.personal_identifies_id, key: item.personal_identifies_id.id, _id: item?.id })))
            setMeta(res[1]);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchCBNV()
    }, [search, id])

    return (
        <div className="bg-[white] flex flex-col">
            <div className="flex flex-col p-2">
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
            <div className="flex">
                <BaseTable
                    total={meta?.count || 0}
                    isReloadButton={true}
                    dataSource={data}
                    actionWidth={90}
                    columns={columns}
                    rowClassName="hover:bg-secondary group editable-row"
                    actionClick={actionClickHandle}
                    actionList={ACTION_TABLE}
                    isAction={true}
                    loading={isLoading}
                    rowKey={'id'}
                    filterColumns={[TableGeneralKeys.Name]}
                    btnCreate={false}
                />
            </div>

        </div>
    )
}
export default CbnvTechnical;