import { AdministrativeUnit } from "../types/AdministrativeUnit.type";
import { MilitaryDistrict } from "../types/MilitaryDistrict.type";
import { Region } from "../types/Region.type";

export interface IProvinceActionSelect {
  adminUnits: AdministrativeUnit[];
  regions: Region[];
  militaryDistricts: MilitaryDistrict[];
}
