import { defineHook } from "@directus/extensions-sdk";
import {
  AvailableRoles,
  DirectusPermissions,
  DirectusRoles,
  DirectusUsers,
} from "../types";
import { ItemsService as ItemsServices } from "@directus/api/dist/services/items";
import { RolesService as RolesServices } from "@directus/api/dist/services/roles";
import type { Permission } from "@directus/types/dist/permissions";
import { createError } from "@directus/errors";

type CreatingDirectusUserPayload = Partial<DirectusUsers>;
type UpdatingDirectusPayload = Omit<Partial<DirectusUsers>, "id">;
type CreatingAvailableRolesPayload = Omit<AvailableRoles, "id">;
type UpdatingAvailableRolesPayload = Omit<Partial<AvailableRoles>, "id">;
export default defineHook(({ filter, action }, { services, getSchema }) => {
  // const { ItemsService } = services;
  const { ItemsService, UsersService, RolesService, PermissionsService } =
    services;
  filter(
    "users.create",
    async (
      payload: CreatingDirectusUserPayload,
      { event, keys, collection },
      {}
    ) => {
      console.log("Trước khi tạo user", event, payload, collection);
      let newPayload = payload;
      try {
        if (!newPayload.email?.includes("@")) {
          newPayload.email = `${payload.email}@email.com`;
        }
      } catch (error) {
        console.error("Error before creating new user", error);
      }
      return newPayload;
    }
  );

  action(
    "users.create",
    async ({ event, payload, collection, key }, { schema, database }) => {
      console.log("Sau khi tạo user", event, payload, collection, key);
      const availableRoleServices: ItemsServices<AvailableRoles> =
        new ItemsService("available_roles", {
          schema: schema || (await getSchema()),
          knext: database,
        });
      try {
        if (payload.role) {
          await availableRoleServices.createOne({
            role_id: payload.role,
            user_id: key,
          });
        }
      } catch (error) {
        console.error("Error before creating new user", error);
      }
      return payload;
    }
  );
  // khi chon 1 role trong dong available_role, isDefault = true
  // update tren bang availe_roles
  // lay roleId,userId: check User tu userId,
  // update tat ca availrole voi userId isDefault = false

  // update by admin

  filter(
    "users.update",
    async (
      payload: UpdatingDirectusPayload,
      { event, keys, collection },
      { database, schema, accountability }
    ) => {
      console.log("Trước khi update user", keys, payload, collection);
      const userServices: ItemsServices<DirectusUsers> = new UsersService({
        schema,
        accountability: accountability,
      });
      const userAdminService = new UsersService({
        schema: schema || (await getSchema()),
        accountability: {
          ...(accountability ?? { role: null }),
          admin: true, // We need to skip permissions checks for the update call below
        },
      });
      // const roleServices: ItemsServices<DirectusRoles> = new RolesService({
      //   schema,
      //   accountability: accountability,
      // });
      const permissionServices: ItemsServices<DirectusPermissions> =
        new PermissionsService({
          schema,
          accountability: accountability,
        });
      const availableRoleServices: ItemsServices<AvailableRoles> =
        new ItemsService("available_roles", {
          schema: schema || (await getSchema()),
          accountability: accountability,
        });
      // console.log("accountability: ", accountability);
      console.log(
        "Truoc khi update user accountability.user: ",
        accountability?.role
      );
      if (accountability && accountability?.user) {
        if (payload.role) {
          const user = await userServices.readOne(keys[0], {
            fields: ["*", "role.id", "role.name"],
          });
          console.log("User tu update: ", user);
          if ((user.role as DirectusRoles).name === "Administrator") {
            let newPayload = payload;
            delete newPayload.role;
            return newPayload;
          } else {
            const availableRoleExist = await availableRoleServices.readByQuery(
              {
                filter: {
                  user_id: {
                    _eq: user.id,
                  },
                  role_id: {
                    _eq: payload.role as string,
                  },
                  is_enable: {
                    _eq: true,
                  },
                },
              },
              {
                emitEvents: false,
              }
            );
            console.log("availableRoleExist: ", availableRoleExist);
            if (availableRoleExist && availableRoleExist.length > 0) {
              const permissions = await permissionServices.readByQuery(
                {
                  fields: ["*"],
                  filter: {
                    role: {
                      _eq: availableRoleExist[0]?.role_id,
                    },
                  },
                },
                {
                  emitEvents: false,
                }
              );
              accountability = {
                ...accountability,
                role: availableRoleExist[0]?.role_id || null,
                permissions: permissions as Permission[],
              };
              // accountability.role =
              //   availableRoleExist[0]?.role_id || accountability.role;
              // accountability.permissions =
              //   (permissions as Permission[]) || accountability.permissions;
              console.log(
                "Sau khi update user accountability.user: ",
                accountability?.role
              );
              await userAdminService.updateOne(
                user.id,
                {
                  role: payload.role,
                },
                {
                  emitEvents: false,
                }
              );
              let newPayload = payload;
              delete newPayload.role;
              return newPayload;
            }
          }
        } else {
          console.log("K vao role thi update bt");
          return payload;
        }
      }
      return payload;
    }
  );

  /**
   * admin update
   *  - admin update chinh no khong cho update
   *  - admin update cho user khac (user_id,role_id,is_default)
   *  - get ra cai available role neu co check voi keys[0] la id role can update neu giong nhau thi k update ,
   *  - khac nhau neu is_default=true ton tai thi k update vs is_default = false th con lai thi van update
   *  - neu khong co thi se cho update
   * user tu update thi chi co update is_default
   */
  // filter(
  //   "available_roles.items.update",
  //   async (
  //     payload: UpdatingAvailableRolesPayload,
  //     { event, keys, collection },
  //     { database, schema, accountability }
  //   ) => {
  //     console.log(
  //       "Trước khi update available_roles",
  //       keys,
  //       payload,
  //       collection
  //     );

  //     const userServices: ItemsServices<DirectusUsers> = new UsersService({
  //       schema,
  //       accountability: accountability,
  //     });
  //     const permissionServices: ItemsServices<DirectusPermissions> =
  //       new PermissionsService({
  //         schema,
  //         accountability: accountability,
  //       });
  //     const availableRoleServices: ItemsServices<AvailableRoles> =
  //       new ItemsService("available_roles", {
  //         schema: schema || (await getSchema()),
  //         accountability: accountability,
  //       });
  //     console.log("accountability: ", accountability);
  //     console.log("accountability?.user: ", accountability?.user);
  //     if (accountability && accountability.user) {
  //       const availableRole = await availableRoleServices.readOne(keys[0]);
  //       if (availableRole) {
  //         const user = await userServices.readOne(availableRole.user_id, {
  //           fields: ["*", "role.id", "role.name"],
  //         });
  //         if (
  //           (user.role as DirectusRoles).name === "Administrator" &&
  //           user.role !== payload.role_id
  //         ) {
  //           let newPayload = payload;
  //           newPayload.is_default = false;
  //           return newPayload;
  //         } else {
  //           if (user.id !== accountability.user) {
  //             const availableRoleExist =
  //               await availableRoleServices.readByQuery({
  //                 filter: {
  //                   user_id: {
  //                     _eq: payload.user_id || availableRole.user_id,
  //                   },
  //                   role_id: {
  //                     _eq: payload.role_id || availableRole.role_id,
  //                   },
  //                 },
  //               });
  //             if (availableRoleExist && availableRoleExist.length > 0) {
  //               throw createError(
  //                 "409",
  //                 "Đã tồn tại bản ghi không thể cập nhật"
  //               );
  //             } else {
  //               if (payload.is_default && payload.is_default === true) {
  //                 const isHaveRoleDefault =
  //                   await availableRoleServices.readByQuery({
  //                     filter: {
  //                       user_id: {
  //                         _eq: payload.user_id || availableRole.user_id,
  //                       },
  //                       role_id: {
  //                         _neq: payload.role_id || availableRole.role_id,
  //                       },
  //                       is_default: {
  //                         _eq: true,
  //                       },
  //                     },
  //                   });
  //                 if (isHaveRoleDefault && isHaveRoleDefault.length > 0) {
  //                   let newPayload = payload;
  //                   newPayload.is_default = false;
  //                   return newPayload;
  //                 }
  //               }
  //               return payload;
  //             }
  //           } else {
  //             const [permissions] = await Promise.all([
  //               permissionServices.readByQuery({
  //                 fields: ["*"],
  //                 filter: {
  //                   role_id: {
  //                     _eq: availableRole.role_id,
  //                   },
  //                 },
  //               }),
  //               availableRoleServices.updateByQuery(
  //                 {
  //                   filter: {
  //                     user_id: {
  //                       _eq: user.id,
  //                     },
  //                     role_id: {
  //                       _neq: availableRole.role_id,
  //                     },
  //                   },
  //                 },
  //                 {
  //                   is_default: false,
  //                 }
  //               ),
  //             ]);
  //             accountability = {
  //               ...accountability,
  //               role: availableRole.role_id as string,
  //               permissions: permissions as Permission[],
  //             };
  //           }
  //           return payload;
  //         }
  //       }
  //     }

  //     return payload;
  //   }
  // );

  // filter(
  //   "available_roles.items.create",
  //   async (
  //     payload: CreatingAvailableRolesPayload,
  //     { event, keys, collection },
  //     { database, schema, accountability }
  //   ) => {
  //     console.log(
  //       "Trước khi create available_roles",
  //       keys,
  //       payload,
  //       collection
  //     );
  //     console.log("accountability: ", accountability);
  //     console.log("accountability?.user: ", accountability?.user);
  //     const userServices: ItemsServices<DirectusUsers> = new UsersService({
  //       schema,
  //       accountability: accountability,
  //     });
  //     const availableRoleServices: ItemsServices<AvailableRoles> =
  //       new ItemsService("available_roles", {
  //         schema: schema || (await getSchema()),
  //         accountability: accountability,
  //       });
  //     if (accountability && accountability?.user) {
  //       if (payload.is_default === true) {
  //         const user = await userServices.readOne(payload.user_id, {
  //           fields: ["*", "role.id", "role.name"],
  //         });
  //         console.log("user: ", user);
  //         if ((user.role as DirectusRoles).name === "Administrator") {
  //           let newPayload = payload;
  //           newPayload.is_default = false;
  //           return newPayload;
  //         } else {
  //           const roleDefault = await availableRoleServices.readByQuery({
  //             filter: {
  //               user_id: {
  //                 _eq: payload.user_id,
  //               },
  //               role_id: {
  //                 _neq: payload.role_id,
  //               },
  //               is_default: {
  //                 _eq: true,
  //               },
  //             },
  //           });
  //           console.log("roleDefault: ", roleDefault);
  //           if (roleDefault && roleDefault.length == 1) {
  //             let newPayload = payload;
  //             newPayload.is_default = false;
  //             return newPayload;
  //           } else {
  //             return payload;
  //           }
  //         }
  //       }
  //       return payload;
  //     }

  //     return payload;
  //   }
  // );
});
