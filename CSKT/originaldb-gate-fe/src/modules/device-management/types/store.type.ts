import internal from "stream";
export type StoreData = {
    attribute?: string | null;
    code?: string | null;
    date_created?: string | null;
    date_updated?: string | null;
    id: string;
    is_enable?: boolean | null;
    name?: string | null;
    order_number?: number | null;
    parent_id?: string |  StoreData   | null;
    short_name?: string | null;
    tree_level?: number | null;
    tree_path?: string | null;
};
