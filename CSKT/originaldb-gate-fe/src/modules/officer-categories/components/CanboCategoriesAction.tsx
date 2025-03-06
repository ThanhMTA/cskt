import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space,Skeleton } from "antd";
// import { CanBoCategoriesData } from "../types/CanBoCategories.types";
import { createCanBo, removeCanBo, updateCanBo, getCanBoDetail } from "../store/CanBoCategories.action";
import { getPositionList } from "../store/PositionCategories.action";
import { getRankList } from "../store/RankCategories.action";
import { getWard } from "@app/modules/it-categories/store/Ward.action";
import { } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { TABLE_FIELD_NAME } from "@app/constants/table.constant";
import ItemComponent from "@app/components/ItemsComponent";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { CanBoCategoriesData } from "../types/CanBoCategories.types";
import { useEffect, useMemo, useState } from "react";
import { ICanBoActionSelect } from "../interfaces/Canbo.interface";
import { selectMap } from "@app/core/helper";
import { useMessage } from "@app/contexts/MessageContext";
import { getOrganizationTree } from "@app/modules/techinical-organization/stores/TechnicalOrganization.action";
import { arrayToTree } from "performant-array-to-tree";
type Props = {
  id?: string,
  action: Action
}

export default function CanBoAction({ id, action }: Props) {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();
  const [isLoading, setIsIoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<CanBoCategoriesData>();
  const [dataSelection, setDataSelection] = useState<ICanBoActionSelect>({

    chucvus: [],
    capbacs: [],
    diachis:[], 
    donvis:[],
    
  });

  const handleDelete = async () => {
    try {
      await removeCanBo(detail?.id);
      openMessage({
        type: "success",
        content: `Xóa chức vụ thành công`
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
    const fetchData = async () => {
      const responses = await Promise.all([
        await  getRankList({ limit: -1 }, {}),
        await getPositionList({ limit: -1 }, {}),
        await getWard({limit:-1},{}),
        await getOrganizationTree({})
        // await getWard({}, {}),
        // await getMilitaryDistrict({}, {}),
      ]);
      setDataSelection({
        capbacs:responses[0],
        chucvus: responses[1],
        diachis:responses[2],
        donvis: arrayToTree([...responses[3]], { dataField: null })
  
      });
    };
    // const getSelectData = async () => {
    //   try {
    //     const res = await Promise.all([
    //       getRankList({ limit: -1 }, {}),
    //       getPositionList({ limit: -1 }, {}),
    //       getWard({limit:-1},{})
    //     ]);
    //     setDataSelection({
    //       capbacs: res[0],
    //       chucvus: res[1],
    //       diachis:res[2]
    //     })
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
  const onFinish = async () => {
    try {
      loading.show()
      let ward_id = null;
      const value: any = form.getFieldsValue();
      const donvi_id = value?.donvi_id?.value ? value?.donvi_id?.value : value?.donvi_id;
      const capbac_id = value?.capbac_id?.value ? value?.capbac_id?.value : value?.capbac_id;
      const chucvu_id = value?.chucvu_id?.value ? value?.chucvu_id?.value : value?.chucvu_id;
      ward_id= value?.ward_id?.ward ? value?.ward_id?.ward:null;

      switch (action) {
        case Action.Update:
          await updateCanBo(detail?.id, { ...value, donvi_id, capbac_id, ward_id, chucvu_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createCanBo({...value,donvi_id, capbac_id, ward_id, chucvu_id});
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
        title: "Họ và tên",
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: "SĐT",
        content: detail?.SDT || null,
        dataIndex: "SDT"
      },
      {
        title: "Số quân nhân",
        content: detail?.code || null,
        dataIndex: "code"
      },
      {
        title: "Cấp bậc",
        content: detail?.capbac_id || null,
        dataIndex: "capbac_id"
      },
      {
        title: "Chức vụ",
        content: detail?.chucvu_id || null,
        dataIndex: "chucvu_id"
      },
      {
        title: "Đơn vị",
        content: detail?.donvi_id || null,
        dataIndex: "donvi_id"
      },
      {
        title: "Địa chỉ",
        content: detail?.ward_id || null,
        dataIndex: "ward_id"
      },
      {
        title: "Trạng thái",
        content: (detail?.is_enable === undefined ? true : detail?.is_enable),

        dataIndex: "is_enable"
      },
    ], [detail]
  )
  const getDetail = async () => {
    try {
      setIsIoading(true)
      const res = await getCanBoDetail(id, {});
      setDetail(res);
      setIsIoading(false)
    } catch (e) {
      console.log(e)
      setIsIoading(false)
    }
  }

  const getDataSelect = (dataIndex: string) => {
    if (["capbac_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.capbacs,
        "name",
        "id"
      );
    }
    if (["chucvu_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.chucvus,
        "name",
        "id"
      );
    }
    if (["ward_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.diachis,
        "name",
        "id"
      );
    }
  };
  useEffect(() => {
    fetchData();
    if (id) {
      getDetail();
    }
  }, [id])
  useEffect(() => {
    // getSelectData();
    fetchData();

  }, [])


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
          <ModalCategoryActionHeader 
          name="Cán Bộ" 
          action={action} 
          hanldeFinish={hanldeFinish} 
          handleDelete={handleDelete} 
          />
      </Flex>
      {isLoading ? <><Skeleton /></> : <Form
          form={form}
          className="form-container bg-secondary p-5 rounded-primary mt-10 grid grid-cols-2 gap-2"
          onFinish={onFinish}
        disabled={action === Action.View}

          // requiredMark={false}
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
                              addressField={value?.dataIndex === "ward_id"}
                              treeField={{
                                isSelect: value?.dataIndex === "donvi_id",
                                dataSelect: dataSelection.donvis,
                              }}
                              selectField={{
                                  isSelect:
                                      value?.dataIndex === "capbac_id" ||
                                      value?.dataIndex === "chucvu_id", 
                                      // value?.dataIndex === "ward_id",
                                  dataSelect: getDataSelect(value.dataIndex),
                              }}
                              isNumberField={value?.dataIndex === "order_number"}
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
      </Form>}

  </Space>
);
}

