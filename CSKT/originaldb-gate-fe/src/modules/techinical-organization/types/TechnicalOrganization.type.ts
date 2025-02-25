import { MajorCategoriesData } from "@app/modules/force-categories/types/MajorCategories.types";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { TechnicalTypeData } from "./TechnicalType.type";

export type TechnicalOrganizationData = {
  id?: string;
  name: string;
  date_created: Date;
  date_updated: Date;
  code?: string;
  ward_id?: Ward | string;
  address?: string;
  org_manage_id?: OrganizationsData;
  description?: string;
  is_offical?: string;
  level?: string; //Cấp chiến lược, chiến dịch, chiến thuật
  major_id?: MajorCategoriesData | string;
  type_id?: TechnicalTypeData | string;
  vtkt_ids?: string[];
  llkt_ids?: string[];
};
