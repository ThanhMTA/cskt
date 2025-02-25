import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { CableBoxesData } from "../types/CableBoxes.types";
import { ICableBoxesSelect } from "../interfaces/CableBoxes.interface";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { getOpticalFiberLinesList } from "../store/OpticalFiberLines.action";
import { createCableBoxes, removeCableBoxes, updateCableBoxes } from "../store/CableBoxes.action";
import { useModal } from "@app/contexts/ModalContext";
import { useLoading } from "@app/contexts/LoadingContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";

type CableBoxesActionType = {
  action: Action;
  detail?: CableBoxesData;
};

const CableBoxesAction: React.FC<CableBoxesActionType> = ({
  action,
  detail,
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [dataSelection, setDataSelection] = useState<ICableBoxesSelect>({
    wards: [],
    opticalFiberLines: [],
  });

  const dataInput = useMemo(
    () => [
      {
        title: "Tên hộp, tủ cáp",
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: "Vị trí lắp đặt",
        content: detail?.address || null,
        dataIndex: "address",
      },
      {
        title: "Địa bàn",
        content: detail?.ward_id || null,
        dataIndex: "ward_id",
      },
      {
        title: "Thuộc tuyến cáp",
        content: detail?.fiber_line_id || null,
        dataIndex: "fiber_line_id",
      },
      {
        title: "Mô tả chi tiết bổ sung",
        content: detail?.desc || null,
        dataIndex: "desc",
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
        await getWard({}, {}),
        await getOpticalFiberLinesList({}, {})
      ]);
      setDataSelection({
        wards: response[0],
        opticalFiberLines: response[1]
      });
    } catch (error) {
      // 
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
      let ward_id = null;
      const value: any = form.getFieldsValue();

      switch (action) {
        case Action.Update:
          const fiber_line_id = value?.fiber_line_id?.value ? value?.fiber_line_id?.value : value?.fiber_line_id;
          ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
          await updateCableBoxes(detail?.id, { ...value, fiber_line_id, ward_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
          await createCableBoxes({ ...value, ward_id });
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
  const getDataSelect = (dataIndex: string) => {
    if (["fiber_line_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.opticalFiberLines,
        "name",
        "id"
      );
    }
  };
  const handleDelete = async () => {
    try {
      await removeCableBoxes(detail?.id);
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
        <ModalCategoryActionHeader name="hộp cáp, tủ cáp" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      <Form
        form={form}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
        onFinish={onFinish}
        disabled={action === Action.View}
      >
        {/* <Form.Item<CableBoxesData>
          label="Tên hộp, tủ cáp"
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: CableBoxesMaxLength.Name }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<CableBoxesData>
          label="Vị trí lắp đặt"
          name="address"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: CableBoxesMaxLength.Name }
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<CableBoxesData>
          label="Địa bàn"
          name="ward_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSelection?.wards,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<CableBoxesData>
          label="Thuộc tuyến cáp"
          name="fiber_line_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSelection?.opticalFiberLines,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<CableBoxesData>
          label="Mô tả chi tiết bổ sung"
          name="desc"
          labelCol={{ span: 24 }}
          rules={[
            { max: CableBoxesMaxLength.Desc }
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<CableBoxesData>
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
                  dataIndex={value.dataIndex}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "fiber_line_id",
                    dataSelect: getDataSelect(value?.dataIndex),
                  }}
                  addressField={value?.dataIndex === "ward_id"}
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

export default CableBoxesAction;
