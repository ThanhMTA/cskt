import { defineHook } from "@directus/extensions-sdk";
import { customAlphabet } from "nanoid";
import { Organizations } from "../types";
import type { ItemsService as ItemsServices } from "@directus/api/dist/services/items";
import { createError } from "@directus/errors";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const newPath = customAlphabet(alphabet, 6);

type CreatingOrganizationPayload = Partial<Organizations>;
type UpdatingOrganizationPayload = Omit<Partial<Organizations>, "id">;

export default defineHook(({ filter, action }, { services }) => {
  const { ItemsService } = services;
  // Xử lý logic tạo Đơn vị
  filter(
    "organizations.items.create",
    async (
      payload: CreatingOrganizationPayload,
      { event, collection },
      { database, schema }
    ) => {
      console.log("Creating a new Đơn vị...", payload, event, collection);

      const dsDonViService: ItemsServices<Organizations> = new ItemsService(
        collection,
        {
          schema,
          knex: database,
        }
      );

      payload.tree_path = newPath();
      // payload.tree_level = 1;

      // Xử lý logic tạo tree_level và tree_path
      if (payload.parent_id && typeof payload.parent_id === "string") {
        const parent = await dsDonViService.readOne(payload.parent_id);
        if (parent) {
          payload.tree_path = `${parent.tree_path}.${payload.tree_path}`;
          payload.tree_level = +(parent.tree_level || 1) + 1;
          console.log("Update has child");
          await dsDonViService.updateOne(
            payload.parent_id,
            {
              has_child: true,
            },
            {
              emitEvents: false,
            }
          );
        }
      }
      console.log("Done hook create Đơn vị!", payload);
      return payload;
    }
  );

  action(
    "organizations.items.create",
    async ({ event, payload, collection }, { schema, database }) => {
      console.log("Sau khi tạo Đơn vị!", event, payload, collection);

      const dsDonViService: ItemsServices<Organizations> = new ItemsService(
        collection,
        {
          schema,
          knex: database,
        }
      );

      try {
        const children = await dsDonViService.readByQuery({
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
            child.tree_path.split(".").slice(-1)[0] || newPath()
          }`;
          child.tree_level = +payload.tree_level! + 1;
          return {
            id: child.id,
            tree_path: child.tree_path,
            tree_level: child.tree_level,
          };
        });

        if (newChildren?.length > 0) {
          await dsDonViService.updateBatch(newChildren, { emitEvents: true });
        }
      } catch (error) {
        console.error(
          "Error after created new don vi, when updating children of Đơn vị",
          error
        );
      }
    }
  );

  filter(
    "organizations.items.update",
    async (
      payload: UpdatingOrganizationPayload,
      { event, keys, collection },
      { database, schema }
    ) => {
      console.log("Updating a Đơn vị...", payload, event, keys, collection);

      const dsDonViService: ItemsServices<Organizations> = new ItemsService(
        collection,
        {
          schema,
          knex: database,
        }
      );

      // Xử lý logic cập nhật tree_level và tree_path
      if (
        payload.parent_id &&
        typeof payload.parent_id === "string" &&
        keys.length === 1
      ) {
        const [parent, current] = await Promise.all([
          dsDonViService.readOne(payload.parent_id),
          dsDonViService.readOne(keys[0]),
        ]);

        if (parent) {
          if (parent.tree_path.includes(current.tree_path)) {
            throw createError(
              "400",
              "Không thể gắn đơn vị con làm đơn vị cha. Hãy xóa bỏ parent_id của đơn vị cha"
            );
          }

          payload.tree_path = `${parent.tree_path}.${
            current.tree_path?.split(".").slice(-1)[0] || newPath()
          }`;
          payload.tree_level = +(parent.tree_level || 0) + 1;
        }
      } else if (payload.parent_id === null) {
        const current = await dsDonViService.readOne(keys[0]);
        payload.tree_path =
          current.tree_path?.split(".").slice(-1)[0] || newPath();
        payload.tree_level = 1;
      }

      return payload;
    }
  );

  action(
    "organizations.items.update",
    async ({ event, payload, keys, collection }, { schema, database }) => {
      console.log("Sau khi update Đơn vị!", event, payload, keys, collection);

      const dsDonViService: ItemsServices<Organizations> = new ItemsService(
        collection,
        {
          schema,
          knex: database,
        }
      );

      // Xử lý logic cập nhật tree_path va tree_level cho đơn vị con khi đơn vị cha thay đổi
      // Thao tác này sẽ gọi lại hook organizations.items.update ở đơn vị con và update recurrsive
      if (payload.tree_path != null && payload.tree_level != null) {
        keys.map(async (key: string) => {
          const children = await dsDonViService.readByQuery({
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
            await dsDonViService.updateBatch(newChildren, { emitEvents: true });
          }
        });
      }
    }
  );
});
