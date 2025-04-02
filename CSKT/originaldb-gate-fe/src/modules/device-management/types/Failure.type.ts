import internal from "stream";

export type FailureData = {
    id: string;
    name: string;// tiêu đề sự cố
    content: string;// nội dung sự cố
    time: string;// thời gian xảy ra sự cố
    condition:string;// tình trạng trang thiết bị
    TTB_id:string;// id trang thiết bị
    created_at?:string;
    updated_at?:string;
    // user_created?:string;
    // user_updated?:string;
  }