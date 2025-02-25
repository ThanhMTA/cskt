import { defineHook } from "@directus/extensions-sdk";
import {
  DirectusRoles,
  DirectusUsers,
  TBVTCategories,
  TBVTCategoriesDirectusUsers,
} from "../types";
import { ItemsService as ItemsServices } from "@directus/api/dist/services/items";
import { createError } from "@directus/errors";
import { customAlphabet } from "nanoid";
import ApiError from "../api/middleware/custom-error";
import {
  BadRequestErrors,
  ConflictErrors,
  ForbiddenErrors,
  InternalServerErrorErrors,
} from "../api/middleware/error-handler";
import { checkIsValidEquipmentCode } from "./tbvt-services";
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const newPath = customAlphabet(alphabet, 6);
// const createdError = createError(
//   "Forbidden",
//   "Bạn không thể  tạo do mã code đã tồn tại mã code đó",
//   403
// );
// const updatedError = createError(
//   "Forbidden",
//   "Bạn không thể  cập nhật mã code do đã tồn tại mã code đó",
//   403
// );
type CreatingTBVTCategoryPayload = Partial<TBVTCategories>;
type UpdatingTBVTCategoryPayload = Omit<Partial<TBVTCategories>, "id">;

// export default defineHook(({ filter, action }, { services }) => {
//   const { ItemsService } = services;
//   // Xử lý logic tạo Trang bị
//   filter(
//     "tbvt_categories.items.create",
//     async (
//       payload: CreatingTBVTCategoryPayload,
//       { event, collection },
//       { database, schema }
//     ) => {
//       console.log(
//         "Creating a new trang bi vat tu...",
//         payload,
//         event,
//         collection
//       );

//       const tbvtService: ItemsServices<TBVTCategories> = new ItemsService(
//         collection,
//         {
//           schema,
//           knex: database,
//         }
//       );

// 	  const tbvt = await tbvtService.readByQuery({

// 	  })

//       return payload;
//     }
//   );

//   filter(
//     "tbvt_categories.items.update",
//     async (
//       payload: UpdatingTBVTCategoryPayload,
//       { event, keys, collection },
//       { database, schema }
//     ) => {
//       console.log(
//         "Updating a trang bi vat tu...",
//         payload,
//         event,
//         keys,
//         collection
//       );

//       const tbvtService: ItemsServices<TBVTCategories> = new ItemsService(
//         collection,
//         {
//           schema,
//           knex: database,
//         }
//       );

//       return payload;
//     }
//   );
// });

// filter.items.read

export default defineHook(({ filter, action }, { services }) => {
  const { ItemsService, UsersService } = services;
  // Xử lý logic tạo Trang bị

  filter(
    "tbvt_categories.items.delete",
    async (payload: any, meta, { accountability, database, schema }) => {
      try {
        const userServices: ItemsServices<DirectusUsers> = new UsersService({
          schema,
          accountability: accountability,
        });
        const userTBVTServices: ItemsServices<TBVTCategoriesDirectusUsers> =
          new ItemsService("tbvt_categories_directus_users", {
            schema,
            knex: database,
          });
        const tbvtCategoriesServices: ItemsServices<TBVTCategories> =
          new ItemsService("tbvt_categories", {
            schema,
            knex: database,
          });
        const [equipment, childrenOfEquipment] = await Promise.all([
          tbvtCategoriesServices.readOne(payload[0], {
            fields: ["*"],
          }),
          tbvtCategoriesServices.readByQuery({
            filter: {
              parent_id: {
                _eq: payload[0],
              },
            },
          }),
        ]);
        if (childrenOfEquipment && childrenOfEquipment.length > 0) {
          throw new ApiError(
            "Bạn không thể xóa do mã trang bị này đang có con",
            403
          );
        }

        console.log("equipment: ", equipment);
        if (accountability && accountability?.user && equipment) {
          if (accountability.admin) {
            await tbvtCategoriesServices.updateOne(
              equipment.id,
              {
                has_child: false,
              },
              {
                emitEvents: false,
              }
            );
            return payload;
          } else {
            const [user, userTBVT] = await Promise.all([
              userServices.readOne(accountability.user, {
                fields: ["*", "role.id", "role.name"],
              }),
              userTBVTServices.readByQuery({
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
                      _eq: equipment.type,
                    },
                  },
                },
              }),
            ]);
            // CCT, CKT, P_QL
            // Không có userTBVT là k có quyền
            // Có thì sẽ check các userTBVT của ô này có phần với trang bị vật tư cần xóa có cùng treePath hay k tồn tại some
            if (
              user &&
              ["CCT", "CKT", "P_QL"].includes((user.role as DirectusRoles).name)
            ) {
              if (userTBVT && userTBVT.length > 0) {
                // let isOwner = false;
                const isOwner = userTBVT.some((tbvt) =>
                  equipment.tree_path.includes(
                    (tbvt.tbvt_categories_id as TBVTCategories).tree_path
                  )
                );
                if (isOwner) {
                  await tbvtCategoriesServices.updateOne(
                    equipment.id,
                    {
                      has_child: false,
                    },
                    {
                      emitEvents: false,
                    }
                  );
                  return payload;
                } else {
                  throw new ApiError(
                    "Bạn không thể xóa trang bị hoặc vật tư này do bạn không có quyền với trang bị hoặc vật tư này",
                    403
                  );
                }
              } else {
                throw new ApiError(
                  "Bạn không thể xóa trang bị hoặc vật tư này do bạn không có quyền với trang bị hoặc vật tư này",
                  403
                );
              }
            } else {
              throw new ApiError(
                "Bạn không thể xóa trang bị hoặc vật tư này do bạn không có quyền với trang bị hoặc vật tư này",
                403
              );
            }
          }
          // user.role as DirectusRoles).name === "Administrator"

          // const userTBVT = await
        }
      } catch (error) {
        console.error("Error delete tbvt categories", error);
        if (error instanceof ApiError) {
          if (error.statusCode === 409) {
            throw new ConflictErrors({
              message: error.message,
            });
          } else if (error.statusCode === 403) {
            throw new ForbiddenErrors({
              message: error.message,
            });
          } else {
            throw new BadRequestErrors({
              message: error.message,
            });
          }
        }
        throw new InternalServerErrorErrors({
          message: "Lỗi không xóa được trang bị hoặc vật tư",
        });
      }
    }
  );
  // lúc sửa
  // truoc khi create cũng phải check treeLevel so với mã cha của nó
  filter(
    "tbvt_categories.items.create",
    async (
      payload: CreatingTBVTCategoryPayload,
      { event, collection },
      { database, schema, accountability }
    ) => {
      try {
        console.log("Creating a new Trang bị...", payload, event, collection);

        const tbvtService: ItemsServices<TBVTCategories> = new ItemsService(
          collection,
          {
            schema,
            knex: database,
          }
        );
        const userServices: ItemsServices<DirectusUsers> = new UsersService({
          schema,
          knex: database,
        });
        const userTBVTServices: ItemsServices<TBVTCategoriesDirectusUsers> =
          new ItemsService("tbvt_categories_directus_users", {
            schema,
            knex: database,
          });

        if (payload.code) {
          const isExistCode = await tbvtService.readByQuery({
            filter: {
              code: {
                _eq: (payload.code as string) || "",
              },
            },
          });
          console.log("isExistCode: ", isExistCode);
          if (isExistCode && isExistCode.length > 0) {
            throw new ApiError(
              "Bạn không thể tạo trang bị do đã tồn tại trang bị với mã code này",
              403
            );
          }
        }

        payload.tree_path = newPath();
        payload.tree_level = 1;
        console.log("typeof payload.parent_id: ", typeof payload.parent_id);
        // Xử lý logic tạo tree_level và tree_path
        if (payload.parent_id && typeof payload.parent_id === "string") {
          // const parent = await tbvtService.readOne(payload.parent_id);
          const parent = await tbvtService.readOne(payload.parent_id);
          console.log("parent: ", parent);
          if (parent) {
            const isValidCode = checkIsValidEquipmentCode(
              payload.code || "",
              parent.code,
              parent.tree_level
            );
            await tbvtService.updateOne(
              payload.parent_id,
              {
                has_child: true,
              },
              {
                emitEvents: false,
              }
            );
            console.log("isValidCode: ", isValidCode);
            // if (!isValidCode) {
            //   throw new ApiError(
            //     "Bạn không thể tạo trang bị do mã trang bị không khớp với mã trang bị cha",
            //     403
            //   );
            // }

            payload.tree_path = `${parent.tree_path}.${payload.tree_path}`;
            payload.tree_level = +(parent.tree_level || 1) + 1;
          }
        }
        console.log("Done hook create Trang bị!", payload);
        return payload;
      } catch (error) {
        console.error("Error create tbvt categories", error);
        if (error instanceof ApiError) {
          if (error.statusCode === 409) {
            throw new ConflictErrors({
              message: error.message,
            });
          } else if (error.statusCode === 403) {
            throw new ForbiddenErrors({
              message: error.message,
            });
          } else {
            throw new BadRequestErrors({
              message: error.message,
            });
          }
        }
        throw new InternalServerErrorErrors({
          message: "Tạo trang bị hoặc vật tư không thành công",
        });
      }
    }
  );

  action(
    "tbvt_categories.items.create",
    async ({ event, payload, collection }, { schema, database }) => {
      console.log("Sau khi tạo Trang bị!", event, payload, collection);

      const tbvtService: ItemsServices<TBVTCategories> = new ItemsService(
        collection,
        {
          schema,
          knex: database,
        }
      );

      try {
        const children = await tbvtService.readByQuery({
          filter: {
            parent_id: {
              tree_path: {
                _eq: payload.tree_path,
              },
            },
          },
        });
        // Xử lý logic cập nhật tree_path va tree_level cho đơn vị con khi đơn vị cha được tạo
        const newChildren = children?.map((child) => {
          child.tree_path = `${payload.tree_path}.${
            child?.tree_path.split(".").slice(-1)[0] || newPath()
          }`;
          child.tree_level = +payload.tree_level! + 1;
          return {
            id: child.id,
            tree_path: child.tree_path,
            tree_level: child.tree_level,
          };
        });

        if (newChildren?.length > 0) {
          await tbvtService.updateBatch(newChildren, { emitEvents: true });
        }
      } catch (error) {
        console.error(
          "Error after created new don vi, when updating children of Trang bị",
          error
        );
      }
    }
  );

  filter(
    "tbvt_categories.items.update",
    async (
      payload: UpdatingTBVTCategoryPayload,
      { event, keys, collection },
      { database, schema }
    ) => {
      console.log("Updating a Trang bị...", payload, event, keys, collection);

      const tbvtService: ItemsServices<TBVTCategories> = new ItemsService(
        collection,
        {
          schema,
          knex: database,
        }
      );
      try {
        const equipment = await tbvtService.readOne(keys[0] as string, {
          fields: ["*", "parent_id.*"],
        });
        if (equipment && payload.code && equipment.parent_id) {
          const isValidCode = checkIsValidEquipmentCode(
            payload.code || "",
            (equipment.parent_id as TBVTCategories).code,
            (equipment.parent_id as TBVTCategories).tree_level + 1
          );
          console.log("isValidCode: ", isValidCode);
          if (!isValidCode) {
            throw new ApiError(
              "Bạn không thể cập nhật mã trang bị do mã trang bị không khớp với mã trang bị cha",
              403
            );
          }
        }

        if (payload.code) {
          const isExistCode = await tbvtService.readByQuery({
            filter: {
              code: {
                _eq: (payload.code as string) || "",
              },
              id: {
                _neq: keys[0] as string,
              },
            },
          });
          if (isExistCode && isExistCode.length > 0) {
            throw new ApiError(
              "Đã tồn tại mã trang bị này trong hệ thống, không thể cập nhật mã trang bị",
              403
            );
          }
        }

        // Xử lý logic cập nhật tree_level và tree_path
        if (
          payload.parent_id &&
          typeof payload.parent_id === "string" &&
          keys.length === 1
        ) {
          const [parent, current] = await Promise.all([
            tbvtService.readOne(payload.parent_id),
            tbvtService.readOne(keys[0]),
          ]);

          if (parent) {
            if (parent.tree_path.includes(current.tree_path)) {
              throw new ApiError(
                "Không thể gắn đơn vị con làm đơn vị cha. Hãy xóa bỏ parent_id của đơn vị cha",
                400
              );
            }

            payload.tree_path = `${parent.tree_path}.${
              current.tree_path?.split(".").slice(-1)[0] || newPath()
            }`;
            payload.tree_level = +(parent.tree_level || 0) + 1;
          }
        } else if (payload.parent_id === null) {
          const current = await tbvtService.readOne(keys[0]);
          payload.tree_path =
            current.tree_path?.split(".").slice(-1)[0] || newPath();
          payload.tree_level = 1;
        }

        return payload;
      } catch (error) {
        console.error("Error update tbvt categories", error);
        if (error instanceof ApiError) {
          if (error.statusCode === 409) {
            throw new ConflictErrors({
              message: error.message,
            });
          } else if (error.statusCode === 403) {
            throw new ForbiddenErrors({
              message: error.message,
            });
          } else {
            throw new BadRequestErrors({
              message: error.message,
            });
          }
        }
        throw new InternalServerErrorErrors({
          message: "Cập nhật trang bị hoặc vật tư không thành công",
        });
      }
    }
  );

  action(
    "tbvt_categories.items.update",
    async ({ event, payload, keys, collection }, { schema, database }) => {
      console.log("Sau khi update Trang bị!", event, payload, keys, collection);

      const tbvtService: ItemsServices<TBVTCategories> = new ItemsService(
        collection,
        {
          schema,
          knex: database,
        }
      );

      // Xử lý logic cập nhật tree_path va tree_level cho đơn vị con khi đơn vị cha thay đổi
      // Thao tác này sẽ gọi lại hook tbvt_categories.items.update ở đơn vị con và update recurrsive
      if (payload.tree_path != null && payload.tree_level != null) {
        keys.map(async (key: string) => {
          const children = await tbvtService.readByQuery({
            filter: {
              parent_id: {
                _eq: key,
              },
            },
          });

          const newChildren = children.map((child) => {
            const tree_paths = child.tree_path.split(".");
            child.tree_path =
              payload.tree_path + "." + (tree_paths.slice(-1)[0] || newPath());
            return {
              id: child.id,
              tree_path: child.tree_path,
              tree_level: +payload.tree_level! + 1,
            };
          });

          if (newChildren.length > 0) {
            await tbvtService.updateBatch(newChildren, { emitEvents: true });
          }
        });
      }
    }
  );
});
