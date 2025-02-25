import { ZoneCategoryData } from "@app/modules/technical-categories/types/ZoneCategory.types";
import { AdministrativeUnit } from "../types/AdministrativeUnit.type";
import { Province } from "../types/Province.type";

export interface IDistrictActionSelect {
  adminUnits: AdministrativeUnit[];
  provinces: Province[];
  zones: ZoneCategoryData[];
}
