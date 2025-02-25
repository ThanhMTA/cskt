import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { Ward } from "@app/modules/it-categories/types/Ward.type";

export interface IDefenseLandsSelect {
  wards: Ward[];
  organizations: OrganizationsData[];
}