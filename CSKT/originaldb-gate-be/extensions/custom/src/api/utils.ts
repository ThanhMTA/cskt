/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SchemaOverview } from "@directus/types";
import { oas, oasConfig } from "./types";
import path from "path";
import fs from "fs";
import { findWorkspaces } from "find-workspaces";
import yaml from "js-yaml";
import dayjs from "./dayjs";
import { ItemsService as ItemsServices } from "@directus/api/dist/services/items";
import { TechnicalTypes } from "../types";
// import { readFile } from "fs/promises";

const directusDir = () => process.cwd();

let oasBuffer: string;

function getConfigRoot(): oasConfig {
  const defConfig: oasConfig = {
    docsPath: "api",
    info: {},
    tags: [],
    publishedTags: [],
    paths: {},
    components: {},
  };
  try {
    const configFile = path.join(
      directusDir(),
      "./extensions/custom/dist/oasconfig.yaml"
    );
    // console.log("configFile: ", configFile);
    const config: any = yaml.load(
      fs.readFileSync(configFile, { encoding: "utf-8" })
    );
    // console.log("config: ", config);
    config.docsPath = config.docsPath || defConfig.docsPath;
    config.info = config.info || defConfig.info;
    config.tags = config.tags || defConfig.tags;
    config.paths = config.paths || defConfig.paths;
    config.components = config.components || defConfig.components;
    return config;
  } catch {
    return defConfig;
  }
}

export function filterPaths(config: oasConfig, oas: oas) {
  for (const path in oas.paths) {
    for (const method in oas.paths[path]) {
      let published = false;

      // @ts-ignore
      const tags = oas.paths[path][method].tags || [];

      tags.forEach((tag) => {
        published = published || config.publishedTags.includes(tag);
      });

      // @ts-ignore
      oas.paths[path][method].tags = tags.filter((tag) =>
        config.publishedTags.includes(tag)
      );

      // @ts-ignore
      if (!published) delete oas.paths[path][method];
    }
  }
  oas.tags = oas.tags.filter((tag) => config.publishedTags.includes(tag.name));
}

export function getConfig(): oasConfig {
  const config = getConfigRoot();
  try {
    const endpointsPath = path.join(directusDir(), "./extensions/custom/dist");
    // console.log("endpointsPath: ", endpointsPath);
    const files = fs.readdirSync(endpointsPath, { withFileTypes: true });
    // console.log("files: ", files);
    for (const file of files) {
      const oasPath = `${endpointsPath}/${file.name}/oas.yaml`;
      if (file.isDirectory() && fs.existsSync(oasPath)) {
        const oas: any = yaml.load(
          fs.readFileSync(oasPath, { encoding: "utf-8" })
        );
        config.tags = [...config.tags, ...(oas.tags || [])];
        config.paths = { ...config.paths, ...(oas.paths || {}) };
        config.components = merge(
          config.components || {},
          oas.components || {}
        );
      }
    }
    return config;
  } catch (e) {
    return config;
  }
}

export async function getOas(
  services: any,
  schema: SchemaOverview
): Promise<oas> {
  if (oasBuffer) return JSON.parse(oasBuffer);

  const { SpecificationService } = services;
  const service = new SpecificationService({
    accountability: { admin: true }, // null or accountability.admin = true needed
    schema,
  });

  oasBuffer = JSON.stringify(await service.oas.generate());

  return JSON.parse(oasBuffer);
}

export function getPackage() {
  try {
    const workspaceDir = findWorkspaces(".");
    console.log("workspaceDir: ", workspaceDir);
    return require(`${workspaceDir || directusDir()}/package.json`);
  } catch (e) {
    return {};
  }
}

export function merge(a: any, b: any) {
  return Object.entries(b).reduce((o, [k, v]) => {
    o[k] =
      v && typeof v === "object"
        ? merge((o[k] = o[k] || (Array.isArray(v) ? [] : {})), v)
        : v;
    return o;
  }, a);
}

export function treeFormat(
  list: any[],
  idKey = "id",
  parentIdKey = "parent_id"
) {
  const map: any = {};
  const tree: any[] = [];
  list.forEach((node) => {
    map[node?.[idKey]] = { children: [], data: { ...node } };
  });
  list.forEach((node) => {
    if (node?.[parentIdKey] !== null && map[node?.[parentIdKey]]) {
      map[node?.[parentIdKey]].children.push(map[node?.[idKey]]);
    } else {
      tree.push(map[node?.[idKey]]);
    }
  });

  return tree;
}

export function updateLevels(node: any, dataMap: any) {
  let levelSum = {
    level_1: node.level_1,
    level_2: node.level_2,
    level_3: node.level_3,
    level_4: node.level_4,
    level_5: node.level_5,
  };

  for (const child of Object.values(dataMap)) {
    if (child.parent_id === node.id) {
      const childLevels = updateLevels(child, dataMap);

      levelSum.level_1 += childLevels.level_1;
      levelSum.level_2 += childLevels.level_2;
      levelSum.level_3 += childLevels.level_3;
      levelSum.level_4 += childLevels.level_4;
      levelSum.level_5 += childLevels.level_5;
    }
  }

  node.level_1 = levelSum.level_1;
  node.level_2 = levelSum.level_2;
  node.level_3 = levelSum.level_3;
  node.level_4 = levelSum.level_4;
  node.level_5 = levelSum.level_5;

  return levelSum;
}
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
  return data.map(filterTreeRecursive).filter((node) => node !== null);
};
const findDeepestParentsWithChildren = (node: any): any[] => {
  if (node.tree_path === undefined) {
    return [];
  }

  let deepestParents: any[] = [];

  node.children.forEach((child: any) => {
    const deepest = findDeepestParentsWithChildren(child);
    if (deepest.length > 0) {
      deepestParents = deepestParents.concat(deepest);
    }
  });
  return deepestParents.length > 0 ? deepestParents : [node];
};
export function listToTreeInTable(
  list: any[],
  organizationTree: any,
  deepestParent?: boolean
) {
  const mapDataToChildrenOrg = (node: any) => {
    const childrens = list.filter(
      (item: any) => node?.data?.id === item?.org_manage_id?.id
    );
    const spreads = [
      ...(node.children
        ? node.children.map(mapDataToChildrenOrg).filter(Boolean)
        : []),
      ...childrens,
    ];

    if (spreads.length > 0) {
      return {
        ...node.data,
        name: `${node.data.name}`,
        children: spreads,
      };
    }
    return undefined;
  };

  const treeWithChildren = organizationTree
    .map(mapDataToChildrenOrg)
    .filter(Boolean);

  const filteredTree = filterTreeData(treeWithChildren);
  if (!deepestParent) {
    const deepest_parents = filteredTree.flatMap((item) => {
      return findDeepestParentsWithChildren(item);
    });
    return deepest_parents;
  } else {
    return filteredTree;
  }
}

export function toRoman(num: number) {
  const romanNumerals = [
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];

  let result = "";
  for (const { value, numeral } of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

export async function getTechnicalCBNVDetail(
  technicalOrgIds?: string[],
  cbnvService?: any
) {
  const res: any = await cbnvService.readByQuery({
    limit: -1,
    filter: {
      technical_org_id: {
        id: {
          _in: technicalOrgIds,
        },
      },
    },
    fields: [
      "*",
      "technical_org_id.*",
      "personal_identifies_id.*",
      "personal_identifies_id.rank_id.*",
      "personal_identifies_id.position_id.*",
      "personal_identifies_id.org_id.*",
      "personal_identifies_id.degree_id.*",
      "personal_identifies_id.type_id.*",
    ],
  });
  const cbnvcmMapTechnical: any = {};
  const indexCounters: any = {};
  const romanIndexCounter = { current: 1 };

  for (const item of res) {
    const { technical_org_id, personal_identifies_id } = item;

    if (!indexCounters[technical_org_id?.id]) {
      indexCounters[technical_org_id?.id] = 1;
    }

    if (!cbnvcmMapTechnical[technical_org_id?.id]) {
      cbnvcmMapTechnical[technical_org_id?.id] = [
        {
          stt: `${toRoman(romanIndexCounter.current)}.`,
          name: technical_org_id?.name,
        },
        {
          ...personal_identifies_id,
          stt: indexCounters[technical_org_id?.id]++,
          rank_id: personal_identifies_id?.rank_id?.name,
          org_id: personal_identifies_id?.org_id?.name,
          degree_id: personal_identifies_id?.degree_id?.name,
          date_of_join_army: personal_identifies_id?.date_of_join_army
            ? dayjs(personal_identifies_id?.date_of_join_army).format(
                "DD/MM/YYYY"
              )
            : "",
        },
      ];
      romanIndexCounter.current++;
    } else {
      cbnvcmMapTechnical[technical_org_id?.id].push({
        ...personal_identifies_id,
        stt: indexCounters[technical_org_id?.id]++,
        rank_id: personal_identifies_id?.rank_id?.name,
        org_id: personal_identifies_id?.org_id?.name,
        degree_id: personal_identifies_id?.degree_id?.name,
        date_of_join_army: personal_identifies_id?.date_of_join_army
          ? dayjs(personal_identifies_id?.date_of_join_army).format(
              "DD/MM/YYYY"
            )
          : "",
      });
    }
  }
  return Object.values(cbnvcmMapTechnical).flat();
}

export function getFullAddressString(ward: any) {
  if (ward && ward?.district_id && ward?.district_id?.province_id) {
    return `${ward?.name}, ${ward?.district_id?.name}, ${ward?.district_id?.province_id?.name}`;
  } else {
    return "";
  }
}

export function getNextColumn(currentCol: any, offset: any) {
  let currentIndex = currentCol.charCodeAt(0) - 65; // 'A' starts at 65
  let newIndex = currentIndex + offset;
  return String.fromCharCode(65 + newIndex);
}

export async function gatherAmountTbvt(
  tree_path: string,
  type: string,
  ItemsService: any,
  _req: Request
) {
  try {
    const technicalTypeService: ItemsServices<TechnicalTypes> =
      new ItemsService("technical_types", {
        schema: (_req as any).schema,
      });
    const equipmentCsscCategoriesService: ItemsServices<any> = new ItemsService(
      "equipment_cssc_categories",
      {
        schema: (_req as any).schema,
      }
    );
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
        "technical_id.name",
        "technical_id.address",
        "technical_id.ward_id.*",
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
    let data: any = [];
    let totalSumTBVT: any = {};
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
    return updatedData;
  } catch (error: any) {
    return [];
  }
}



