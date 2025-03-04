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
const BinhChungs = loadable(() => import('./pages/BinhChung'));

export enum ITCategoriesRoute {
  CountryCategories = `${RouterUrl.ITCategories}/quoc-gia`,
  AdministrativeUnitCategories = `${RouterUrl.ITCategories}/don-vi-hanh-chinh`,
  RegionCategories = `${RouterUrl.ITCategories}/vung`,
  MilitaryDistrictCategories = `${RouterUrl.ITCategories}/quan-khu`,
  ProvinceCategories = `${RouterUrl.ITCategories}/tinh`,
  DistrictCategories = `${RouterUrl.ITCategories}/huyen`,
  WardCategories = `${RouterUrl.ITCategories}/xa`,
  EngineRoomCategories = `${RouterUrl.ITCategories}/phong-may-cntt`,
  Binh_Chung= `${RouterUrl.ITCategories}/binh-chung`,
  test= `${RouterUrl.ITCategories}/test`,

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
    // value: 'Binh_Chung',
    label: "DM phòng máy CNTT",
    // label: "DM Binh Chủng ",
  },
  {
    key: ITCategoriesRoute.Binh_Chung,
    value: 'Binh_Chung',
    label: "DM Binh Chủng ",
  }
]
// console.log("Danh sách EndPoints:", endPoints);


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
      element: <BinhChungs />,
      id: '8',
    }, 
    {
      path: ITCategoriesRoute.Binh_Chung,
      element: <BinhChungs />,
      id: '9',
    }, 


  ]
}
console.log("Danh sách Router:", Router.children?.map((route) => ({
  path: route.path,
  id: route.id,
})));


