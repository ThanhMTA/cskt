import { ReasonCategoriesTypeFor } from "../enums/ReasonCategories.enum";

export interface ConditionCategoriesData {
  id: string;
  date_created: string;
  date_updated: null;
  name: string;
  code: string;
  type_for: ReasonCategoriesTypeFor;
  is_enable: boolean;
  order_number: number;
}