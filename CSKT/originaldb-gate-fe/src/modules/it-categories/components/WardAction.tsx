import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Skeleton, Space } from "antd";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useMessage } from "@app/contexts/MessageContext";
import { Ward } from "../types/Ward.type";
import { updateWard, createWard, removeWard, getWardDetail } from "../store/Ward.action";
import { getAdministrativeUnit } from "../store/AdministrativeUnit.action";
import { getDistrict } from "../store/District.action";
import ItemComponent from "../../../components/ItemsComponent";
import { selectMap } from "@app/core/helper";
import { IWardActionSelect } from "../interfaces/Ward.interface";
type Props = {
    id?: string,
    action: Action
}

export default function WardAction({ id, action }: Props) {
    const [form] = Form.useForm();
    const loading = useLoading();
    const modal = useModal();
    const { openMessage } = useMessage();

    const [detail, setDetail] = useState<Ward>();
    const [dataSelection, setDataSelection] = useState<IWardActionSelect>({
        adminUnits: [],
        districts: [],
    });
    const [isLoading, setIsIoading] = useState<boolean>(false);
    const onFinish = async () => {
        try {
            loading.show()
            const value: any = form.getFieldsValue();
            const district_id = value?.district_id?.value ? value?.district_id?.value : value?.district_id;
            const admin_unit_id = value?.admin_unit_id?.value ? value?.admin_unit_id?.value : value?.admin_unit_id;
            const zone_id = value?.zone_id?.value ? value?.zone_id?.value : value?.zone_id;
            switch (action) {
                case Action.Update:
                    await updateWard(detail?.id, { ...value, district_id, admin_unit_id, zone_id });
                    openMessage({
                        type: "success",
                        content: `Cập nhật thành công`
                    })
                    break;
                case Action.Create:
                    await createWard(value);
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
            await removeWard(detail?.id);
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

    const dataInput = useMemo(
        () => [
            {
                title: "Xã/phường/thị trấn",
                content: detail?.name || null,
                require: true,
                dataIndex: "name",
                rules: [
                    { required: true, message: `Hãy nhập thông tin cho trường tên xã` },
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
                title: "Huyện",
                content: detail?.district_id || null,
                dataIndex: "district_id",
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
            }
        ], [detail]
    )

    const getDetail = async () => {
        try {
            setIsIoading(true)
            const res = await getWardDetail(id, {});
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
                getDistrict({ limit: -1 }, {}),
            ]);
            setDataSelection({
                adminUnits: res[0],
                districts: res[1],
            })
        } catch (e) {
            console.log(e);
        }
    }
    const getDataSelect = (dataIndex: string) => {
        if (["district_id"].includes(dataIndex)) {
            return selectMap(
                dataSelection?.districts,
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
                <ModalCategoryActionHeader name="xã" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
            </Flex>
            {isLoading ? <><Skeleton /></> : <Form
                form={form}
                className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
                onFinish={onFinish}
                requiredMark={false}
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
                                            value?.dataIndex === "district_id" ||
                                            value?.dataIndex === "zone_id" ||
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

