import { AdministrativeUnit } from "../types/AdministrativeUnit.type";
import { District } from "../types/District.type";

export interface IWardActionSelect {
  adminUnits: AdministrativeUnit[];
  districts: District[];
}
