import dayjs from "@app/core/dayjs";
import BaseTable from "./BaseTable";
import { Action } from "@app/enums";
import { useCategories } from "@app/contexts/CategoriesContext";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Location, Params } from 'react-router-dom';
import { IActivity, IEndPoint, IMeta } from "@app/interfaces/common.interface";
import { getActivities, paginationActivities } from "@app/store/activities/activities.action";
import { DEFAULT_PAGESIZE } from "@app/configs/app.config";

const dateFormat = 'DD/MM/YYYY HH:mm';


const buildActionName = (action: string) => {
  switch (action) {
    case Action.Create:
      return 'Thêm mới';
    case Action.Update:
      return 'Chỉnh sửa';
    case Action.Delete:
      return 'Xóa';
  }
}


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
    title: 'Thời gian',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (text: any) => dayjs(text).format(dateFormat),
  },
  {
    title: 'Tên người khai thác',
    dataIndex: 'user',
    key: 'user',
    render: (_, item: any) => `${item?.user?.first_name} ${item?.user?.last_name}`,
  },
  {
    title: 'Vai trò hệ thống',
    dataIndex: 'collection',
    key: 'collection',
    render: (_, item: any) => item?.user?.role?.name,
  },
  {
    title: 'Loại tương tác',
    dataIndex: 'action',
    key: 'action',
    render: (text: any) => buildActionName(text),
  },
  {
    title: 'Thông tin tương tác',
    key: 'revisions',
    render: (_, item: any) => `${buildActionName(item?.action)} ${item?.revisions?.[0]?.data?.name || ''}`
  },
]

export default function Activities() {
  const { endPoints } = useCategories();
  const location = useLocation()
  const params = useParams();
  const endPoint = getEndPoint(location, params, endPoints);
  const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: DEFAULT_PAGESIZE });
  const [data, setData] = useState<IActivity[]>([]);
  const [meta, setMeta] = useState<IMeta>({ count: 0 });
  const [currEndPoint, setCurrEndPoint] = useState<IEndPoint>()
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (page: number, pageSize: number, endPoint: string) => {
    try {
      const filterParams: any = {
        _and: [
          {
            _or: [
              {
                _and: [
                  {
                    collection: {
                      _eq: endPoint
                    }
                  },
                  {
                    action: {
                      _in: ['create', 'update', 'delete']
                    }
                  }
                ]
              }
            ]
          }
        ]
      };
      setIsLoading(true);
      const res = await Promise.all([getActivities({ limit: pageSize, page }, filterParams), paginationActivities(filterParams)]);
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