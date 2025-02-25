import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Flex, Form, Space } from "antd";
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
import { useEffect, useMemo, useState } from "react";
import { selectMap } from "@app/core/helper";
import { FORCE_PAGE_LABEL } from "../constants/ForceCategories.constant";
import { TBVTCategoriesData } from "../types/TBVTCategories.types";
import {
  createTBVTCategories,
  getTBVTCategoriesDetail,
  getTBVTCategoriesList,
  getTBVTCode,
  removeTBVTCategories,
  updateTBVTCategories,
} from "../store/TBVTCategories.action";
import { ITBVTCategoriesSelection } from "../interfaces/TBVTCategories.interface";
import { getCountry } from "@app/modules/it-categories/store/Country.action";
import { getSpeciesList } from "../store/SpeciesCategories.action";
import { getUnitList } from "../store/UnitCategories.action";
import {
  TBVT_CATEGORIES_FIELD_NAME,
  TBVT_CATEGORIES_TYPE_OPTIONS,
} from "../constants/TBVTCategories.constant";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import ItemComponent from "@app/components/ItemsComponent";
import { arrayToTree } from "performant-array-to-tree";
import { getMajorList } from "../store/MajorCategories.action";
import { TBVTCategoriesType } from "../enums/TBVTCategories.enum";

type FiberLineTypeActionType = {
  action: Action;
  detail?: TBVTCategoriesData;
  parent_id?: string;
  type: string;
  dataSource: Partial<TBVTCategoriesData[]>;
  setDataSource: React.Dispatch<
    React.SetStateAction<Partial<TBVTCategoriesData[]>>
  >;
};

const TBVTCategoriesAction: React.FC<FiberLineTypeActionType> = ({
  action,
  detail,
  type,
  parent_id = null,
  dataSource,
  setDataSource,
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();
  const [parentDetail, setParentDetail] = useState<TBVTCategoriesData | null>(
    null
  );
  const [dataSelection, setDataSelection] = useState<ITBVTCategoriesSelection>({
    country: [],
    species: [],
    tbvt: [],
    units: [],
    major_categories: [],
  });
  let label = "";
  switch (type) {
    case TBVTCategoriesType.TB:
      label = "TBKT nhóm 1";
      break;
    case TBVTCategoriesType.HC:
      label = "TBVT ngành Hậu cần";
      break;
    case TBVTCategoriesType.CT:
      label = "TBVT ngành Chính trị";
      break;
    case TBVTCategoriesType.VT:
      label = "TBKT nhóm 2, VTKT";
      break;
    default:
      break;
  }

  // FUNCTIONS
  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        await getCountry({}, {}),
        await getSpeciesList({}, {}),
        await getTBVTCategoriesList(
          {},
          {
            _and: [
              {
                type: {
                  _eq: type,
                },
              },
            ],
          }
        ),
        await getUnitList({}, {}),
        await getMajorList({}, {}),
      ]);

      setDataSelection({
        country: response[0],
        species: response[1],
        tbvt: response[2],
        units: response[3],
        major_categories: arrayToTree([...response[4]], { dataField: null }),
      });
    } catch (error) {
      //
    }
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

  const getTBVTCategoriesCode = async () => {
    const res: any = await getTBVTCode(parent_id as string);
    form.setFieldValue("code", res || "");
    if (parent_id) {
      const response = await getTBVTCategoriesDetail(parent_id, {});
      setParentDetail(response || null);
    }
  };
  const handleDelete = async () => {
    try {
      if (detail?.children?.length > 0) {
        openMessage({
          type: "warning",
          content: "Đ/c không thể xóa khi đang tồn tại mã con!",
        });
      } else {
        await removeTBVTCategories(detail?.id);
        setDataSource((prev: Partial<TBVTCategoriesData[]>) => {
          return prev.filter((item: any) => item?.id !== detail?.id);
        });
        openMessage({
          type: "success",
          content: `Xóa ${FORCE_PAGE_LABEL.REASON} thành công`,
        });
        // handleSuccess();
        loading.hide();
        modal.closeModal({});
      }
    } catch (error: any) {
      console.log(error);
      openMessage({
        type: "error",
        content: error?.message || "Lỗi hệ thống",
      });
    }
  };

  const onFinish = async () => {
    try {
      loading.show();
      const value: any = form.getFieldsValue();
      const parent_id = value?.parent_id?.value
        ? value?.parent_id?.value
        : value?.parent_id;
      const tree_level =
        parentDetail?.tree_level && +parentDetail?.tree_level + 1;
      const major_categories = value?.major_categories?.map((item: any) => {
        return { major_categories_id: item?.value ? item.value : item };
      });
      switch (action) {
        case Action.Update: {
          const res = await updateTBVTCategories(detail?.id, {
            ...value,
            code: undefined,
            parent_id,
            type,
            major_categories,
          });
          setDataSource((prev: Partial<TBVTCategoriesData[]>) => {
            return prev.map((item: any) => {
              if (item?.id === detail?.id) {
                return res;
              }
              return item;
            });
          });
          openMessage({
            type: "success",
            content: `Cập nhật thành công`,
          });
          break;
        }
        case Action.Create: {
          const res = await createTBVTCategories({
            ...value,
            parent_id,
            type,
            tree_level,
            major_categories,
          });
          if (res?.code) {
            setDataSource([
              ...dataSource.map((it: TBVTCategoriesData | undefined) => {
                if (!it) return it;
                if (it?.id === parent_id) {
                  return {
                    ...it,
                    has_child: true,
                  };
                }
                return it;
              }),
              res,
            ]);
          }
          openMessage({
            type: "success",
            content: `Thêm mới thành công`,
          });
          form.resetFields();
          break;
        }
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
  useEffect(() => {
    fetchData();
    if (action === Action.Create) {
      getTBVTCategoriesCode();
    }
  }, []);

  const getDataSelect = (dataIndex: string) => {
    if (["parent_id"].includes(dataIndex)) {
      return selectMap(dataSelection?.tbvt, "name", "id");
    }
    if (["unit"].includes(dataIndex)) {
      return selectMap(dataSelection?.units, "name", "name");
    }
    if (["major_categories"].includes(dataIndex)) {
      return dataSelection.major_categories;
    }
    if (["type"].includes(dataIndex)) {
      return TBVT_CATEGORIES_TYPE_OPTIONS;
    }
  };
  //
  const dataInput = useMemo(
    () => [
      {
        title: TBVT_CATEGORIES_FIELD_NAME.CODE,
        content: detail?.code || null,
        dataIndex: "code",
        placeholder: "A.1.01.01.00.00.000",
        // TODO bo check rule
        // rules: [
        //   {
        //     pattern: /^[A-Z]\.\d{1}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{3}$/,
        //     message: "Hãy nhập đúng định dạng",
        //   },
        // ],
      },
      {
        title: TBVT_CATEGORIES_FIELD_NAME.PARENT_ID,
        content: detail?.parent ?? parent_id,
        dataIndex: "parent_id",
      },
      {
        title: TBVT_CATEGORIES_FIELD_NAME.NAME,
        content: detail?.name || null,
        require: true,
        dataIndex: "name",
        rules: [{ required: true, message: `Thông tin không được để trống!` }],
      },
      {
        title: TBVT_CATEGORIES_FIELD_NAME.UNIT,
        content: detail?.unit || null,
        dataIndex: "unit",
      },

      {
        title: TBVT_CATEGORIES_FIELD_NAME.MARJOR_CATEGORIES,
        content: detail?.major_categories || [],
        dataIndex: "major_categories",
      },
      {
        title: "Số thứ tự",
        content: detail?.order_number || null,
        dataIndex: "order_number",
      },
      {
        title: TBVT_CATEGORIES_FIELD_NAME.IS_ENABLE,
        content: detail?.is_enable === undefined ? true : detail?.is_enable,

        dataIndex: "is_enable",
      },
    ],
    [detail]
  );
  return (
    <Space {...SPACE_PROP_DEFAULT} className="flex" size={20}>
      <Flex
        align="center"
        justify="space-between"
        className={`absolute bg-white left-0 right-0 px-6 pb-3 z-50`}
      >
        <ModalCategoryActionHeader
          name={label}
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
                  placeholder={value?.placeholder}
                  rules={value?.rules}
                  content={value?.content}
                  require={value?.require}
                  statusUpdate={true}
                  disable={
                    (parent_id !== null &&
                      (value.dataIndex === "code" ||
                        value.dataIndex === "parent_id")) ||
                    (action === Action.Update && value.dataIndex === "code")
                      ? true
                      : false
                  }
                  dataIndex={value.dataIndex}
                  selectField={{
                    isSelect:
                      value?.dataIndex === "unit" ||
                      value?.dataIndex === "parent_id",
                    dataSelect: getDataSelect(value.dataIndex),
                  }}
                  treeField={{
                    isMultiple: value?.dataIndex === "major_categories",
                    isSelect: value?.dataIndex === "major_categories",
                    dataSelect: getDataSelect(value.dataIndex),
                  }}
                  isNumberField={value?.dataIndex === "order_number"}
                  isRadioField={
                    value?.dataIndex === "is_enable" ||
                    value?.dataIndex === "is_planning" ||
                    value?.dataIndex === "has_child"
                  }
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
                    isRadioField={
                      value?.dataIndex === "is_enable" ||
                      value?.dataIndex === "is_planning" ||
                      value?.dataIndex === "has_child"
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

export default TBVTCategoriesAction;
