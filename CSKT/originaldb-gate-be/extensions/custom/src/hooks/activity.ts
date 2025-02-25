import { defineHook } from "@directus/extensions-sdk";
import {
  AvailableRoles,
  DirectusActivity,
  DirectusPermissions,
  DirectusRevisions,
  DirectusRoles,
  DirectusUsers,
} from "../types";
import { ItemsService as ItemsServices } from "@directus/api/dist/services/items";
import { RolesService as RolesServices } from "@directus/api/dist/services/roles";
import type { Permission } from "@directus/types/dist/permissions";
import { createError } from "@directus/errors";

type CreatingActivityPayload = Omit<DirectusActivity, "id">;
export default defineHook(({ filter }, { services, getSchema }) => {
  // const { ItemsService } = services;
  const { ItemsService, UsersService, RolesService, PermissionsService } =
    services;
  /**
   *
   */

  filter(
    "activity.create",
    async (
      payload: CreatingActivityPayload,
      { event, keys, collection },
      { database, schema, accountability }
    ) => {
      console.log("Trước khi revisions.create", keys, payload, collection);
      const userServices: ItemsServices<DirectusUsers> = new UsersService({
        schema,
        accountability: accountability,
      });
      if (
        (payload && payload?.user) ||
        (accountability && accountability?.user)
      ) {
        const userId = (payload.user as string) || accountability?.user || "";
        const user = await userServices.readOne(userId, {
          fields: ["*", "role.id", "role.name"],
        });
        // console.log("accountability: ", accountability);
        // console.log("user: ", user);
        let newPayload = payload;
        if (user) {
          newPayload.role_name = (user.role as DirectusRoles).name || "";
          return newPayload;
        }
      }

      return payload;
    }
  );

  filter(
    "activity.read",
    async (
      payload: any,
      { event, keys, collection },
      { database, schema, accountability }
    ) => {
      console.log("Trước khi read activity", keys, payload, collection);
      const userServices: ItemsServices<DirectusUsers> = new UsersService({
        schema,
        accountability: accountability,
      });
      if (accountability && accountability?.user) {
        const userId = accountability?.user || "";
        const user = await userServices.readOne(userId, {
          fields: ["*", "role.id", "role.name"],
        });
        // user.role as DirectusRoles).name === "Administrator"
        if (
          (user.role as DirectusRoles).name !== "Administrator" ||
          !(user.role as DirectusRoles).name.includes("ADMIN")
        ) {
          let newPayload = payload;
          newPayload.user = user.id;
          newPayload.role_name = (user.role as DirectusRoles).name;
          return newPayload;
        }
        return payload;
      }

      return payload;
    }
  );
});
