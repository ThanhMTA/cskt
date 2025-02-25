import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { StationFunctionData } from "../types/StationFunction.types";
import { StationTypeData } from "../types/StationType.types";
import { WorkstationsData } from "../types/Workstations.types";

export interface IWorkstationsActionSelect {
  wards: Ward[];
  organizations: any[];
  stationFunctions: StationFunctionData[];
  stationType: StationTypeData[];
  stationParent: WorkstationsData[];
}