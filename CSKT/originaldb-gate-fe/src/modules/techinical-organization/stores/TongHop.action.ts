import { customGetApi, getItems } from "@app/core/api";
import { IRequest } from "@app/interfaces/common.interface";
import { GroupEquipment } from "../types/GroupEquipment.type";

const GROUP_EQUIPMENT = "group_equipment";

export const getGroupEquipment = async (query: IRequest, filter: any) => {
  return getItems<GroupEquipment[]>(GROUP_EQUIPMENT, {
    ...query,
    filter,
    sort: ["order_number"],
  });
};

export const getAmountTbvtByGroupEquipment = (params: any) => {
  return customGetApi("api/getAmountTbvtByGroupEquipment", {
    tree_path: params?.tree_path,
    type: params?.type,
  });
};
