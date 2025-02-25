import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { StationTypeData } from "../types/StationType.types";
import { createStationType, getStationTypeList, removeStationType, updateStationType } from "../store/StationType.action";
import { selectMap } from "@app/core/helper";
import { STATION_TYPE_FIELDS_NAME } from "../constants/StationType.constant";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";

type StationTypeActionType = {
  detail?: StationTypeData,
  action: Action,
  parent_id?: string;
};

const StationTypeAction: React.FC<StationTypeActionType> = ({
  detail, action, parent_id = null
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [dataSourceStationType, setDataSourceStationType] = useState<StationTypeData[]>([]);


  // FUNCTIONS
  const getStationType = async () => {
    try {
      const response: any = await getStationTypeList({}, {})
      setDataSourceStationType(response);
    } catch (error) {
      // 
    }
  }


  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      const parent_id = value?.parent_id?.value ? value?.parent_id?.value : value?.parent_id;
      switch (action) {
        case Action.Update:
          await updateStationType(detail?.id, { ...value, parent_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createStationType(value);
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
      await removeStationType(detail?.id);
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
      form.submit();
    }
  }
  const handleSuccess = () => {
    loading.hide()
    modal.closeModal({ success: true })
  }

  useEffect(() => {
    getStationType();
  }, []);
  const dataInput = useMemo(
    () => [
      {
        title: STATION_TYPE_FIELDS_NAME.NAME,
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Hãy nhập thông tin cho trường tên quốc gia` },
        ],
      },
      {
        title: STATION_TYPE_FIELDS_NAME.PARENT_ID,
        content: parent_id ? parent_id : (detail?.parent || null),
        dataIndex: "parent_id",
      },
      {
        title: STATION_TYPE_FIELDS_NAME.IS_ENABLE,
        content: (detail?.is_enable === undefined ? true : detail?.is_enable),

        dataIndex: "is_enable",
      },
      {
        title: "Số thứ tự",
        content: detail?.order_number || null,
        dataIndex: "order_number",
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
        <ModalCategoryActionHeader name="quốc gia" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      <Form
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
                  disable={(parent_id && value?.dataIndex === "parent_id") ? true : false}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "parent_id",
                    dataSelect: detail ? selectMap(
                      dataSourceStationType,
                      "name",
                      "id"
                    ).filter(item => item.value !== detail?.id) : selectMap(
                      dataSourceStationType,
                      "name",
                      "id"
                    ),
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

export default StationTypeAction;
