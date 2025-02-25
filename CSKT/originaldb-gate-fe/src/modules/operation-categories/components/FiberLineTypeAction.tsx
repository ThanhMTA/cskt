import { MergeFilled } from "@ant-design/icons";
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Button, Flex, Form, Input, InputNumber, Popconfirm, Radio, Select, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { BUTTON_LABEL, MESSAGE_CONTENT, TITLE_MODAL_TYPE } from "@app/constants/common.constant";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OPERATION_CATEGORIES_PAGE_LABEL } from "../constants/OperationCategories.constant";
import { StationTypeMaxLength } from "../enums/StationType.enum";
import { selectMap } from "@app/core/helper";
import { FiberLineTypeData } from "../types/FiberLineType.types";
import { createFiberLineType, getFiberLineTypeDetail, getFiberLineTypeList, removeFiberLineType, updateFiberLineType } from "../store/FiberLineType.action";
import IsEnabled from "@app/components/IsEnabled";

type FiberLineTypeActionType = {
  modalType: Action;
  detailRecord?: FiberLineTypeData;
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

const FiberLineTypeAction: React.FC<FiberLineTypeActionType> = ({
  modalType,
  idRecord,
  closeModal,
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const [actionType, setActionType] = useState<Action>(modalType)
  const [dataSource, setDataSource] = useState<FiberLineTypeData[]>([]);


  // FUNCTIONS
  const getStationType = async () => {
    try {
      const response:any = await getFiberLineTypeList({}, {})
      setDataSource(response);
    } catch (error) {
      // 
    }
  }

  const submitForm = useCallback(async () => {
    try {
      actionType === Action.Create ? await createFiberLineType(form?.getFieldsValue()) : await updateFiberLineType(idRecord,form?.getFieldsValue());
      openMessage({
        type: "success",
        content: `${actionType === Action.Create ? "Thêm mới" : "Chỉnh sửa"} ${OPERATION_CATEGORIES_PAGE_LABEL.FiberLineType} thành công`
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
        await removeFiberLineType(idRecord);
        openMessage({
          type: "success",
          content: `Xóa ${OPERATION_CATEGORIES_PAGE_LABEL.FiberLineType} thành công`
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
        const response:FiberLineTypeData = await getFiberLineTypeDetail(idRecord, {});
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
    getStationType();
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
          } ${OPERATION_CATEGORIES_PAGE_LABEL.FiberLineType}`}
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
          <span className="font-bold">Danh mục {OPERATION_CATEGORIES_PAGE_LABEL.FiberLineType}</span>
        </Flex>
        <Form.Item<FiberLineTypeData>
          label="Tên loại tuyến cáp"
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: StationTypeMaxLength.Name }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<FiberLineTypeData>
          label="Mã loại tuyến cáp trực thuộc"
          name="parent_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSource,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<FiberLineTypeData>
          label="Trạng thái"
          name="is_enable"
          labelCol={{ span: 24 }}
          labelAlign="left"
          rules={[
            {required: true}
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
        </Form.Item>
        <Form.Item<FiberLineTypeData>
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

export default FiberLineTypeAction;
