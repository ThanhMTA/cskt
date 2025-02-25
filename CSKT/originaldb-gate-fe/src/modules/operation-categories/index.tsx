import { RouteObject } from "react-router";
import loadable from "../../components/Loadable";
import { RouterUrl } from "@app/enums/router.enum";
import { IEndPoint } from "@app/interfaces/common.interface";
import { CategoriesProvider } from "@app/contexts/CategoriesContext";

const OperationCategories = loadable(
  () => import("./pages/OperationCategories")
);
const DefenseLands = loadable(() => import("./pages/DefenseLands"));
const StationTypeCategories = loadable(
  () => import("./pages/StationTypeCategories")
);
const FiberLineType = loadable(() => import("./pages/FiberLineType"));
const DrainTankType = loadable(() => import("./pages/DrainTankType"));
const PoleType = loadable(() => import("./pages/PoleType"));
const StationFunction = loadable(() => import("./pages/StationFunction"));
const Workstations = loadable(() => import("./pages/Workstations"));
const OpticalFiberLines = loadable(() => import("./pages/OpticalFiberLines"));
const CopperCableFiberLines = loadable(
  () => import("./pages/CopperCableLines")
);
const MicrowaveLines = loadable(() => import("./pages/MicrowaveLines"));
const MobileVehicles = loadable(() => import("./pages/MobileVehicles"));
const CableBoxes = loadable(() => import("./pages/CableBoxes"));
const DrainTanks = loadable(() => import("./pages/DrainTanks"));
const Poles = loadable(() => import("./pages/Poles"));

export enum OperationCategoriesRoute {
  OperationCategories = `${RouterUrl.OperationCategories}/diem-dat-quoc-phong`,
  StationTypeCategories = `${RouterUrl.OperationCategories}/loai-tram-thong-tin`,
  FiberLineType = `${RouterUrl.OperationCategories}/loai-tuyen-cap`,
  DrainTankType = `${RouterUrl.OperationCategories}/loai-cong-be`,
  PoleType = `${RouterUrl.OperationCategories}/loai-cot`,
  StationFunction = `${RouterUrl.OperationCategories}/chuc-nang-tram-thong-tin`,
  Workstations = `${RouterUrl.OperationCategories}/tram-thong-tin`,
  OpticalFiberLines = `${RouterUrl.OperationCategories}/tuyen-cap-quang`,
  CopperCableFiberLines = `${RouterUrl.OperationCategories}/tuyen-cap-dong`,
  MicrowaveLines = `${RouterUrl.OperationCategories}/tuyen-viba`,
  MobileVehicles = `${RouterUrl.OperationCategories}/xe-co-dong`,
  CableBoxes = `${RouterUrl.OperationCategories}/hop-cap-tu-cap`,
  DrainTanks = `${RouterUrl.OperationCategories}/cong-be`,
  Poles = `${RouterUrl.OperationCategories}/cot`,
  SpliceClosures = `${RouterUrl.OperationCategories}/mang-xong`,
}

export const endPoints: IEndPoint[] = [
  {
    key: OperationCategoriesRoute.OperationCategories,
    value: "defense_lands",
    label: "DM điểm đất QP",
  },
  {
    key: OperationCategoriesRoute.Workstations,
    value: "workstations",
    label: "DM trạm TT",
  },
  {
    key: OperationCategoriesRoute.StationTypeCategories,
    value: "station_type_categories",
    label: "DM loại trạm",
  },
  {
    key: OperationCategoriesRoute.MobileVehicles,
    value: "mobile_vehicles",
    label: "DM xe cơ động",
  },
  {
    key: OperationCategoriesRoute.OpticalFiberLines,
    value: "optical_fiber_lines",
    label: "DM tuyến cáp quang",
  },
  {
    key: OperationCategoriesRoute.CopperCableFiberLines,
    value: "optical_fiber_lines",
    label: "DM tuyến cáp đồng",
  },
  {
    key: OperationCategoriesRoute.MicrowaveLines,
    value: "microwave_lines",
    label: "DM tuyến viba",
  },
  {
    key: OperationCategoriesRoute.CableBoxes,
    value: "cable_boxes",
    label: "DM hộp-Tủ cáp",
  },
  {
    key: OperationCategoriesRoute.DrainTanks,
    value: "drain_tanks",
    label: "DM cống, bể",
  },
  {
    key: OperationCategoriesRoute.FiberLineType,
    value: "fiber_line_type",
    label: "Loại tuyến cáp",
  },
  {
    key: OperationCategoriesRoute.DrainTankType,
    value: "drain_tank_type",
    label: "Loại cống bể",
  },
  {
    key: OperationCategoriesRoute.PoleType,
    value: "pole_type",
    label: "Loại cột",
  },
  {
    key: OperationCategoriesRoute.StationFunction,
    value: "station_function",
    label: "Chức năng trạm thông tin",
  },
  {
    key: OperationCategoriesRoute.Poles,
    value: "poles",
    label: "Danh sách cột",
  },
];

export const Router: RouteObject = {
  path: RouterUrl.OperationCategories,
  element: (
    <CategoriesProvider value={{ endPoints: endPoints }}>
      <OperationCategories />
    </CategoriesProvider>
  ),
  children: [
    {
      path: OperationCategoriesRoute.OperationCategories,
      element: <DefenseLands />,
    },
    {
      path: OperationCategoriesRoute.StationTypeCategories,
      element: <StationTypeCategories />,
    },
    {
      path: OperationCategoriesRoute.FiberLineType,
      element: <FiberLineType />,
    },
    {
      path: OperationCategoriesRoute.DrainTankType,
      element: <DrainTankType />,
    },
    {
      path: OperationCategoriesRoute.PoleType,
      element: <PoleType />,
    },
    {
      path: OperationCategoriesRoute.StationFunction,
      element: <StationFunction />,
    },
    {
      path: OperationCategoriesRoute.Workstations,
      element: <Workstations />,
    },
    {
      path: OperationCategoriesRoute.OpticalFiberLines,
      element: <OpticalFiberLines />,
    },
    {
      path: OperationCategoriesRoute.CopperCableFiberLines,
      element: <CopperCableFiberLines />,
    },
    {
      path: OperationCategoriesRoute.MicrowaveLines,
      element: <MicrowaveLines />,
    },
    {
      path: OperationCategoriesRoute.MobileVehicles,
      element: <MobileVehicles />,
    },
    {
      path: OperationCategoriesRoute.CableBoxes,
      element: <CableBoxes />,
    },
    {
      path: OperationCategoriesRoute.DrainTanks,
      element: <DrainTanks />,
    },
    {
      path: OperationCategoriesRoute.Poles,
      element: <Poles />,
    },
  ],
};
