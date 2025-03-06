export type CanBoCategoriesData = {
    id: string;
    name: string;
    SDT:string;
    is_enable: boolean;
    code: string; // -- Mã quân nhân 
    capbac_id:string;
    chucvu_id:string;
    donvi_id:string;
    ward_id: string;
    created_at: string; // TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at: string; // TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  };
  