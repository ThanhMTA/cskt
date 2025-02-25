import AddressComponent from "@app/components/AddressComponent";
import { getFullAddressString } from "@app/core/helper";
import { FormatDate } from "@app/enums";
import {
  LevelCategoriesLabel,
  OfficalLabel,
} from "@app/modules/techinical-organization/enum/LevelCategory.enum";
import {
  AutoComplete,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popover,
  Radio,
  Select,
  TreeSelect,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { AutoCompleteProps } from "antd/lib";
import dayjs from "dayjs";
import { useState } from "react";

interface IProps {
  title: string;
  require?: boolean;
  content?: any | null;
  statusUpdate: boolean;
  dataIndex: string;
  selectField?: any;
  isNumberField?: boolean;
  isRadioField?: boolean;
  addressField?: boolean;
  autoCompleteField?: any;
  isDateField?: boolean;
  treeField?: any;
  placeholder?: string;
  rules?: any;
  icon?: any;
  disable?: any;
  suffix?: any;
  isTextArea?: boolean;
  hidden?: boolean;
}

const ItemComponent = ({
  title,
  content = null,
  statusUpdate = false,
  dataIndex,
  selectField,
  addressField,
  autoCompleteField,
  isDateField,
  hidden,
  isNumberField,
  placeholder,
  isRadioField,
  treeField,
  suffix,
  isTextArea = false,
  disable = false,
  rules,
}: IProps) => {
  const [treeLine, setTreeLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(false);
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const getPanelValue = (searchText: string): { value: string }[] => {
    if (!searchText) {
      return [];
    }

    return (
      autoCompleteField?.dataSelect
        ?.filter((item: { name: string }) => item?.name?.includes(searchText))
        .map((item: { name: string; id: string }) => ({
          value: item.name,
          key: item?.id,
        })) || []
    );
  };
  const onSelect = (data: string, e: any) => {
    const itemSelected = autoCompleteField?.dataSelect.find(
      (item: any) => item?.id === e.key
    );
    autoCompleteField?.formData.setFieldsValue({
      technical_id: e.key,
      code: itemSelected.code,
      org_manage_id: itemSelected.org_manage_id?.id,
      ward_id: {
        province: itemSelected?.ward_id?.district_id?.province_id?.id,
        district: itemSelected?.ward_id?.district_id?.id,
        ward: itemSelected?.ward_id?.id,
      },
      address: itemSelected.address,
      description: itemSelected.description,
      is_offical: itemSelected.is_offical,
    });
  };
  const renderMajorCategories = () => {
    const showItems = (content ?? []).slice(0, 2);
    const moreItems =
      (content ?? []).length > 2 ? content.slice(2, content.length) : [];
    return (
      <div className="flex flex-row items-center w-full">
        {showItems.map((val: any, i: number) => {
          return (
            <div>
              <div
                key={i}
                className="mr-2 flex py-[2px] px-2 items-center justify-center rounded-[52px] bg-[#F0F0F0] border border-grayColor"
              >
                {val?.major_categories_id?.name ?? ""}
              </div>
            </div>
          );
        })}
        {moreItems.length ? (
          <div className="flex flex-row cursor-pointer">
            {" "}
            <Popover
              placement="right"
              rootClassName="border rounded-[12px]"
              arrow={false}
              content={
                <div className="min-w-40">
                  {moreItems.map((val: any, i: number) => {
                    return (
                      <div className="flex flex-row">
                        <div
                          key={i}
                          className="mr-2 my-1 flex py-[2px] px-2 items-center justify-center rounded-[52px] bg-[#F5F5F5] border border-[#F0F0F0]"
                        >
                          {val?.major_categories_id?.name ?? ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            >
              <div className="flex items-center justify-center py-[2px] px-2 rounded-[20px] border border-[#F0F0F0] bg-[#F5F5F6] text-xs font-normal">
                ...
              </div>
            </Popover>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };
  if (statusUpdate) {
    let initValue = null;

    if (dataIndex === "ward_id") {
      if (content) {
        initValue = {
          province: content?.district_id?.province_id?.id,
          district: content?.district_id?.id,
          ward: content?.id,
        };
      } else {
        initValue = {
          province: null,
          district: null,
          ward: null,
        };
      }
    } else if (dataIndex === "used_at" || dataIndex === "repair_at") {
      if (content) initValue = dayjs(content);
    } else if (dataIndex === "major_categories") {
      initValue = content?.map((item: any) => item?.major_categories_id?.id);
    } else {
      initValue = content?.name
        ? { value: content?.id, label: content?.name }
        : content;
    }
    return (
      <Form.Item
        className={`m-0 ${hidden ? "hidden" : ""}`}
        label={<span className="font-extrabold">{title}</span>}
        name={dataIndex}
        labelCol={{ span: 24 }}
        rules={rules}
        initialValue={initValue}
      >
        {selectField?.isSelect ? (
          <Select
            optionFilterProp="label"
            disabled={disable}
            showSearch={true}
            allowClear={true}
            options={selectField?.dataSelect}
          />
        ) : treeField?.isSelect ? (
          treeField?.isMultiple ? (
            <TreeSelect
              treeLine={treeLine && { showLeafIcon }}
              multiple
              showSearch
              filterTreeNode={(input: any, treeNode: any) => {
                return (
                  treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              style={{ width: "100%" }}
              placeholder="Chọn chuyên ngành"
              allowClear
              treeDefaultExpandAll
              treeData={treeField?.dataSelect}
            />
          ) : (
            <TreeSelect
              treeLine={treeLine && { showLeafIcon }}
              disabled={disable}
              showCheckedStrategy="SHOW_ALL"
              showSearch
              filterTreeNode={(input: any, treeNode: any) => {
                return (
                  treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              style={{ width: "100%" }}
              placeholder={treeField.placeholder || "Chọn đơn vị"}
              allowClear
              treeDefaultExpandAll
              treeData={treeField?.dataSelect}
            />
          )
        ) : isDateField ? (
          <DatePicker className="w-full" format={FormatDate.DayJSStandard} />
        ) : isNumberField ? (
          <InputNumber className="w-full" min={0} suffix={suffix} />
        ) : addressField ? (
          <AddressComponent placeholder="Tỉnh/TP, Quận/huyện, Phường/xã" />
        ) : autoCompleteField ? (
          <AutoComplete
            onSelect={onSelect}
            onSearch={(text) => setOptions(getPanelValue(text))}
            options={options}
          />
        ) : isTextArea ? (
          <TextArea />
        ) : isRadioField ? (
          <>
            {dataIndex === "is_enable" ? (
              <Radio.Group>
                <Radio value={true}>Hoạt động</Radio>
                <Radio value={false}>Không hoạt động</Radio>
              </Radio.Group>
            ) : (
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            )}
          </>
        ) : (
          <Input placeholder={placeholder} disabled={disable} />
        )}
      </Form.Item>
    );
  }
  return (
    <div className="flex flex-col gap-[10px]">
      <p className="font-bold text-sm">
        {title}
        {/* {require && <span className="text-red">*</span>} */}
      </p>
      {isRadioField ? (
        <>
          {dataIndex === "is_enable" ? (
            content ? (
              <span className="text-green-600">Hoạt động</span>
            ) : (
              <span className="text-red">Không hoạt động</span>
            )
          ) : content ? (
            <span className="text-green-600">Có</span>
          ) : (
            <span className="text-red">Không</span>
          )}
          {/* {dataIndex === "is_enable" ? <span className="text-green-600">Hoạt động</span> : <span className="text-red">Không hoạt động</span>} */}
        </>
      ) : (
        <>
          {dataIndex === "ward_id" ? (
            getFullAddressString(content)
          ) : dataIndex === "used_at" || dataIndex === "repair_at" ? (
            dayjs(content).format(FormatDate.DayJSStandard)
          ) : dataIndex === "is_offical" ? (
            OfficalLabel[content]
          ) : // content === OFFICAL.CHINH_THUC ? "Chính thức" : "Kiêm nhiệm"
          dataIndex === "level" ? (
            LevelCategoriesLabel[content]
          ) : dataIndex === "major_categories" ? (
            renderMajorCategories()
          ) : (
            <p className="text-sm font-normal">
              {content?.name
                ? content.name
                : content?.name === null
                ? ""
                : content}
            </p>
          )}
        </>
      )}
    </div>
  );
};
export default ItemComponent;
