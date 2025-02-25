import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { PoleTypeData } from "../types/PoleType.types";

export interface IPolesSelect {
  organizations: OrganizationsData[];
  poleType: PoleTypeData[];
}