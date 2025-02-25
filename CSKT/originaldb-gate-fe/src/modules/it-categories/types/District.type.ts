import { ZoneCategoryData } from "@app/modules/technical-categories/types/ZoneCategory.types";
import { AdministrativeUnit } from "./AdministrativeUnit.type";
import { Province } from "./Province.type";

export type District = {
  admin_unit_id: string | AdministrativeUnit;
  code_ex: string;
  name: string;
  short_name: string;
  id: string;
  province_id: string | Province;
  is_enable: boolean;
  order_number: number;
  zone_id: string | ZoneCategoryData;
};
