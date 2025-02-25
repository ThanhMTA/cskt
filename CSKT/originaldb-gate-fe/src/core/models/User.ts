import { Base } from "@app/core/models/Base";
import { DsDonVi } from "@app/types/types";

export class UserModel extends Base<UserModel>() {
    first_name!: string;
    last_name!: string;
    don_vi!: DsDonVi;
    get full_name(){
        return `${this.first_name || ''} ${this.last_name || ''}`
    }
    get ten_don_vi(){
        return (this?.don_vi as DsDonVi)?.ten || ''
    }
}