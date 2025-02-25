import { TBVTCategoriesType } from "../enums/TBVTCategories.enum";

export interface TBVTCategoriesData {
  id: string;
  name: string;
  code?: string;
  origin_id?: string;
  unit?: string;
  is_planning?: boolean;
  species_id?: string;
  type: TBVTCategoriesType;
  has_child: boolean;
  is_enable: boolean;
  id_ex?: string;
  code_ex?: string;
  children?: any[];
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  parent_id?: string;
  tree_level: number;
  major_categories?: any;
  tree_path?: string;
  order_number: number;
  parent?: any;
  date_created: string;
  date_updated: null;
}
