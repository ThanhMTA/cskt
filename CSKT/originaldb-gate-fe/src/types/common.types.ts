import { IEndPoint } from "@app/interfaces/common.interface";
import { ActorsDirectusRoles, AvailableRoles } from "./types";

export type GlobalState = {
    appId: string;
    currPath: string;
    currEndpoints: IEndPoint[];
    actorsDirectusRoles: ActorsDirectusRoles[],
    availableRoles?: AvailableRoles[]
}
export type GlobalAction = {
    setAppId: (appId: string) => void
    setCurrentPath: (curr: string) => void;
    setCurrEndpoints: (currEndpoints: IEndPoint[]) => void;
    getActorsDirectusRoles: () => Promise<ActorsDirectusRoles[]>
    getAvailableRoles: (userId: string) => Promise<AvailableRoles[]>
}
export type GlobalStore = GlobalState & GlobalAction; 