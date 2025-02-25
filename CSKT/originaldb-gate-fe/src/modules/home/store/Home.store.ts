import { create } from "zustand";
import { ActorState, HomeStore } from "../types/Home.type";
import { IRequest } from "@app/interfaces/common.interface";
import { getActorsList, metaActors } from "@app/store/actors/actor.action";

export const homeStore = create<HomeStore>((set) => ({
    actorState: {
        actors: [],
        metaActor: undefined
    },
    setActorState: (data: ActorState) => set({ actorState: data }),
    getActors: async (req?: IRequest) => {
        try {
            const filter: any = {
                _and: [{
                    is_enable: {
                        _eq: true
                    }
                }]
            }
            const res = await Promise.all([getActorsList({ limit: -1, page: 1 }, filter), metaActors(filter)]);
            const data: ActorState = {
                actors: res[0],
                metaActor: res[1]
            }
            set({
                actorState: data
            })
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e)
        }
    }
}))