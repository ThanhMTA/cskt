export type MobileVehiclesData = {
  id: string;
  name: string;
  code: string;
  serial_number?: string;
  org_id?:string;
  origin_id?:string;
  quality?: number;
  eid?:string;
  used_at?:string;
  is_enable: boolean;
  order_number?: number;
  created_at?: string;
  updated_at?: string;
}