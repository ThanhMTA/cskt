import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { OrganizationsData } from "../types/Organizations.types";
import {
  createOrganizations,
  getOrganizationCode,
  getOrganizationsDetail,
  removeOrganizations,
  updateOrganizations,
} from "../store/Organizations.action";
import { IOrganizationsDataSelection } from "../interfaces/Organizations.interface";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { getMilitaryDistrict } from "@app/modules/it-categories/store/MilitaryDistrict.action";
import { ORGANIZATIONS_FIELD_NAME } from "../constants/Organizations.constant";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";

type OrganizationsActionType = {
  action: Action;
  detail?: OrganizationsData;
  parent_id?: string;
};

const OrganizationsAction: React.FC<OrganizationsActionType> = ({
  action,
  detail,
  parent_id,
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [parentDetail, setParentDetail] = useState<OrganizationsData | null>(
    null
  );
  const [dataSelection, setDataSelection] =
    useState<IOrganizationsDataSelection>({
      organizations: [],
      militaryDistrict: [],
      wards: [],
    });

  const getOrgCode = async (orgId?: string) => {
    const res = await getOrganizationCode(orgId);
    form.setFieldValue("code", res || "");
    if (parent_id) {
      const response = await getOrganizationsDetail(parent_id, {});
      setParentDetail(response || null);
    }
  };

  const fetchData = async () => {
    const responses = await Promise.all([
      await getOrganizationTree({}),
      await getWard({}, {}),
      await getMilitaryDistrict({}, {}),
    ]);
    setDataSelection({
      organizations: arrayToTree([...responses[0]], { dataField: null }),
      wards: responses[1],
      militaryDistrict: responses[2],
    });
  };

  const onFinish = async () => {
    try {
      loading.show();
      let ward_id = null;
      const value: any = form.getFieldsValue();
      const parent_id = value?.parent_id?.value
        ? value?.parent_id?.value
        : value?.parent_id;
      const military_distric_id = value?.military_distric_id?.value
        ? value?.military_distric_id?.value
        : value?.military_distric_id;
      ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
      const tree_level =
        parentDetail?.tree_level && +parentDetail?.tree_level + 1;

      switch (action) {
        case Action.Update:
          await updateOrganizations(detail?.id, {
            ...value,
            military_distric_id,
            parent_id,
            ward_id,
          });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`,
          });
          break;
        case Action.Create:
          await createOrganizations({
            ...value,
            military_distric_id,
            parent_id,
            ward_id,
            tree_level,
          });
          openMessage({
            type: "success",
            content: `Thêm mới thành công`,
          });
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
      loading.hide();
    }
  };
  const hanldeFinish = () => {
    if (action === Action.View) {
      handleSuccess();
      return;
    } else {
      form.submit();
    }
  };

  const handleSuccess = () => {
    loading.hide();
    modal.closeModal({ success: true });
  };
  const handleDelete = async () => {
    try {
      if (detail?.children?.length > 0) {
        openMessage({
          type: "warning",
          content: "Đ/c không thể xóa khi đang tồn tại mã con!",
        });
      } else {
        await removeOrganizations(detail?.id);
        openMessage({
          type: "success",
          content: `Xóa thành công`,
        });
        // handleSuccess();
        loading.hide();
        modal.closeModal({});
      }
    } catch (error: any) {
      console.log(error);
      openMessage({
        type: "error",
        content: error?.message || "Lỗi hệ thống",
      });
    }
  };

  useEffect(() => {
    fetchData();
    if (action === Action.Create) {
      getOrgCode(parent_id ?? "");
    }
  }, []);

  const dataInput = useMemo(
    () => [
      {
        title: ORGANIZATIONS_FIELD_NAME.CODE,
        content: detail?.code ?? null,
        dataIndex: "code",
      },
      {
        title: ORGANIZATIONS_FIELD_NAME.PARENT_ID,
        content: detail?.parent ?? parent_id,
        dataIndex: "parent_id",
      },
      {
        title: ORGANIZATIONS_FIELD_NAME.NAME,
        content: detail?.name ?? null,
        require: true,
        dataIndex: "name",
        rules: [{ required: true, message: `Thông tin không được để trống!` }],
      },
      {
        title: ORGANIZATIONS_FIELD_NAME.SHORT_NAME,
        content: detail?.short_name ?? null,
        dataIndex: "short_name",
      },

      {
        title: ORGANIZATIONS_FIELD_NAME.WARD_ID,
        content: detail?.ward_id ?? null,
        dataIndex: "ward_id",
      },
      {
        title: ORGANIZATIONS_FIELD_NAME.MILITARY_DISTRIC_ID,
        content: detail?.military_district_id ?? null,
        dataIndex: "military_district_id",
      },
      {
        title: ORGANIZATIONS_FIELD_NAME.ATTRIBUTE,
        content: detail?.attribute ?? null,
        dataIndex: "attribute",
      },
      {
        title: "Số thứ tự",
        content: detail?.order_number || null,
        dataIndex: "order_number",
      },
      {
        title: "Trạng thái",
        content: detail?.is_enable === undefined ? true : detail?.is_enable,
        dataIndex: "is_enable",
      },
    ],
    [detail, parent_id]
  );
  const getDataSelect = (dataIndex: string) => {
    if (["military_district_id"].includes(dataIndex)) {
      return selectMap(dataSelection?.militaryDistrict, "name", "id");
    }
  };

  return (
    <Space {...SPACE_PROP_DEFAULT} className="flex" size={20}>
      <Flex
        align="center"
        justify="space-between"
        className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
      >
        <ModalCategoryActionHeader
          name="đơn vị"
          action={action}
          hanldeFinish={hanldeFinish}
          handleDelete={handleDelete}
        />
      </Flex>
      <Form
        form={form}
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
                  // disable={
                  //   (parent_id !== null &&
                  //     (value.dataIndex === "code" ||
                  //       value.dataIndex === "parent_id")) ||
                  //   (action === Action.Update && value.dataIndex === "code")
                  //     ? true
                  //     : false
                  // }
                  addressField={value?.dataIndex === "ward_id"}
                  treeField={{
                    isSelect: value?.dataIndex === "parent_id",
                    dataSelect: dataSelection.organizations,
                  }}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "military_district_id",
                    dataSelect: getDataSelect(value.dataIndex),
                  }}
                  isNumberField={value.dataIndex === "order_number"}
                  isRadioField={value?.dataIndex === "is_enable"}
                />
              );
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
                    isRadioField={value?.dataIndex === "is_enable"}
                  />
                </div>
              );
            })}
          </>
        )}
        {/* <Flex gap={20}>
          <Flex gap={20} vertical className="flex-1">
            <div className="bg-secondary rounded-primary p-3">
              <Form.Item<OrganizationsData>
                label={ORGANIZATIONS_FIELD_NAME.NAME}
                name="name"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true },
                  { max: OrganizationsMaxLength.Name }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item<OrganizationsData>
                label={ORGANIZATIONS_FIELD_NAME.SHORT_NAME}
                name="short_name"
                labelCol={{ span: 24 }}
                rules={[
                  { max: OrganizationsMaxLength.ShortName }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item<OrganizationsData>
                label={ORGANIZATIONS_FIELD_NAME.CODE}
                name="code"
                labelCol={{ span: 24 }}
                rules={[
                  { max: OrganizationsMaxLength.Name }
                ]}
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="bg-secondary rounded-primary p-3">
              <Form.Item<OrganizationsData>
                label={ORGANIZATIONS_FIELD_NAME.WARD_ID}
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
              <Form.Item<OrganizationsData>
                label={ORGANIZATIONS_FIELD_NAME.MILITARY_DISTRIC_ID}
                name="military_distric_id"
                labelCol={{ span: 24 }}
              >
                <Select
                  options={
                    selectMap(
                      dataSelection?.militaryDistrict,
                      "name",
                      "id"
                    )
                  }
                />
              </Form.Item>
              <Form.Item<OrganizationsData>
                label={ORGANIZATIONS_FIELD_NAME.ATTRIBUTE}
                name="attribute"
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
            </div>
          </Flex>
          <div className="bg-secondary rounded-primary p-3 flex-1">
            <Flex
              gap={16}
              className="p-3 bg-tertiary rounded-[inherit]"
              align="center"
            >
              <div className="w-8 center rounded-full bg-white aspect-square">
                <InfoCircleOutlined />
              </div>
              <span className="font-bold">Thông tin khác</span>
            </Flex>
            <Form.Item<OrganizationsData>
              label={ORGANIZATIONS_FIELD_NAME.IS_ENABLE}
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
            </Form.Item>
            <Form.Item<OrganizationsData>
              label={ORGANIZATIONS_FIELD_NAME.PARENT_ID}
              name="parent_id"
              labelCol={{ span: 24 }}
            >
              <Select
                disabled={!!detailRecord || actionType === Action.View}
                options={
                  selectMap(
                    dataSelection?.organizations,
                    "code",
                    "id"
                  )
                }
              />
            </Form.Item>
            <Form.Item<OrganizationsData>
              label={ORGANIZATIONS_FIELD_NAME.TREE_LEVEL}
              name="tree_level"
              labelCol={{ span: 24 }}
              rules={[
                { required: true }
              ]}
            >
              <InputNumber
                className="w-full"
                controls={false}
              />
            </Form.Item>
            <Form.Item<OrganizationsData>
              label={ORGANIZATIONS_FIELD_NAME.TREE_PATH}
              name="tree_path"
              labelCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
            <Form.Item<OrganizationsData>
              label="Số thứ tự"
              name="order_number"
              labelCol={{ span: 24 }}
            >
              <InputNumber
                className="w-full"
                controls={false}
              />
            </Form.Item>
          </div>
        </Flex> */}
        {/* <Flex
          gap={16}
          className="p-3 bg-tertiary rounded-[inherit]"
          align="center"
        >
          <div className="w-8 center rounded-full bg-white aspect-square">
            <MergeFilled className="text-lg" />
          </div>
          <span className="font-bold">Danh mục {FORCE_PAGE_LABEL.ORGANIZATIONS}</span>
        </Flex>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.NAME}
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: OrganizationsMaxLength.Name }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.SHORT_NAME}
          name="short_name"
          labelCol={{ span: 24 }}
          rules={[
            { max: OrganizationsMaxLength.ShortName }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.CODE}
          name="code"
          labelCol={{ span: 24 }}
          rules={[
            { max: OrganizationsMaxLength.Name }
          ]}
        >
          <Input disabled/>
        </Form.Item>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.WARD_ID}
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
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.MILITARY_DISTRIC_ID}
          name="military_distric_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSelection?.militaryDistrict,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.ATTRIBUTE}
          name="attribute"
          labelCol={{ span: 24 }}
        >
          <Input/>
        </Form.Item>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.IS_ENABLE}
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
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.PARENT_ID}
          name="parent_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSelection?.organizations,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.TREE_LEVEL}
          name="tree_level"
          labelCol={{ span: 24 }}
          rules={[
            {required: true}
          ]}
        >
          <InputNumber
            className="w-full"
            controls={false}
          />
        </Form.Item>
        <Form.Item<OrganizationsData>
          label={ORGANIZATIONS_FIELD_NAME.TREE_PATH}
          name="tree_path"
          labelCol={{ span: 24 }}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item<OrganizationsData>
          label="Số thứ tự"
          name="order_number"
          labelCol={{ span: 24 }}
        >
          <InputNumber
            className="w-full"
            controls={false}
          />
        </Form.Item> */}
      </Form>
    </Space>
  );
};

export default OrganizationsAction;
