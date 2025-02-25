import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { OpticalFiberLinesData } from "../types/OpticalFiberLines.types";

export interface ICableBoxesSelect {
  wards: Ward[];
  opticalFiberLines: OpticalFiberLinesData[];
}