import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { OPERATION_CATEGORIES_PAGE_LABEL } from "../constants/OperationCategories.constant";
import { selectMap } from "@app/core/helper";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { PolesData } from "../types/Poles.types";
import { IPolesSelect } from "../interfaces/Poles.interface";
import { getPoleTypeList } from "../store/PoleType.action";
import { createPoles, removePoles, updatePoles } from "../store/Poles.action";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";

type PolesTypeActionType = {
  detail?: PolesData,
  action: Action
};

const PolesAction: React.FC<PolesTypeActionType> = ({
  detail,
  action
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [dataSelection, setDataSelection] = useState<IPolesSelect>({
    organizations: [],
    poleType: []
  });

  const dataInput = useMemo(
    () => [
      {
        title: "Tên cột",
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Hãy nhập thông tin cho trường tên quốc gia` },
        ],
      },
      {
        title: "Vị trí đặt cột",
        content: detail?.address || null,
        dataIndex: "address",
      },
      {
        title: "Độ cao",
        content: detail?.height || null,
        dataIndex: "height",
      },
      {
        title: "Đơn vị quản lý",
        content: detail?.org_id || null,
        dataIndex: "org_id",
      },
      {
        title: "Loại cột",
        content: detail?.type_id || null,
        dataIndex: "type_id",
      },
      {
        title: "Mô tả",
        content: detail?.desc || null,
        dataIndex: "desc",
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

  // FUNCTIONS
  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        await getOrganizationsList({}, {}),
        await getPoleTypeList({}, {}),
      ]);
      setDataSelection({
        organizations: response[0],
        poleType: response[1]
      });
    } catch (error) {
      // 
    }
  }

  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          const org_id = value?.org_id?.value ? value?.org_id?.value : value?.org_id;
          const type_id = value?.type_id?.value ? value?.type_id?.value : value?.type_id;
          await updatePoles(detail?.id, { ...value, org_id, type_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createPoles(value);
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
      await removePoles(detail?.id);
      openMessage({
        type: "success",
        content: `Xóa thành công`
      })
      handleSuccess();
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
      onFinish();
      return;
      // const value: EngineRoom = form.getFieldsValue();
      // console.log('asdsad: ', value)
      // form.submit();
    }
  }
  const handleSuccess = () => {
    loading.hide()
    modal.closeModal({ success: true })
  }
  const getDataSelect = (dataIndex: string) => {
    if (["org_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.organizations,
        "name",
        "id"
      );
    }
    if (["type_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.poleType,
        "name",
        "id"
      );
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

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
        <ModalCategoryActionHeader name="cột" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      <Form
        form={form}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
        onFinish={onFinish}
        requiredMark={false}
      >
        {/* <Form.Item<PolesData>
          label="Tên cột"
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: DrainTanksMaxLength.Name }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<PolesData>
          label="Vị trí đặt cột"
          name="address"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: DrainTanksMaxLength.Address }
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<PolesData>
          label="Độ cao"
          name="height"
          labelCol={{ span: 24 }}
        >
          <InputNumber
            className="w-full"
            controls={false}
          />
        </Form.Item>
        <Form.Item<PolesData>
          label="Đơn vị quản lý"
          name="org_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSelection?.organizations,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<PolesData>
          label="Loại cột"
          name="type_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSelection?.poleType,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<PolesData>
          label="Mô tả"
          name="desc"
          labelCol={{ span: 24 }}
          rules={[
            { max: DrainTanksMaxLength.Desc }
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<PolesData>
          label="Trạng thái"
          name="is_enable"
          labelCol={{ span: 24 }}
          labelAlign="left"
          rules={[
            { required: true }
          ]}
        >
          {
            actionType === Action.View ? (
              <IsEnabled is_enable={form.getFieldValue('is_enable')} />
            ) : (
              <Radio.Group>
                <Radio value={true}>Hoạt động</Radio>
                <Radio value={false}>Không hoạt động</Radio>
              </Radio.Group>
            )
          }
        </Form.Item> */}
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
                  addressField={value?.dataIndex === "ward_id"}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "org_id" ||
                      value?.dataIndex === "type_id",
                    dataSelect: getDataSelect(value?.dataIndex),
                  }}
                  isRadioField={value?.dataIndex === "is_enable"}
                  isNumberField={value?.dataIndex === "order_number"}
                  dataIndex={value.dataIndex}
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
                  />
                </div>
              );
            })}
          </>
        )}
      </Form>
    </Space>
  );
};

export default PolesAction;
