import { customGetApi } from "@app/core/api";

export const getReportTBVTByOrg = (params: any) => {
  return customGetApi("api/reportTBVTByOrg", {
    org_id: params.org_id,
  });
};
export const getReportCBNVCMKTByOrg = (params: any) => {
  return customGetApi("api/reportCBNVCMKTByOrg", {
    tree_path: params.tree_path,
    type: params.type,
  });
};
export const getReportToDBKTByOrg = (params: any) => {
  return customGetApi("api/reportToBDKTByOrg", {
    tree_path: params.tree_path,
    type: params.type,
  });
};
export const getReportAmountTbvtByGroupEquipment = (params: any) => {
  return customGetApi("api/xuat-bao-cao-vtkt", params);
};