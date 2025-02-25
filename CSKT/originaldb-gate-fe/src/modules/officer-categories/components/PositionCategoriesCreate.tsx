import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { PositionCategoriesData } from "../types/PositionCategories.types";
import { createPosition, removePosition, updatePosition } from "../store/PositionCategories.action";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useMemo } from "react";
import { POSITION_CATEGORIES_FIELD_NAME } from "../constants/PositionCategories.constant";
import { TABLE_FIELD_NAME } from "@app/constants/table.constant";
import ItemComponent from "@app/components/ItemsComponent";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";

type PositionCategoriesCreateType = {
  action: Action;
  detail?: PositionCategoriesData;
};

const PositionCategoriesCreate: React.FC<PositionCategoriesCreateType> = ({
  action,
  detail,
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();

  const handleDelete = async () => {
    try {
      await removePosition(detail?.id);
      openMessage({
        type: "success",
        content: `Xóa chức vụ thành công`
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
  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          await updatePosition(detail?.id, value);
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createPosition(value);
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
        title: POSITION_CATEGORIES_FIELD_NAME.NAME,
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: POSITION_CATEGORIES_FIELD_NAME.SHORT_NAME,
        content: detail?.short_name || null,
        dataIndex: "short_name"
      },
      {
        title: POSITION_CATEGORIES_FIELD_NAME.CODE,
        content: detail?.code || null,
        dataIndex: "code"
      },
      {
        title: POSITION_CATEGORIES_FIELD_NAME.CODE_EX,
        content: detail?.code_ex || null,
        dataIndex: "code_ex"
      },
      {
        title: POSITION_CATEGORIES_FIELD_NAME.ID_EX,
        content: detail?.id_ex || null,
        dataIndex: "id_ex"
      },
      {
        title: TABLE_FIELD_NAME.ORDER_NUMBER,
        content: detail?.order_number || null,
        dataIndex: "order_number"
      },
      {
        title: POSITION_CATEGORIES_FIELD_NAME.IS_ENABLE,
        content: (detail?.is_enable === undefined ? true : detail?.is_enable),

        dataIndex: "is_enable"
      },
    ], [detail]
  )


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
        <ModalCategoryActionHeader name="chức vụ" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      <Form
        form={form}
        preserve={false}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
        onFinish={onFinish}
        disabled={action === Action.View}
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

export default PositionCategoriesCreate;
