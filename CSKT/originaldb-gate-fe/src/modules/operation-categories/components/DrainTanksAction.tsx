import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { DrainTanksData } from "../types/DrainTanks.types";
import { createDrainTanks, removeDrainTanks, updateDrainTanks } from "../store/DrainTanks.action";
import { IDrainTanksSelect } from "../interfaces/DrainTanks.interface";
import { getOrganizationsList } from "@app/modules/force-categories/store/Organizations.action";
import { getDrainTankTypeList } from "../store/DrainTankType.action";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";

type FiberLineTypeActionType = {
  detail?: DrainTanksData,
  action: Action
};


const DrainTanksAction: React.FC<FiberLineTypeActionType> = ({
  detail,
  action
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [dataSelection, setDataSelection] = useState<IDrainTanksSelect>({
    organizations: [],
    wards: [],
    drainTankType: []
  });


  const dataInput = useMemo(
    () => [
      {
        title: "Tên cống, bể",
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Hãy nhập thông tin cho trường tên quốc gia` },
        ],
      },
      {
        title: "Vị trí đặt cống, bể",
        content: detail?.address || null,
        dataIndex: "address",
      },
      {
        title: "Địa bàn",
        content: detail?.ward_id || null,
        dataIndex: "ward_id",
      },
      {
        title: "Đơn vị quản lý",
        content: detail?.org_id || null,
        dataIndex: "org_id",
      },
      {
        title: "Loại cống bể",
        content: detail?.type_id || null,
        dataIndex: "type_id",
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
    ], [detail]
  )

  // FUNCTIONS
  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        await getOrganizationsList({}, {}),
        await getWard({}, {}),
        await getDrainTankTypeList({}, {})
      ]);
      setDataSelection({
        organizations: response[0],
        wards: response[1],
        drainTankType: response[2]
      });
    } catch (error) {
      // 
    }
  }

  const handleDelete = async () => {
    try {
      await removeDrainTanks(detail?.id);
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
      onFinish();
      return;
      // const value: EngineRoom = form.getFieldsValue();
      // console.log('asdsad: ', value)
      // form.submit();
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

      switch (action) {
        case Action.Update:
          const org_id = value?.org_id?.value ? value?.org_id?.value : value?.org_id;
          const type_id = value?.type_id?.value ? value?.type_id?.value : value?.type_id;
          ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
          await updateDrainTanks(detail?.id, { ...value, org_id, type_id, ward_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          ward_id = value?.ward_id?.ward ? value?.ward_id?.ward : null;
          await createDrainTanks({ ...value, ward_id });
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
  const getDataSelect = (dataIndex: string) => {
    if (["org_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.organizations,
        "name",
        "id"
      );
    }
    if (["ward_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.wards,
        "name",
        "id"
      );
    }
    if (["type_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.drainTankType,
        "name",
        "id"
      );
    }
  }
  useEffect(() => {
    fetchData();
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
        <ModalCategoryActionHeader name="cống bể" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
      </Flex>
      <Form
        form={form}
        className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
        onFinish={onFinish}
        requiredMark={false}
      >
        {/* <Form.Item<DrainTanksData>
          label="Tên cống, bể"
          name="name"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: DrainTanksMaxLength.Name }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<DrainTanksData>
          label="Vị trí đặt cống, bể"
          name="address"
          labelCol={{ span: 24 }}
          rules={[
            { required: true },
            { max: DrainTanksMaxLength.Name }
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<DrainTanksData>
          label="Địa bàn"
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
        <Form.Item<DrainTanksData>
          label="Đơn vị quản lý"
          name="org_id"
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
        <Form.Item<DrainTanksData>
          label="Loại cống bể"
          name="type_id"
          labelCol={{ span: 24 }}
        >
          <Select
            options={
              selectMap(
                dataSelection?.drainTankType,
                "name",
                "id"
              )
            }
          />
        </Form.Item>
        <Form.Item<DrainTanksData>
          label="Mô tả"
          name="desc"
          labelCol={{ span: 24 }}
          rules={[
            { max: DrainTanksMaxLength.Desc }
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<DrainTanksData>
          label="Trạng thái"
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
        </Form.Item> */}
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
                  addressField={value?.dataIndex === "ward_id"}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "org_id" ||
                      value?.dataIndex === "type_id",
                    dataSelect: getDataSelect(value?.dataIndex),
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

export default DrainTanksAction;
