import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Select, Skeleton, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { SpliceClosuresData } from "../types/SpliceClosures.types";
import { createSpliceClosures, removeSpliceClosures, updateSpliceClosures } from "../store/SpliceClosures.action";
import { ISpliceClosuresSelect } from "../interface/SpliceClosures.interface";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { getOpticalFiberLinesList } from "../store/OpticalFiberLines.action";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ItemComponent from "@app/components/ItemsComponent";
import { getTBVTCategoriesList } from "@app/modules/force-categories/store/TBVTCategories.action";
import { TBVTCategoriesType } from "@app/modules/force-categories/enums/TBVTCategories.enum";
import { getReasonList } from "@app/modules/force-categories/store/ReasonCategories.action";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";

type SpliceClosuresActionType = {
  action: Action;
  detail?: SpliceClosuresData;
};



const SpliceClosuresAction: React.FC<SpliceClosuresActionType> = ({
  action,
  detail,
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const [isLoading, setIsIoading] = useState<boolean>(false);
  const { openMessage } = useMessage();
  const [dataSelection, setDataSelection] = useState<ISpliceClosuresSelect>({
    organizations: [],
    wards: [],
    opticalFiberLine: [],
    vtkt: [],
    reasons: []
  });



  // FUNCTIONS
  const fetchData = async () => {
    try {
      setIsIoading(true)
      const response: any = await Promise.all([
        getOrganizationTree({}),
        getWard({}, {}),
        getOpticalFiberLinesList({}, {}),
        getTBVTCategoriesList({}, {
          type: {
            _eq: TBVTCategoriesType.VT
          }
        }),
        getReasonList({}, {})
      ]);
      setDataSelection({
        organizations: arrayToTree([...response[0]], { dataField: null }),
        wards: response[1],
        opticalFiberLine: response[2],
        vtkt: response[3],
        reasons: response[4],
      });
      setIsIoading(false)
    } catch (error) {
      // 
      setIsIoading(false)
    }
  }

  const dataInput = useMemo(
    () => [
      {
        title: "Tỉnh/TP, Quận/huyện, Phường xã",
        content: detail?.ward_id || null,
        require: false,
        dataIndex: "ward_id",
      },
      {
        title: "Địa chỉ măng xông",
        content: detail?.address || null,
        require: false,
        dataIndex: "address",
      },

      {
        title: "Đơn vị sửa chữa",
        content: detail?.repair_org_id || null,
        require: false,
        dataIndex: "repair_org_id",
      },
      {
        title: "Thời điểm khắc phục",
        content: detail?.repair_at || null,
        require: false,
        dataIndex: "repair_at",
      },
      {
        title: "Vị trí măng xông",
        content: detail?.repair_point || null,
        require: false,
        dataIndex: "repair_point",
      },
      {
        title: "Thuộc tuyến cáp",
        content: detail?.fiber_line_id || null,
        require: false,
        dataIndex: "fiber_line_id",
      },
      {
        title: "Độ suy hao sau khi hàn nối",
        content: detail?.attenuation_splice || null,
        require: false,
        dataIndex: "attenuation_splice",
      },
      {
        title: "Mô tả",
        content: detail?.desc || null,
        require: false,
        dataIndex: "desc",
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
      {
        title: "Nguyên nhân hỏng",
        content: detail?.reason || null,
        require: false,
        dataIndex: "reason",
      },
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
      let ward_id = null;
      const value: any = form.getFieldsValue();
      const repair_org_id = value?.repair_org_id?.value ? value?.repair_org_id?.value : value?.repair_org_id;
      const fiber_line_id = value?.fiber_line_id?.value ? value?.fiber_line_id?.value : value?.fiber_line_id;
      const tbvt_code = value?.tbvt_code?.value ? value?.tbvt_code?.value : value?.tbvt_code;
      const reason_id = value?.reason_id?.value ? value?.reason_id?.value : value?.reason_id;
      ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
      switch (action) {
        case Action.Update:
          await updateSpliceClosures(detail?.id, { ...value, repair_org_id, fiber_line_id, tbvt_id: tbvt_code, ward_id, reason_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createSpliceClosures({ ...value, repair_org_id, fiber_line_id, tbvt_id: tbvt_code, ward_id, reason_id });
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
      await removeSpliceClosures(detail?.id);
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
  const getDataSelect = (dataIndex: string) => {
    // if (["reason_id"].includes(dataIndex)) {
    //   return selectMap(
    //     dataSelection?.reasons,
    //     "name",
    //     "id"
    //   );
    // }
    if (["tbvt_code"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.vtkt,
        "code",
        "id"
      );
    }
    if (["tbvt_name"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.vtkt,
        "name",
        "id"
      );
    }
    if (["fiber_line_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.opticalFiberLine,
        "name",
        "id"
      );
    }
  };
  useEffect(() => {
    fetchData();
    // if (id) {
    //   fetchDetail()
    // }
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
        <ModalCategoryActionHeader name="măng xông" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      {isLoading ? <><Skeleton /></> : <Form
        form={form}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{
          tbvt_name: detail?.tbvt_id?.id || null,
          tbvt_code: detail?.tbvt_id?.id || null,
        }}
      >
        {action === Action.Update || action === Action.Create ? (
          <>
            <Form.Item
              name="tbvt_name"
              label={
                <span className="font-extrabold">
                  {'Tên TBVT'}
                  {<span className="text-red">*</span>}
                </span>
              }
              labelCol={{ span: 24 }}
              rules={[
                { required: true },
              ]}
            >
              <Select
                optionFilterProp="label"
                onChange={(value) => {
                  form.setFieldValue('tbvt_code', value)
                }}
                showSearch={true}
                allowClear={true}
                options={getDataSelect('tbvt_name')}
              />
            </Form.Item>
            <Form.Item
              label={
                <span className="font-extrabold">
                  {'Mã TBVT'}
                  {<span className="text-red">*</span>}
                </span>
              }
              name="tbvt_code"
              labelCol={{ span: 24 }}
              rules={[
                { required: true },
              ]}
            >
              <Select
                optionFilterProp="label"
                onChange={(value) => {
                  form.setFieldValue('tbvt_name', value)
                }}
                showSearch={true}
                allowClear={true}
                options={getDataSelect('tbvt_code')}
              />
            </Form.Item>
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
                  isDateField={value?.dataIndex === "repair_at"}
                  treeField={{
                    isSelect:
                      value?.dataIndex === "repair_org_id",
                    dataSelect: dataSelection.organizations,
                  }}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "fiber_line_id",
                    dataSelect: getDataSelect(value?.dataIndex),
                  }}
                  addressField={value?.dataIndex === "ward_id"}
                  isNumberField={
                    value?.dataIndex === "order_number"
                  }
                  isRadioField={
                    value?.dataIndex === "is_enable"
                  }
                  isTextArea={
                    value?.dataIndex === "reason"
                  }
                />
              )
            })}
          </>
        ) : (
          <>
            <div className="flex flex-col gap-[10px]">
              <p className="font-bold text-sm">
                {'Tên TBVT'}
                {<span className="text-red">*</span>}
              </p>
              <>
                <p className="text-sm font-normal">
                  {/* {dataSelection?.vtkt?.find((item: TbvtCategories) => item.id === detail?.tbvt_id)?.name} */}
                  {detail?.tbvt_id?.name}
                </p>
              </>
            </div >
            <div className="flex flex-col gap-[10px]">
              <p className="font-bold text-sm">
                {'Mã TBVT'}
                {<span className="text-red">*</span>}
              </p>
              <>
                <p className="text-sm font-normal">
                  {/* {dataSelection?.vtkt?.find((item: TbvtCategories) => item.id === detail?.tbvt_id)?.code} */}
                  {detail?.tbvt_id?.code}
                </p>
              </>
            </div >
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
      </Form>}
    </Space>
  );
};

export default SpliceClosuresAction;
