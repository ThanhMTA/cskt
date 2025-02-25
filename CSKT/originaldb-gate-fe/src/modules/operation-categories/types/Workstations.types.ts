export type WorkstationsData = {
  id: string;
  name: string;
  short_name?: string;
  symbol?: string;
  phone_number?: string;
  contact_method?: string;
  address?: string;
  org_id?: string;
  org_use_id?: string;
  org_technical_id?: string;
  org_support_id?: string;
  ward_id?: string;
  function_id?: string;
  area?: string | number;
  coordinates?: string;
  type_id?: string;
  desc?: string;
  is_enable: boolean;
  order_number?: number;
  parent_id?: string;
  parent?: any;
  created_at?: string;
  updated_at?: string;
  file_path?: string;
  longitude?: string; // kinh độ
  latitude?: string;

  // id_ex?: string;
  // code_ex?: string;
};
