import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Skeleton, Space } from "antd";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useMessage } from "@app/contexts/MessageContext";
import { District } from "../types/District.type";
import { updateDistrict, createDistrict, removeDistrict, getDistrictDetail } from "../store/District.action";
import { getAdministrativeUnit } from "../store/AdministrativeUnit.action";
import { getProvince } from "../store/Province.action";
import ItemComponent from "../../../components/ItemsComponent";
import { selectMap } from "@app/core/helper";
import { IDistrictActionSelect } from "../interfaces/District.interface copy";
import { getZoneCategoryList } from "@app/modules/technical-categories/store/ZoneCategory.action";
type Props = {
    id?: string,
    action: Action
}

export default function DistrictAction({ id, action }: Props) {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();

    const [detail, setDetail] = useState<District>();
    const [isLoading, setIsIoading] = useState<boolean>(false);
    const [dataSelection, setDataSelection] = useState<IDistrictActionSelect>({
        adminUnits: [],
        provinces: [],
        zones: [],
    });
    const dataInput = useMemo(() => [
        {
            title: "Tên",
            content: detail?.name || null,
            require: true,
            dataIndex: "name",
            rules: [
                { required: true, message: `Hãy nhập thông tin cho trường tên huyện` },
            ],
        },
        {
            title: "Tên rút gọn",
            content: detail?.short_name || null,
            dataIndex: "short_name",
        },
        {
            title: "Mã mở rộng",
            content: detail?.code_ex || null,
            dataIndex: "code_ex",
        },
        {
            title: "Đơn vị hành chính",
            content: detail?.admin_unit_id || null,
            dataIndex: "admin_unit_id",
        },
        {
            title: "Tỉnh",
            content: detail?.province_id || null,
            dataIndex: "province_id",
        },
        {
            title: "Thuộc khu vực",
            content: detail?.zone_id || null,
            dataIndex: "zone_id",
        },
        {
            title: "Số thứ tự",
            content: detail?.order_number || null,
            dataIndex: "order_number",
        },
        {
            title: "Trạng thái",
            content: (detail?.is_enable === undefined ? true : detail?.is_enable),

            dataIndex: "is_enable",
        },
    ], [detail])
    const onFinish = async () => {
        try {
            loading.show()
            const value: any = form.getFieldsValue();
            const province_id = value?.province_id?.value ? value?.province_id?.value : value?.province_id;
            const admin_unit_id = value?.admin_unit_id?.value ? value?.admin_unit_id?.value : value?.admin_unit_id;
            const zone_id = value?.zone_id?.value ? value?.zone_id?.value : value?.zone_id;
            switch (action) {
                case Action.Update:
                    await updateDistrict(detail?.id, { ...value, province_id, admin_unit_id, zone_id });
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`
                    })
                    break;
                case Action.Create:
                    await createDistrict(value);
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

    const handleDelete = async () => {
        try {
            await removeDistrict(detail?.id);
            openMessage({
                type: "success",
                content: `Xóa thành công`
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
    const getDetail = async () => {
        try {
            setIsIoading(true)
            const res = await getDistrictDetail(id, {});
            setDetail(res);
            setIsIoading(false)
        } catch (e) {
            console.log(e)
            setIsIoading(false)
        }
    }
    const getSelectData = async () => {
        try {
            const res = await Promise.all([
                getAdministrativeUnit({ limit: -1 }, {}),
                getProvince({ limit: -1 }, {}),
                getZoneCategoryList({ limit: -1 }, {}),
            ]);
            setDataSelection({
                adminUnits: res[0],
                provinces: res[1],
                zones: res[2]
            })
        } catch (e) {
            console.log(e);
        }
    }
    const getDataSelect = (dataIndex: string) => {
        if (["province_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.provinces,
                "name",
                "id"
            );
        }
        if (["admin_unit_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.adminUnits,
                "name",
                "id"
            );
        }
        if (["zone_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.zones,
                "name",
                "id"
            );
        }
    };
    useEffect(() => {
        if (id) {
            getDetail();
        }
    }, [id])
    useEffect(() => {
        getSelectData();
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
                className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
            >
                <ModalCategoryActionHeader name="huyện" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
            </Flex>
            {isLoading ? <><Skeleton /></> : <Form
                form={form}
                className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
                disabled={action === Action.View}
                onFinish={onFinish}
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
                                    isNumberField={value?.dataIndex === "order_number"}
                                    selectField={{
                                        isSelect:
                                            value?.dataIndex === "province_id" ||
                                            value?.dataIndex === "zone_id" ||
                                            value?.dataIndex === "admin_unit_id",
                                        dataSelect: getDataSelect(value.dataIndex),
                                    }}
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
            </Form>
            }

        </Space>
    );
}

