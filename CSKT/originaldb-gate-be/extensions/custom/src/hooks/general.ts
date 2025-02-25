import { defineHook } from "@directus/extensions-sdk";
import {
  AvailableRoles,
  DirectusPermissions,
  DirectusRevisions,
  DirectusRoles,
  DirectusUsers,
  TBVTCategories,
  TBVTCategoriesDirectusUsers,
} from "../types";
import { ItemsService as ItemsServices } from "@directus/api/dist/services/items";
import { RolesService as RolesServices } from "@directus/api/dist/services/roles";
import type { Permission } from "@directus/types/dist/permissions";
import { createError } from "@directus/errors";

type CreatingRevisionsPayload = Omit<DirectusRevisions, "id">;
export default defineHook(({ filter }, { services }) => {
  // const { ItemsService } = services;
  const { UsersService, ItemsService } = services;
  /**
   *
   */

  filter(
    "*.items.read",
    async (
      payload: any,
      { event, keys, collection },
      { database, schema, accountability }
    ) => {
      console.log("event: ", event);
      const userServices: ItemsServices<DirectusUsers> = new UsersService({
        schema,
        accountability: accountability,
      });
      const userTBVTServices: ItemsServices<TBVTCategoriesDirectusUsers> =
        new ItemsService("tbvt_categories_directus_users", {
          schema,
          knex: database,
        });
      if (
        collection === "tbvt_categories" &&
        accountability &&
        accountability.user
      ) {
        const user = await userServices.readOne(accountability.user, {
          fields: ["*", "role.id", "role.name"],
        });
        if (
          collection === "tbvt_categories" &&
          ["CCT", "CKT", "P_QL"].includes((user.role as DirectusRoles).name)
        ) {
          const userTBVT = await userTBVTServices.readByQuery({
            fields: ["*", "tbvt_categories_id.tree_path"],
            filter: {
              directus_users_id: {
                _eq: accountability.user,
              },
              is_enable: {
                _eq: true,
              },
              tbvt_categories_id: {
                type: {
                  _eq: payload.type,
                },
              },
            },
          });
          console.log("userTBVT: ", userTBVT);
          console.log("payload: ", payload);
          if (userTBVT && userTBVT.length > 0) {
            return payload;
          } else {
            return [];
          }
        }
        return payload;
      }

      return payload;
    }
  );

  filter(
    "*.items.query",
    async (
      payload: any,
      { event, keys, collection },
      { database, schema, accountability }
    ) => {
      console.log("new accountability role: ", accountability?.role);
      console.log("Trước khi query item general", keys, collection);
      const userServices: ItemsServices<DirectusUsers> = new UsersService({
        schema,
        accountability: accountability,
      });
      // console.log("Old payload: ", JSON.stringify(payload));
      let newPayload = payload;
      if (accountability && accountability?.user) {
        // user.role as DirectusRoles).name === "Administrator"
        const user = await userServices.readOne(accountability.user, {
          fields: ["*", "role.id", "role.name"],
        });

        if (
          accountability.permissions &&
          accountability.permissions.length > 0
        ) {
          const isExistDeletePermission = accountability.permissions.some(
            (per) => per.collection === collection && per.action === "delete"
          );
          if (
            !isExistDeletePermission ||
            !accountability.admin ||
            (user && (user.role as DirectusRoles).name !== "Administrator") ||
            !(user.role as DirectusRoles).name.includes("ADMIN")
          ) {
            // console.log(`Khong co permission delete cua bang ${collection}`);
            // payload.is_enable = true;
            const filterAnd = {
              _and: [],
            };
            console.log("payload: ", payload);
            if (payload.filter && JSON.stringify(payload.filter) !== "{}") {
              // console.log("Payload co data");
              // {
              //   fields: [
              //     '*',
              //     'directus_roles_id.*',
              //     'actors_id.*',
              //     'actors_id.tables.*',
              //     'actors_id.tables.tables_id.*'
              //   ],
              //   filter: { _and: [ [Object] ] }
              // } actors_directus_roles

              // _OR, _AND, cac gia tri filter

              const andCondition = {
                _and: [],
              };
              for (const key in payload.filter) {
                if (key === "_or") {
                  filterAnd._and = [
                    ...filterAnd._and,
                    {
                      _or: payload.filter[key],
                    },
                  ];
                } else if (key === "_and") {
                  filterAnd._and = [
                    ...filterAnd._and,
                    {
                      _and: payload.filter[key],
                    },
                  ];
                  // _or,_and,
                } else {
                  const condition = {
                    [key]: payload.filter[key],
                  };
                  andCondition._and.push({
                    _and: [condition],
                  });
                }
              }
              console.log("andCondition: ", andCondition);
              console.log("filterAnd: ", filterAnd);
              if (JSON.stringify(andCondition) !== "{}") {
                filterAnd._and.push(andCondition);
              }
              console.log("filterAnd: ", JSON.stringify(filterAnd));
              newPayload = {
                ...newPayload,
                filter: filterAnd,
              };
            } else {
              // console.log("Zo day");
              newPayload.filter._and = [
                {
                  is_enable: {
                    _eq: true,
                  },
                },
              ];
            }
            console.log("newPayload: ", JSON.stringify(newPayload));
            if (
              collection === "tbvt_categories" &&
              ["CCT", "CKT", "P_QL"].includes((user.role as DirectusRoles).name)
            ) {
              console.log("user: ", user);
              const userTBVTServices: ItemsServices<TBVTCategoriesDirectusUsers> =
                new ItemsService("tbvt_categories_directus_users", {
                  schema,
                  knex: database,
                });
              const userTBVT = await userTBVTServices.readByQuery(
                {
                  fields: ["*", "tbvt_categories_id.tree_path"],
                  filter: {
                    directus_users_id: {
                      _eq: accountability.user,
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
              console.log("userTBVT: ", userTBVT);
              if (userTBVT && userTBVT.length > 0) {
                const conditionUserTBVT = {
                  _and: [
                    {
                      _or: [],
                    },
                  ],
                };

                for (const tbvt of userTBVT) {
                  conditionUserTBVT._and[0]?._or.push({
                    tree_path: {
                      _starts_with: (tbvt.tbvt_categories_id as TBVTCategories)
                        .tree_path,
                    },
                  });
                }
                console.log(
                  "conditionUserTBVT: ",
                  JSON.stringify(conditionUserTBVT)
                );
                newPayload.filter._and.push(conditionUserTBVT);
              } else {
                return newPayload;
              }
              // payload.filter.tree_path = {
              //   _in:
              //     userTBVT.length > 0
              //       ? userTBVT.map((tbvt) => (tbvt as TBVTCategories).tree_path)
              //       : [],
              // };
            }
          }
        }
      }
      // console.log("new payloadLast: ", JSON.stringify(newPayload));
      return newPayload;
    }
  );
  // filter(
  //   "*.items.read",
  //   async (
  //     payload: any,
  //     { event, keys, collection },
  //     { database, schema, accountability }
  //   ) => {
  //     console.log("Trước khi read item general", keys, payload, collection);
  //     // console.log("accountability: ", accountability);
  //     // console.log("accountability?.user: ", accountability?.user);
  //     const userServices: ItemsServices<DirectusUsers> = new UsersService({
  //       schema,
  //       accountability: accountability,
  //     });

  //     if (accountability && accountability?.user) {
  //       // user.role as DirectusRoles).name === "Administrator"
  //       const user = await userServices.readOne(accountability.user, {
  //         fields: ["*", "role.id", "role.name"],
  //       });
  //       if (
  //         accountability.permissions &&
  //         accountability.permissions.length > 0
  //       ) {
  //         const isExistDeletePermission = accountability.permissions.some(
  //           (per) => per.collection === collection && per.action === "delete"
  //         );
  //         if (
  //           !isExistDeletePermission ||
  //           !accountability.admin ||
  //           (user && (user.role as DirectusRoles).name !== "Administrator") ||
  //           !(user.role as DirectusRoles).name.includes("ADMIN")
  //         ) {
  //           // console.log(`Khong co permission delete cua bang ${collection}`);
  //           payload.is_enable = true;
  //           if (
  //             collection === "tbvt_categories" &&
  //             ["CCT", "CKT", "P_QL"].includes(
  //               (user.role as DirectusRoles).name
  //             ) &&
  //             payload.type
  //           ) {
  //             const userTBVTServices: ItemsServices<TBVTCategoriesDirectusUsers> =
  //               new ItemsService("tbvt_categories_directus_users", {
  //                 schema,
  //                 knex: database,
  //               });
  //             const userTBVT = await userTBVTServices.readByQuery({
  //               fields: ["*", "tbvt_categories_id.tree_path"],
  //               filter: {
  //                 directus_users_id: {
  //                   _eq: accountability.user,
  //                 },
  //                 is_enable: {
  //                   _eq: true,
  //                 },
  //                 tbvt_categories_id: {
  //                   type: {
  //                     _eq: payload.type,
  //                   },
  //                 },
  //               },
  //             });
  //             payload.tree_path = {
  //               _in:
  //                 userTBVT.length > 0
  //                   ? userTBVT.map((tbvt) => (tbvt as TBVTCategories).tree_path)
  //                   : [],
  //             };
  //           }
  //         }
  //       }
  //     }
  //     console.log("payload: ", payload);
  //     return payload;
  //   }
  // );
});
