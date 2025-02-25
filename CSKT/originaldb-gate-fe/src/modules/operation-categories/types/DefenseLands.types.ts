export type DefenseLandsData = {
    id: string;
    name: string;
    short_name?: string;
    address?: string;
    area?: string| number;
    coordinates?: string;
    altitude?: string| number;
    phone_number?: string;
    id_ex?: string;
    code_ex?: string;
    org_id?: string;
    ward_id?: string;
    is_enable: boolean;
    order_number?: number;
    created_at?: string;
    updated_at?: string;
}