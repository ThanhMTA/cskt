import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { OpticalFiberLinesData } from "../types/OpticalFiberLines.types";
import { ReasonCategories, TbvtCategories } from "@app/types/types";

export interface ISpliceClosuresSelect {
  organizations: any[];
  wards: Ward[];
  opticalFiberLine: OpticalFiberLinesData[];
  vtkt: TbvtCategories[];
  reasons: ReasonCategories[];
}
