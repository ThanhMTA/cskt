import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { WorkstationsData } from "../types/Workstations.types";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { IWorkstationsActionSelect } from "../interfaces/Workstations.interface";
import { selectMap } from "@app/core/helper";
import { getStationFunctionList } from "../store/StationFunction.action";
import { getStationTypeList } from "../store/StationType.action";
import {
  createWorkstations,
  getWorkstationsList,
  removeWorkstations,
  updateWorkstations,
} from "../store/Workstations.action";
import { WORKSTATIONS_FIELDS_NAME } from "../constants/Workstations.constant";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";

type WorkstationsActionType = {
  action: Action;
  detail?: WorkstationsData;
  parent_id?: string;
};

const WorkstationsAction: React.FC<WorkstationsActionType> = ({
  action,
  detail,
  parent_id,
}) => {
  // variables
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [dataSelection, setDataSelection] = useState<IWorkstationsActionSelect>(
    {
      stationParent: [],
      organizations: [],
      stationFunctions: [],
      wards: [],
      stationType: [],
    }
  );

  const dataInput = useMemo(
    () => [
      {
        title: WORKSTATIONS_FIELDS_NAME.NAME,
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [{ required: true, message: `Thông tin không được để trống!` }],
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.SHORT_NAME,
        content: detail?.short_name || null,
        dataIndex: "short_name",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.PARENT_ID,
        // content: detail?.parent_id || null,
        content: parent_id ? parent_id : detail?.parent || null,
        dataIndex: "parent_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.PHONE_NUMBER,
        content: detail?.phone_number || null,
        dataIndex: "phone_number",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.WARD_ID,
        content: detail?.ward_id || null,
        dataIndex: "ward_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.ADDRESS,
        content: detail?.address || null,
        dataIndex: "address",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.ORG_USE_ID,
        content: detail?.org_use_id || null,
        dataIndex: "org_use_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.ORG_TECHNICAL_ID,
        content: detail?.org_technical_id || null,
        dataIndex: "org_technical_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.ORG_SUPPORT_ID,
        content: detail?.org_support_id || null,
        dataIndex: "org_support_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.ORG_ID,
        content: detail?.org_id || null,
        dataIndex: "org_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.CONTACT_METHOD,
        content: detail?.contact_method || null,
        dataIndex: "contact_method",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.FUNCTION_ID,
        content: detail?.function_id || null,
        dataIndex: "function_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.AREA,
        content: detail?.area || null,
        dataIndex: "area",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.LATITUDE,
        content: detail?.latitude || null,
        dataIndex: "latitude",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.LONGITUDE,
        content: detail?.longitude || null,
        dataIndex: "longitude",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.TYPE_ID,
        content: detail?.type_id || null,
        dataIndex: "type_id",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.FILE_PATH,
        content: detail?.file_path || null,
        dataIndex: "file_path",
      },
      {
        title: WORKSTATIONS_FIELDS_NAME.DESC,
        content: detail?.desc || null,
        dataIndex: "desc",
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
    [detail]
  );

  // functions
  const fetchData = async () => {
    const responses = await Promise.all([
      await getOrganizationTree({}),
      await getWard({}, {}),
      await getStationFunctionList({}, {}),
      await getStationTypeList({}, {}),
      await getWorkstationsList({}, {}),
    ]);
    setDataSelection({
      organizations: arrayToTree([...responses[0]], { dataField: null }),
      wards: responses[1],
      stationFunctions: responses[2],
      stationType: responses[3],
      stationParent: responses[4],
    });
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

  const onFinish = async () => {
    try {
      loading.show();
      let ward_id = null;
      const value: any = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          const org_id = value?.org_id?.value
            ? value?.org_id?.value
            : value?.org_id;
          const parent_id = value?.parent_id?.value
            ? value?.parent_id?.value
            : value?.parent_id;
          const org_use_id = value?.org_use_id?.value
            ? value?.org_use_id?.value
            : value?.org_use_id;
          const org_technical_id = value?.org_technical_id?.value
            ? value?.org_technical_id?.value
            : value?.org_technical_id;
          const org_support_id = value?.org_support_id?.value
            ? value?.org_support_id?.value
            : value?.org_support_id;
          const type_id = value?.type_id?.value
            ? value?.type_id?.value
            : value?.type_id;
          const function_id = value?.function_id?.value
            ? value?.function_id?.value
            : value?.function_id;
          ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
          await updateWorkstations(detail?.id, {
            ...value,
            org_id,
            org_use_id,
            org_technical_id,
            org_support_id,
            type_id,
            function_id,
            parent_id,
            ward_id,
          });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`,
          });
          break;
        case Action.Create:
          ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
          await createWorkstations({ ...value, ward_id });
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
  const handleDelete = async () => {
    try {
      await removeWorkstations(detail?.id);
      openMessage({
        type: "success",
        content: `Xóa thành công`,
      });
      handleSuccess();
    } catch (error: any) {
      console.log(error);
      openMessage({
        type: "error",
        content: error?.message || "Lỗi hệ thống",
      });
    }
  };
  const getDataSelect = (dataIndex: string) => {
    if (["type_id"].includes(dataIndex)) {
      return selectMap(dataSelection?.stationType, "name", "id");
    }
    if (["parent_id"].includes(dataIndex)) {
      return detail
        ? selectMap(dataSelection.stationParent, "name", "id").filter(
            (item) => item.value !== detail?.id
          )
        : selectMap(dataSelection.stationParent, "name", "id");
    }
    if (["function_id"].includes(dataIndex)) {
      return selectMap(dataSelection?.stationFunctions, "name", "id");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // return
  return (
    <Space {...SPACE_PROP_DEFAULT} className="flex" size={20}>
      <Flex
        align="center"
        justify="space-between"
        className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
      >
        <ModalCategoryActionHeader
          name="trạm thông tin"
          action={action}
          hanldeFinish={hanldeFinish}
          handleDelete={handleDelete}
        />
      </Flex>
      <Form
        form={form}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-4 gap-4"
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
                  suffix={value.dataIndex === "area" ? "m²" : null}
                  disable={
                    parent_id && value?.dataIndex === "parent_id" ? true : false
                  }
                  selectField={{
                    isSelect:
                      value?.dataIndex === "type_id" ||
                      value?.dataIndex === "function_id" ||
                      value?.dataIndex === "parent_id",
                    dataSelect: getDataSelect(value?.dataIndex),
                  }}
                  treeField={{
                    isSelect:
                      value?.dataIndex === "org_id" ||
                      value?.dataIndex === "org_use_id" ||
                      value?.dataIndex === "org_support_id" ||
                      value?.dataIndex === "org_technical_id",
                    dataSelect: dataSelection.organizations,
                  }}
                  isNumberField={
                    value?.dataIndex === "area" ||
                    value?.dataIndex === "order_number"
                  }
                  addressField={value?.dataIndex === "ward_id"}
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
      </Form>
    </Space>
  );
};

export default WorkstationsAction;
