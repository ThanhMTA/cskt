export enum Scope {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum SidebarMenuKey {
  Banner = 0,
  Home,
  ContactManager,
  Website,
  System,
  Categories,
  Pages,
  Posts,
}

export enum Action {
  Create = "create",
  Delete = "delete",
  Update = "update",
  // Edit = 'edit',
  View = "view",
  ExportExcel = "exportExcel",
}

export enum CommonCategories {
  RANK = "RANK",
  POSITION = "POSITION",
  ADMINISTRATIVE = "ADMINISTRATIVE",
}

export enum SeparatorKey {
  PathName = "/",
}

export enum TableKey {
  Stt = 100,
  Action,
}

export enum TableDataIndex {
  OrdinalNumber = "ordinalNumber",
}

export enum DefaultRequestValue {
  Take = 10,
}

export enum FormatDate {
  DayJSStandard = "DD-MM-YYYY",
  DayJSFull01 = "HH:mm:ss DD-MM-YYYY",
}

export enum UserMenu {
  Profile,
  ChangePassword,
  Logout,
}

export const FileSize10MB = 10485760;

export enum DurationTime {
  Alert = 5000,
}

export enum PermissionAction {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
  share = "share",
}
export enum TableType {
  DANH_MUC_GOC = "DANH_MUC_GOC",
  DANH_SACH = "DANH_SACH",
}

export enum LayoutSpace {
  TabMargin = 150,
  SectionMargin = 120,
}

export enum Status {
  draft = "Đã khoá",
  active = "Đang hoạt động",
}

export enum StatusUser {
  draft = "draft",
  active = "active",
}
