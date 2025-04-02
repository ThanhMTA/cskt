import { Ward } from "@app/modules/it-categories/types/Ward.type";

export interface ITechnicalAssuranceActionSelect {
  wards: Ward[];
  organizations: any[];
  type: any[];
  majors: any[];
  technical_orgs?: any[];
}
