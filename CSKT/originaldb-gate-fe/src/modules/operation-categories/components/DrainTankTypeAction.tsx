import { MergeFilled } from "@ant-design/icons";
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Button, Flex, Form, Input, InputNumber, Popconfirm, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { BUTTON_LABEL, MESSAGE_CONTENT, TITLE_MODAL_TYPE } from "@app/constants/common.constant";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OPERATION_CATEGORIES_PAGE_LABEL } from "../constants/OperationCategories.constant";
import { DrainTankTypeMaxLength } from "../enums/DrainTankType.enum";
import { DrainTankTypeData } from "../types/DrainTankType.types";
import { createDrainTankType, getDrainTankTypeDetail, removeDrainTankType, updateDrainTankType } from "../store/DrainTankType.action";
const { TextArea } = Input;

type DrainTankTypeActionType = {
  modalType: Action;
  detailRecord?: DrainTankTypeData;
  idRecord?: string;
  //methods
  closeModal: (flag?: boolean) => void;
};

const validateMessages = {
  required: "Vui lòng không bỏ trống trường này",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const DrainTankTypeAction: React.FC<DrainTankTypeActionType> = ({
  modalType,
  idRecord,
  closeModal,
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const [actionType, setActionType] = useState<Action>(modalType)

  const submitForm = useCallback(async () => {
    try {
      actionType === Action.Create ? await createDrainTankType(form?.getFieldsValue()) : await updateDrainTankType(idRecord,form?.getFieldsValue());
      openMessage({
        type: "success",
        content: `${actionType === Action.Create ? "Thêm mới" : "Chỉnh sửa"} ${OPERATION_CATEGORIES_PAGE_LABEL.DrainTankType} thành công`
      })
      closeModal(true);
    } catch (error: any) {
      openMessage({
        type: "error",
        content: error?.message || "Lỗi hệ thống",
      });
    }
  }, [actionType])

  const variantInput = useMemo(() => {
    return  actionType === Action.View ? "borderless" : "outlined";
  }, [actionType]);

  const deleteHandler = useCallback(
    async () => {
      try {
        await removeDrainTankType(idRecord);
        openMessage({
          type: "success",
          content: `Xóa ${OPERATION_CATEGORIES_PAGE_LABEL.DrainTankType} thành công`
        })
        closeModal(true);
      } catch (error:any) {
        openMessage({
          type: "error",
          content: error?.message || "Lỗi hệ thống",
        });
      }
    },
    [idRecord]
  );

  const getDetail = useCallback(
    async () => {
      try {
        const response:DrainTankTypeData = await getDrainTankTypeDetail(idRecord, {});
        form.setFieldsValue(response)
      } catch (error:any) {
        openMessage({
          type: "error",
          content: error?.message || "Lỗi hệ thống"
        })
      }
    },
    [idRecord]
  )

  useEffect(() => {
    setActionType(modalType);
  }, [modalType])

  useEffect(() => {
    if (modalType !== Action.Create) {
      getDetail();
    }
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
        <p className="modal-title">
          {`${
            TITLE_MODAL_TYPE?.find((i) => i?.key === actionType)?.title
          } ${OPERATION_CATEGORIES_PAGE_LABEL.DrainTankType}`}
        </p>
        {actionType === Action.View ? (
          <Button
            htmlType="submit"
            type="primary"
            onClick={() => {
              setActionType(Action.Update);
            }}
          >
            Sửa thông tin
          </Button>
        ) : (
          <Flex
            gap={10}
          >
            {
              actionType === Action.Update && (
                <Popconfirm
                  title={MESSAGE_CONTENT.DELETE}
                  onConfirm={deleteHandler}
                  okText={BUTTON_LABEL.CORRECT}
                  cancelText={BUTTON_LABEL.NO}
                >
                  <Button
                    htmlType="button"
                    className="text-red border-red"
                  >
                    Xóa tất cả
                  </Button>
                </Popconfirm>
                
              )
            }
            <Button
              htmlType="submit"
              type="primary"
              onClick={form.submit}
            >
              Lưu thông tin
            </Button>
          </Flex>
        )}
      </Flex>
      <Form
        form={form}
        preserve={false}
        className="bg-secondary p-3 rounded-primary mt-10"
        validateMessages={validateMessages}
        onFinish={submitForm}
        disabled={actionType === Action.View}
        autoComplete="off"
        variant={variantInput}
      >
        <Flex
          gap={16}
          className="p-3 bg-tertiary rounded-[inherit]"
          align="center"
        >
          <div className="w-8 center rounded-full bg-white aspect-square">
            <MergeFilled className="text-lg" />
          </div>
          <span className="font-bold">Danh mục {OPERATION_CATEGORIES_PAGE_LABEL.DrainTankType}</span>
        </Flex>
        <Form.Item<DrainTankTypeData>
          label="Tên loại cống bể"
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: DrainTankTypeMaxLength.Name }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<DrainTankTypeData>
          label="Mô tả"
          name="desc"
          labelCol={{ span: 24 }}
          rules={[{ max: DrainTankTypeMaxLength.Desc }]}
        >
          <TextArea/>
        </Form.Item>
        <Form.Item<DrainTankTypeData>
          label="Số thứ tự"
          name="order_number"
          labelCol={{ span: 24 }}
        >
          <InputNumber
            className="w-full"
            controls={false}
          />
        </Form.Item>
      </Form>
    </Space>
  );
};

export default DrainTankTypeAction;
