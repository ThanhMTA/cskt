import { PersonalIdentifyType } from "../enums/PersonalIdentify.enum";

export interface PersonalIdentifyData {
  id: string;
  name: string;
  short_name?: string;
  e_qn?: string;
  cccd?: string;
  military_code?: string;
  gender: boolean;
  birthday?: string;
  address?: string;
  type: PersonalIdentifyType;
  ward_id?: string;
  rank_id?: string;
  position_id?: string;
  org_id?: string;
  is_enable: boolean;
  order_number: number;
  date_created: string;
  date_updated: null;
}