import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Skeleton, Space } from "antd";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useMessage } from "@app/contexts/MessageContext";
import { Province } from "../types/Province.type";
import { updateProvince, createProvince, removeProvince, getProvinceDetail } from "../store/Province.action";
import { getRegion } from "../store/Region.action";
import { getMilitaryDistrict } from "../store/MilitaryDistrict.action";
import { getAdministrativeUnit } from "../store/AdministrativeUnit.action";
import ItemComponent from "../../../components/ItemsComponent";
import { selectMap } from "@app/core/helper";
import { IProvinceActionSelect } from "../interfaces/Province.interface";
type Props = {
    id?: string,
    action: Action
}

export default function ProvinceAction({ id, action }: Props) {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();
    const [detail, setDetail] = useState<Province>();
    const [dataSelection, setDataSelection] = useState<IProvinceActionSelect>({
        adminUnits: [],
        militaryDistricts: [],
        regions: []
    });
    const [isLoading, setIsIoading] = useState<boolean>(false);
    const onFinish = async () => {
        try {
            loading.show();
            const value: any = form.getFieldsValue();
            const region_id = value?.region_id?.value ? value?.region_id?.value : value?.region_id;
            const admin_unit_id = value?.admin_unit_id?.value ? value?.admin_unit_id?.value : value?.admin_unit_id;
            const military_distric_id = value?.military_distric_id?.value ? value?.military_distric_id?.value : value?.military_distric_id;
            switch (action) {
                case Action.Update:
                    await updateProvince(detail?.id, { ...value, region_id, admin_unit_id, military_distric_id });
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`
                    })
                    break;
                case Action.Create:
                    await createProvince(value);
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
            await removeProvince(detail?.id);
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
            const res = await getProvinceDetail(id, {});
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
                getRegion({ limit: -1 }, {}),
                getAdministrativeUnit({ limit: -1 }, {}),
                getMilitaryDistrict({ limit: -1 }, {})
            ]);
            setDataSelection({
                regions: res[0],
                adminUnits: res[1],
                militaryDistricts: res[2],
            })
        } catch (e) {
            console.log(e);
        }
    }

    const dataInput = useMemo(
        () => [
            {
                title: "Tên",
                content: detail?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Hãy nhập thông tin cho trường tên tỉnh` },
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
                title: "Vùng",
                content: detail?.region_id || null,
                dataIndex: "region_id",
            },
            {
                title: "Đơn vị hành chính",
                content: detail?.admin_unit_id || null,
                dataIndex: "admin_unit_id",
            },
            {
                title: "Quân khu",
                content: detail?.military_distric_id || null,
                dataIndex: "military_distric_id",
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
        ], [detail]
    )
    const getDataSelect = (dataIndex: string) => {
        if (["military_distric_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.militaryDistricts,
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
        if (["region_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.regions,
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
                <ModalCategoryActionHeader name="tỉnh" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
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
                                    selectField={{
                                        isSelect:
                                            value?.dataIndex === "region_id" ||
                                            value?.dataIndex === "military_distric_id" ||
                                            value?.dataIndex === "admin_unit_id",
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

