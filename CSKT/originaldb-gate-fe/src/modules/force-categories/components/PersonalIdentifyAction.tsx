import { MergeFilled } from "@ant-design/icons";
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Space,
} from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action, FormatDate } from "@app/enums";
import {
  BUTTON_LABEL,
  MESSAGE_CONTENT,
  TITLE_MODAL_TYPE,
} from "@app/constants/common.constant";
import { useCallback, useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { FORCE_PAGE_LABEL } from "../constants/ForceCategories.constant";
import { PersonalIdentifyData } from "../types/PersonalIdentify.types";
import { PersonalIdentifyMaxLength } from "../enums/PersonalIdentify.enum";
import TextArea from "antd/es/input/TextArea";
import { PERSONAL_IDENTIFY_TYPE_OPTIONS } from "../constants/PersonalIdentify.constant";
import { IPersonalIdentifySelection } from "../interfaces/PersonalIdentify.interface";
import { getOrganizationsList } from "../store/Organizations.action";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { getRankList } from "@app/modules/officer-categories/store/RankCategories.action";
import { getPositionList } from "@app/modules/officer-categories/store/PositionCategories.action";
import { createPersonalIdentify, getPersonalIdentifyDetail, removePersonalIdentify, updatePersonalIdentify } from "../store/PersonalIdentify.action";
import IsEnabled from "@app/components/IsEnabled";

type PersonalIdentifyActionType = {
  modalType: Action;
  detailRecord?: PersonalIdentifyData;
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

const PersonalIdentifyAction: React.FC<PersonalIdentifyActionType> = ({
  modalType,
  idRecord,
  closeModal,
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const [actionType, setActionType] = useState<Action>(modalType);
  const LABEL_PAGE = FORCE_PAGE_LABEL.PERSONAL_IDENTIFY;
  const [dataSelection, setDataSelection] = useState<IPersonalIdentifySelection>({
    organizations: [],
    wards: [],
    ranks: [],
    positions: [],
  });

  // FUNCTIONS
  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        await getOrganizationsList({}, {}),
        await getWard({}, {}),
        await getRankList({}, {}),
        await getPositionList({}, {}),
      ]);
      setDataSelection({
        organizations: response[0],
        wards: response[1],
        ranks: response[2],
        positions: response[3],
      });
    } catch (error) {
      //
    }
  };

  const submitForm = useCallback(async () => {
    try {
      actionType === Action.Create
        ? await createPersonalIdentify(form?.getFieldsValue())
        : await updatePersonalIdentify(idRecord, form?.getFieldsValue());
      openMessage({
        type: "success",
        content: `${
          actionType === Action.Create ? "Thêm mới" : "Chỉnh sửa"
        } ${LABEL_PAGE} thành công`,
      });
      closeModal(true);
    } catch (error: any) {
      openMessage({
        type: "error",
        content: error?.message || "Lỗi hệ thống",
      });
    }
  }, [actionType]);

  const variantInput = useMemo(() => {
    return actionType === Action.View ? "borderless" : "outlined";
  }, [actionType]);

  const deleteHandler = useCallback(async () => {
    try {
      await removePersonalIdentify(idRecord);
      openMessage({
        type: "success",
        content: `Xóa ${LABEL_PAGE} thành công`,
      });
      closeModal(true);
    } catch (error: any) {
      openMessage({
        type: "error",
        content: error?.message || "Lỗi hệ thống",
      });
    }
  }, [idRecord]);

  const getDetail = useCallback(async () => {
    try {
      const response: PersonalIdentifyData = await getPersonalIdentifyDetail(
        idRecord,
        {},
      );
      form.setFieldsValue(response);
    } catch (error: any) {
      openMessage({
        type: "error",
        content: error?.message || "Lỗi hệ thống",
      });
    }
  }, [idRecord]);

  useEffect(() => {
    setActionType(modalType);
  }, [modalType]);

  useEffect(() => {
    fetchData();
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
          } ${LABEL_PAGE}`}
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
          <Flex gap={10}>
            {actionType === Action.Update && (
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
            )}
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
        initialValues={{
          is_enable: true,
          gender: true
        }}
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
          <span className="font-bold">Danh mục {LABEL_PAGE}</span>
        </Flex>
        <Form.Item<PersonalIdentifyData>
          label="Tên cấp quyết định"
          name="name"
          labelCol={{ span: 24 }}
          rules={[{ required: true }, { max: PersonalIdentifyMaxLength.Name }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Tên viết tắt"
          name="short_name"
          labelCol={{ span: 24 }}
          rules={[{ max: PersonalIdentifyMaxLength.ShortName }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Mã định danh con người"
          name="e_qn"
          labelCol={{ span: 24 }}
          rules={[{ max: PersonalIdentifyMaxLength.EQN }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Mã định danh công dân"
          name="cccd"
          labelCol={{ span: 24 }}
          rules={[{ max: PersonalIdentifyMaxLength.CCCD }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Số hiệu quân nhân"
          name="military_code"
          labelCol={{ span: 24 }}
          rules={[{ max: PersonalIdentifyMaxLength.MilitaryCode }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Giới tính"
          name="gender"
          labelCol={{ span: 24 }}
          labelAlign="left"
          rules={[{ required: true }]}
        >
          {
            actionType === Action.View ? (
              <IsEnabled is_enable={form.getFieldValue('gender')} />
            ) : (
              <Radio.Group>
                <Radio value={true}>Nam</Radio>
                <Radio value={false}>Nữ</Radio>
              </Radio.Group>
            )
          }
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Ngày sinh"
          name="birthday"
          labelCol={{ span: 24 }}
          labelAlign="left"
          valuePropName="checked"
          rules={[{ required: true }]}
        >
          <DatePicker
            className="w-full"
            placeholder="Chọn ngày sinh"
            format={FormatDate.DayJSStandard}
          />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Địa chỉ"
          name="address"
          labelCol={{ span: 24 }}
          rules={[
            { max: PersonalIdentifyMaxLength.Address },
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Loại"
          name="type"
          labelCol={{ span: 24 }}
        >
          <Select options={PERSONAL_IDENTIFY_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Phường/xã"
          name="ward_id"
          labelCol={{ span: 24 }}
        >
          <Select options={selectMap(dataSelection?.wards, "name", "id")} />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Cấp bậc"
          name="rank_id"
          labelCol={{ span: 24 }}
        >
          <Select options={selectMap(dataSelection?.ranks, "name", "id")} />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Chức vụ"
          name="position_id"
          labelCol={{ span: 24 }}
        >
          <Select options={selectMap(dataSelection?.positions, "name", "id")} />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Đơn vị"
          name="org_id"
          labelCol={{ span: 24 }}
        >
          <Select options={selectMap(dataSelection?.organizations, "name", "id")} />
        </Form.Item>
        <Form.Item<PersonalIdentifyData>
          label="Trạng thái"
          name="is_enable"
          labelCol={{ span: 24 }}
          labelAlign="left"
          rules={[{ required: true }]}
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
        <Form.Item<PersonalIdentifyData>
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

export default PersonalIdentifyAction;
