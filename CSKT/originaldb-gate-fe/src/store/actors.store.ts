import { ActorsState, ActorsStoreType } from "@app/types/actors.types";
import { create } from "zustand";

const initialState:ActorsState = {
  actors: [],
  count: 0,
  loading: false,
}

export const ActorsStore = create<ActorsStoreType>(() => ({
    ...initialState,
}))