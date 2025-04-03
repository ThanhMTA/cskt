import internal from "stream";

export type TTBData = {
    id: string;
    name: string;// tên trang bị
    short_name: string;// tên viết tắt của trang bị 
    nick_name: string;// kí hiệu trang bị
    serial_number:string;// số serial number
    quantity:internal;// số lượng
    hierarchy:string;// phân cấp
    condition_id:string;// tình trạng
    org_id:string;// đơn vị được biên chế
    species_id:string;// chủng loại
    unit_id:string;// đơn vị tính
    investor_id:string; // nguồn đầu tư
    management_unit:string;// đơn vị quản lý
    manager_id:string;// người quản lý
    manufacturer_id:string;// hãng sản xuất 
    place_id:string;// vị trí hiện tại của trang thiết bị
    is_enable: boolean;
    store_id:string;
    group_id:string;
    created_at?:string;
    updated_at?:string;
    // user_created?:string;
    // user_updated?:string;
  }