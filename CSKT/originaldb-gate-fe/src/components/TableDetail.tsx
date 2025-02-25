import dayjs from "@app/core/dayjs";
import BaseTable from "./BaseTable";

import { useCategories } from "@app/contexts/CategoriesContext";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Location, Params } from 'react-router-dom';
import { getActivities, paginationActivities } from "@app/store/activities/activities.action";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";
import { IEndPoint, IMeta } from "@app/interfaces/common.interface";
import { TableDetailDescription } from "@app/types/table.types";
import { getTableByName, getTableDetailDescription, metaTableDetailDescription } from "@app/store/tables/tables.action";

const dateFormat = 'DD/MM/YYYY HH:mm';





const getEndPoint = (location: Location, params: Params, endPoints: IEndPoint[]): IEndPoint | undefined => {
  const { pathname } = location;

  if (!Object.keys(params).length) {
    return endPoints?.find(x => x.key === pathname); // we don't need to replace anything
  }

  let path = pathname;
  Object.entries(params).forEach(([paramName, paramValue]) => {
    if (paramValue) {
      path = path.replace(paramValue, `:${paramName}`);
    }
  });
  return endPoints?.find(x => x.key === path);
};
const columns = [
  {
    title: 'Dữ liệu',
    dataIndex: 'property_name',
    key: 'property_name',
  },
  {
    title: 'Thông tin',
    dataIndex: 'property_desc',
    key: 'property_desc',
  }
]

export default function TableDetail() {
  const { endPoints } = useCategories();
  const location = useLocation()
  const params = useParams();
  const endPoint = getEndPoint(location, params, endPoints);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [data, setData] = useState<TableDetailDescription[]>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [currEndPoint, setCurrEndPoint] = useState<IEndPoint>()
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (page: number, pageSize: number, endPoint: string) => {
    try {
      const filterParams: any = {
        _and: [
          {
            name: {
              _eq: endPoint
            }
          },
        ]
      };
      const collection = await getTableByName({ limit: 1, page: 1 }, filterParams);
      const filterTableDetail: any = {
        _and: [
          {
            table_id: {
              _eq: collection[0]?.id
            }
          },
        ]
      };
      setIsLoading(true);
      const res = await Promise.all([getTableDetailDescription({ limit: pageSize, page }, filterTableDetail), metaTableDetailDescription(filterTableDetail)]);
      if (res[1]) {
        setMeta({ count: res[1].count })
      }
      setData(res[0])
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (endPoint?.value) {
      fetchData(1, DEFAULT_PAGESIZE, endPoint?.value);
      setCurrEndPoint(endPoint);
    }
  }, [endPoint])

  return currEndPoint?.value && <BaseTable
    className="mt-5"
    isReloadButton={true}
    dataSource={[...data]}
    columns={columns}
    paginationCustom={
      {
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: meta?.count
      }
    }
    onChange={({ current, pageSize }: any) => {
      setPagination({ page: current, pageSize });
      fetchData(current, pageSize, currEndPoint?.value);
    }}
    actionList={undefined}
    isAction={true}
    actionClick={(event: any) => {
      console.log(event);

    }}
    loading={isLoading}
    rowKey={'id'}
  />
}