import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { DrainTankTypeData } from "../types/DrainTankType.types";

export interface IDrainTanksSelect {
  wards: Ward[];
  organizations: OrganizationsData[];
  drainTankType: DrainTankTypeData[];
}