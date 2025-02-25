import { MilitaryDistrict } from "@app/modules/it-categories/types/MilitaryDistrict.type";
import { Ward } from "@app/modules/it-categories/types/Ward.type";

export interface IOrganizationsDataSelection {
  wards: Ward[];
  militaryDistrict: MilitaryDistrict[];
  organizations: any[];
}
