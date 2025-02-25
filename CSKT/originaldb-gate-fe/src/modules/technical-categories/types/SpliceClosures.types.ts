import { TbvtCategories } from "@app/types/types";

export type SpliceClosuresData = {
  id: string;
  tbvt_id?: TbvtCategories;
  address?: string;
  ward_id?: string;
  reason?: string;
  repair_org_id?: string;
  repair_at?: string;
  repair_point?: string;
  fiber_line_id?: string;
  is_enable: boolean;
  desc?: string;
  attenuation_splice?: string;
  order_number?: number;
  created_at?: string;
  updated_at?: string;
};
