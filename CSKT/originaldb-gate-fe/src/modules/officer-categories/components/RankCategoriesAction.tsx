import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useMemo } from "react";
import { RankCategoriesData } from "../types/RankCategories.types";
import { createRank, removeRank, updateRank } from "../store/RankCategories.action";
import { TABLE_FIELD_NAME } from "@app/constants/table.constant";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";

type RankCategoriesActionType = {
  action: Action;
  detail?: RankCategoriesData;
};

const RankCategoriesAction: React.FC<RankCategoriesActionType> = ({
  action,
  detail,
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();

  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          await updateRank(detail?.id, value);
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createRank(value);
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
      await removeRank(detail?.id);
      openMessage({
        type: "success",
        content: `Xóa cấp bậc thành công`
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
        title: 'Tên cấp bậc',
        content: detail?.name ?? null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: 'Tên tắt cấp bậc',
        content: detail?.short_name ?? null,
        dataIndex: "short_name"
      },
      {
        title: "Mã cấp bậc",
        content: detail?.code ?? null,
        dataIndex: "code"
      },
      {
        title: "Mã quốc gia mở rộng CSDL Quốc gia",
        content: detail?.code_ex ?? null,
        dataIndex: "code_ex"
      },
      {
        title: "Mã định danh mở rộng CSDL Quốc gia",
        content: detail?.id_ex ?? null,
        dataIndex: "id_ex"
      },
      {
        title: TABLE_FIELD_NAME.ORDER_NUMBER,
        content: detail?.order_number ?? null,
        dataIndex: "order_number"
      },
      {
        title: 'Trạng thái',
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
        <ModalCategoryActionHeader name="cấp bậc" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
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

export default RankCategoriesAction;
