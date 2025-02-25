import { getItems } from "@app/core/api";
import { IRequest } from "@app/interfaces/common.interface";

export const getProvinceList = (query?: IRequest) => {
  return getItems<any[]>("province_categories", {
    ...query,
    fields: ["*"],
    filter: {},
    // filter,
  });
};

export const getDistrictList = (provinceId: string) => {
  return getItems<any[]>("district_categories", {
    fields: ["*"],
    filter: {
      province_id: {
        _eq: provinceId,
      },
    },
  });
};

export const getWardList = (districtId: string) => {
  return getItems<any[]>("ward_categories", {
    fields: ["*"],
    filter: {
      district_id: {
        _eq: districtId,
      },
    },
  });
};
