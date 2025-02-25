import { RouteObject } from 'react-router';
import loadable from '../../components/Loadable';
import { RouterUrl } from '@app/enums/router.enum';
import { CategoriesProvider } from '@app/contexts/CategoriesContext';
import { IEndPoint } from '@app/interfaces/common.interface';

const ITCategories = loadable(() => import('./pages/ITCategories'));
const CountryCategories = loadable(() => import('./pages/CountryCategories'));
const AdministrativeUnitCategories = loadable(() => import('./pages/AdministrativeUnitCategories'));
const RegionCategories = loadable(() => import('./pages/RegionCategories'));
const MilitaryDistrictCategories = loadable(() => import('./pages/MilitaryDistrictCategories'));
const ProvinceCategories = loadable(() => import('./pages/ProvinceCategories'));
const DistrictCategories = loadable(() => import('./pages/DistrictCategories'));
const WardCategories = loadable(() => import('./pages/WardCategories'));
const EngineRoomCategories = loadable(() => import('./pages/EngineRoomCategories'));

export enum ITCategoriesRoute {
  CountryCategories = `${RouterUrl.ITCategories}/quoc-gia`,
  AdministrativeUnitCategories = `${RouterUrl.ITCategories}/don-vi-hanh-chinh`,
  RegionCategories = `${RouterUrl.ITCategories}/vung`,
  MilitaryDistrictCategories = `${RouterUrl.ITCategories}/quan-khu`,
  ProvinceCategories = `${RouterUrl.ITCategories}/tinh`,
  DistrictCategories = `${RouterUrl.ITCategories}/huyen`,
  WardCategories = `${RouterUrl.ITCategories}/xa`,
  EngineRoomCategories = `${RouterUrl.ITCategories}/phong-may-cntt`,
}
export const endPoints: IEndPoint[] = [

  {
    key: ITCategoriesRoute.CountryCategories,
    value: 'country_categories',
    label: "DM quốc gia",
  },
  {
    key: ITCategoriesRoute.ProvinceCategories,
    value: 'province_categories',
    label: "DM tỉnh",
  },
  {
    key: ITCategoriesRoute.DistrictCategories,
    value: 'district_categories',
    label: "DM huyện",
  },
  {
    key: ITCategoriesRoute.WardCategories,
    value: 'ward_categories',
    label: "DM xã",
  },
  {
    key: ITCategoriesRoute.AdministrativeUnitCategories,
    value: 'administrative_unit_categories',
    label: "DM đơn vị hành chính",
  },
  {
    key: ITCategoriesRoute.RegionCategories,
    value: 'region_categories',
    label: "DM vùng",
  },
  {
    key: ITCategoriesRoute.MilitaryDistrictCategories,
    value: 'military_district_categories',
    label: "DM quân khu",
  },

  {
    key: ITCategoriesRoute.EngineRoomCategories,
    value: 'engine_room_categories',
    label: "DM phòng máy CNTT",
  }
]

export const Router: RouteObject = {
  path: RouterUrl.ITCategories,
  element: <CategoriesProvider value={{ endPoints: endPoints }}>
    <ITCategories />
  </CategoriesProvider>,
  children: [
    {
      path: ITCategoriesRoute.CountryCategories,
      element: <CountryCategories />,
      id: '1'
    },
    {
      path: ITCategoriesRoute.AdministrativeUnitCategories,
      element: <AdministrativeUnitCategories />,
      id: '2'
    },
    {
      path: ITCategoriesRoute.RegionCategories,
      element: <RegionCategories />,
      id: '3'
    },
    {
      path: ITCategoriesRoute.MilitaryDistrictCategories,
      element: <MilitaryDistrictCategories />,
      id: '4',
    },
    {
      path: ITCategoriesRoute.ProvinceCategories,
      element: <ProvinceCategories />,
      id: '5',
    },
    {
      path: ITCategoriesRoute.DistrictCategories,
      element: <DistrictCategories />,
      id: '6',
    },
    {
      path: ITCategoriesRoute.WardCategories,
      element: <WardCategories />,
      id: '7',
    },
    {
      path: ITCategoriesRoute.EngineRoomCategories,
      element: <EngineRoomCategories />,
      id: '8',
    }
  ]
}

