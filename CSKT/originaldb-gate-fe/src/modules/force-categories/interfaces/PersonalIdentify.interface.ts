import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { RankCategoriesData } from "@app/modules/officer-categories/types/RankCategories.types";
import { PositionCategoriesData } from "@app/modules/officer-categories/types/PositionCategories.types";
import { OrganizationsData } from "../types/Organizations.types";

export interface IPersonalIdentifySelection {
  wards: Ward[];
  ranks: RankCategoriesData[];
  positions: PositionCategoriesData[];
  organizations: OrganizationsData[];
}