import { RankCategoriesData } from "../types/RankCategories.types";
import { PositionCategoriesData } from "../types/PositionCategories.types";
import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { OrganizationsData } from "@app/modules/force-categories/types/Organizations.types";
export interface ICanBoActionSelect {
  capbacs: RankCategoriesData[];
  chucvus: PositionCategoriesData[];
  diachis:Ward[];
  donvis:OrganizationsData[];

}
