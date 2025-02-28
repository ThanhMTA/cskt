import {
  AggregationOptions,
  Query,
  aggregate,
  createItem,
  createUser,
  readItem,
  readItems,
  readMe,
  readUsers,
  updateItem,
  deleteItem,
  updateUser,
  readRoles,
  deleteUser,
  updateItems,
  readActivities,
  readPermissions,
  readPermission,
  customEndpoint,
  updateMe,
  createItems,
  deleteItems,
} from "@directus/sdk";
import HTTP from "./http";

const handleError = (e: any) => {
  if (e?.errors?.[0]?.extensions?.code === "TOKEN_EXPIRED") {
    const event = new Event("unauthorized");
    document.dispatchEvent(event);
  } else if (e?.response?.status === 403) {
    document.dispatchEvent(new Event("permissionDenied"));
  }
  return Promise.reject(e);
};
// lấy danh sách item 
export const getItems = <T>(
  collection: string,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(readItems(collection, query)).catch((e) =>
    handleError(e)
  );
};
// lấy thông tin chi tiết của item theo id 
export const getItem = <T>(
  collection: string,
  key: any,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(readItem(collection, key, query)).catch((e) =>
    handleError(e)
  );
};
// update item theo id 
export const update = <T>(
  collection: string,
  key: any,
  item: Partial<T>,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(updateItem(collection, key, item, query)).catch((e) =>
    handleError(e)
  );
};
// thêm mới 
export const create = <T>(
  collection: string,
  item: Partial<T>,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(createItem(collection, item, query)).catch((e) =>
    handleError(e)
  );
};
//  tạo nhiều bàn ghi cùng lúc 
export const createMulItems = <T>(
  collection: string,
  items: any
) => {
  return HTTP.request<T>(createItems(collection, items)).catch((e) =>
    handleError(e)
  );
};
// truy vấn tổng hợp
export const aggregateData = <T>(
  collection: string,
  options: AggregationOptions<T extends object ? any : any, any>
) => {
  return HTTP.request<T>(aggregate(collection, options)).catch((e) =>
    handleError(e)
  );
};
// lấy danh sách người dùng 
export const getUsers = <T>(query?: Query<any, any> | undefined) => {
  return HTTP.request<T>(readUsers(query)).catch((e) => handleError(e));
};
// lấy thông tin người dùng hiện tại 
export const me = <T>(query?: Query<any, any> | undefined) => {
  return HTTP.request<T>(readMe(query)).catch((e) => handleError(e));
};
// update thông tin người dùng hiện tại 
export const updateCurrentUser = <T>(body: any) => {
  return HTTP.request<T>(updateMe(body)).catch((e) => handleError(e));
};
// xóa người dùng 
export const removeUser = <T>(userId: string) => {
  return HTTP.request<T>(deleteUser(userId)).catch((e) => handleError(e));
};
// tạo thêm người dùng 
export const createDirectusUser = <T>(query: any) => {
  return HTTP.request<T>(createUser(query)).catch((e) => handleError(e));
};
// update thông tin người dùng 
export const updateDiretusUser = <T>(
  userId: string,
  item: Partial<T>,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(updateUser(userId, item, query)).catch((e) =>
    handleError(e)
  );
};
// xóa dữ liệu 
export const deleteData = <T>(collection: string, key: any) => {
  return HTTP.request<T>(deleteItem(collection, key)).catch((e) =>
    handleError(e)
  );
};
//  xóa n
export const removeItems = <T>(collection: string, query: any) => {
  return HTTP.request<T>(deleteItems(collection, query)).catch((e) =>
    handleError(e)
  );
};
export const createData = <T>(
  collection: string,
  item: Partial<T>,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(createItem(collection, item, query)).catch((e) =>
    handleError(e)
  );
};
export const roles = <T>(query?: Query<any, any> | undefined) => {
  return HTTP.request<T>(readRoles(query)).catch((e) => handleError(e));
};

export const updateMultiItem = <T>(
  collection: string,
  keysOrQuery: Query<any, any> | string[] | number[],
  item: Partial<T>,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(
    updateItems(collection, keysOrQuery, item, query)
  ).catch((e) => handleError(e));
};

export const readActivitiesItem = <T>(query?: Query<any, any> | undefined) => {
  return HTTP.request<T>(readActivities(query)).catch((e) => handleError(e));
};

export const readRolesItem = <T>(query?: Query<any, any> | undefined) => {
  return HTTP.request<T>(readRoles(query)).catch((e) => handleError(e));
};
export const getPermissions = <T>(query?: Query<any, any> | undefined) => {
  return HTTP.request<T>(readPermissions(query)).catch((e) => handleError(e));
};
export const getPermissionDetail = <T>(
  key: number,
  query?: Query<any, any> | undefined
) => {
  return HTTP.request<T>(readPermission(key, query)).catch((e) =>
    handleError(e)
  );
};

// export const customApi = async <T>(url: string, method: HttpMethod, params: T) => {
//     try {
//         const token = await HTTP.getToken();
//         const headers = {
//             Authorization: `Bearer ${token}`,
//         };
//         const res = await fetch(new URL(`${import.meta.env.VITE_PUBLIC_API_URL}${url}`), {
//             method,
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...headers
//             },
//             body: method === 'GET' ? undefined : JSON.stringify(params),
//         });
//         return res;
//     } catch (e) {
//         return handleError(e);
//     }
// }

export const customGetApi = <T>(url: string, params: any) => {
  return HTTP.request<T>(
    customEndpoint<any>({
      path: url,
      method: "GET",
      params: params,
    })
  );
};
export const customPostApi = <T>(url: string, params: any, body: any) => {
  return HTTP.request<T>(
    customEndpoint<any>({
      path: url,
      method: "POST",
      params,
      body: JSON.stringify(body),
    })
  );
};

export const updateUserRole = async (role: string) => {
  return await customPostApi(
    "api/update-available-role",
    {},
    {
      role: role || "",
    }
  );
};
