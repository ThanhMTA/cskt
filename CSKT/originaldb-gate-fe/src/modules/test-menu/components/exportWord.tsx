import React from "react";
import { Button } from "antd";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// export const generateWordFile = async () => {
//     try {
//         // 1️⃣ Tải file mẫu từ thư mục public
//         const response = await fetch("/template.docx");
//         if (!response.ok) throw new Error("Không tìm thấy file template");
        
//         const blob = await response.blob();
//         const content = await blob.arrayBuffer();
        
//         // 2️⃣ Đọc và xử lý file DOCX
//         const zip = new PizZip(content);
//         const doc = new Docxtemplater(zip);
        
//         // 3️⃣ Truyền dữ liệu động vào file, với mảng devices
//         const devices = [
//             { device_name: "Bảng mạch MIC", serial_number: "NN1MRT0X36GJ" },
//             { device_name: "Máy tính bàn", serial_number: "ABC123XYZ" },
//             { device_name: "Màn hình LED", serial_number: "XYZ456DEF" }
//         ];

//         doc.setData({
//             name: "Nguyễn Thái Khoa",
//             date: "10 tháng 02 năm 2025",
//             devices: devices,  // Truyền mảng vào
//         });

//         doc.render(); // Render dữ liệu

//         // 4️⃣ Xuất file DOCX mới
//         const output = doc.getZip().generate({ type: "blob" });
//         saveAs(output, "Bien_Ban_Ban_Giao.docx");

//     } catch (error) {
//         console.error("Lỗi khi tạo file Word:", error);
//     }
// };
export const generateWordFile = async () => {
    try {
        // 1️⃣ Tải file mẫu từ thư mục public
        const response = await fetch("/template.docx");
        if (!response.ok) throw new Error("Không tìm thấy file template");
        
        const blob = await response.blob();
        const content = await blob.arrayBuffer();
        
        // 2️⃣ Đọc và xử lý file DOCX
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);

        // 3️⃣ Truyền dữ liệu động vào file
        const devices = [
            { index: 1, device_name: "Bảng mạch MIC", serial_number: "NN1MRT0X36GJ" },
            { index: 2, device_name: "Bảng mạch SPF", serial_number: "NN1MRT0XVSGC" }
        ];

        doc.setData({
            name: "Nguyễn Thái Khoa",
            date: "10 tháng 02 năm 2025",
            devices,  // Gán danh sách vào template
        });

        doc.render(); // Render dữ liệu

        // 4️⃣ Xuất file DOCX mới
        const output = doc.getZip().generate({ type: "blob" });
        saveAs(output, "Bien_Ban_Ban_Giao.docx");

    } catch (error) {
        console.error("Lỗi khi tạo file Word:", error);
    }
};
