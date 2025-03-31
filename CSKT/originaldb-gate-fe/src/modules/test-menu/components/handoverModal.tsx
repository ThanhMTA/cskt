
import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
// import { Flex, Form, Space, Tooltip, Popconfirm, Button } from "antd";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
// import htmlDocx from "html-docx-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Button, DatePicker, Divider, Flex, Form, Input, Popconfirm,
  Radio, Select, Space, Tooltip, TreeSelect, Col, Row, Checkbox,
  Typography, Table, Descriptions, Card
} from "antd";
import { FailureData } from "../types/Failure.type";
import { createFailure, updateFailure, removeFailure } from "../stores/Failure.action";
import { getTTBDetail } from "../stores/QLTTB.action"
import { useMessage } from "@app/contexts/MessageContext";
import { Action } from "@app/enums";
// import { useMemo, ReactNode,} from "react";
import { ReactNode, useEffect, useState, useMemo, useRef } from "react";
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
import { createHandover, createHandoverList, getHandoverDetail, metaHandoverDetail } from "../stores/In_out.action";
import { handoverData } from "../types/handover.type";
const { Title, Text } = Typography;
// import { getCanBo } from "@app/modules/officer-categories/store/CanBoCategories.action";
import { CanBoCategoriesData } from "@app/modules/officer-categories/types/CanBoCategories.types";
import {generateWordFile} from "./exportWord";
type FailureCreateType = {
  action: Action;
  detail?: TTBData;

};

const Handover_View: React.FC<FailureCreateType> = ({
  action,
  detail
}) => {
  const [form] = Form.useForm();
  const { openMessage } = useMessage();
  const loading = useLoading();
  const modal = useModal();
  const [datasource, setDatasource] = useState<any[]>([])
  const [datasourceIn, setDatasourceIn] = useState<TTBData[]>([])
  const [data, setData] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: 1000 });
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [receiverList, setReceiverList] = useState<CanBoCategoriesData[]>([]);
  const [delivererList, setDelivererList] = useState<CanBoCategoriesData[]>([]);
  const [handoverdetail, setHandoverDetail] = useState<any>(null);
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
        title: "STT",
        dataIndex: "index",
        key: "index",
        width: 50,
        align: "center",
        render: (_: any, __: any, index: number) => {
          return (pagination.page - 1) * pagination.pageSize + index + 1;
        },
      },
      {
        title: "Tên trang bị",
        dataIndex: "name",
        fixed: 'left',
        // key: TableGeneralKeys.Name,
        render: (value: any, record: any) => record?.id_tb?.name ?? '',
      },
      {
        title: "Đơn vị tính",
        dataIndex: "unit_id",
        key: "unit_id",
        width: 100,
        render: (value: any, record: any) => record?.id_tb?.unit_id?.name ?? '',

      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        width: 90,
        render: (value: any, record: any) => record?.id_tb?.quantity ?? '',

      },
      {
        title: "serial number",
        dataIndex: "serial_number",
        width: 170,
        render: (value: any, record: any) => record?.id_tb?.serial_number ?? '',

      },

      {
        title: "Tình trạng",
        dataIndex: "condition_id",
        key: "condition_id",
        width: 170,
        render: (value: any, record: any) => record?.id_tb?.condition_id?.name ?? '',
      },


    ];
  }, []);
  const getDetail = async () => {
    try {
      const res = await getHandoverDetail(detail?.id);
      setDatasource(res);
      // setHandoverDetail(datasource[0])



    } catch (e) {
      console.log(e)
      // setIsIoading(false)
    }
  }



  useEffect(() => {
    getDetail()
    setHandoverDetail(datasource[0])
  })
  // console.log("kta:",handoverdetail)
  // const handoverdetail = datasource?.[0];
  // Kiểm tra giá trị trước
  // Chạy lại khi `handoverdetail` thay đổi

  const date = new Date(handoverdetail?.id_handover?.time ?? '');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // const handleExport = () => {
  //   ExportToWord({ handoverdetail, datasource });
  // };
  // const pdfRef = useRef(); // Tạo ref để lấy nội dung cần xuất
  const pdfRef = useRef<HTMLDivElement | null>(null);

  const exportPDF = () => {
    const input = pdfRef.current;
    if (!input) return; // Tránh lỗi nếu ref chưa được gán

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Chiều rộng A4 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("handover_document.pdf");
    });
  };
  // const wordRef = useRef<HTMLDivElement | null>(null); 
//   const generateWordFile = () => {
//     const doc = new Document({
//         sections: [
//             {
//                 properties: {},
//                 children: [
//                     new Paragraph({
//                         children: [
//                             new TextRun("Hello, đây là file Word xuất từ ReactJS!"),
//                             new TextRun({
//                                 text: " Được tạo bằng thư viện docx.",
//                                 bold: true,
//                             }),
//                         ],
//                     }),
//                 ],
//             },
//         ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//         saveAs(blob, "document.docx");
//     });
// }; 
  return (
    <Space
      {...SPACE_PROP_DEFAULT}
      className="flex"
    // size={20}
    >

      <div ref={ pdfRef } style={{ padding: 20, background: "#fff" }}>

        {/* <Card style={{ width: "90%", margin: "auto", padding: "20px", border: "1px solid #000" }}> */}
          {/* Phần Header */}
          <Row>
            <Col span={8} style={{ textAlign: "center" }}>
              <Text strong>TRUNG TÂM KTTT CNC</Text>
              <br />
              <Text strong>PHÒNG KỸ THUẬT</Text>
              <br />
              <Text strong>TRUYỀN DẪN THÔNG TIN VỆ TINH</Text>
            </Col>
            <Col span={8}></Col>
            <Col span={8} style={{ textAlign: "center" }}>
              <Text strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
              <br />
              <Text strong>Độc lập - Tự do - Hạnh phúc</Text>
              <br />
              <Text italic>Hà Nội, ngày {day} tháng {month} năm {year} </Text>
            </Col>
          </Row>

          {/* Tiêu đề */}
          <Title level={3} style={{ textAlign: "center", marginTop: "20px" }}>
            BIÊN BẢN BÀN GIAO
          </Title>

          {/* Nội dung mô tả */}
          <Typography.Paragraph style={{ textAlign: "justify" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp; Hôm nay, ngày {day} tháng {month} năm {year} , chúng tôi thực hiện {handoverdetail?.id_handover?.title ?? ''}, cụ thể như sau:
          </Typography.Paragraph>

          {/* Thông tin Bên giao & Bên nhận */}
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="I. BÊN GIAO" labelStyle={{ width: 150 }}>
              <b>{handoverdetail?.id_handover?.org_delivery_id?.name ?? ''}</b>

              <br />
              - Đại diện: Đ/c: {handoverdetail?.id_handover?.deliverer_id?.capbac_id?.short_name ?? ''} {handoverdetail?.id_handover?.deliverer_id?.name ?? ''}

              <br />
              - Chức vụ: {handoverdetail?.id_handover?.deliverer_id?.chucvu_id?.name ?? ''}
            </Descriptions.Item>
            <Descriptions.Item label="II. BÊN NHẬN" labelStyle={{ width: 150 }}>
              <b>{handoverdetail?.id_handover?.org_receive_id?.name ?? ''}</b>
              <br />
              - Đại diện: Đ/c: {handoverdetail?.id_handover?.receiver_id?.capbac_id?.short_name ?? ''} {handoverdetail?.id_handover?.receiver_id?.name ?? ''}
              <br />
              - Chức vụ: {handoverdetail?.id_handover?.receiver_id?.chucvu_id?.name ?? ''}
            </Descriptions.Item>
          </Descriptions>

          {/* Bảng nội dung bàn giao */}
          <Title level={4} style={{ marginTop: "20px" }}>
            III. NỘI DUNG BÀN GIAO
          </Title>
          <Table
            columns={columns}
            dataSource={datasource}
            pagination={false}
            bordered
            size="middle"
          />

          {/* Ghi chú cuối */}
          <Typography.Paragraph style={{ marginTop: "20px", textAlign: "justify" }}>
            Biên bản này được lập thành 02 bản, có giá trị như nhau; mỗi bên giữ 01 bản.
          </Typography.Paragraph>

          {/* Ký tên */}
          <Row style={{ marginTop: "20px", textAlign: "center", fontWeight: "bold" }}>
            <Col span={12}><b>BÊN GIAO</b></Col>
            <Col span={12}><b>BÊN NHẬN</b></Col>
          </Row>
          <Row style={{ marginTop: "60px", textAlign: "center" }}>
            <Col span={12}>
              <Text ><b>
                {handoverdetail?.id_handover?.deliverer_id?.capbac_id?.short_name ?? ''} {handoverdetail?.id_handover?.deliverer_id?.name ?? ''}

              </b></Text>
            </Col>
            <Col span={12}>
              <Text>
                <b>
                  {handoverdetail?.id_handover?.receiver_id?.capbac_id?.short_name ?? ''} {handoverdetail?.id_handover?.receiver_id?.name ?? ''}
                </b>
              </Text>
            </Col>
          </Row>

        {/* </Card> */}


      </div>
      <div style={{ textAlign: "right", marginLeft: "50px" }}>
          {/* <Button type="primary"
         onClick={handleExport}
        >
          Xuất file Word
        </Button> */}
          <Button
            //  onClick={exportToWord}
            // onClick={exportPDF}
            onClick={generateWordFile}
            type="primary"
          >
            Xuất file
          </Button>

        </div>
    </Space>


  );
};

export default Handover_View;
