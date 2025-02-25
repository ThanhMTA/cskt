import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { selectMap } from "@app/core/helper";
import { MicrowaveLinesData } from "../types/MicrowaveLines.types";
import { IMicrowaveLinesSelect } from "../interfaces/MicrowaveLines.interface";
import { getFiberLineTypeList } from "../store/FiberLineType.action";
import {
  createMicrowaveLines,
  getMicrowaveLinesDetail,
  removeMicrowaveLines,
  updateMicrowaveLines,
} from "../store/MicrowaveLines.action";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";

type MicrowaveLinesActionType = {
  action: Action;
  detail?: MicrowaveLinesData;
};

const MicrowaveLinesAction: React.FC<MicrowaveLinesActionType> = ({
  action,
  detail,
}) => {
  // variables
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();

  const [dataSelection, setDataSelection] = useState<IMicrowaveLinesSelect>({
    organizations: [],
    type: [],
    modulation_type: [],
    polarization_type: [],
  });

  const dataInput = useMemo(
    () => [
      {
        title: "Tên",
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [{ required: true, message: `Thông tin không được để trống!` }],
      },
      {
        title: "Ký hiệu",
        content: detail?.symbol || null,
        dataIndex: "symbol",
      },
      // {
      //   title: "Tuyến cáp trực thuộc",
      //   content: detail?.parent_id ?? (detail?.parent_id as any)?.name,
      //   dataIndex: "parent_id",
      // },
      {
        title: "Đơn vị quản lý",
        content: detail?.org_manage_id || null,
        dataIndex: "org_manage_id",
      },
      {
        title: "Cự ly",
        content: detail?.distance || null,
        dataIndex: "distance",
      },
      {
        title: "Tần số thu",
        content: detail?.receiving_frequency || null,
        dataIndex: "receiving_frequency",
      },
      {
        title: "Độ nhạy thu",
        content: detail?.receiving_sensitivity || null,
        dataIndex: "receiving_sensitivity",
      },
      {
        title: "Công suất phát",
        content: detail?.transmission_power || null,
        dataIndex: "transmission_power",
      },
      {
        title: "Số chặng tiếp phát",
        content: detail?.number_of_relay_stages || null,
        dataIndex: "number_of_relay_stages",
      },
      {
        title: "Tôc độ bít (R bít)",
        content: detail?.bit_rate || null,
        dataIndex: "bit_rate",
      },
      {
        title: "Loại thiết bị",
        content: detail?.type || null,
        dataIndex: "type",
      },
      {
        title: "Dung lượng hệ thống",
        content: detail?.capacity || null,
        dataIndex: "capacity",
      },
      {
        title: "Loại điều chế",
        content: detail?.modulation_type || null,
        dataIndex: "modulation_type",
      },
      {
        title: "Độ cao anten",
        content: detail?.antenna_height || null,
        dataIndex: "antenna_height",
      },
      {
        title: "Phân cực",
        content: detail?.polarization_type || null,
        dataIndex: "polarization_type",
      },
      {
        title: "Mức suy hao",
        content: detail?.depreciation_rate || null,
        dataIndex: "depreciation_rate",
      },
      {
        title: "Vị trí điểm đầu",
        content: detail?.longitude || null,
        dataIndex: "longitude",
      },
      {
        title: "Vị trí điểm cuối",
        content: detail?.latitude || null,
        dataIndex: "latitude",
      },
      {
        title: "Ghi chú",
        content: detail?.note || null,
        dataIndex: "note",
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
    const responses = await Promise.all([await getOrganizationTree({})]);
    console.log("responses: ", responses);
    setDataSelection({
      organizations: arrayToTree([...responses[0]], { dataField: null }),
      type: [
        {
          key: "Thiết bị rắn",
          value: "RAN",
        },
        {
          key: "Thiết bị ống chân không",
          value: "ONG_CHAN_KHONG",
        },
      ],
      modulation_type: [
        {
          key: "M-PSK",
          value: "M_PSK",
        },
        {
          key: "M-QAM đa mức",
          value: "M_QAM",
        },
      ],
      polarization_type: [
        {
          key: "Đứng",
          value: "DUNG",
        },
        {
          key: "Ngang",
          value: "NGANG",
        },
      ],
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
      const value: MicrowaveLinesData = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          const org_manage_id = value?.org_manage_id?.value
            ? value?.org_manage_id?.value
            : value?.org_manage_id;
          await updateMicrowaveLines(detail?.id, {
            ...value,
            org_manage_id,
          });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`,
          });
          break;
        case Action.Create:
          await createMicrowaveLines({
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
      await removeMicrowaveLines(detail?.id);
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
    console.log("dataIndex: ", dataIndex);
    // if (["org_id", "org_use_id", "org_technical_id", "org_suport_id"].includes(dataIndex)) {
    //   return selectMap(
    //     dataSelection?.organizations,
    //     "name",
    //     "id"
    //   )
    // }
    // const dataIdx = dataSelection?.fiberLineType.findIndex((item: any) =>
    //   item.name
    //     .toLowerCase()
    //     .includes(
    //       location.pathname
    //         .split("/")
    //         [location.pathname.split("/").length - 1].includes("quang")
    //         ? "quang"
    //         : "đồng"
    //     )
    // );
    if (["type", "modulation_type", "polarization_type"].includes(dataIndex)) {
      return selectMap(dataSelection?.type, "name", "value");
    }
  };
  useEffect(() => {
    console.log("Fet tadadad");
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
                    value.dataIndex === "distance" ||
                    value.dataIndex === "receiving_frequency" ||
                    value.dataIndex === "receiving_sensitivity" ||
                    value.dataIndex === "transmission_power" ||
                    value.dataIndex === "number_of_relay_stages" ||
                    value.dataIndex === "bit_rate" ||
                    value.dataIndex === "capacity" ||
                    value.dataIndex === "antenna_height" ||
                    value.dataIndex === "depreciation_rate"
                  }
                  selectField={{
                    isSelect:
                      value.dataIndex === "type" ||
                      value.dataIndex === "modulation_type" ||
                      value.dataIndex === "polarization_type",
                    dataSelect: getDataSelect(value.dataIndex),
                  }}
                  treeField={{
                    isSelect: value?.dataIndex === "org_manage_id",
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

export default MicrowaveLinesAction;
