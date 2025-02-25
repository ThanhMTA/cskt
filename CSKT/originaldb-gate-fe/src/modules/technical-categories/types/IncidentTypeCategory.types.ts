export type IncidentTypeCategoryData = {
  id: string;
  name: string;
  short_name: string;
  note?: string;
  is_enable: boolean;
  order_number: number;
  created_at?:string;
  updated_at?:string;
}