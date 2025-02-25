import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { TechnicalTeamsData } from "../types/TechnicalTeams.types";
import { createTechnicalTeams, removeTechnicalTeams, updateTechnicalTeams } from "../store/TechnicalTeams.action";
import { selectMap } from "@app/core/helper";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { TECHNICAL_TEAM_FIELD_NAME } from "../constants/TechnicalTeams.constant";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";

type Props = {
  detail?: TechnicalTeamsData,
  action: Action
}

const TechnicalTeamsAction: React.FC<Props> = ({
  detail, action
}) => {

  // variables
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();
  const [dataSelection, setDataSelection] = useState<OrganizationsData[]>([]);


  // functions
  const fetchData = async () => {
    const responses = await getOrganizationsList({}, {});
    setDataSelection(responses);
  }

  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      const org_id = value?.org_id?.value ? value?.org_id?.value : value?.org_id;
      switch (action) {
        case Action.Update:
          await updateTechnicalTeams(detail?.id, { ...value, org_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createTechnicalTeams(value);
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
        title: TECHNICAL_TEAM_FIELD_NAME.NAME,
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: TECHNICAL_TEAM_FIELD_NAME.SHORT_NAME,
        content: detail?.short_name || null,
        dataIndex: "short_name",
      },
      {
        title: TECHNICAL_TEAM_FIELD_NAME.ORG_ID,
        content: detail?.org_id || null,
        dataIndex: "org_id",
      },
      {
        title: TECHNICAL_TEAM_FIELD_NAME.IS_ENABLE,
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

  const handleDelete = async () => {
    try {
      await removeTechnicalTeams(detail?.id);
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

  const getDataSelect = (dataIndex: string) => {
    if (["org_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection,
        "name",
        "id"
      );
    }
  };
  useEffect(() => {
    fetchData()
  }, [])
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
        <ModalCategoryActionHeader name="tổ sữa chữa cơ động" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      <Form
        form={form}
        preserve={false}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
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
                  selectField={{
                    isSelect:
                      value?.dataIndex === "org_id",
                    dataSelect: getDataSelect(value.dataIndex),
                  }}
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

export default TechnicalTeamsAction;
