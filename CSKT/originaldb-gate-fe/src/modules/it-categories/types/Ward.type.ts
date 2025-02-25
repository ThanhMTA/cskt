import { AdministrativeUnit } from "./AdministrativeUnit.type";
import { District } from "./District.type";

export type Ward = {
  admin_unit_id: string | AdministrativeUnit;
  code_ex: string;
  name: string;
  short_name: string;
  id: string;
  district_id: string | District;
  is_enable: boolean;
  order_number: number;
};
