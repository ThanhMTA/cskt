import { ReasonCategoriesTypeFor } from "../enums/ReasonCategories.enum";

export type ReasonCategoriesData = {
  id: string;
  name: string;
  order_number?: number;
  type_for: ReasonCategoriesTypeFor
  code?:string;
  is_enable?: boolean;
}

// interface RootObject {
//   id: string;
//   date_created: string;
//   date_updated: null;
//   name: string;
//   code: string;
//   type_for: string;
//   order_number: null;
// }