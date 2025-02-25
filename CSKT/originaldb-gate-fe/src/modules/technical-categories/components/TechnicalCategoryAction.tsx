import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { TechnicalCategoryData } from "../types/TechnicalCategory.types";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { TECHNICAL_CATEGORY } from "../constants/TechnicalCategory.constant";
import { createTechnicalCategory, removeTechnicalCategory, updateTechnicalCategory } from "../store/TechnicalCategory.action";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { arrayToTree } from "performant-array-to-tree";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";

type TechnicalCategoryActionType = {
  action: Action;
  detail?: TechnicalCategoryData;

};


const TechnicalCategoryAction: React.FC<TechnicalCategoryActionType> = ({
  action,
  detail,
}) => {

  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [dataSelection, setDataSelection] = useState<any[]>([]);

  // functions
  const fetchData = async () => {
    const responses = await getOrganizationTree({});
    setDataSelection(arrayToTree([...responses], { dataField: null }));
  }
  const dataInput = useMemo(
    () => [
      {
        title: TECHNICAL_CATEGORY.ORG_ID,
        content: detail?.org_id || null,
        require: true,
        dataIndex: "org_id",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: TECHNICAL_CATEGORY.DESCRIPTION,
        content: detail?.note || null,
        dataIndex: "note",
      },
      {
        title: 'Số thứ tự',
        content: detail?.order_number || null,
        dataIndex: "order_number",
      },
      {
        title: "Trạng thái",
        content: (detail?.is_enable === undefined ? true : detail?.is_enable),

        dataIndex: "is_enable",
      }
    ], [detail]
  )

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
      const org_id = value?.org_id?.value ? value?.org_id?.value : value?.org_id;
      switch (action) {
        case Action.Update:
          await updateTechnicalCategory(detail?.id, { ...value, org_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createTechnicalCategory(value);
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
      await removeTechnicalCategory(detail?.id);
      openMessage({
        type: "success",
        content: `Xóa thành công`
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

  useEffect(() => {
    fetchData();
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
        <ModalCategoryActionHeader name="Đơn vị XLSC" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
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
                  isNumberField={value?.dataIndex === "order_number"}
                  // selectField={{
                  //   isSelect:
                  //     value?.dataIndex === "org_id",
                  //   dataSelect: selectMap(
                  //     dataSelection,
                  //     "name",
                  //     "id"
                  //   ),
                  // }}
                  treeField={{
                    isSelect:
                      value?.dataIndex === "org_id",
                    dataSelect: dataSelection,
                  }}
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

export default TechnicalCategoryAction;
