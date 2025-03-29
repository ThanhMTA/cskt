import internal from "stream";

export type handoverData = {
    id: string;
    name: string;// mã
    time: string;// thời gian lập biên bản
    title:string;
    type_handover:string;// loại bàn giao
    org_delivery_id:string;// id dơn vị giao
    org_receive_id:string;// id đơn vị nhận 
    deliverer_id:string;// id người giao
    receiver_id:string;// id người nhận
    created_at?:string;
    updated_at?:string;

  }