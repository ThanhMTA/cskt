import { defineHook } from "@directus/extensions-sdk";
import defineOrganizationHooks from "./organization";
import defineGeneralHooks from "./general";
import defineActivityHooks from "./activity";
import defineTBVTCategoryHooks from "./tbvt-categories";
import defineUserHooks from "./user";

export default defineHook((registerFunctions, context) => {
  defineOrganizationHooks(registerFunctions, context);
  defineGeneralHooks(registerFunctions, context);
  defineActivityHooks(registerFunctions, context);
  defineUserHooks(registerFunctions, context);
  defineTBVTCategoryHooks(registerFunctions, context);
});
