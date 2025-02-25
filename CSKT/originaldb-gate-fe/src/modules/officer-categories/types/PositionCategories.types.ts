export type PositionCategoriesData = {
  id: string;
  name: string;
  short_name: string;
  code_ex: string;
  id_ex: string;
  is_enable: boolean;
  code: string; // -- Mã chức vụ được Bộ quốc phòng cấp
  order_number: number; // INTEGER NULL, -- STT
  created_at: string; // TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at: string; // TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
};
