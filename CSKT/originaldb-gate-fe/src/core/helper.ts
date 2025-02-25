import { Ward } from "@app/modules/it-categories/types/Ward.type";
import { SelectProps } from "antd";

export function makeid(length = 10) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Helper
const StringIsNumber = (value) => isNaN(Number(value)) === false;

// Turn enum into array
export function ToArray(enumme) {
  return Object.values(enumme);
}

export function toAttributes(
  attributes: any,
  keyName: string,
  valueKey: string
) {
  return (
    attributes &&
    attributes
      .filter((x) => !!x)
      .reduce(
        (prev: any, curr: any) => ({
          ...prev,
          [curr[keyName]]: curr[valueKey].map((x: any) => x.value),
        }),
        {}
      )
  );
}
export const allowMetaKey = (event: KeyboardEvent): boolean => {
  if (
    [
      "Delete",
      "Backspace",
      "Tab",
      "Escape",
      "Enter",
      "NumLock",
      "ArrowLeft",
      "ArrowRight",
      "End",
      "Home",
    ].indexOf(event.key) !== -1 ||
    (event.key === "a" && (event.ctrlKey || event.metaKey)) ||
    (event.key === "c" && (event.ctrlKey || event.metaKey)) ||
    (event.key === "v" && (event.ctrlKey || event.metaKey)) ||
    (event.key === "x" && (event.ctrlKey || event.metaKey))
  ) {
    return true;
  }
  return false;
};

export const onlyNumber = (event: any, allowKey = "") => {
  if (allowMetaKey(event)) {
    return;
  }
  if (event.key.search(/[^0-9]/) >= 0 && !allowKey.includes(event.key)) {
    event.preventDefault();
  }
};
export function transformReq(data: any) {
  const obj = { ...data };
  Object.keys(obj).forEach(
    (k) => (obj[k] = typeof obj[k] == "string" ? obj[k].trim() : obj[k])
  );
  return obj;
}

interface AttributesData {
  [key: string]: string[];
}

export function formatAttributes(attributes: AttributesData): string {
  return Object.entries(attributes)
    .map(([key, values]) => `${key}: ${values.join(", ")}`)
    .join("\n");
}

export function getIdByName<
  T extends { id: string; name: string; children: T[] }
>(
  arr: T[],
  name: string,
  idKey: keyof T | string = "id",
  nameKey: keyof T | string = "name"
): T {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][nameKey] === name) {
      return arr[i][idKey];
    }
    if (arr[i].children?.length > 0) {
      const id = getIdByName(arr[i].children, name, idKey, nameKey);
      if (id) {
        return id;
      }
    }
  }
  return null;
}

export const getMenuFlat = (menus: any[]) => {
  const menuFlat: any[] = [];
  menus.forEach((element) => {
    menuFlat?.push(element);
    if (element?.children?.length) {
      menuFlat?.push(element?.children);
    }
    element?.children?.forEach((i: any) => {
      if (i?.children?.length) {
        menuFlat?.push(i?.children);
      }
    });
  });
  return menuFlat?.flat();
};

/**
 * get label của select items
 */

export const getLabelSelect = (
  value: string | number,
  options: SelectProps["options"]
) => {
  return options?.find((o) => o.value === value)?.label;
};

export const selectMap = (
  array: any[],
  labelKey: string = "title",
  valueKey: string = "value"
) => {
  return array?.map((item) => {
    return {
      label: item[labelKey],
      value: item[valueKey],
    };
  });
};

// export const listToTree = (
//   list: any[],
//   idKey = "id",
//   parentIdKey = "parent_id"
// ) => {
//   const map: any = {};
//   const tree: any[] = [];
//   list.forEach((node) => {
//     map[node?.[idKey]] = { ...node, children: [] };
//   });
//   list.forEach((node) => {
//     if (node?.[parentIdKey] !== null && map[node?.[parentIdKey]]) {
//       map[node?.[parentIdKey]].children.push(map[node?.[idKey]]);
//     } else {
//       tree.push(map[node?.[idKey]]);
//     }
//   });
//   return tree;
// };
export const listToTree = (
  list: any[],
  idKey = "id",
  parentIdKey = "parent_id"
) => {
  const map: any = {};
  const tree: any[] = [];

  list.forEach((node) => {
    map[node?.[idKey]] = { ...node };
  });

  list.forEach((node) => {
    if (node?.[parentIdKey] !== null && map[node?.[parentIdKey]]) {
      if (!map[node?.[parentIdKey]].children) {
        map[node?.[parentIdKey]].children = [];
      }
      if (map[node?.[idKey]]?.has_child) map[node?.[idKey]].isLeaf = false;
      else map[node?.[idKey]].isLeaf = true;
      map[node?.[parentIdKey]].children.push(map[node?.[idKey]]);
      // Sort children by order_number and then by code
      map[node?.[parentIdKey]].children.sort((a: any, b: any) => {
        if (a?.order_number && b?.order_number) {
          return a?.order_number - b?.order_number;
        } else if (a?.order_number) {
          return -1;
        } else if (b?.order_number) {
          return 1;
        } else {
          return a?.code?.localeCompare(b?.code);
        }
      });
    } else {
      if (map[node?.[idKey]]?.has_child) map[node?.[idKey]].isLeaf = false;
      else map[node?.[idKey]].isLeaf = true;
      const parentNode = map[node?.[idKey]];
      tree.push(parentNode);
    }
  });

  return tree;
};

export const getLabelIsEnable = (flag: boolean) => {
  return flag ? "Hoạt động" : "Không hoạt động";
};

export const getFullAddressString = (ward: any) => {
  if (ward && ward?.district_id && ward?.district_id?.province_id) {
    return `${ward?.name}, ${ward?.district_id?.name}, ${ward?.district_id?.province_id?.name}`;
  } else {
    return "";
  }
};

export const serializeFilter = (
  filter: Record<string, any>,
  prefix = ""
): string => {
  const params = new URLSearchParams();

  const buildParams = (obj: Record<string, any>, parentKey: string) => {
    for (const key in obj) {
      const value = obj[key];
      const newKey = parentKey ? `${parentKey}[${key}]` : key;

      if (typeof value === "object" && value !== null) {
        buildParams(value, newKey);
      } else {
        params.append(newKey, value);
      }
    }
  };

  buildParams(filter, prefix ? `filter[${prefix}]` : "filter");
  return `&${params.toString()}`;
};

export const checkPasswordComplexity = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  if (regex.test(password)) {
    return "Password is complex enough.";
  } else {
    return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }
};
