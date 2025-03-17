import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space, Skeleton, Tooltip, Popconfirm, Button } from "antd";
// import { CanBoCategoriesData } from "../types/CanBoCategories.types";
import { createTTB, removeTTB, updateTTB, getTTBDetail, getCommonCategory, getPlaceTree } from "../stores/QLTTB.action";
// import { getPositionList } from "../store/PositionCategories.action";
// import { getConditionList } from "@app/modules/force-categories/store/CondittionCategories.action";
// import { getRankList } from "../store/RankCategories.action";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { } from "@app/contexts/MessageContext";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";

import { Action } from "@app/enums";
import { TABLE_FIELD_NAME } from "@app/constants/table.constant";
import ItemComponent from "@app/components/ItemsComponent";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { TTBData } from "../types/TTB.type";
import { useEffect, useMemo, useState } from "react";
// import { ICanBoActionSelect } from "../interfaces/Canbo.interface";
import { selectMap } from "@app/core/helper";
import { useMessage } from "@app/contexts/MessageContext";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";
import { group } from "console";
type Props = {
    id?: string,
    action: Action
}
interface ICommonCategory {

    condition: any[],
    org: any[],
    species: any[],
    unit: any[],
    investor: any[],
    management: any[],
    manager: any[],
    manufactures: any[],
    place: any[],
    group: any[],
}
export default function TTBAction({ id, action }: Props) {
    const [form] = Form.useForm();
    const { openMessage } = useMessage();
    const loading = useLoading();
    const modal = useModal();
    const [isLoading, setIsIoading] = useState<boolean>(false);
    const [detail, setDetail] = useState<TTBData>();
    const [dataSelection, setDataSelection] = useState<ICommonCategory>({


        condition: [],
        org: [],
        species: [],
        unit: [],
        investor: [],
        management: [],
        manager: [],
        manufactures: [],
        place: [],
        group: [],

    });

    const handleDelete = async () => {
        try {
            await removeTTB(detail?.id);
            openMessage({
                type: "success",
                content: `Xóa trang thiết thành công`
            })
            // handleSuccess();
            loading.hide()
            modal.closeModal({})
        } catch (error: any) {
            console.log(error);
            openMessage({
                type: "error",
                content: error?.message || "Lỗi hệ thống",
            });
        }
    }
    const hanldeFinish = () => {
        if (action === Action.View) {
            handleSuccess();
            return;
        } else {
            form.submit();
        }
    }
    const handleSuccess = () => {
        loading.hide()
        modal.closeModal({ success: true })
    }
    const fetchData = async () => {
        const responses = await Promise.all([
            getCommonCategory('condition_categories'),
            getCommonCategory('species_categories'),
            getCommonCategory('unit_categories'),
            getCommonCategory('nguon_dau_tu'),
            getCommonCategory('can_bo'),
            getCommonCategory('hang_san_xuat'),
            getCommonCategory('nhom_TBKT'),
            getCommonCategory('vi_tri'),

            await getOrganizationTree({}),

        ]);
        setDataSelection({
            condition: responses[0],
            org: responses[8],
            species: responses[1],
            unit: responses[2],
            investor: responses[3],
            management: responses[8],
            manager: responses[4],
            manufactures: responses[5],
            place: responses[7],
            group: responses[6],

        });
        console.log("ktra:", responses[7])
    };
    // const getSelectData = async () => {
    //   try {
    //     const res = await Promise.all([
    //       getRankList({ limit: -1 }, {}),
    //       getPositionList({ limit: -1 }, {}),
    //       getWard({limit:-1},{})
    //     ]);
    //     setDataSelection({
    //       capbacs: res[0],
    //       chucvus: res[1],
    //       diachis:res[2]
    //     })
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    const onFinish = async () => {
        try {
            loading.show()
            let ward_id = null;
            const value: any = form.getFieldsValue();
            const condition_id = value?.condition_id?.value ? value?.condition_id?.value : value?.condition_id;
            const org_id = value?.org_id?.value ? value?.org_id?.value : value?.org_id;
            const species_id = value?.species_id?.value ? value?.species_id?.value : value?.species_id;
            const unit_id = value?.unit_id?.value ? value?.unit_id?.value : value?.unit_id;
            const investor_id = value?.investor_id?.value ? value?.investor_id?.value : value?.investor_id;
            const management_id = value?.management_id?.value ? value?.management_id?.value : value?.management_id;
            const manager_id = value?.manager_id?.value ? value?.manager_id?.value : value?.manager_id;
            const manufacturer_id = value?.manufacturer_id?.value ? value?.manufacturer_id?.value : value?.manufacturer_id;
            const place_id = value?.place_id?.value ? value?.place_id?.value : value?.place_id;
            const group_id = value?.group_id?.value ? value?.group_id?.value : value?.group_id;
            // const investor_id = value?.investor_id?.value ? value?.investor_id?.value : value?.investor_id;


            switch (action) {
                case Action.Update:
                    await updateTTB(detail?.id, {
                        ...value,
                        condition_id,
                        org_id,
                        ward_id,
                        species_id,
                        unit_id,
                        investor_id,
                        management_id,
                        manager_id,
                        manufacturer_id,
                        place_id,
                        group_id
                    });
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`
                    })
                    break;
                case Action.Create:
                    await createTTB({
                        ...value,
                        condition_id,
                        org_id,
                        ward_id,
                        species_id,
                        unit_id,
                        investor_id,
                        management_id,
                        manager_id,
                        manufacturer_id,
                        place_id,
                        group_id
                    });

                    openMessage({
                        type: "success",
                        content: `Thêm mới thành công`
                    })
                    form.resetFields();
                    break;
                case Action.View:
                    break;

            }
            handleSuccess();
        } catch (e: any) {
            console.log(e);
            openMessage({
                type: "error",
                content: e?.message || "Lỗi hệ thống",
            });
            loading.hide()
        }
    }



    const dataInput = useMemo(
        () => [
            {
                title: "Tên trang thiết bị",
                content: detail?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Thông tin không được để trống!` },
                ],
            },
            {
                title: "Tên viết tắt",
                content: detail?.short_name || null,
                dataIndex: "short_name"
            },
            {
                title: "Ký hiệu",
                content: detail?.nick_name || null,
                dataIndex: "nick_name"
            },
            ,
            {
                title: "serial number",
                content: detail?.serial_number || null,
                dataIndex: "serial_number"
            },
            {
                title: "Số lượng",
                content: detail?.quantity || null,
                dataIndex: "quantity"
            },
            {
                title: "Phân cấp",
                content: detail?.hierarchy || null,
                dataIndex: "hierarchy"
            },
            {
                title: "Tình trạng",
                content: detail?.condition_id || null,
                dataIndex: "condition_id"
            },
            {
                title: "Biên chế",
                content: detail?.org_id || null,
                dataIndex: "org_id"
            },
            {
                title: "Chủng loại",
                content: detail?.species_id || null,
                dataIndex: "species_id"
            },
            {
                title: "Đơn vị tính",
                content: detail?.unit_id || null,
                dataIndex: "unit_id"
            },
            {
                title: "Nguồn đầu tư",
                content: detail?.investor_id || null,
                dataIndex: "investor_id"
            },
            {
                title: "Đơn vị quản lý",
                content: detail?.management_id || null,
                dataIndex: "management_id"
            },
            {
                title: "Người quản lý",
                content: detail?.manager_id || null,
                dataIndex: "manager_id"
            },
            {
                title: "Hãng sản xuất",
                content: detail?.manufacturer_id || null,
                dataIndex: "manufacturer_id"
            },
            {
                title: "Vị trí hiện tại",
                content: detail?.place_id || null,
                dataIndex: "place_id"
            },
            {
                title: "Nhóm trang thiết bị",
                content: detail?.group_id || null,
                dataIndex: "group_id"
            },
            {
                title: "Trạng thái",
                content: (detail?.is_enable === undefined ? true : detail?.is_enable),

                dataIndex: "is_enable"
            },
        ], [detail]
    )
    const getDetail = async () => {
        try {
            setIsIoading(true)
            const res = await getTTBDetail(id, {});
            setDetail(res);
            setIsIoading(false)
        } catch (e) {
            console.log(e)
            setIsIoading(false)
        }
    }

    const getDataSelect = (dataIndex: string) => {
        if (["condition_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.condition,
                "name",
                "id"
            );
        }
        if (["species_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.species,
                "name",
                "id"
            );
        }
        if (["unit_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.unit,
                "name",
                "id"
            );
        }
        if (["investor_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.investor,
                "name",
                "id"
            );
        }

        if (["manager_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.manager,
                "name",
                "id"
            );
        }
        if (["manufacturer_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.manufactures,
                "name",
                "id"
            );
        }

        if (["group_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.group,
                "name",
                "id"
            );
        }
        if (["hierarchy"].includes(dataIndex)) {
            return selectMap(
                [
                    { id: "1", name: "1" },
                    { id: "2", name: "2" },
                    { id: "3", name: "3" },
                    { id: "4", name: "4" },
                    { id: "5", name: "5" },


                ],
                "name",
                "id"
            );
        }
    };
    const getDataTReeSelect = (dataIndex: string) => {
        if (["org_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.org,
                "name",
                "id"
            );
        }
        if (["place_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.place,
                "name",
                "id"
            );
        }
        if (["management_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.management,
                "name",
                "id"
            );
        }
       
    };
    useEffect(() => {
        fetchData();
        if (id) {
            getDetail();
        }
    }, [id])
    useEffect(() => {
        // getSelectData();
        fetchData();

    }, [])


    return (
        <Space
            {...SPACE_PROP_DEFAULT}
            className="flex"
            size={20}
        >
            <Flex
                align="center"
                justify="space-between"
                className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50  `}
            // className="px-6 w-[900px]"

            >
                {/* <ModalCategoryActionHeader
                    name="Trang thiết bị"
                    action={action}
                    hanldeFinish={hanldeFinish}
                    handleDelete={handleDelete}

           

                /> */}
                {action === Action.Create ? (
                    <div className="text-[22px] font-bold">{`Thông tin Trang thiết bị`}</div>
                ) : (
                    <div className="text-[22px] font-bold">{`Thông tin trang thiết bị ${detail?.nick_name}`}</div>
                )}
                <div className="flex flex-row gap-2">
                    {action === Action.View ? (
                        <>
                            <Tooltip title="Xóa">
                                <Popconfirm
                                    title={MESSAGE_CONTENT.DELETE}
                                    onConfirm={() => { }}
                                    okText={BUTTON_LABEL.CORRECT}
                                    cancelText={BUTTON_LABEL.NO}
                                >
                                    <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa">
                                <Button
                                    onClick={hanldeFinish}
                                    type="default"
                                    icon={<EditOutlined />}
                                    shape="circle"
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Xóa">
                                <Popconfirm
                                    title={MESSAGE_CONTENT.DELETE}
                                    onConfirm={handleDelete}
                                    okText={BUTTON_LABEL.CORRECT}
                                    cancelText={BUTTON_LABEL.NO}
                                >
                                    <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Lưu">
                                <Button
                                    onClick={() => {
                                        form.submit();
                                    }}
                                    type="default"
                                    icon={<CheckOutlined />}
                                    shape="circle"
                                />
                            </Tooltip>
                        </>
                    )}


                </div>
            </Flex>
            {isLoading ? <><Skeleton /></> : <Form
                form={form}
                className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
                onFinish={onFinish}
                disabled={action === Action.View}

            // requiredMark={false}
            >
                {action === Action.Update || action === Action.Create ? (
                    <>
                        {dataInput.map((value: any, i: number) => {
                            return (
                                <ItemComponent
                                    key={i}
                                    title={value?.title}
                                    rules={value?.rules}
                                    content={value?.content}
                                    require={value?.require}
                                    statusUpdate={true}
                                    dataIndex={value.dataIndex}
                                    // addressField={value?.dataIndex === "ward_id"}
                                    treeField={{
                                        isSelect: value?.dataIndex === "org_id"||
                                        value?.dataIndex === "management_id"||
                                        value?.dataIndex === "place_id", 

                                        // dataSelect: dataSelection.org,
                                        dataSelect: getDataTReeSelect(value.dataIndex),

                                       
                                    }}
                                    selectField={{
                                        isSelect:
                                            value?.dataIndex === "condition_id" ||
                                            value?.dataIndex === "species_id" ||
                                            value?.dataIndex === "unit_id" ||
                                            value?.dataIndex === "investor_id" ||
                                            value?.dataIndex === "manager_id" ||
                                            value?.dataIndex === "manager_id" ||
                                            value?.dataIndex === "manufacturer_id" ||
                                            value?.dataIndex === "group_id" ||
                                            value?.dataIndex === "hierarchy",
                                        // value?.dataIndex === "ward_id",
                                        dataSelect: getDataSelect(value.dataIndex),

                                    }}
                                    isNumberField={value?.dataIndex === "order_number"}
                                    isRadioField={
                                        value?.dataIndex === "is_enable"
                                    }
                                />
                            )
                        })}
                    </>
                ) : (
                    <>
                        {dataInput.map((value: any, i: number) => {
                            return (
                                <div className="flex flex-col pb-4">
                                    <ItemComponent
                                        key={i}
                                        title={value?.title}
                                        content={value?.content}
                                        require={value?.require}
                                        statusUpdate={false}
                                        dataIndex={value.dataIndex}
                                        isRadioField={
                                            value?.dataIndex === "is_enable"
                                        }
                                    />
                                </div>
                            );
                        })}
                    </>
                )}
            </Form>}

        </Space>
    );
}

