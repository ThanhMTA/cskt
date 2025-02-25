import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { selectMap } from "@app/core/helper";

import { IOpticalFiberLinesSelect } from "../interfaces/OpticalFiberLines.interface";
import { getFiberLineTypeList } from "../store/FiberLineType.action";
import {
  createOpticalFiberLines,
  getOpticalFiberLinesDetail,
  getOpticalFiberLinesTree,
  removeOpticalFiberLines,
  updateOpticalFiberLines,
} from "../store/CopperCableFiberLines.action";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";
import { ICopperCableLinesSelect } from "../interfaces/CopperCableLines.interface";
import { CopperCableLinesData } from "../types/CopperCableLines.types";

type CopperCableFiberLinesActionType = {
  action: Action;
  detail?: CopperCableLinesData;
};

const CopperCableFiberLinesAction: React.FC<
  CopperCableFiberLinesActionType
> = ({ action, detail }) => {
  // variables
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [parentDetail, setParentDetail] = useState<
    CopperCableLinesData[] | null
  >(null);
  const [dataSelection, setDataSelection] = useState<ICopperCableLinesSelect>({
    organizations: [],
    fiberLineType: [],
  });

  const dataInput = useMemo(
    () => [
      {
        title: "Tên",
        content: detail?.name || null,
        dataIndex: "name",
        rules: [{ required: true, message: `Thông tin không được để trống!` }],
      },
      {
        title: "Loại tuyến cáp",
        content: detail?.type_id || null,
        dataIndex: "type_id",
        rules: [
          { required: true, message: `Loại tuyến cáp không được để trống!` },
        ],
      },
      {
        title: "Ký hiệu",
        content: detail?.symbol || null,
        dataIndex: "symbol",
      },
      {
        title: "Đơn vị quản lý",
        content: detail?.org_manage_id || null,
        dataIndex: "org_manage_id",
      },
      {
        title: "Đơn vị khai thác",
        content: detail?.org_use_id || null,
        dataIndex: "org_use_id",
      },
      {
        title: "Đơn vị bảo đảm kỹ thuật",
        content: detail?.org_suport_id || null,
        dataIndex: "org_suport_id",
      },
      {
        title: "Độ dài tuyến cáp",
        content: detail?.length || null,
        dataIndex: "length",
      },
      {
        title: "Độ dài quản lý",
        content: detail?.manage_length || null,
        dataIndex: "manage_length",
      },
      {
        title: "Tọa độ",
        content: detail?.coordinates || null,
        dataIndex: "coordinates",
      },
      {
        title: "Điểm đầu",
        content: detail?.first_point || null,
        dataIndex: "first_point",
      },
      {
        title: "Điểm cuối",
        content: detail?.final_point || null,
        dataIndex: "final_point",
      },

      {
        title: "Tổng số sợi",
        content: detail?.number_of_fiber || null,
        dataIndex: "number_of_fiber",
      },
      {
        title: "Mô tả",
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
      await getFiberLineTypeList({}, {}),
    ]);
    setDataSelection({
      organizations: arrayToTree([...responses[0]], { dataField: null }),
      fiberLineType: responses[1],
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
      const value: CopperCableLinesData = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          const org_manage_id = value?.org_manage_id?.value
            ? value?.org_manage_id?.value
            : value?.org_manage_id;
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
          await updateOpticalFiberLines(detail?.id, {
            ...value,
            org_manage_id,
            org_use_id,
            org_technical_id,
            org_support_id,
            type_id,
          });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`,
          });
          break;
        case Action.Create:
          await createOpticalFiberLines({
            ...value,
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
  const handleDelete = async () => {
    try {
      await removeOpticalFiberLines(detail?.id);
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
      return selectMap(dataSelection?.fiberLineType, "name", "id");
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
          name="danh sách tuyến cáp"
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
                  isNumberField={
                    value.dataIndex === "order_number" ||
                    value.dataIndex === "length" ||
                    value.dataIndex === "manage_length" ||
                    value.dataIndex === "number_of_fiber"
                  }
                  selectField={{
                    isSelect: value.dataIndex === "type_id",
                    dataSelect:
                      value.dataIndex === "type_id"
                        ? getDataSelect(value.dataIndex)
                        : dataSelection.copperCableLines,
                  }}
                  treeField={{
                    isSelect:
                      value?.dataIndex === "org_manage_id" ||
                      value?.dataIndex === "org_use_id" ||
                      value?.dataIndex === "org_technical_id" ||
                      value?.dataIndex === "org_suport_id",
                    dataSelect: dataSelection.organizations,
                  }}
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
                    dataIndex={value?.dataIndex}
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

export default CopperCableFiberLinesAction;
