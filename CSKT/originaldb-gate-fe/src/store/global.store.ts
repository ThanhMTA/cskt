import { IEndPoint } from "@app/interfaces/common.interface";
import { GlobalStore } from "@app/types/common.types";
import { create } from "zustand";
import { getActorsDirectusRoles, getAvailableRoles } from "./actors/actor.action";

export const globalStore = create<GlobalStore>((set) => ({
    appId: '',
    currEndpoints: [],
    currPath: '',
    actorsDirectusRoles: [],
    availableRoles: [],
    setAppId: (appId: string) => set({ appId }),
    setCurrEndpoints: (curr: IEndPoint[]) => {
        set({ currEndpoints: curr })
    },
    setCurrentPath: (path: string) => set({ currPath: path }),
    getActorsDirectusRoles: async () => {
        const filter = {
            _and: [{
                actors_id: {
                    _nnull: true
                }
            }]
        }
        const actorsDirectusRoles = await getActorsDirectusRoles(filter);
        set({ actorsDirectusRoles })
        return actorsDirectusRoles;
    },
    getAvailableRoles: async (userId: string) => {
        const filter = {
            _and: [{
                user_id: {
                    _eq: userId
                }
            }]
        }
        const availableRoles = await getAvailableRoles(filter);
        set({ availableRoles })
        return availableRoles;
    }
}))