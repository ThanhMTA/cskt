import { TypeCabble } from "../enums/OpticalFiberLines.enum";

export type OpticalFiberLinesData = {
  id: string;
  name: string;
  short_name?: string;
  org_id?: any;
  org_use_id?: any;
  org_technical_id?: any;
  org_suport_id?: any;
  length?: number;
  manage_length?: number;
  coordinates?: any[];
  type_id?: any;
  type_cabble?: TypeCabble;
  first_point?: string;
  final_point?: string;
  number_of_fiber?: number;
  desc?: string;
  is_enable: boolean;
  order_number?: number;
  created_at?: string;
  updated_at?: string;
  longitude?: string;
  latitude?: string;
};
