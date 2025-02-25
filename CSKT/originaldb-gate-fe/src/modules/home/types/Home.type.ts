import { IMeta, IRequest } from "@app/interfaces/common.interface";
import { ActorsData } from "@app/types/actors.types";

export type ActorState = {
    actors: ActorsData[],
    metaActor?: IMeta
}
export type HomeState = {
    actorState: ActorState;
}

export type HomeAction = {
    setActorState: (actors: ActorState) => void,
    getActors: (req?: IRequest) => Promise<ActorState>
}
export type HomeStore = HomeState & HomeAction;