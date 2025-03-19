import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
// import { Flex, Form, Space, Tooltip, Popconfirm, Button } from "antd";
import { Button, DatePicker, Divider, Flex, Form, Input, Popconfirm, Radio, Select, Space, Tooltip, TreeSelect } from "antd";
import { FailureData } from "../types/Failure.type";
import { createFailure, updateFailure, removeFailure } from "../stores/Failure.action";
import { getTTBDetail } from "../stores/QLTTB.action"
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
// import { useMemo, ReactNode,} from "react";
import { ReactNode, useEffect, useState } from "react";
import { TTBData } from "../types/TTB.type";
import { TABLE_FIELD_NAME } from "@app/constants/table.constant";
import ItemComponent from "@app/components/ItemsComponent";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

type FailureCreateType = {
  action: Action;
  detail?: FailureData;
  TTB: TTBData;
};

const FailureCreate: React.FC<FailureCreateType> = ({
  action,
  detail,
  TTB
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();
  const [datasource, setDatasource] = useState<TTBData[]>([])
  const [filter, setFilter] = useState<any>({});

  const handleDelete = async () => {
    try {
      await removeFailure(detail?.id);
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
          await updateFailure(detail?.id, value);
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createFailure(value);
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
        {action === Action.Create ? (
          <div className="text-[22px] font-bold">{`Thông tin Trang thiết bị`}</div>
        ) : (
          <div className="text-[22px] font-bold">{`Thông tin trang thiết bị ${detail?.name}`}</div>
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
        {/* <ModalCategoryActionHeader name="chức vụ" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} /> */}
      </Flex>
      <Divider className="m-0" />
      <Form
        form={form}
        onFinish={onFinish}
        layout='horizontal'
        labelCol={{ span: 9 }}
        labelAlign="left"
        className="form-item rounded px-6 py-2"
        requiredMark={(label: ReactNode, info: { required: boolean }) => {
          return (
            <>
              {label} {info?.required ? <span className="text-red"> &nbsp;*</span> : ""}
            </>
          );
        }}
        disabled={action === Action.View}
      >
        {/* <Form.Item
          className="mb-4"
          name={"TTB_id"}
          label={
            <div className="flex text-[15px] justify-items-start gap-x-1">
             Trang bị
            </div>
            
          }
          initialValue={TTB?.id}
          // rules={[{ required: true, message: "Họ và tên không được để trống" }]}
        >
          {action === Action.Create || Action.Update ? (
            <Input 
            // placeholder="Nhập họ và tên" 
            // title={TTB.name}
            className="border-0" 
            style={{ resize: "none" }} 
             readOnly 
            //  value={TTB?.id || ""}
              defaultValue={TTB.name}
             />
          ) : (
            <p className="px-[12px] text-[15px]">
              {form.getFieldValue("TTB_id") || ""}
            </p>
          )}
        </Form.Item> */}
        <Form.Item name="TTB_id" initialValue={TTB?.id} hidden>
          <Input />
        </Form.Item>

        {/* Hiển thị tên trang bị */}
        <Form.Item
          className="mb-4"
          label={
            <div className="flex text-[15px] justify-items-start gap-x-1">
              Trang bị
            </div>
          }
        >
          <Input
            value={TTB?.name}
            readOnly
            className="border-0 bg-transparent"
            style={{ resize: "none" }}
          />
        </Form.Item>
        <Form.Item
          className="mb-4"
          name={"name"}
          label={
            <div className="flex text-[15px] justify-items-start gap-x-1">
              Tiêu đề
            </div>
          }

        >
          {action === Action.Create || Action.Update ? (
            <Input placeholder="Nhập tiêu đề" className="border-0 " style={{ resize: "none" }} />
          ) : (
            <p className="px-[12px] text-[15px]">
              {form.getFieldValue("name") || ""}
            </p>
          )}
        </Form.Item>


        <Form.Item
          className="mb-4"
          name={"condition"}
          label={
            <div className="flex text-[15px] justify-items-start gap-x-1">
              Tình trạng
            </div>
          }
        >
          {action === Action.Create || Action.Update ? (
            <Input placeholder="Nhập tình trạng" className="border-0" style={{ resize: "none" }} />

          ) : (
            <p className="px-[12px] text-[15px]">
              {form.getFieldValue("condition") || ""}
            </p>
          )}
        </Form.Item>
        <Form.Item
          className="mb-4"
          name={"content"}
          label={<div className="flex text-[15px] justify-items-start gap-x-1">Nội dung</div>}>
          {action === Action.Create || Action.Update ? (
            <Input.TextArea rows={4} placeholder="Nhập nội dung"  className="border-0" style={{ resize: "none" }} />

            //  <Input placeholder="Nhập nội dung" className="border-0" style={{ resize: "none" }} />

          ) : (
            <p className="px-[12px] text-[15px]">
              {form.getFieldValue("content") || ""}
            </p>
          )}
        </Form.Item>
        <Form.Item
          className="mb-4"
          name={"time"}
          label={
            <div className="flex text-[15px] justify-items-start gap-x-1">
              Thời gian
            </div>
          }
        >
          {action === Action.Create || Action.Update ? (
            <DatePicker
              size='middle'
              allowClear
              showTime
              className="flex border-0 w-full"
              placeholder="Chọn ngày xảy ra sự cố"
            />
          ) : (
            <p className="px-[12px] text-[15px]">
              {form.getFieldValue("time") || ""}
            </p>
          )}
        </Form.Item>

      </Form>

    </Space>
  );
};

export default FailureCreate;
