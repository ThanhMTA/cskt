import { Country } from "@app/modules/it-categories/types/Country.type";
import { UnitCategoriesData } from "../types/UnitCategories.types";
import { SpeciesCategoriesData } from "../types/SpeciesCategories.types";
import { TBVTCategoriesData } from "../types/TBVTCategories.types";

export interface ITBVTCategoriesSelection {
  country: Country[];
  units: UnitCategoriesData[];
  species: SpeciesCategoriesData[];
  tbvt: TBVTCategoriesData[];
  major_categories: any[];
}
