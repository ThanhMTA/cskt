import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
// import { Flex, Form, Space, Tooltip, Popconfirm, Button } from "antd";
import {
  Button, DatePicker, Divider, Flex, Form, Input, Popconfirm,
  Radio, Select, Space, Tooltip, TreeSelect, Col, Row, Checkbox
} from "antd";
import { FailureData } from "../types/Failure.type";
import { createFailure, updateFailure, removeFailure } from "../stores/Failure.action";
import { getTTBDetail } from "../stores/QLTTB.action"
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
// import { useMemo, ReactNode,} from "react";
import { ReactNode, useEffect, useState, useMemo } from "react";
import { TTBData } from "../types/TTB.type";
import { TABLE_FIELD_NAME } from "@app/constants/table.constant";
import ItemComponent from "@app/components/ItemsComponent";
import ModalCategoryActionHeader from "@app/components/ModalCategoryActionHeader";
import { useLoading } from "@app/contexts/LoadingContext";
import { useModal } from "@app/contexts/ModalContext";
import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import BaseTable from "@app/components/BaseTable";
import { TableGeneralKeys } from "@app/enums/table.enum";
import { getTTB, metaTTB } from "../stores/QLTTB.action";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { listToTree } from "@app/core/helper";
import { arrayToTree } from "performant-array-to-tree";
import { getUsersList, metaUsers, getOrganizationTree } from "../stores/Account.action";
import { FilterFilled, MenuFoldOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { IMeta } from "@app/interfaces/common.interface";
import { getCanBo } from "../stores/In_out.action";
import { createHandover, createHandoverList } from "../stores/In_out.action";
// import { getCanBo } from "@app/modules/officer-categories/store/CanBoCategories.action";
import { CanBoCategoriesData } from "@app/modules/officer-categories/types/CanBoCategories.types";
type FailureCreateType = {
  action: Action;
  detail?: TTBData;

};

const In_OutCreate: React.FC<FailureCreateType> = ({
  action,
  detail
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();
  const [datasource, setDatasource] = useState<TTBData[]>([])
  const [datasourceIn, setDatasourceIn] = useState<TTBData[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [receiverList, setReceiverList] = useState<CanBoCategoriesData[]>([]);
  const [delivererList, setDelivererList] = useState<CanBoCategoriesData[]>([]);

  const handleDelete = async () => {
    try {
      await removeFailure(detail?.id);
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
  const onFinish = async () => {
    try {
      loading.show()
      const value: any = form.getFieldsValue();
      switch (action) {
        case Action.Update:
          await updateFailure(detail?.id, value);
          openMessage({
            type: "success",
            content: `Cập nhật thành công`
          })
          break;
        case Action.Create:
          const handoverRes = await createHandover(value);
          const handoverId = handoverRes.id;
          const handoverListData = datasourceIn.map((item) => ({
            id_handover: handoverId,
            id_tb: item.id,
          }));
          await Promise.all(handoverListData.map((item) => createHandoverList(item)));
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

  const columns: any[] = useMemo(() => {
    return [
      {
        title: "Tên trang bị",
        dataIndex: "name",
        fixed: 'left',
        key: TableGeneralKeys.Name,
        render: (value: string, record: any) => {
          // console.log('record: ', record)
          return (
            <span
              className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
              // onClick={() => handleActions(Action.View, record)}
              onClick={() => handleRowClick(pagination.page, pagination.pageSize, record)}

            >
              {value ?? ""}
            </span>
          );
        },
      },
      {
        title: "Ký hiệu",
        dataIndex: "nick_name",
        key: "nick_name",
        render: (value: any) => {
          return value
        },
        //     width:150

      },
      {
        title: "serial number",
        dataIndex: "serial_number",
        render: (value: any) => {
          return value
        },
      },
      {
        title: "Đơn vị biên chế",
        dataIndex: "org_id",
        key: "org_id",
        render: (value: any, record: any) => record?.org_id?.name ?? '',
      },

      {
        title: "Tình trạng",
        dataIndex: "condition_id",
        key: "condition_id",
        render: (value: any, record: any) => record?.condition_id?.name ?? '',
      },


    ];
  }, []);
  const columns1: any[] = useMemo(() => {
    return [
      {
        title: "Tên trang bị",
        dataIndex: "name",
        fixed: 'left',
        key: TableGeneralKeys.Name,
        render: (value: string, record: any) => {
          console.log('record: ', record)
          return (
            <span
              className="font-semibold text-sm cursor-pointer text-[#3D73D0]"
            // onClick={() => handleActions(Action.View, record)}
            >
              {value ?? ""}
            </span>
          );
        },
      },
      {
        title: "Ký hiệu",
        dataIndex: "nick_name",
        key: "nick_name",
        render: (value: any) => {
          return value
        },
        //     width:150

      },
      {
        title: "serial number",
        dataIndex: "serial_number",
        render: (value: any) => {
          return value
        },
      },
      {
        title: "Tình trạng",
        dataIndex: "condition_id",
        key: "condition_id",
        render: (value: any, record: any) => record?.condition_id?.name ?? '',
      },

      {

        title: "Bỏ chọn",
        dataIndex: "is_enable",
        fixed: 'right',
        key: "is_enable",
        width: 80,
        render: (_: any, record: any) => (
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleDeleteClick(record)}
          >
            <DeleteOutlined style={{ color: 'red', fontSize: 16 }} />
          </div>
        )

      },
    ];
  }, []);



  const fetchData = async (
    page: number,
    pageSize: number,
    filter: any
  ) => {
    setIsLoading(true);
    try {

      const res = await Promise.all([
        getTTB({ limit: pageSize, page }, filter),
        getOrganizationTree(),
        metaTTB(filter)


      ]);

      setOrganizations(res[1])
      setDatasource(res[0])
      setMeta(res[2]);

      // setPlaces(response[3])
      // console.log('data: ', response[3])

    } catch (error) {
      console.log('error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const reloadData = async () => {
    try {
      fetchData(pagination.page, pagination.pageSize, filter)
    } catch (error: any) {
      console.log('error: ', error)
    }
  }
  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize, filter)
  }, [pagination, filter])
  const handleRowClick = async (
    page: number,
    pageSize: number,
    record: any
  ) => {
    try {
      const res = await getTTBDetail(record.id, {});

      setDatasourceIn(prev => {
        const isExist = prev.some(item => item.id === res.id);
        if (isExist) return prev; // Đã tồn tại thì giữ nguyên, không thêm nữa
        return [...prev, res];    // Nếu chưa có thì thêm vào danh sách
      });

    } catch (error) {
      console.log("Lỗi khi lấy chi tiết TTB:", error);
    }
  };
  const handleDeleteClick = (record: any) => {
    setDatasourceIn(prev => prev.filter(item => item.id !== record.id));
  };

  const ManagementOptions: any = [
    {
      title: "Giao",
      key: "Giao",
    },
    {
      title: "Nhận",
      key: "Nhận",
    },

  ];

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
      //  className={`absolute left-0 right-0 px-6 pb-3 z-50 bg-[#f0f4ff] border-b border-[#d0d7e2] text-[#1e2a3a]`}
      >
        {action === Action.Create ? (
          <div className="text-[22px] font-bold">{`Thông tin biên bản bàn giao`}</div>
        ) : (
          <div className="text-[22px] font-bold">{`Thông tin trang thiết bị ${detail?.name}`}</div>
        )}
        <div className="flex flex-row gap-3">
          {action === Action.View ? (
            <>
              <Tooltip title="Xóa">
                <Popconfirm
                  title={MESSAGE_CONTENT.DELETE}
                  onConfirm={() => { }}
                  okText={BUTTON_LABEL.CORRECT}
                  cancelText={BUTTON_LABEL.NO}
                >
                  <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Chỉnh sửa">
                <Button
                  onClick={hanldeFinish}
                  type="default"
                  icon={<EditOutlined />}
                  shape="circle"
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Xóa">
                <Popconfirm
                  title={MESSAGE_CONTENT.DELETE}
                  onConfirm={handleDelete}
                  okText={BUTTON_LABEL.CORRECT}
                  cancelText={BUTTON_LABEL.NO}
                >
                  <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Lưu">
                <Button
                  onClick={() => {
                    form.submit();
                  }}
                  type="default"
                  icon={<CheckOutlined />}
                  shape="circle"
                />
              </Tooltip>
            </>
          )}


        </div>
        {/* <ModalCategoryActionHeader name="chức vụ" action={action} hanldeFinish={hanldeFinish} handleDelete={handleDelete} /> */}
      </Flex>
      {/* <Divider /> */}
      <Divider className="m-2" />

      <Row
        className={`bg-[#f0f4ff] border-b border-[#d0d7e2] text-[#1e2a3a] p-1`}

      >
        <Col span={12} push={12}>
          <Form
            form={form}
            onFinish={onFinish}
            layout='horizontal'
            labelCol={{ span: 9 }}
            labelAlign="left"
            className="form-item rounded px-6 py-2"
            requiredMark={(label: ReactNode, info: { required: boolean }) => {
              return (
                <>
                  {label} {info?.required ? <span className="text-red"> &nbsp;*</span> : ""}
                </>
              );
            }}
            disabled={action === Action.View}
          >



            {/* Hiển thị tên trang bị */}
            <Form.Item
              className="mb-4"
              name={"type_handover"}

              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Loại biên bản
                </div>
              }
            >
              <Radio.Group
                className="flex flex-row flex-wrap gap-4"

              >
                {ManagementOptions?.map((value: { title: string; key: string }, index: number) => (
                  <Radio key={value.key} value={value.title}>
                    <span className="text-[14px] font-normal leading-[23px]">
                      {value.title}
                    </span>
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              className="mb-4"
              name={"name"}
              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Mã biên bản
                </div>
              }
            >
              {action === Action.Create || Action.Update ? (
                <Input placeholder="Nhập mã biên bản" className="border-0 " style={{ resize: "none" }} />
                
              ) : (
                <p className="px-[12px] text-[15px]">
                  {form.getFieldValue("name") || ""}
                </p>
              )}
            </Form.Item>
            <Form.Item
              className="mb-4"
              name={"title"}
              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Nội dung bàn giao
                </div>
              }
            >
              {action === Action.Create || Action.Update ? (
                <Input placeholder="Nhập nội dung" className="border-0 " style={{ resize: "none" }} />
                
              ) : (
                <p className="px-[12px] text-[15px]">
                  {form.getFieldValue("title") || ""}
                </p>
              )}
            </Form.Item>
            <Form.Item
              className="mb-4"
              name={"org_receive_id"}
              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Đơn vị nhận
                </div>
              }

            >
              {action === Action.Create || Action.Update ? (
                <TreeSelect
                  multiple
                  // multiple={false} 

                  showCheckedStrategy="SHOW_ALL"
                  treeCheckable
                  // size="mi"
                  showSearch
                  className="min-w-[200px] max-w-[300px]"
                  filterTreeNode={(input: any, treeNode: any) => {
                    return (
                      treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  // className="-mt-3"
                  // style={{ width: "100%" }}
                  placeholder="Chọn đơn vị"
                  allowClear
                  treeDefaultExpandAll
                  // treeData={organizationTree}
                  treeData={listToTree(arrayToTree([...organizations], { dataField: null }))}
                onChange={(checkedValues) => {
                   form.setFieldsValue({ org_receive_id: checkedValues[0] });
                  if (checkedValues?.length > 0) {
                    // ví dụ lấy cái đầu tiên
                    getCanBo(checkedValues)
                      .then((res) => {
                        setReceiverList(res);
                      })
                      .catch(console.error);

                  }
                
                
                
                }
              }
                />
              ) : (
                <p className="px-[12px] text-[15px]">
                  {form.getFieldValue("org_receive_id") || ""}
                </p>
              )}
            </Form.Item>

            <Form.Item
              className="mb-4"
              name={"receiver_id"}
              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Người nhận
                </div>
              }

            >
              {action === Action.Create || Action.Update ? (
                // <Input placeholder="Nhập tiêu đề" className="border-0 " style={{ resize: "none" }} />
                <Select
                className="flex border-0 w-full"
                allowClear
                placeholder="Chọn nhóm người nhận"
                options={receiverList.map((item) => ({
                  label: item.name,  // hoặc item.ten_nhom, tùy theo key của bạn
                  value: item.id,    // hoặc item.group_id
                }))}
                showSearch
                filterOption={(input: string, option: any) => {
                    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                }}
                // onChange={(checkedValues) => {
                //     form.setFieldsValue({ group_id: checkedValues });
                //     formValueChange();
                // }}
            />
              ) : (
                <p className="px-[12px] text-[15px]">
                  {form.getFieldValue("receiver_id") || ""}
                </p>
              )}
            </Form.Item>
            <Form.Item
              className="mb-4"
              name={"org_delivery_id"}
              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Đơn vị giao
                </div>
              }

            >
              {action === Action.Create || Action.Update ? (
                <TreeSelect
                  multiple
                  // multiple={true} 
                  showCheckedStrategy="SHOW_ALL"
                  treeCheckable
                  // size="small"
                  showSearch
                  className="min-w-[200px] max-w-[300px]"
                  filterTreeNode={(input: any, treeNode: any) => {
                    return (
                      treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  // className="-mt-3"
                  // style={{ width: "100%" }}
                  placeholder="Chọn đơn vị"
                  allowClear
                  treeDefaultExpandAll
                  // treeData={organizationTree}
                  treeData={listToTree(arrayToTree([...organizations], { dataField: null }))}
                  onChange={(checkedValues) => {
                   form.setFieldsValue({ org_delivery_id: checkedValues[0] });

                    if (checkedValues?.length > 0) {
                      // ví dụ lấy cái đầu tiên
                      getCanBo(checkedValues)
                        .then((res) => {
                          setDelivererList(res);
                        })
                        .catch(console.error);
  
                    }
                    // console.log("ktra canbo:", receiverList)
                  }
                }
                />
              ) : (
                <p className="px-[12px] text-[15px]">
                  {form.getFieldValue("org_delivery_id") || ""}
                </p>
              )}
            </Form.Item>

            <Form.Item
              className="mb-4"
              name={"deliverer_id"}
              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Người giao
                </div>
              }

            >
              {action === Action.Create || Action.Update ? (
                // <Input placeholder="Nhập tiêu đề" className="border-0 " style={{ resize: "none" }} />
                <Select
                className="flex border-0 w-full"
                allowClear
                placeholder="Chọn người giao"
                options={delivererList.map((item) => ({
                  label: item.name,  // hoặc item.ten_nhom, tùy theo key của bạn
                  value: item.id,    // hoặc item.group_id
                }))}
                showSearch
                filterOption={(input: string, option: any) => {
                    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                }}
                // onChange={(checkedValues) => {
                //     form.setFieldsValue({ group_id: checkedValues });
                //     formValueChange();
                // }}
            />
              ) : (
                <p className="px-[12px] text-[15px]">
                  {form.getFieldValue("deliverer_id") || ""}
                </p>
              )}
            </Form.Item>

            <Form.Item
              className="mb-4"
              name={"time"}
              label={
                <div className="flex text-[15px] justify-items-start gap-x-1">
                  Thời gian
                </div>
              }
            >
              {action === Action.Create || Action.Update ? (
                <DatePicker
                  size='middle'
                  allowClear
                  showTime
                  className="flex border-0 w-full"
                  placeholder="Chọn ngày xảy ra sự cố"
                />
              ) : (
                <p className="px-[12px] text-[15px]">
                  {form.getFieldValue("time") || ""}
                </p>
              )}
            </Form.Item>
            <Form.Item>
              <BaseTable
                // loading={isLoading}
                columns={columns1}
                dataSource={datasourceIn}
                // setPagination={setPagination}
                rowKey={"id"}
                // actionClick={handleActions}


                x={800}



                onChange={({ current, pageSize }: any) => {
                  setPagination({ page: current, pageSize });
                  fetchData(current, pageSize, filter);
                }}
                paginationCustom={
                  {
                    current: pagination.page,
                    pageSize: pagination.pageSize,
                    // total: meta?.count || 0
                  }
                }
              />
            </Form.Item>

          </Form>
        </Col>
        <Col span={12} pull={12}>
          <div className="flex flex-row pb-2 items-center justify-end">
            <div className="flex flex-row items-center min-w-200 gap-2">

              <Input
                size="small"
                className="rounded-full"
                placeholder="Nhập tên trang thiết bị"
                allowClear
                onChange={(e: any) => {
                  setPagination({ page: 1, pageSize: DEFAULT_PAGESIZE });
                  if (e.target.value !== '') {
                    setFilter((prev: any) => ({
                      ...prev,
                      name: {
                        _contains: e.target.value,
                      },
                    }));
                  } else {
                    const { name, ...filterWithoutFullName } = filter;
                    setFilter(filterWithoutFullName)
                  }
                }}
                suffix={<SearchOutlined className="text-primary" />}
              />

            </div>
          </div>

          <BaseTable
            loading={isLoading}
            columns={columns}
            dataSource={datasource}
            setPagination={setPagination}
            rowKey={"id"}
            // actionClick={handleActions}


            x={800}



            onChange={({ current, pageSize }: any) => {
              setPagination({ page: current, pageSize });
              fetchData(current, pageSize, filter);
            }}
            paginationCustom={
              {
                current: pagination.page,
                pageSize: pagination.pageSize,
                total: meta?.count || 0
              }
            }
          // onRow={(record: any) => ({
          //   onClick: () => handleRowClick(record),
          // })}
          />
        </Col>
      </Row>

    </Space>
  );
};

export default In_OutCreate;
