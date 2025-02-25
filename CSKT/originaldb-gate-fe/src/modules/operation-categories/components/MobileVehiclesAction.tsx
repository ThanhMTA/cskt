import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { selectMap } from "@app/core/helper";
import { MobileVehiclesData } from "../types/MobileVehicles.types";
import { IMobileVehiclesSelect } from "../interfaces/MobileVehicles.interface";
import { getCountry } from "@app/modules/it-categories/store/Country.action";
import { createMobileVehicles, removeMobileVehicles, updateMobileVehicles } from "../store/MobileVehicles.action";
import { useModal } from "@app/contexts/ModalContext";
import { useLoading } from "@app/contexts/LoadingContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";

type MobileVehiclesActionType = {
  action: Action;
  detail?: MobileVehiclesData;
};


const MobileVehiclesAction: React.FC<MobileVehiclesActionType> = ({
  action,
  detail,
}) => {
  // variables
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [dataSelection, setDataSelection] = useState<IMobileVehiclesSelect>({
    organizations: [],
    country: []
  });
  const dataInput = useMemo(
    () => [
      {
        title: "Tên xe cơ động",
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: "Mã TBVT",
        content: detail?.code || null,
        dataIndex: "code",
      },
      {
        title: "Biển số xe",
        content: detail?.serial_number || null,
        dataIndex: "serial_number",
      },
      {
        title: "Đơn vị quản lý",
        content: detail?.org_id || null,
        dataIndex: "org_id",
      },
      {
        title: "Xuất xứ",
        content: detail?.origin_id || null,
        dataIndex: "origin_id",
      },
      {
        title: "Cấp chất lượng",
        content: detail?.quality || null,
        dataIndex: "quality",
      },
      {
        title: "Mã định danh",
        content: detail?.eid || null,
        dataIndex: "eid",
      },
      {
        title: "Ngày đưa vào sử dụng",
        content: detail?.used_at || null,
        dataIndex: "used_at",
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
      },
    ], [detail]
  )
  // functions
  const fetchData = async () => {
    const responses = await Promise.all([
      await getOrganizationTree({}),
      await getCountry({}, {}),
    ]);
    setDataSelection({
      organizations: arrayToTree([...responses[0]], { dataField: null }),
      country: responses[1]
    })
  }

  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          const org_id = value?.org_id?.value ? value?.org_id?.value : value?.org_id;
          const origin_id = value?.origin_id?.value ? value?.origin_id?.value : value?.origin_id;
          await updateMobileVehicles(detail?.id, { ...value, org_id, origin_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createMobileVehicles(value);
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
  const handleDelete = async () => {
    try {
      await removeMobileVehicles(detail?.id);
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
  const getDataSelect = (dataIndex: string) => {
    if (["origin_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.country,
        "name",
        "id"
      )
    }
  };
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
        <ModalCategoryActionHeader name="xe cơ động" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
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
                  isNumberField={
                    value.dataIndex === "order_number" ||
                    value.dataIndex === "quality"
                  }
                  isDateField={
                    value.dataIndex === "used_at"
                  }
                  treeField={{
                    isSelect:
                      value?.dataIndex === "org_id",
                    dataSelect: dataSelection.organizations,
                  }}
                  selectField={{
                    isSelect:
                      value.dataIndex === "origin_id",
                    dataSelect: getDataSelect(value.dataIndex),
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

export default MobileVehiclesAction;
