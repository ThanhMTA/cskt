export type ActorsData = {
  id: string;
  date_created: string;
  date_updated: string;
  name: string;
  short_name: string;
  desc: null;
  order_number: null;
  is_enable: boolean;
  tables: any[];
  roles: number[];
}

export type ActorsState = {
    actors: ActorsData[];
    count: number;
    loading?: boolean;
}
export type ActorsAction = {
  // 
}
export type ActorsStoreType = ActorsState & ActorsAction;