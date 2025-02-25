import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useMemo } from "react";
import { PoleTypeData } from "../types/PoleType.types";
import { createPoleType, removePoleType, updatePoleType } from "../store/PoleType.action";
import { useModal } from "@app/contexts/ModalContext";
import { useLoading } from "@app/contexts/LoadingContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";

type PoleTypeActionType = {
  action: Action;
  detail?: PoleTypeData;
};

const PoleTypeAction: React.FC<PoleTypeActionType> = ({
  action,
  detail,
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();

  const dataInput = useMemo(
    () => [
      {
        title: "Tên loại cột",
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: "Mô tả",
        content: detail?.desc || null,
        dataIndex: "desc",
      },
      {
        title: 'Số thứ tự',
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
  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          await updatePoleType(detail?.id, value);
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createPoleType(value);
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
  const handleDelete = async () => {
    try {
      await removePoleType(detail?.id);
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
        <ModalCategoryActionHeader name="loại cột" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      <Form
        form={form}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
        onFinish={onFinish}
        disabled={action === Action.View}
      >
        {/* <Form.Item<PoleTypeData>
          label="Tên loại cột"
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: DrainTankTypeMaxLength.Name }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<PoleTypeData>
          label="Mô tả"
          name="desc"
          labelCol={{ span: 24 }}
          rules={[{ max: DrainTankTypeMaxLength.Desc }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<PoleTypeData>
          label="Số thứ tự"
          name="order_number"
          labelCol={{ span: 24 }}
        >
          <InputNumber
            className="w-full"
            controls={false}
          />
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
                  dataIndex={value.dataIndex}
                  isNumberField={
                    value.dataIndex === "order_number"
                  }
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
    </Space>
  );
};

export default PoleTypeAction;
