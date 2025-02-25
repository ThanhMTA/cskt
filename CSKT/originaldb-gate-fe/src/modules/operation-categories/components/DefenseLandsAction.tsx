import { MergeFilled } from "@ant-design/icons";
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Button, Flex, Form, Input, InputNumber, Popconfirm, Radio, Select, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { BUTTON_LABEL, MESSAGE_CONTENT, TITLE_MODAL_TYPE } from "@app/constants/common.constant";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DefenseLandsData } from "../types/DefenseLands.types";
import { createDefenseLands, getDefenseLandsDetail, removeDefenseLands, updateDefenseLands } from "../store/DefenseLands.action";
import { OPERATION_CATEGORIES_PAGE_LABEL } from "../constants/OperationCategories.constant";
import { DefenseLandsMaxLength } from "../enums/DefenseLands.enum";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { IDefenseLandsSelect } from "../interfaces/DefenseLands.interface";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { selectMap } from "@app/core/helper";
import { DEFENSE_LANDS_FIELDS_NAME } from "../constants/DefenseLands.constant";
import IsEnabled from "@app/components/IsEnabled";
const { TextArea } = Input;

type DefenseLandsActionType = {
  modalType: Action;
  detailRecord?: DefenseLandsData;
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

const DefenseLandsAction: React.FC<DefenseLandsActionType> = ({
  modalType,
  idRecord,
  closeModal,
}) => {
  // variables
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const [actionType, setActionType] = useState<Action>(modalType)
  const [dataSelection, setDataSelection] = useState<IDefenseLandsSelect>({
    organizations: [],
    wards: []
  });

  // functions
  const fetchData = async () => {
    const responses = await Promise.all([
      await getOrganizationsList({}, {}),
      await getWard({}, {}),
    ]);
    setDataSelection({
      organizations: responses[0],
      wards: responses[1]
    })
  }
  const submitForm = useCallback(async () => {
    try {
      actionType === Action.Create ? await createDefenseLands(form?.getFieldsValue()) : await updateDefenseLands(idRecord,form?.getFieldsValue());
      openMessage({
        type: "success",
        content: `${actionType === Action.Create ? "Thêm mới" : "Chỉnh sửa"} ${OPERATION_CATEGORIES_PAGE_LABEL.DefenseLands} thành công`
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
        await removeDefenseLands(idRecord);
        openMessage({
          type: "success",
          content: `Xóa ${OPERATION_CATEGORIES_PAGE_LABEL.DefenseLands} thành công`
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
        const response:DefenseLandsData = await getDefenseLandsDetail(idRecord, {});
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
    fetchData();
    if (modalType !== Action.Create) {
      getDetail();
    }
  }, []);

  // return
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
          } ${OPERATION_CATEGORIES_PAGE_LABEL.DefenseLands}`}
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
        initialValues={{is_enable: true}}
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
          <span className="font-bold">Danh mục {OPERATION_CATEGORIES_PAGE_LABEL.DefenseLands}</span>
        </Flex>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.NAME}
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: DefenseLandsMaxLength.Name }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.SHORT_NAME}
          name="short_name"
          labelCol={{ span: 24 }}
          rules={[{ max: DefenseLandsMaxLength.ShortName }]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label="Địa chỉ"
          name="address"
          labelCol={{ span: 24 }}
          rules={[{ max: DefenseLandsMaxLength.Address }]}
        >
          <TextArea/>
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.AREA}
          name="area"
          labelCol={{ span: 24 }}
        >
          <InputNumber
            className="w-full"
            controls={false}
          />
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.ALTITUDE}
          name="altitude"
          labelCol={{ span: 24 }}
        >
          <InputNumber className="w-full" controls={false}/>
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.ID_EX}
          name="id_ex"
          labelCol={{ span: 24 }}
          rules={[{max: DefenseLandsMaxLength.IdEx}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.CODE_EX}
          name="code_ex"
          labelCol={{ span: 24 }}
          rules={[{max: DefenseLandsMaxLength.CodeEx}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.MANAGE_ORG_ID}
          name="org_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={selectMap(
              dataSelection.organizations,
              "name",
              "id"
            )}
          />
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.WARD_ID}
          name="ward_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={selectMap(
              dataSelection.wards,
              "name",
              "id"
            )}
          />
        </Form.Item>
        <Form.Item<DefenseLandsData>
          label={DEFENSE_LANDS_FIELDS_NAME.IS_ENABLE}
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
        <Form.Item<DefenseLandsData>
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

export default DefenseLandsAction;
