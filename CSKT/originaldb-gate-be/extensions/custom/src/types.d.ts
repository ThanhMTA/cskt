export type Actors = {
  code?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  desc?: string | null;
  id: string;
  is_enable?: boolean | null;
  llkt_ids?: unknown | null;
  name?: string | null;
  order_number?: number | null;
  roles: any[] | ActorsDirectusRoles[];
  short_name?: string | null;
  tables: any[] | ActorsTables[];
  vtkt_ids?: unknown | null;
};
export type GroupEquipment = {
  date_created?: string | null;
  desc?: string | null;
  id: string;
  name?: string | null;
  order_number?: number | null;
  parent_id?: string | GroupEquipment | null;
  short_name?: string | null;
  user_created?: string | DirectusUsers | null;
};

export type ActorsDirectusRoles = {
  actors_id?: string | Actors | null;
  directus_roles_id?: string | DirectusRoles | null;
  id: number;
  is_enable?: boolean | null;
};

export type ActorsTables = {
  actors_id?: string | Actors | null;
  id: number;
  tables_id?: string | Tables | null;
};

export type AdministrativeUnitCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type AvailableRoles = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_default?: boolean | null;
  is_enable?: boolean | null;
  role_id?: string | DirectusRoles | null;
  user_id?: string | DirectusUsers | null;
};

export type BusinessDomain = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  note?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type BusinessGroup = {
  business_id?: string | BusinessDomain | null;
  date_created?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  note?: string | null;
  order_number?: number | null;
  short_name?: string | null;
  user_created?: string | DirectusUsers | null;
};

export type CableBoxes = {
  address?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  description?: string | null;
  fiber_line_id?: string | OpticalFiberLines | null;
  fiber_line_id_old?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  ward_id?: string | WardCategories | null;
};

export type ConditionCategories = {
  code?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  sub_system?: string | null;
  type_for?: string | null;
};

export type CountryCategories = {
  bar_code?: string | null;
  code?: string | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type CustomPermissions = {
  date_created?: string | null;
  date_updated?: string | null;
  desc?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  roles: any[] | CustomPermissionsDirectusRoles[];
  status?: number | null;
};

export type CustomPermissionsDirectusRoles = {
  custom_permissions_id?: string | CustomPermissions | null;
  directus_roles_id?: string | DirectusRoles | null;
  id: number;
  is_enable?: boolean | null;
};

export type DefenseLands = {
  address?: string | null;
  altitude?: number | null;
  area?: number | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  latitude?: string | null;
  longitude?: string | null;
  name?: string | null;
  order_number?: number | null;
  org_manage_code_old?: string | null;
  org_manage_id?: string | Organizations | null;
  phone_number?: string | null;
  symbol?: string | null;
  ward_id?: string | WardCategories | null;
};

export type DegreeCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable: boolean;
  name?: string | null;
  short_name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type DirectusActivity = {
  action: string;
  collection: string;
  comment?: string | null;
  id: number;
  ip?: string | null;
  item: string;
  origin?: string | null;
  revisions: any[] | DirectusRevisions[];
  role_name?: string | null;
  timestamp: string;
  user?: string | DirectusUsers | null;
  user_agent?: string | null;
};

export type DirectusCollections = {
  accountability?: string | null;
  archive_app_filter: boolean;
  archive_field?: string | null;
  archive_value?: string | null;
  collapse: string;
  collection: string;
  color?: string | null;
  display_template?: string | null;
  group?: string | DirectusCollections | null;
  hidden: boolean;
  icon?: string | null;
  item_duplication_fields?: unknown | null;
  note?: string | null;
  preview_url?: string | null;
  singleton: boolean;
  sort?: number | null;
  sort_field?: string | null;
  translations?: unknown | null;
  unarchive_value?: string | null;
  versioning: boolean;
};

export type DirectusDashboards = {
  color?: string | null;
  date_created?: string | null;
  icon: string;
  id: string;
  name: string;
  note?: string | null;
  panels: any[] | DirectusPanels[];
  user_created?: string | DirectusUsers | null;
};

export type DirectusExtensions = {
  bundle?: string | null;
  enabled: boolean;
  folder: string;
  id: string;
  source: string;
};

export type DirectusFields = {
  collection: string | DirectusCollections;
  conditions?: unknown | null;
  display?: string | null;
  display_options?: unknown | null;
  field: string;
  group?: string | DirectusFields | null;
  hidden: boolean;
  id: number;
  interface?: string | null;
  note?: string | null;
  options?: unknown | null;
  readonly: boolean;
  required?: boolean | null;
  sort?: number | null;
  special?: unknown | null;
  translations?: unknown | null;
  validation?: unknown | null;
  validation_message?: string | null;
  width?: string | null;
};

export type DirectusFiles = {
  charset?: string | null;
  description?: string | null;
  duration?: number | null;
  embed?: string | null;
  filename_disk?: string | null;
  filename_download: string;
  filesize?: number | null;
  focal_point_x?: number | null;
  focal_point_y?: number | null;
  folder?: string | DirectusFolders | null;
  height?: number | null;
  id: string;
  location?: string | null;
  metadata?: unknown | null;
  modified_by?: string | DirectusUsers | null;
  modified_on: string;
  storage: string;
  tags?: unknown | null;
  title?: string | null;
  type?: string | null;
  uploaded_by?: string | DirectusUsers | null;
  uploaded_on: string;
  width?: number | null;
};

export type DirectusFlows = {
  accountability?: string | null;
  color?: string | null;
  date_created?: string | null;
  description?: string | null;
  icon?: string | null;
  id: string;
  name: string;
  operation?: string | DirectusOperations | null;
  operations: any[] | DirectusOperations[];
  options?: unknown | null;
  status: string;
  trigger?: string | null;
  user_created?: string | DirectusUsers | null;
};

export type DirectusFolders = {
  id: string;
  name: string;
  parent?: string | DirectusFolders | null;
};

export type DirectusMigrations = {
  name: string;
  timestamp?: string | null;
  version: string;
};

export type DirectusNotifications = {
  collection?: string | null;
  id: number;
  item?: string | null;
  message?: string | null;
  recipient: string | DirectusUsers;
  sender?: string | DirectusUsers | null;
  status?: string | null;
  subject: string;
  timestamp?: string | null;
};

export type DirectusOperations = {
  date_created?: string | null;
  flow: string | DirectusFlows;
  id: string;
  key: string;
  name?: string | null;
  options?: unknown | null;
  position_x: number;
  position_y: number;
  reject?: string | DirectusOperations | null;
  resolve?: string | DirectusOperations | null;
  type: string;
  user_created?: string | DirectusUsers | null;
};

export type DirectusPanels = {
  color?: string | null;
  dashboard: string | DirectusDashboards;
  date_created?: string | null;
  height: number;
  icon?: string | null;
  id: string;
  name?: string | null;
  note?: string | null;
  options?: unknown | null;
  position_x: number;
  position_y: number;
  show_header: boolean;
  type: string;
  user_created?: string | DirectusUsers | null;
  width: number;
};

export type DirectusPermissions = {
  action: string;
  collection: string;
  fields?: unknown | null;
  id: number;
  permissions?: unknown | null;
  presets?: unknown | null;
  role?: string | DirectusRoles | null;
  validation?: unknown | null;
};

export type DirectusPresets = {
  bookmark?: string | null;
  collection?: string | null;
  color?: string | null;
  filter?: unknown | null;
  icon?: string | null;
  id: number;
  layout?: string | null;
  layout_options?: unknown | null;
  layout_query?: unknown | null;
  refresh_interval?: number | null;
  role?: string | DirectusRoles | null;
  search?: string | null;
  user?: string | DirectusUsers | null;
};

export type DirectusRelations = {
  id: number;
  junction_field?: string | null;
  many_collection: string;
  many_field: string;
  one_allowed_collections?: unknown | null;
  one_collection?: string | null;
  one_collection_field?: string | null;
  one_deselect_action: string;
  one_field?: string | null;
  sort_field?: string | null;
};

export type DirectusRevisions = {
  activity: number | DirectusActivity;
  collection: string;
  data?: unknown | null;
  delta?: unknown | null;
  id: number;
  item: string;
  parent?: number | DirectusRevisions | null;
  version?: string | DirectusVersions | null;
};

export type DirectusRoles = {
  admin_access: boolean;
  app_access: boolean;
  description?: string | null;
  enforce_tfa: boolean;
  icon: string;
  id: string;
  ip_access?: unknown | null;
  is_enable?: boolean | null;
  name: string;
  order_number?: number | null;
  short_name?: string | null;
  users: any[] | DirectusUsers[];
};

export type DirectusSessions = {
  expires: string;
  ip?: string | null;
  origin?: string | null;
  share?: string | DirectusShares | null;
  token: string;
  user?: string | DirectusUsers | null;
  user_agent?: string | null;
};

export type DirectusSettings = {
  auth_login_attempts?: number | null;
  auth_password_policy?: string | null;
  basemaps?: unknown | null;
  custom_aspect_ratios?: unknown | null;
  custom_css?: string | null;
  default_appearance: string;
  default_language: string;
  default_theme_dark?: string | null;
  default_theme_light?: string | null;
  id: number;
  mapbox_key?: string | null;
  module_bar?: unknown | null;
  project_color: string;
  project_descriptor?: string | null;
  project_logo?: string | DirectusFiles | null;
  project_name: string;
  project_url?: string | null;
  public_background?: string | DirectusFiles | null;
  public_favicon?: string | DirectusFiles | null;
  public_foreground?: string | DirectusFiles | null;
  public_note?: string | null;
  report_bug_url?: string | null;
  report_error_url?: string | null;
  report_feature_url?: string | null;
  storage_asset_presets?: unknown | null;
  storage_asset_transform?: string | null;
  storage_default_folder?: string | DirectusFolders | null;
  theme_dark_overrides?: unknown | null;
  theme_light_overrides?: unknown | null;
  theming_group: string;
};

export type DirectusShares = {
  collection: string | DirectusCollections;
  date_created?: string | null;
  date_end?: string | null;
  date_start?: string | null;
  id: string;
  item: string;
  max_uses?: number | null;
  name?: string | null;
  password?: string | null;
  role?: string | DirectusRoles | null;
  times_used?: number | null;
  user_created?: string | DirectusUsers | null;
};

export type DirectusTranslations = {
  id: string;
  key: string;
  language: string;
  value: string;
};

export type DirectusUsers = {
  appearance?: string | null;
  auth_data?: unknown | null;
  avatar?: string | DirectusFiles | null;
  description?: string | null;
  email?: string | null;
  email_notifications?: boolean | null;
  external_identifier?: string | null;
  first_name?: string | null;
  id: string;
  is_enable?: boolean | null;
  language?: string | null;
  last_access?: string | null;
  last_name?: string | null;
  last_page?: string | null;
  location?: string | null;
  order_number?: number | null;
  password?: string | null;
  personal_id?: string | PersonalIdentifies | null;
  provider: string;
  role?: string | DirectusRoles | null;
  status: string;
  tags?: unknown | null;
  tfa_secret?: string | null;
  theme_dark?: string | null;
  theme_dark_overrides?: unknown | null;
  theme_light?: string | null;
  theme_light_overrides?: unknown | null;
  title?: string | null;
  token?: string | null;
  type?: string | null;
};

export type DirectusVersions = {
  collection: string | DirectusCollections;
  date_created?: string | null;
  date_updated?: string | null;
  hash?: string | null;
  id: string;
  item: string;
  key: string;
  name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type DirectusWebhooks = {
  actions: unknown;
  collections: unknown;
  data: boolean;
  headers?: unknown | null;
  id: number;
  method: string;
  migrated_flow?: string | null;
  name: string;
  status: string;
  url: string;
  was_active_before_deprecation: boolean;
};

export type DistrictCategories = {
  admin_unit_id?: string | AdministrativeUnitCategories | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  province_id?: string | ProvinceCategories | null;
  short_name?: string | null;
  zone_id?: string | ZoneCategories | null;
};

export type DocumentTypeCategories = {
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  name?: string | null;
  short_name?: string | null;
};

export type DrainTankTypes = {
  date_created?: string | null;
  date_updated?: string | null;
  desc?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
};

export type DrainTanks = {
  address?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  fiber_line_id?: string | OpticalFiberLines | null;
  fiber_line_id_old?: string | null;
  final_point?: string | null;
  first_point?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  note?: string | null;
  org_manage_code_old?: string | null;
  org_manage_id?: string | Organizations | null;
  type_id?: string | DrainTankTypes | null;
  ward_id?: string | WardCategories | null;
};

export type EngineRoomCategories = {
  ability_cpu?: number | null;
  address?: string | null;
  area?: number | null;
  bandwidth?: number | null;
  comment?: string | null;
  contact_method?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  has_fighting_protect?: boolean | null;
  has_lighting_protect?: boolean | null;
  has_power_source?: boolean | null;
  id: string;
  is_enable?: boolean | null;
  latitude?: string | null;
  level_service?: number | null;
  longitude?: string | null;
  n_percent_density?: number | null;
  n_phy_server?: number | null;
  n_rack?: number | null;
  n_storage?: number | null;
  n_vir_server?: number | null;
  name?: string | null;
  note?: string | null;
  order_number?: number | null;
  org_id?: string | Organizations | null;
  org_support_id?: string | Organizations | null;
  org_technical_id?: string | Organizations | null;
  org_use_id?: string | Organizations | null;
  phone_number?: string | null;
  short_name?: string | null;
  sum_app_service?: number | null;
  sum_ram?: number | null;
  url_file_path?: string | null;
  ward_id?: string | WardCategories | null;
};

export type EquipmentTypeCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
};

export type FailureCauseCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type FiberLineTypeCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  parent_id?: string | FiberLineTypeCategories | null;
};

export type GrantDecisionCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
};

export type IncidentType = {
  date_created?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  note?: string | null;
  order_number?: number | null;
  short_name?: string | null;
  user_created?: string | DirectusUsers | null;
};

export type MajorCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  group_id?: string | BusinessGroup | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  note?: string | null;
  order_number?: number | null;
  parent_id?: string | MajorCategories | null;
  short_name?: string | null;
};

export type MicrowaveLines = {
  antenna_height?: number | null;
  bit_rate?: number | null;
  capacity?: number | null;
  date_created?: string | null;
  date_updated?: string | null;
  depreciation_rate?: number | null;
  distance?: number | null;
  id: string;
  is_enable?: boolean | null;
  latitude?: string | null;
  longitude?: string | null;
  modulation_type?: string | null;
  name?: string | null;
  note?: string | null;
  number_of_relay_stages?: number | null;
  order_number?: number | null;
  org_manage_code_old?: string | null;
  org_manage_id?: string | Organizations | null;
  polarization_type?: string | null;
  receiving_frequency?: number | null;
  receiving_sensitivity?: number | null;
  symbol?: string | null;
  transmission_frequency?: number | null;
  transmission_power?: number | null;
  type?: string | null;
};

export type MilitaryDistrictCategories = {
  code?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type MilitaryTypes = {
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type MobileVehicles = {
  code: string;
  date_created?: string | null;
  date_updated?: string | null;
  eid?: string | null;
  id: string;
  is_enable?: boolean | null;
  name: string;
  org_code_old?: string | null;
  org_id?: string | Organizations | null;
  origin_id?: string | CountryCategories | null;
  quality?: number | null;
  serial_number?: string | null;
  started_at?: string | null;
};

export type OpticalFiberLines = {
  coordinates?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  fiber_line_id_old?: string | null;
  final_point?: string | null;
  first_point?: string | null;
  id: string;
  is_enable?: boolean | null;
  length?: number | null;
  manage_length?: number | null;
  name?: string | null;
  note?: string | null;
  number_of_fiber?: number | null;
  order_number?: number | null;
  org_manage_code_old?: string | null;
  org_manage_id?: string | null;
  org_suport_id?: string | Organizations | null;
  org_support_code_old?: string | null;
  org_technical_code_old?: string | null;
  org_technical_id?: string | Organizations | null;
  org_use_code_old?: string | null;
  org_use_id?: string | Organizations | null;
  parent_id?: string | OpticalFiberLines | null;
  symbol?: string | null;
  type_cabble?: string | null;
  type_id?: string | FiberLineTypeCategories | null;
};

export type OrgTypeCategories = {
  code?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  desc?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
};

export type Organizations = {
  attribute?: string | null;
  code?: string | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  has_child?: boolean | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  military_district_id?: string | MilitaryDistrictCategories | null;
  name?: string | null;
  order_number?: number | null;
  order_type_categories: any[] | OrganizationsOrgTypeCategories[];
  org_old_code?: string | null;
  org_old_name?: string | null;
  parent_id?: string | Organizations | null;
  short_name?: string | null;
  tree_level?: number | null;
  tree_path?: string | null;
  ward_id?: string | WardCategories | null;
};

export type OrganizationsOrgTypeCategories = {
  id: number;
  is_enable?: boolean | null;
  org_type_categories_id?: string | OrgTypeCategories | null;
  organizations_id?: string | Organizations | null;
};

export type PersonalIdentifies = {
  address?: string | null;
  birthday?: string | null;
  cccd?: string | null;
  date_created?: string | null;
  date_of_join_army?: string | null;
  date_updated?: string | null;
  degree_id?: string | DegreeCategories | null;
  e_qn?: string | null;
  gender?: boolean | null;
  id: string;
  is_enable?: boolean | null;
  military_code?: string | null;
  name?: string | null;
  order_number?: number | null;
  org_id?: string | Organizations | null;
  phone_number?: string | null;
  position_id?: string | PositionCategories | null;
  rank_id?: string | RankCategories | null;
  short_name?: string | null;
  type?: string | null;
  type_id?: string | MilitaryTypes | null;
  ward_id?: string | WardCategories | null;
};

export type PoleTypes = {
  date_created?: string | null;
  date_updated?: string | null;
  desc?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
};

export type Poles = {
  address?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  fiber_line_id?: string | OpticalFiberLines | null;
  fiber_line_id_old?: string | null;
  height?: number | null;
  id: string;
  is_enable?: boolean | null;
  latitude?: string | null;
  longitude?: string | null;
  name?: string | null;
  note?: string | null;
  org_manage_code_old?: string | null;
  org_manage_id?: string | Organizations | null;
  type_id?: string | PoleTypes | null;
};

export type PositionCategories = {
  code?: string | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type ProvinceCategories = {
  admin_unit_id?: string | AdministrativeUnitCategories | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  military_distric_id?: string | MilitaryDistrictCategories | null;
  name?: string | null;
  order_number?: number | null;
  region_id?: string | RegionCategories | null;
  short_name?: string | null;
};

export type QualificationCategories = {
  code?: string | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type RankCategories = {
  code?: string | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type RealEstateTypeCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
};

export type ReasonCategories = {
  code?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  sub_system?: string | null;
  type_for?: string | null;
};

export type RegionCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type SecurityCategories = {
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  name?: string | null;
  short_name?: string | null;
};

export type SpeciesCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  scope?: string | null;
  short_name?: string | null;
};

export type SpliceClosures = {
  address?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  desc?: string | null;
  fiber_line_id?: string | OpticalFiberLines | null;
  id: string;
  is_enable?: boolean | null;
  optical_loss?: number | null;
  order_number?: number | null;
  reason?: string | null;
  repair_at?: string | null;
  repair_org_code_old?: string | null;
  repair_org_id?: string | Organizations | null;
  repair_point?: string | null;
  tbvt_id?: string | null;
  ward_id?: string | WardCategories | null;
};

export type StationFunctionCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type StationTypeCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  parent_id?: string | StationTypeCategories | null;
};

export type StatusCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable: boolean;
  name?: string | null;
  short_name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Tables = {
  date_created?: string | null;
  date_updated?: string | null;
  desc?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  type?: string | null;
};

export type TablesDetailDescription = {
  data_type?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  order_number?: number | null;
  property_desc?: string | null;
  property_name?: string | null;
  table_id?: string | Tables | null;
};

export type TBVTCategories = {
  code?: string | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  has_child?: boolean | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  is_planning?: boolean | null;
  major_categories: any[] | TbvtCategoriesMajorCategories[];
  name?: string | null;
  order_number?: number | null;
  origin_id?: string | CountryCategories | null;
  parent_id?: string | TBVTCategories | null;
  sub_system?: string | null;
  tree_level?: number | null;
  tree_path?: string | null;
  type: string;
  unit?: string | null;
};

export type TBVTCategoriesDirectusUsers = {
  desc?: string | null;
  directus_users_id?: string | DirectusUsers | null;
  id: number;
  is_enable?: boolean | null;
  tbvt_categories_id?: string | TBVTCategories | null;
};

export type TbvtCategoriesMajorCategories = {
  id: number;
  is_enable?: boolean | null;
  major_categories_id?: string | MajorCategories | null;
  tbvt_categories_id?: string | TBVTCategories | null;
};

export type TechnicalCategory = {
  date_created?: string | null;
  id: string;
  is_enable?: boolean | null;
  note?: string | null;
  order_number?: number | null;
  org_id?: string | Organizations | null;
  user_created?: string | DirectusUsers | null;
};

export type TechnicalOrg = {
  address?: string | null;
  code?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  description?: string | null;
  id: string;
  is_enable?: boolean | null;
  is_offical?: string | null;
  is_temporary?: number | null;
  name?: string | null;
  org_manage_id?: string | Organizations | null;
  personal_identifies: any[] | TechnicalOrgPersonalIdentifies[];
  tbvt_categories: any[] | TechnicalOrgTbvtCategories[];
  ward_id?: string | WardCategories | null;
};

export type TechnicalOrgPersonalIdentifies = {
  id: number;
  personal_identifies_id?: string | PersonalIdentifies | null;
  technical_org_id?: string | TechnicalOrg | null;
};

export type TechnicalOrgTbvtCategories = {
  amount?: number | null;
  id: number;
  manufacturing_year?: string | null;
  note?: string | null;
  quality?: number | null;
  serial_number?: string | null;
  tbvt_categories_id?: string | TBVTCategories | null;
  technical_org_id?: string | TechnicalOrg | null;
  time_of_repair?: number | null;
};

export type TechnicalTeams = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  org_id?: string | Organizations | null;
  short_name?: string | null;
};

export type TechnicalType = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  note?: string | null;
  order_number?: string | null;
  parent_id?: string | TechnicalType | null;
  short_name?: string | null;
  tree_level?: string | null;
  tree_path?: string | null;
};

export type TechnicalTypes = {
  date_created?: string | null;
  id: string;
  is_enable?: boolean | null;
  level?: string | null;
  major_id?: string | MajorCategories | null;
  technical_id?: string | TechnicalOrg | null;
  type_id?: string | TechnicalType | null;
  user_created?: string | DirectusUsers | null;
};

export type UnitCategories = {
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
  sub_system?: string | null;
};

export type UrgencyCategories = {
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: string;
  id_ex?: string | null;
  is_enable?: boolean | null;
  name?: string | null;
  short_name?: string | null;
};

export type WardCategories = {
  admin_unit_id?: string | AdministrativeUnitCategories | null;
  code_ex?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  district_id?: string | DistrictCategories | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  short_name?: string | null;
};

export type Workstations = {
  address?: string | null;
  area?: number | null;
  contact_method?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  description?: string | null;
  function_id?: string | StationFunctionCategories | null;
  id: string;
  is_enable?: boolean | null;
  latitude?: string | null;
  longitude?: string | null;
  name?: string | null;
  order_number?: number | null;
  org_manage_code_old?: string | null;
  org_manage_id?: string | Organizations | null;
  org_support_code_old?: string | null;
  org_support_id?: string | Organizations | null;
  org_technical_code_old?: string | null;
  org_technical_id?: string | Organizations | null;
  org_use_code_old?: string | null;
  org_use_id?: string | Organizations | null;
  parent_id?: string | Workstations | null;
  phone_number?: string | null;
  symbol?: string | null;
  type_id?: string | StationTypeCategories | null;
  url_file_path?: string | null;
  ward_id?: string | WardCategories | null;
};

export type ZoneCategories = {
  code?: string | null;
  date_created?: string | null;
  desc?: string | null;
  id: string;
  is_enable?: boolean | null;
  name?: string | null;
  order_number?: number | null;
  user_created?: string | DirectusUsers | null;
};

export type CustomDirectusTypes = {
  actors: Actors[];
  actors_directus_roles: ActorsDirectusRoles[];
  actors_tables: ActorsTables[];
  administrative_unit_categories: AdministrativeUnitCategories[];
  available_roles: AvailableRoles[];
  business_domain: BusinessDomain[];
  business_group: BusinessGroup[];
  cable_boxes: CableBoxes[];
  condition_categories: ConditionCategories[];
  country_categories: CountryCategories[];
  custom_permissions: CustomPermissions[];
  custom_permissions_directus_roles: CustomPermissionsDirectusRoles[];
  defense_lands: DefenseLands[];
  degree_categories: DegreeCategories[];
  directus_activity: DirectusActivity[];
  directus_collections: DirectusCollections[];
  directus_dashboards: DirectusDashboards[];
  directus_extensions: DirectusExtensions[];
  directus_fields: DirectusFields[];
  directus_files: DirectusFiles[];
  directus_flows: DirectusFlows[];
  directus_folders: DirectusFolders[];
  directus_migrations: DirectusMigrations[];
  directus_notifications: DirectusNotifications[];
  directus_operations: DirectusOperations[];
  directus_panels: DirectusPanels[];
  directus_permissions: DirectusPermissions[];
  directus_presets: DirectusPresets[];
  directus_relations: DirectusRelations[];
  directus_revisions: DirectusRevisions[];
  directus_roles: DirectusRoles[];
  directus_sessions: DirectusSessions[];
  directus_settings: DirectusSettings;
  directus_shares: DirectusShares[];
  directus_translations: DirectusTranslations[];
  directus_users: DirectusUsers[];
  directus_versions: DirectusVersions[];
  directus_webhooks: DirectusWebhooks[];
  district_categories: DistrictCategories[];
  document_type_categories: DocumentTypeCategories[];
  drain_tank_types: DrainTankTypes[];
  drain_tanks: DrainTanks[];
  engine_room_categories: EngineRoomCategories[];
  equipment_type_categories: EquipmentTypeCategories[];
  failure_cause_categories: FailureCauseCategories[];
  fiber_line_type_categories: FiberLineTypeCategories[];
  grant_decision_categories: GrantDecisionCategories[];
  incident_type: IncidentType[];
  major_categories: MajorCategories[];
  microwave_lines: MicrowaveLines[];
  military_district_categories: MilitaryDistrictCategories[];
  military_types: MilitaryTypes[];
  mobile_vehicles: MobileVehicles[];
  optical_fiber_lines: OpticalFiberLines[];
  org_type_categories: OrgTypeCategories[];
  organizations: Organizations[];
  organizations_org_type_categories: OrganizationsOrgTypeCategories[];
  personal_identifies: PersonalIdentifies[];
  pole_types: PoleTypes[];
  poles: Poles[];
  position_categories: PositionCategories[];
  province_categories: ProvinceCategories[];
  qualification_categories: QualificationCategories[];
  rank_categories: RankCategories[];
  real_estate_type_categories: RealEstateTypeCategories[];
  reason_categories: ReasonCategories[];
  region_categories: RegionCategories[];
  security_categories: SecurityCategories[];
  species_categories: SpeciesCategories[];
  splice_closures: SpliceClosures[];
  station_function_categories: StationFunctionCategories[];
  station_type_categories: StationTypeCategories[];
  status_categories: StatusCategories[];
  tables: Tables[];
  tables_detail_description: TablesDetailDescription[];
  tbvt_categories: TBVTCategories[];
  tbvt_categories_directus_users: TBVTCategoriesDirectusUsers[];
  tbvt_categories_major_categories: TbvtCategoriesMajorCategories[];
  technical_category: TechnicalCategory[];
  technical_org: TechnicalOrg[];
  technical_org_personal_identifies: TechnicalOrgPersonalIdentifies[];
  technical_org_tbvt_categories: TechnicalOrgTbvtCategories[];
  technical_teams: TechnicalTeams[];
  technical_type: TechnicalType[];
  technical_types: TechnicalTypes[];
  unit_categories: UnitCategories[];
  urgency_categories: UrgencyCategories[];
  ward_categories: WardCategories[];
  workstations: Workstations[];
  zone_categories: ZoneCategories[];
};
