import { AdministrativeUnit } from "./AdministrativeUnit.type"
import { MilitaryDistrict } from "./MilitaryDistrict.type"
import { Region } from "./Region.type"

export type Province = {
    id: string
    date_created: string
    date_updated: any
    name: string
    short_name: string
    code_ex: string
    admin_unit_id: string | AdministrativeUnit;
    region_id: string | Region;
    military_distric_id: string | MilitaryDistrict;
    is_enable: boolean
    order_number: number
}
