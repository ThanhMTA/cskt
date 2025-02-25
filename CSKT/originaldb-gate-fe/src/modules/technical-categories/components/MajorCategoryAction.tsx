import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { MajorCategoryData } from "../types/MajorCategory.types";
import { MAJOR_CATEGORY } from "../constants/MajorCategory.constant";
import { createMajorCategory, getBusinessGroupList, getMajorCategoryDetail, getMajorCategoryList, removeMajorCategory, updateMajorCategory } from "../store/MajorCategory.action";
import { IMajorActionSelect } from "../interface/Major.interface";
import { arrayToTree } from "performant-array-to-tree";

type MajorCategoryActionType = {
  action: Action;
  id?: string;
  parentId?: string;
};


const MajorCategoryAction: React.FC<MajorCategoryActionType> = ({
  action,
  id,
  parentId,
}) => {
  const [form] = Form.useForm();
  const loading = useLoading();
  const modal = useModal();
  const { openMessage } = useMessage();
  const [detail, setDetail] = useState<MajorCategoryData | null>(null)
  const [dataSelection, setDataSelection] = useState<IMajorActionSelect>({
    parent: [],
    group: []
  });

  // functions
  const fetchData = async () => {
    const responses = await Promise.all([
      getMajorCategoryList({}, {}),
      getBusinessGroupList({}, {})
    ])
    setDataSelection({
      parent: arrayToTree([...responses[0]], { dataField: null }),
      group: responses[1],
    })
  }
  const fetchDetail = async () => {
    try {
      const response = await getMajorCategoryDetail(id, {});
      setDetail(response)
    } catch (error) {
      console.log('error: ', error)
    }
  }
  const dataInput = useMemo(
    () => [
      {
        title: MAJOR_CATEGORY.NAME,
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [
          { required: true, message: `Thông tin không được để trống!` },
        ],
      },
      {
        title: MAJOR_CATEGORY.SHORT_NAME,
        content: detail?.short_name || null,
        dataIndex: "short_name",
      },
      {
        title: MAJOR_CATEGORY.PARENT_ID,
        content: detail?.parent_id || parentId || null,
        dataIndex: "parent_id",
      },
      {
        title: MAJOR_CATEGORY.GROUP_ID,
        content: detail?.group_id || null,
        dataIndex: "group_id",
      },
      {
        title: 'Ghi chú',
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
    ], [detail, parentId]
  )

  const getDataSelect = (dataIndex: string) => {
    // if (["parent_id"].includes(dataIndex)) {
    //   return selectMap(
    //     dataSelection?.parent,
    //     "name",
    //     "id"
    //   );
    // }
    if (["group_id"].includes(dataIndex)) {
      return selectMap(
        dataSelection?.group,
        "name",
        "id"
      );
    }
  };

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
      const parent_id = value?.parent_id?.value ? value?.parent_id?.value : value?.parent_id;
      const group_id = value?.group_id?.value ? value?.group_id?.value : value?.group_id;
      switch (action) {
        case Action.Update:
          await updateMajorCategory(detail?.id, { ...value, parent_id, group_id });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          await createMajorCategory(value);
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
      await removeMajorCategory(detail?.id);
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
    if (id) {
      fetchDetail()
    }
  }, [id]);
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
        <ModalCategoryActionHeader name="chuyên ngành" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} />
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
                  treeField={{
                    isSelect:
                      value?.dataIndex === "parent_id",
                    dataSelect: dataSelection.parent,
                  }}
                  disable={(parentId && value?.dataIndex === "parent_id") ? true : false}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "group_id",
                    dataSelect: getDataSelect(value.dataIndex)
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
      </Form>
    </Space>
  );
};

export default MajorCategoryAction;
