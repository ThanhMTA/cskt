import { defineEndpoint } from "@directus/extensions-sdk";
import { ItemsService as ItemsServices } from "@directus/api/dist/services/items";
import type { AuthenticationService as AuthenticationServices } from "@directus/api/dist/services/authentication";
// import {} from "@directu"
import {
  AvailableRoles,
  DirectusRoles,
  DirectusUsers,
  GroupEquipment,
  Organizations,
  TechnicalTypes,
} from "../types";
import { readFile } from "fs/promises";
const ExcelJS = require("exceljs");
import path from "path";
import { SchemaOverview } from "@directus/types";
import { Router, Request, Response, NextFunction } from "express";
import {
  getConfig,
  getOas,
  getPackage,
  merge,
  filterPaths,
  updateLevels,
  treeFormat,
  listToTreeInTable,
  getTechnicalCBNVDetail,
  toRoman,
  getFullAddressString,
  gatherAmountTbvt,
  getNextColumn,
} from "./utils";
import swaggerUi from "swagger-ui-express";
import { TemplateHandler } from "easy-template-x";
import dayjs from "./dayjs";
import {
  generateNewCodeOrg,
  generateNewCodeEquip,
} from "./generate-code-services";
import ApiError from "./middleware/custom-error";
import {
  BadRequestErrors,
  ConflictErrors,
  ForbiddenErrors,
  InternalServerErrorErrors,
} from "./middleware/error-handler";
// import { authentication, createDirectus, rest } from "@directus/sdk";
const config = getConfig();
// console.log("config: ", config);
const id = config.docsPath;
// console.log("id: ", id);
export default defineEndpoint(
  (router, { services, logger, getSchema, database, env }) => {
    const { ItemsService } = services;
    router.get("/", (_req, res) => res.send("Hello, World!"));
    const options = {
      swaggerOptions: {
        url: `/api/${id}/oas`,
        filter: true,
      },
    };
    // console.log("swagger serve: ", swaggerUi.serve);
    router.use(
      "/docs",
      // (_req: Request, res: Response, next: NextFunction) => {
      //   console.log("_Req query before: ", _req.query);
      //   res.locals.path = _req.query.path;
      //   _req.query = {};

      //   next();
      // },
      // (_req: Request, res: Response, next: NextFunction) => {
      //   console.log("_Req query after: ", _req.query);
      //   console.log("res.locals before: ", res.locals.path);
      //   if (res.locals.path && !options.swaggerOptions.url.includes("?path")) {
      //     options.swaggerOptions.url = `${options.swaggerOptions.url}?path=ItemsActorsTables`;
      //   }

      //   console.log("options: ", options);
      //   next();
      // },
      swaggerUi.serve
    );
    router.get(
      "/docs/:collection",
      async (_req: Request, res: Response, next: NextFunction) => {
        const collection = _req.params.collection;
        console.log("collection: ", collection);
        const schema = await getSchema();
        const swagger = await getOas(services, schema);
        // console.log("swagger: ", swagger);
        const pkg = getPackage();
        console.log("pkg: ", pkg);
        swagger.info.title =
          config.info.title || pkg?.name || swagger.info.title;
        swagger.info.version =
          config.info.version || pkg?.version || swagger.info.version;
        swagger.info.description =
          config.info.description ||
          pkg?.description ||
          swagger.info.description;

        // inject custom-endpoints
        try {
          for (const path in config.paths) {
            swagger.paths[path] = config.paths[path];
          }

          for (const tag of config.tags) {
            swagger.tags.push(tag);
          }

          swagger.components = merge(config.components, swagger.components);
        } catch (e) {
          logger.info("No custom definitions");
        }

        if (config.publishedTags?.length) filterPaths(config, swagger);
        const tag = swagger.tags.find(
          (tag: any) => tag["x-collection"] === collection
        )?.name;
        console.log("tag: ", tag);
        function filterSwaggerByTags(swaggerJson: any, tags: any) {
          const filteredPaths = {};
          const filteredComponentsSchema = Object.fromEntries(
            Object.entries(swaggerJson.components.schemas).filter(
              ([key, value]) => key === tag || key === "x-metadata"
            )
          );
          console.log("filteredComponentsSchema: ", filteredComponentsSchema);
          const filteredTags = tags.filter((tag: any) => tag.name === tag);
          // Loop through paths and include only those with the specified tags
          for (const [path, pathItem] of Object.entries(swaggerJson.paths)) {
            const filteredMethods = {};
            // @ts-ignore
            for (const [method, operation] of Object.entries(pathItem)) {
              if (
                // @ts-ignore
                operation.tags &&
                // @ts-ignore
                operation.tags.some((tag) => tags.includes(tag.toLowerCase()))
              ) {
                // @ts-ignore
                filteredMethods[method] = operation;
                if (
                  method === "get" &&
                  // @ts-ignore
                  filteredMethods[method]["security"] &&
                  // @ts-ignore
                  filteredMethods[method]["security"].length > 0
                ) {
                  // @ts-ignore
                  filteredMethods[method]["security"].push({ Bearer: [] });
                }
              }
            }
            if (Object.keys(filteredMethods).length > 0) {
              // @ts-ignore
              filteredPaths[path] = filteredMethods;
            }
          }
          return {
            ...swaggerJson,
            paths: filteredPaths,
            tags: filteredTags,
            components: {
              ...swaggerJson.components,
              schemas: filteredComponentsSchema,
              securitySchemes: {
                ...swaggerJson.components.securitySchemes,
                Bearer: {
                  type: "http",
                  scheme: "bearer",
                  bearerFormat: "JWT",
                  description:
                    "Enter your Bearer token in the format **Bearer &lt;token&gt;**",
                },
              },
            },
          };
        }
        const filteredDocs = filterSwaggerByTags(swagger, [tag.toLowerCase()]);

        if (tag) {
          swaggerUi.setup(filteredDocs, { filter: true })(_req, res, next);
        } else {
          swaggerUi.setup({ filter: true })(_req, res, next);
        }
      }
    );
    router.get("/docs", swaggerUi.setup({}, options));
    router.get(
      "/oas",
      async (_req: Request, res: Response, next: NextFunction) => {
        try {
          // console.log("res.query oas: ", _req.query);
          // console.log("res.locals oas: ", res.locals);
          const schema = await getSchema();
          const swagger = await getOas(services, schema);
          // console.log("swagger: ", swagger);
          const pkg = getPackage();
          console.log("pkg: ", pkg);
          swagger.info.title =
            config.info.title || pkg?.name || swagger.info.title;
          swagger.info.version =
            config.info.version || pkg?.version || swagger.info.version;
          swagger.info.description =
            config.info.description ||
            pkg?.description ||
            swagger.info.description;

          // inject custom-endpoints
          try {
            for (const path in config.paths) {
              swagger.paths[path] = config.paths[path];
            }

            for (const tag of config.tags) {
              swagger.tags.push(tag);
            }

            swagger.components = merge(config.components, swagger.components);
          } catch (e) {
            logger.info("No custom definitions");
          }

          if (config.publishedTags?.length) filterPaths(config, swagger);
          function filterSwaggerByTags(swaggerJson: any) {
            const filteredPaths = {};

            // Loop through paths and include only those with the specified tags
            for (const [path, pathItem] of Object.entries(swaggerJson.paths)) {
              const filteredMethods = {};
              // @ts-ignore
              for (const [method, operation] of Object.entries(pathItem)) {
                // @ts-ignore
                filteredMethods[method] = operation;
                if (
                  method === "get" &&
                  // @ts-ignore
                  filteredMethods[method]["security"] &&
                  // @ts-ignore
                  filteredMethods[method]["security"].length > 0
                ) {
                  // @ts-ignore
                  filteredMethods[method]["security"].push({ Bearer: [] });
                }
              }
              if (Object.keys(filteredMethods).length > 0) {
                // @ts-ignore
                filteredPaths[path] = filteredMethods;
              }
            }
            console.log("filteredPaths: ", filteredPaths);
            return {
              ...swaggerJson,
              paths: filteredPaths,

              components: {
                ...swaggerJson.components,
                securitySchemes: {
                  ...swaggerJson.components.securitySchemes,
                  Bearer: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description:
                      "Enter your Bearer token in the format **Bearer &lt;token&gt;**",
                  },
                },
              },
            };
          }
          const swaggerNew = filterSwaggerByTags(swagger);

          res.json(swaggerNew);
        } catch (error: any) {
          return next(new Error(error.message || error[0].message));
        }
      }
    );
    router.get(
      "/docs/collection/:collection",
      async (_req: Request, res: Response, next: NextFunction) => {
        const collection = _req.params.collection;
        console.log("collection: ", collection);
        const schema = await getSchema();
        const swagger = await getOas(services, schema);
        // console.log("swagger: ", swagger);
        const pkg = getPackage();
        console.log("pkg: ", pkg);
        swagger.info.title =
          config.info.title || pkg?.name || swagger.info.title;
        swagger.info.version =
          config.info.version || pkg?.version || swagger.info.version;
        swagger.info.description =
          config.info.description ||
          pkg?.description ||
          swagger.info.description;

        // inject custom-endpoints
        try {
          for (const path in config.paths) {
            swagger.paths[path] = config.paths[path];
          }

          for (const tag of config.tags) {
            swagger.tags.push(tag);
          }

          swagger.components = merge(config.components, swagger.components);
        } catch (e) {
          logger.info("No custom definitions");
        }

        if (config.publishedTags?.length) filterPaths(config, swagger);
        const tag = swagger.tags.find(
          (tag: any) => tag["x-collection"] === collection
        )?.name;
        console.log("tag: ", tag);
        function filterSwaggerByTags(swaggerJson: any, tags: any) {
          const filteredPaths = {};
          const filteredComponentsSchema = Object.fromEntries(
            Object.entries(swaggerJson.components.schemas).filter(
              ([key, value]) => key === tag || key === "x-metadata"
            )
          );
          console.log("filteredComponentsSchema: ", filteredComponentsSchema);
          const filteredTags = tags.filter((tag: any) => tag.name === tag);
          // Loop through paths and include only those with the specified tags
          for (const [path, pathItem] of Object.entries(swaggerJson.paths)) {
            const filteredMethods = {};
            // @ts-ignore
            for (const [method, operation] of Object.entries(pathItem)) {
              if (
                // @ts-ignore
                operation.tags &&
                // @ts-ignore
                operation.tags.some((tag) => tags.includes(tag.toLowerCase()))
              ) {
                // @ts-ignore
                filteredMethods[method] = operation;
                if (
                  method === "get" &&
                  // @ts-ignore
                  filteredMethods[method]["security"] &&
                  // @ts-ignore
                  filteredMethods[method]["security"].length > 0
                ) {
                  // @ts-ignore
                  filteredMethods[method]["security"].push({ Bearer: [] });
                }
              }
            }
            if (Object.keys(filteredMethods).length > 0) {
              // @ts-ignore
              filteredPaths[path] = filteredMethods;
            }
          }
          return {
            ...swaggerJson,
            paths: filteredPaths,
            tags: filteredTags,
            components: {
              ...swaggerJson.components,
              schemas: filteredComponentsSchema,
              securitySchemes: {
                ...swaggerJson.components.securitySchemes,
                Bearer: {
                  type: "http",
                  scheme: "bearer",
                  bearerFormat: "JWT",
                  description:
                    "Enter your Bearer token in the format **Bearer &lt;token&gt;**",
                },
              },
            },
          };
        }
        const filteredDocs = filterSwaggerByTags(swagger, [tag.toLowerCase()]);
        res.json(filteredDocs);
        // if (tag) {

        //   swaggerUi.setup(filteredDocs, { filter: true })(_req, res, next);
        // } else {
        //   swaggerUi.setup({ filter: true })(_req, res, next);
        // }
      }
    );
    // router.get(
    //   "/tags",
    //   async (_req: Request, res: Response, next: NextFunction) => {
    //     try {
    //       // console.log("res.query oas: ", _req.query);
    //       // console.log("res.locals oas: ", res.locals);
    //       const schema = await getSchema();
    //       const swagger = await getOas(services, schema);
    //       // console.log("swagger: ", swagger);
    //       const pkg = getPackage();
    //       console.log("pkg: ", pkg);
    //       swagger.info.title =
    //         config.info.title || pkg?.name || swagger.info.title;
    //       swagger.info.version =
    //         config.info.version || pkg?.version || swagger.info.version;
    //       swagger.info.description =
    //         config.info.description ||
    //         pkg?.description ||
    //         swagger.info.description;

    //       // inject custom-endpoints
    //       try {
    //         for (const path in config.paths) {
    //           swagger.paths[path] = config.paths[path];
    //         }

    //         for (const tag of config.tags) {
    //           swagger.tags.push(tag);
    //         }

    //         swagger.components = merge(config.components, swagger.components);
    //       } catch (e) {
    //         logger.info("No custom definitions");
    //       }

    //       if (config.publishedTags?.length) filterPaths(config, swagger);
    //       res.json(swagger.tags);
    //     } catch (error: any) {
    //       return next(new Error(error.message || error[0].message));
    //     }
    //   }
    // );
    /**
     * @link http://localhost:8080/api/api/organizations/code/generate/
     * @method POST
     * @body id: string uuid
     * @returns code : string
     */
    router.post(
      "/organizations/code/generate",
      async (_req: Request, res: Response) => {
        try {
          const { ItemsService } = services;
          const organizationService: ItemsServices<Organizations> =
            new ItemsService("organizations", {
              schema: (_req as any).schema,
            });

          const org = _req.body.id
            ? await organizationService.readOne(_req.body.id as string)
            : undefined;
          console.log("org: ", org);

          const org_code = await generateNewCodeOrg(
            org ? (org?.code as string) : "",
            database
          );
          console.log("org_code: ", org_code);
          return res.send(org_code);

          // res.json(swagger);
        } catch (error: any) {
          console.log("Error: ", error);
          return res
            .status(500)
            .send((error as any).message || "Có lỗi xảy ra");
        }
      }
    );
    /**
     * @link http://localhost:8080/api/api/tbvt-categories/:id/generate/
     * @method GET
     * @param id: string uuid
     * @returns code : string
     */
    router.get(
      "/tbvt-categories/:id/generate",
      async (_req: Request, res: Response) => {
        try {
          const { ItemsService } = services;
          const tbvtService: ItemsServices<any> = new ItemsService(
            "tbvt_categories",
            {
              schema: (_req as any).schema,
            }
          );
          const parent = await tbvtService.readOne(_req.params.id as string);
          if (!parent) {
            return res.status(404).send("Không tồn tại mã trang bị vật tư");
          }
          const equip_code = await generateNewCodeEquip(
            parent.code || "",
            parent.type || "",
            database
          );
          console.log("equip_code: ", equip_code);
          return res.send(equip_code);
        } catch (error) {
          console.log("Error: ", error);
          return res
            .status(500)
            .send((error as any).message || "Có lỗi xảy ra");
        }
      }
    );

    router.post(
      "/update-available-role",
      async (_req: Request, res: Response) => {
        try {
          const {
            ItemsService,
            UsersService,
            PermissionsService,
            AuthenticationService,
          } = services;
          const { role } = _req.body;
          if (_req.accountability && _req.accountability.user && role) {
            const userServices: ItemsServices<DirectusUsers> = new UsersService(
              {
                schema: (_req as any).schema,
                accountability: _req.accountability,
              }
            );
            const userAdminService = new UsersService({
              schema: (_req as any).schema || (await getSchema()),
              accountability: {
                ...(_req.accountability ?? { role: null }),
                admin: true, // We need to skip permissions checks for the update call below
              },
            });
            // const authenticationService: AuthenticationServices =
            //   new AuthenticationService({
            //     schema: await getSchema(),
            //     accountability: {
            //       ...(_req.accountability ?? { role: null }),
            //       admin: true, // We need to skip permissions checks for the update call below
            //     },
            //   });
            const availableRoleServices: ItemsServices<AvailableRoles> =
              new ItemsService("available_roles", {
                schema: (_req as any).schema || (await getSchema()),
                accountability: _req.accountability,
              });
            // console.log("accountability: ", accountability);
            console.log(
              "Truoc khi update user accountability.user: ",
              _req.accountability?.role
            );

            const user = await userServices.readOne(_req.accountability.user, {
              fields: ["*", "role.id", "role.name"],
            });
            console.log("User tu update: ", user);
            if ((user.role as DirectusRoles).name === "Administrator") {
              throw new ApiError(
                "Bạn là Administrator không được cập nhật vai",
                403
              );
            } else {
              const availableRoleExist =
                await availableRoleServices.readByQuery(
                  {
                    filter: {
                      user_id: {
                        _eq: user.id,
                      },
                      role_id: {
                        _eq: role as string,
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
                await userAdminService.updateOne(
                  user.id,
                  {
                    role: role,
                  },
                  {
                    emitEvents: false,
                  }
                );
                // await authenticationService.refresh(_req.)
                return res.status(200).json({
                  success: true,
                  message: "Cập nhật vai người dùng thành công",
                });
              } else {
                throw new ApiError("Người dùng không có vai này", 400);
              }
            }
          }
        } catch (error: any) {
          console.log("Error: ", error);
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
            message: "Cập nhật vai người dùng không thành công",
          });
        }
      }
    );

    router.get(
      "/reportCBNVCMKTByOrg",
      async (_req: Request, res: Response, next: NextFunction) => {
        try {
          const { tree_path, type } = _req?.query;
          const { ItemsService } = services;
          const orgService: ItemsServices<Organizations> = new ItemsService(
            "organizations",
            {
              schema: (_req as any).schema,
            }
          );
          const cbnvService: ItemsServices<any> = new ItemsService(
            "technical_org_personal_identifies",
            {
              schema: (_req as any).schema,
            }
          );
          const technicalTypeService: ItemsServices<TechnicalTypes> =
            new ItemsService("technical_types", {
              schema: (_req as any).schema,
            });
          const organization = await orgService.readByQuery({
            filter: {
              tree_path: tree_path,
            },
            fields: ["*"],
          });
          console.log("organization: ", organization);
          const organizations = await orgService.readByQuery({
            limit: -1,
            filter: {
              _and: [{ tree_path: { _contains: tree_path } }],
            },
            alias: {
              parentId: "parent_id",
              value: "id",
              key: "id",
              title: "name",
            },
            fields: [
              "id",
              "key",
              "name",
              "value",
              "title",
              "parentId",
              "parent_id",
              "order_number",
              "tree_path",
            ],
            sort: ["order_number", "code"],
          });

          const treeOrgFormat = treeFormat(organizations);
          const technicalTypes = await technicalTypeService.readByQuery({
            limit: -1,
            filter: {
              _and: [
                {
                  technical_id: {
                    org_manage_id: { tree_path: { _contains: tree_path } },
                  },
                },
                {
                  type_id: {
                    short_name: {
                      _eq: type === "ToBD" ? "to_bdktcd" : "TRAM_CQDT",
                    },
                  },
                },
              ],
            },
            fields: [
              "*",
              "technical_id.*",
              "technical_id.org_manage_id.*",
              "major_id.*",
              "type_id.*",
              "personal_identifies.*",
            ],
          });
          const technicalTypesFormat = technicalTypes.map((item: any) => ({
            ...item,
            ...item.technical_id,
            parentId: item.technical_id?.parent_id,
            key: item?.technical_id?.id,
            title: item?.technical_id?.name,
            value: item?.id,
            parent_id: item.technical_id?.parent_id,
            id: item.id,
          }));

          const listTree = listToTreeInTable(
            [...technicalTypesFormat],
            treeOrgFormat
          );
          const data = await Promise.all(
            listTree.map(async (item: any, index: number) => {
              const technicalOrgIds = item?.children?.map(
                (child: any) => child?.technical_id?.id
              );

              // Fetch cbnvDetail for each item
              const cbnvDetail = await getTechnicalCBNVDetail(
                technicalOrgIds,
                cbnvService
              );
              return {
                org_name: `${toRoman(index + 1)}. ${item?.name}`,
                cbnvDetail: cbnvDetail,
              };
            })
          );
          const templateFile = await readFile(
            path.join(__dirname, "./tong-hop-cbnvcmkt.docx")
          );
          const handler = new TemplateHandler();
          const nowInVietnam = dayjs().tz();
          const day = nowInVietnam.get("date"); // Outputs the day of the month as a number (e.g., 3)
          const month = nowInVietnam.get("month") + 1; // Outputs the month as a number (e.g., 6, January is 0)
          const year = nowInVietnam.get("year"); // Outputs the full year (e.g., 2024)
          const dataMapTemplate = {
            day: day,
            month: month,
            root_org: organization[0]?.short_name,
            year: year,
            data: data,
          };
          const doc = await handler.process(templateFile, dataMapTemplate);
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=bao-cao-tbvt.docx"
          );
          return res.send(doc);
        } catch (error: any) {
          console.log("Error: ", error);
          return res
            .status(500)
            .send((error as any).message || "Có lỗi xảy ra");
        }
      }
    );
    router.get(
      "/reportToBDKTByOrg",
      async (_req: Request, res: Response, next: NextFunction) => {
        try {
          const { tree_path, type } = _req?.query;
          const { ItemsService } = services;
          const orgService: ItemsServices<Organizations> = new ItemsService(
            "organizations",
            {
              schema: (_req as any).schema,
            }
          );
          const cbnvService: ItemsServices<any> = new ItemsService(
            "technical_org_personal_identifies",
            {
              schema: (_req as any).schema,
            }
          );
          const technicalTypeService: ItemsServices<TechnicalTypes> =
            new ItemsService("technical_types", {
              schema: (_req as any).schema,
            });
          const organization = await orgService.readByQuery({
            filter: {
              tree_path: tree_path,
            },
            fields: ["*"],
          });
          const organizations = await orgService.readByQuery({
            limit: -1,
            filter: {
              _and: [
                { tree_path: { _contains: tree_path } },
                { is_enable: true },
              ],
            },
            alias: {
              parentId: "parent_id",
              value: "id",
              key: "id",
              title: "name",
            },
            fields: [
              "id",
              "key",
              "name",
              "value",
              "title",
              "parentId",
              "short_name",
              "parent_id",
              "order_number",
              "tree_path",
            ],
            sort: ["order_number", "code"],
          });
          const treePathMap = new Map();

          console.log("organizations: ", organizations);
          organizations.forEach((item: any) => {
            treePathMap.set(
              item?.tree_path?.split(".")[
                item?.tree_path?.split(".").length - 1
              ],
              item?.short_name
            );
          });

          console.log("treePathMap: ", treePathMap);
          const treeOrgFormat = treeFormat(organizations);
          const technicalTypes = await technicalTypeService.readByQuery({
            limit: -1,
            filter: {
              _and: [
                {
                  technical_id: {
                    org_manage_id: { tree_path: { _contains: tree_path } },
                  },
                },
                { technical_id: { org_manage_id: { is_enable: true } } },
                {
                  type_id: {
                    short_name: {
                      _eq: type === "ToBD" ? "to_bdktcd" : "TRAM_CQDT",
                    },
                  },
                },
              ],
            },
            fields: [
              "*",
              "technical_id.*",
              "technical_id.org_manage_id.*",
              "technical_id.ward_id.*",
              "technical_id.ward_id.district_id.*",
              "technical_id.ward_id.district_id.province_id.*",
              "major_id.*",
              "type_id.*",
              "personal_identifies.*",
            ],
          });
          const technicalTypesFormat = technicalTypes.map(
            (item: any, index: string) => ({
              ...item,
              ...item.technical_id,
              org_manage:
                item?.technical_id?.org_manage_id?.tree_path
                  ?.split(".")
                  .map((item: string) => treePathMap.get(item) ?? "")
                  .join("/") ?? "",
              full_address:
                (item?.technical_id?.address
                  ? `${item?.technical_id?.address}, `
                  : "") +
                (getFullAddressString(item?.technical_id?.ward_id) ?? ""),
              parentId: item.technical_id?.parent_id,
              key: item?.technical_id?.id,
              title: item?.technical_id?.name,
              value: item?.id,
              parent_id: item.technical_id?.parent_id,
              id: item.id,
              stt: index + 1,
            })
          );

          // const listTree = listToTreeInTable(
          //   [...technicalTypesFormat],
          //   treeOrgFormat,
          //   true
          // );
          // const data = await Promise.all(
          //   listTree.map(async (item: any, index: number) => {
          //     const technicalOrgIds = item?.children?.map(
          //       (child: any) => child?.technical_id?.id
          //     );

          //     // Fetch cbnvDetail for each item
          //     const cbnvDetail = await getTechnicalCBNVDetail(
          //       technicalOrgIds,
          //       cbnvService
          //     );
          //     return {
          //       org_name: `${toRoman(index + 1)}. ${item?.name}`,
          //       cbnvDetail: cbnvDetail,
          //     };
          //   })
          // );
          // console.log("listTree: ", listTree);
          const templateFile = await readFile(
            path.join(__dirname, "./tong-hop-toBDKT.docx")
          );
          const handler = new TemplateHandler();
          const nowInVietnam = dayjs().tz();
          const day = nowInVietnam.get("date"); // Outputs the day of the month as a number (e.g., 3)
          const month = nowInVietnam.get("month") + 1; // Outputs the month as a number (e.g., 6, January is 0)
          const year = nowInVietnam.get("year"); // Outputs the full year (e.g., 2024)
          const dataMapTemplate = {
            day: day,
            month: month,
            type: type === "ToBD" ? "TỔ BĐKT" : "TRẠM CQĐT",
            root_org: organization[0]?.short_name,
            year: year,
            data: technicalTypesFormat,
          };
          const doc = await handler.process(templateFile, dataMapTemplate);
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=bao-cao-tbvt.docx"
          );
          return res.send(doc);
        } catch (error: any) {
          console.log("Error: ", error);
          return res
            .status(500)
            .send((error as any).message || "Có lỗi xảy ra");
        }
      }
    );

    router.get(
      "/reportTBVTByOrg",
      async (_req: Request, res: Response, next: NextFunction) => {
        try {
          const { org_id } = _req?.query;
          const { ItemsService } = services;
          const orgService: ItemsServices<Organizations> = new ItemsService(
            "organizations",
            {
              schema: (_req as any).schema,
            }
          );
          const technicalOrgTbvtsService: ItemsServices<any> = new ItemsService(
            "technical_org_tbvt_categories",
            {
              schema: (_req as any).schema,
              knex: database,
            }
          );
          const tbvtCategoriesService: ItemsServices<any> = new ItemsService(
            "tbvt_categories",
            {
              schema: (_req as any).schema,
              knex: database,
            }
          );
          const organization = await orgService.readOne(org_id as string);
          const { tree_path, short_name } = organization;
          const filters = {
            technical_org_id: {
              org_manage_id: {
                tree_path: { _contains: tree_path },
              },
            },
          };
          const technicalOrgTbvts = await technicalOrgTbvtsService.readByQuery({
            limit: -1,
            filter: filters,
            fields: ["*", "technical_org_id.*", "tbvt_categories_id.*"],
          });
          const tbvtCategoriesMap: any = {};
          for (const item of technicalOrgTbvts) {
            const {
              tbvt_categories_id: { id, tree_path },
              quality,
              amount,
            } = item;
            // const tree_paths_filter = tree_path
            //   .split(".")
            //   .reduce((acc: any, curr: any) => {
            //     acc.push(acc.length ? `${acc[acc.length - 1]}.${curr}` : curr);
            //     return acc;
            //   }, []);
            const categoryRes = await tbvtCategoriesService.readByQuery({
              filter: {
                tree_path: tree_path,
              },
              fields: ["*", "parent_id.*"],
              sort: ["order_number", "code"],
            });
            for (const category of categoryRes) {
              if (!tbvtCategoriesMap[category.id]) {
                tbvtCategoriesMap[category.id] = {
                  ...category,
                  level_1: 0,
                  level_2: 0,
                  level_3: 0,
                  level_4: 0,
                  level_5: 0,
                  total: 0,
                  name: `${category?.code} - ${category?.name}`,
                };
              }
            }
            // Update quality levels
            const category = tbvtCategoriesMap[id];
            if (category) {
              const amountInt = parseInt(amount);
              if (Number(quality) === 1) category.level_1 += amountInt;
              if (Number(quality) === 2) category.level_2 += amountInt;
              if (Number(quality) === 3) category.level_3 += amountInt;
              if (Number(quality) === 4) category.level_4 += amountInt;
              if (Number(quality) === 5) category.level_5 += amountInt;
              category.total =
                category.level_1 +
                category.level_2 +
                category.level_3 +
                category.level_4 +
                category.level_5;
            }
          }
          const data: any = Object.values(tbvtCategoriesMap);

          const dataMap = Object.fromEntries(
            data.map((item: any) => [item.id, item])
          );
          for (const node of data) {
            if (!node.parent_id) {
              updateLevels(node, dataMap);
            }
          }
          const templateFile = await readFile(
            path.join(__dirname, "./bao-cao-tbvt.docx")
          );
          const handler = new TemplateHandler();
          const nowInVietnam = dayjs().tz();
          const day = nowInVietnam.get("date"); // Outputs the day of the month as a number (e.g., 3)
          const month = nowInVietnam.get("month") + 1; // Outputs the month as a number (e.g., 6, January is 0)
          const year = nowInVietnam.get("year"); // Outputs the full year (e.g., 2024)
          const dataMapTemplate = {
            day: day,
            month: month,
            root_org: short_name,
            year: year,
            data: data.map((item: any, index: number) => ({
              ...item,
              stt: index + 1,
            })),
          };
          const doc = await handler.process(templateFile, dataMapTemplate);
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=bao-cao-tbvt.docx"
          );
          return res.send(doc);
        } catch (error: any) {
          console.log("Error: ", error);
          return res
            .status(500)
            .send((error as any).message || "Có lỗi xảy ra");
        }
      }
    );

    router.get(
      "/xuat-bao-cao-vtkt",
      async (_req: Request, res: Response, next: NextFunction) => {
        try {
          const { type, parent_tree_path, current_tree_path } = _req?.query;
          const { UsersService, ItemsService } = services;

          let filterValue: any = {};
          let filterOrg: any = {};
          let dataList: any = [];


          const userServices: ItemsServices<DirectusUsers> = new UsersService({
            schema: (_req as any).schema,
            accountability: _req.accountability,
          });

          const user = await userServices.readOne(_req.accountability.user, {
            fields: ["*", "role.id", "role.name"],
          });

          const getBaseFilterValue = (type: any) => ({
            _and: [
              { type_id: { short_name: { _eq: type === 'ToBD' ? 'to_bdktcd' : 'TRAM_CQDT' } } }
            ],
          });

          if ((user.role as DirectusRoles).name === 'CSKT_K1') { //Neu tai khoan la CSKT_K1 thi se duoc view toan bo co quan, don vi cua toan quan
            filterValue = {
              _and: [
                { technical_id: { org_manage_id: { is_enable: true } } },
                ...getBaseFilterValue(type)._and,
              ],
            };
            filterOrg = { is_enable: true };
          } else if ((user.role as DirectusRoles).name === 'CSKT_DV') { //Neu tai khoan la CSKT_DV thi chi duoc view co quan, don vi cua don vi hien tai cua tk
            filterValue = {
              _and: [
                { technical_id: { org_manage_id: { tree_path: { _contains: parent_tree_path } } } },
                ...getBaseFilterValue(type)._and,
              ],
            };

            filterOrg = {
              _and: [
                { tree_path: { _contains: parent_tree_path || current_tree_path } },
                { is_enable: true },
              ],
            };
          } else { // Neu tk la ADMIN thi tuong tu nhu CSKT_K1
            filterValue = getBaseFilterValue(type);
          }

          //get organization tree
          const OrganizationsService: ItemsServices<Organizations> =
            new ItemsService("organizations", {
              schema: (_req as any).schema,
            });
          const organizations = await OrganizationsService.readByQuery({
            limit: -1,
            filter: filterOrg,
            alias: {
              parentId: "parent_id",
              value: "id",
              key: "id",
              title: "name",
            },
            fields: [
              "id",
              "key",
              "name",
              "value",
              "title",
              "parentId",
              "parent_id",
              "order_number",
              "tree_path",
            ],
            sort: ["order_number", "code"],
          });
          const organizationsTree = treeFormat(organizations);

          //get technicalTypes
          const TechnicalTypesService: ItemsServices<TechnicalTypes> =
            new ItemsService("technical_types", {
              schema: (_req as any).schema,
            });
          const technicalTypes = await TechnicalTypesService.readByQuery({
            limit: -1,
            filter: filterValue,
            fields: [
              "*",
              "technical_id.name",
              "technical_id.address",
              "technical_id.ward_id.*",
              "technical_id.ward_id.district_id.*",
              "technical_id.ward_id.district_id.province_id.*",
              "technical_id.tbvt_categories.*",
              "technical_id.org_manage_id.*",
              "technical_id.org_manage_id.ward_id.*",
              "technical_id.org_manage_id.ward_id.district_id.*",
              "technical_id.org_manage_id.ward_id.district_id.province_id.*",
              "type_id.*",
            ],
          });
          const technicalTypesFormat: any[] = technicalTypes.map((item: any, index: number) => ({
            ...item,
            ...item.technical_id,
            parentId: item.technical_id?.parent_id,
            key: item?.technical_id?.id,
            title: item?.technical_id?.name,
            value: item?.id,
            parent_id: item.technical_id?.parent_id,
            id: item.id,
          }));

          const filterTreeData = (data: any[]) => {
            const filterTreeRecursive = (node: any) => {
                if (!node) return null;
                if (Array.isArray(node.children)) {
                    node.children = node.children
                        .map(filterTreeRecursive)
                        .filter((child: any) => child !== null);
                }
                if (node.children && node.children.length === 0) {
                    delete node.children;
                }
                return node;
            };
            return data.map(filterTreeRecursive).filter(node => node !== null);
          };
          const mapTechnicalTypeToOrg = (list: any[]) => {
            const calculateDynamicValues = (node: any) => {
              if (node.children && node.children.length > 0) {
                  const totals: any = {};
                  node.children.forEach((child: any) => {
                      calculateDynamicValues(child);
      
                      for (const [key, value] of Object.entries(child)) {
                          if (typeof value === "number") {
                              totals[key] = (totals[key] || 0) + value;
                          }
                      }
                  });
                  Object.assign(node, totals);
              }
            }
            const mapDataToChildrenOrg = (node: any) => {
              const children = list.filter(
                (item: any) => node?.data?.id === item?.org_manage_id?.id
              );
          
              const childNodes = [
                ...(node.children ? node.children.map(mapDataToChildrenOrg).filter(Boolean) : []),
                ...children,
              ];
          
              if (childNodes.length > 0) {
                return {
                  ...node.data,
                  name: node.data.name,
                  children: childNodes,
                };
              }
          
              return null; 
            };
            const flattenChildren = (node: any) =>  {
              if (!node.children || node.children.length === 0) {
                  return [node];
              }
              return node.children.flatMap(flattenChildren);
            }
          
            const treeWithChildren = organizationsTree
              .map(mapDataToChildrenOrg)
              .filter(Boolean);

            const processedTree = filterTreeData(treeWithChildren)?.map((node: any) => {
                calculateDynamicValues(node);
                return node;
            });


          
            return processedTree.map((level1: any, indexLevel1: number) => {
              const indexLevel1Str = (indexLevel1 + 1).toString();
      
              if (!level1.children) {
                  return {...level1, index: indexLevel1Str, bold: true, dvt: '', note: '', transport: ''};
              }
      
              level1.children = level1.children.map((level2: any, indexLevel2: number) => {
                  const indexLevel2Str = `${indexLevel2 + 1}`;
      
                  if (!level2.children) {
                      return {...level2, index: indexLevel2Str, bold: true,  dvt: '', note: '', transport: ''};
                  }
      
                  const leafNodes = flattenChildren(level2);
                  return {
                      ...level2,
                      children: leafNodes,
                      index: indexLevel2Str,
                      bold: true,
                      dvt: '', note: '', transport: ''
                  };
              });
              return {
                  ...level1,
                  index: indexLevel1Str,
                  bold: true,
                  dvt: '', note: '', transport: ''
              };
            });
          };          
          // get equipment_cssc_categories
          let data: any = [];
          let totalSumTBVT: any = {};
          const equipmentCsscCategoriesService: ItemsServices<any> = new ItemsService(
            "equipment_cssc_categories",
            {
              schema: (_req as any).schema,
            }
          );
          for (const technicalType of technicalTypesFormat) {
            const tbvtCategoriesMap: Record<string, { total: number }> = {};
            const tbvt_categories = technicalType.tbvt_categories || [];
            for (const item of tbvt_categories) {
              const tbvt_id = item.tbvt_categories_id;
      
              if (!tbvtCategoriesMap[tbvt_id]) {
                tbvtCategoriesMap[tbvt_id] = { total: 0 };
              }
      
              const amount = parseInt(item.amount, 10);
              if (!isNaN(amount)) {
                tbvtCategoriesMap[tbvt_id].total += amount;
              }
            }
            const keys: any = Object.keys(tbvtCategoriesMap);
            const equipmentCsscCategories =
              await equipmentCsscCategoriesService.readByQuery({
                limit: -1,
                filter: {
                  tbvt_id: { _in: keys },
                },
                fields: ["*", "group_id.*", "group_id.parent_id.*"],
              });
            const groupedByGroupId: any = equipmentCsscCategories.reduce(
              (
                acc: Record<string, { amount: number; short_name: string }>,
                item: any
              ) => {
                const group_id = item.group_id.id;
                const parent_group_id = item.group_id.parent_id.id;
                const parent_group_short_name = item.group_id.parent_id.short_name;
                const short_name = item.group_id.short_name;
      
                if (!acc[parent_group_id]) {
                  acc[parent_group_id] = {
                    amount: 0,
                    short_name: parent_group_short_name,
                  };
                }
                if (!acc[group_id]) {
                  acc[group_id] = { amount: 0, short_name: short_name };
                }
                acc[group_id].amount += tbvtCategoriesMap[item.tbvt_id]?.total || 0;
                acc[parent_group_id].amount +=
                  tbvtCategoriesMap[item.tbvt_id]?.total || 0;
      
                return acc;
              },
              { other: { amount: 0, short_name: "other" } }
            );
            for (const id of Object.keys(tbvtCategoriesMap)) {
              const isInCategories = equipmentCsscCategories.some(
                (item: any) => item.tbvt_id === id
              );
              
      
              if (!isInCategories) {
                // groupedByGroupId?.other?.amount += tbvtCategoriesMap[id]?.total || 0;
                groupedByGroupId.other = groupedByGroupId.other || { amount: 0 };
                groupedByGroupId.other.amount += tbvtCategoriesMap[id]?.total || 0;
              }
            }
            const groupedByGroupIdFormat = Object.fromEntries(
              Object.entries(groupedByGroupId).map(([key, value]: any) => [
                value?.short_name,
                value?.amount,
              ])
            );
            data.push({
              id: technicalType?.id,
              name: technicalType?.name,
              org_manage_id: technicalType?.org_manage_id,
              ward_id: technicalType?.ward_id,
              address: technicalType?.address,
              transport: technicalType?.transport,
              dvt: technicalType?.dvt,
              note: technicalType?.note,
              level: technicalType?.level,
              totalToBDKT: 1,
              ...groupedByGroupIdFormat,
            });
            if(!totalSumTBVT[technicalType?.org_manage_id?.id]) {
              totalSumTBVT[technicalType?.org_manage_id?.id] = { ...groupedByGroupIdFormat };
            } else {
              Object.entries(groupedByGroupIdFormat).forEach(([key, value]: [string, number]) => {
                if (totalSumTBVT[technicalType?.org_manage_id?.id][key]) {
                  totalSumTBVT[technicalType?.org_manage_id?.id][key] += value;
                } else {
                  totalSumTBVT[technicalType?.org_manage_id?.id][key] = value;
                }
              });
            }
          }
          const updatedData = data.map((item: any) => {
            if (item?.id) {
              return {
                ...item,
                ...(totalSumTBVT[item.id] || {}),
              };
            }
            return item;
          });

          const dataTechnicalTypesMapOrg = mapTechnicalTypeToOrg([...updatedData]);

          ///flatten to array
          const traverseData = (node: any) => {
            node.forEach((item: any) => {
              const { children, org_manage_id, ...rest } = item;
              dataList.push(rest);
              if (item.children && item.children.length > 0) {
                  traverseData(item.children); 
              }
            });
          }
          traverseData(dataTechnicalTypesMapOrg)

        

          const groupEquipmentService: ItemsServices<GroupEquipment> =
            new ItemsService("group_equipment", {
              schema: (_req as any).schema,
            });
          const groupEquipment = await groupEquipmentService.readByQuery({
            limit: -1,
            sort: ["order_number"],
            fields: [
              "*"
            ],
          });
          let groupTree = treeFormat(groupEquipment);
          groupTree?.push({
            children: [],
            data: {
                name: "Khác",
                desc: null,
                order_number: groupTree?.length + 1,
                short_name: "other"
            }
          })
          groupTree?.push({
            children: [],
            data: {
                name: "Phương tiện cơ động",
                desc: null,
                order_number: groupTree?.length + 2,
                short_name: "transport"
            }
          });
          groupTree?.push({
            children: [],
            data: {
                name: "Ghi chú",
                desc: null,
                order_number: groupTree?.length + 3,
                short_name: "note"
            }
          })

          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(
            path.join(__dirname, "./template_CSKT.xlsx")
          );

          //sheet 2
          const worksheet = workbook.getWorksheet("Chi tiết VTKT tổ BĐKTcđ");
          if (!worksheet) {
            throw new Error("Worksheet not found in template file.");
          }
          let columns = ['index', 'name', 'address', 'dvt', 'totalToBDKT'];
          let rowStart = 5;
          let colStart = 'F';
          let indexStart = 1;
          const borderStyle = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          for (const group of groupTree) {
            let mergeRange;
            if (group.children?.length === 0) {
                mergeRange = `${colStart}${rowStart}:${colStart}${rowStart + 1}`;
            } else {
                let colEnd = getNextColumn(colStart, group.children.length);
                mergeRange = `${colStart}${rowStart}:${colEnd}${rowStart}`;
            }

            worksheet.mergeCells(mergeRange);
            const mergedCell = worksheet.getCell(`${colStart}${rowStart}`);
            mergedCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
            mergedCell.value = group?.data?.name;
            mergedCell.font = { name: "Times New Roman", size: 12, bold: true };
            mergedCell.border = borderStyle;

            if (group.children?.length > 0) {
              const child_name = group?.children?.map((item: any) => item?.data?.short_name).join('_');
              group.children = [{
                children: [],
                data: {
                    name: `SL`,
                    desc: null,
                    order_number: 0,
                    short_name: `SL_${child_name}`,
                }
              },...group?.children];
              let colChildStart = colStart;
              for (const child of group?.children) {
                const cell = worksheet.getCell(`${colChildStart}${rowStart + 1}`);
                cell.value = child?.data?.name;
                cell.alignment = { vertical: "middle", horizontal: "center", textRotation: 90 };
                cell.font = { name: "Times New Roman", size: 12, bold: true };
                cell.border = borderStyle;
                colChildStart = getNextColumn(colChildStart, 1);
                columns.push(child?.data?.short_name);
              }
              colStart = getNextColumn(colStart, group.children.length);
            } else {
              colStart = getNextColumn(colStart, 1);
              columns.push(group?.data?.short_name);
            }
          }

          rowStart = 7;
          
          for (const item of dataList) {
            const row = worksheet.getRow(rowStart);
            let values = [];
            for (const col of columns) {
              if (col.split("_")[0] === 'SL') {
                const child_short_name = col.split("_").slice(1);
                const total = child_short_name.reduce((sum, short_name) => sum + (item[short_name] || 0), 0);
                values.push(total);
              } else {
                if (['index', 'name', 'address', 'dvt', 'totalToBDKT', 'transport', 'note'].includes(col)) {
                  if (col === 'address') {
                    const address = item[col] || '';
                    const fullAddress = getFullAddressString(item['ward_id']);
                    item[col] = `${address}${address ? ', ' : ''}${fullAddress}`;
                  } else if(col === 'index') {
                    if(!item[col]) {
                      item[col] = indexStart;
                      indexStart++
                    }
                  }
                  values.push(item[col]);
                } else {
                  values.push(item[col] || '');
                }
              }            
            }
            row.values = values;
            const exceptionAlign = [0, 1, 2, 3, 4, columns?.length-1, columns?.length]
            row.eachCell((cell: any, index: number) => {
              cell.border = borderStyle;
              cell.alignment = { wrapText: true, vertical: 'middle', horizontal: exceptionAlign.includes(index) ? 'left' : 'right' };
              if(item['bold']) cell.font = { name: "Times New Roman", size: 12, bold: true };
            });
            rowStart++;
          }
          const cells = ['A5', 'B5', 'C5', 'D5', 'E5'];
          cells.forEach(cell => {
            worksheet.getCell(cell).border = borderStyle;
          });
          //set width of columns
          for(let i = 0; i < columns.length; i++) {
            if(i > 6) {
              worksheet.getColumn(i).width = 10;
            }
          }
          //calculate for header
          const nowInVietnam = dayjs().tz();
          const day = nowInVietnam.get("date"); // Outputs the day of the month as a number (e.g., 3)
          const month = nowInVietnam.get("month") + 1; // Outputs the month as a number (e.g., 6, January is 0)
          const year = nowInVietnam.get("year"); // Outputs the full year (e.g., 2024)
          const nextMergeCol = getNextColumn('A', columns?.length - 1);
          const mergeRangeRow1 = `A1:${nextMergeCol}1`;
          worksheet.mergeCells(mergeRangeRow1);
          const mergedCellR1 = worksheet.getCell(`A1`);
          mergedCellR1.alignment = { vertical: "middle", horizontal: "center" };
          mergedCellR1.value = 'Phụ lục I';
          mergedCellR1.font = { name: "Times New Roman", size: 14, bold: true };

          const mergeRangeRow2 = `A2:${nextMergeCol}2`;
          worksheet.mergeCells(mergeRangeRow2);
          const mergedCellR2 = worksheet.getCell(`A2`);
          mergedCellR2.alignment = { vertical: "middle", horizontal: "center" };
          mergedCellR2.value = 'LỰC LƯỢNG BĐKT CƠ ĐỘNG';
          mergedCellR2.font = { name: "Times New Roman", size: 14, bold: true };

          const mergeRangeRow3 = `A3:${nextMergeCol}3`;
          worksheet.mergeCells(mergeRangeRow3);
          const mergedCellR3 = worksheet.getCell(`A3`);
          mergedCellR3.alignment = { vertical: "middle", horizontal: "center" };
          mergedCellR3.value = `(Kèm theo Báo cáo số:     /BC-…. ngày ${day}/${month}/${year} của ……..)`;
          mergedCellR3.font = { name: "Times New Roman", size: 14, bold: false, italic: true };
          const bufferData = await workbook.xlsx.writeBuffer();


          // Set headers for file download
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=template-out.xlsx"
          );
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );


          // Send the buffer as the response
          return res.send(bufferData);
        } catch (error: any) {
          console.log("Error: ", error);
          return res
            .status(500)
            .send((error as any).message || "Có lỗi xảy ra");
        }
      }
    );

    router.get(
      "/getAmountTbvtByGroupEquipment",
      async (_req: Request, res: Response, next: NextFunction) => {
        try {
          const { tree_path, type } = _req?.query;
          const { ItemsService } = services;
          const data = await gatherAmountTbvt(
            tree_path as string,
            type as string,
            ItemsService,
            _req
          );
          return res.send(data);
        } catch (error: any) {
          console.log("Error: ", error);
          return res
            .status(500)
            .send((error as any).message || "Có lỗi xảy ra");
        }
      }
    );
  }
);
