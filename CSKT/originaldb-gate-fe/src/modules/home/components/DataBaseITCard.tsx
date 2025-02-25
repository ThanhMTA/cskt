import { ApartmentOutlined } from "@ant-design/icons";
import { TableType } from "@app/enums";
import { Divider, Tooltip } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { getTablesDevices } from "../store/Home.action";

import { Actors, Tables } from "@app/types/types";

type DataBaseITCardProps = {
  width?: number;
  itemCard: Tables;
};

const DataBaseITCard: React.FC<DataBaseITCardProps> = memo(
  ({ width, itemCard }) => {
    // variables
    const [widthCard, setWidthCard] = useState<number | string>("100%");
    const [totalDevices, setTotalDevices] = useState<number>(0);
    const [totalDevicesActive, setTotalDevicesActive] = useState<number>(0);
    const [totalDevicesDisabled, setTotalDevicesDisabled] = useState<number>(0);
    // functions
    const getActorsTableList = useCallback(async () => {
      const filter: any = {};
      if (itemCard) {
        const res = await getTablesDevices(
          itemCard?.name as string,
          { page: 1, limit: -1 },
          filter
        );
        const total = res?.length;
        const totalActive = res?.filter((x) => x.is_enable)?.length;
        const totalDisabled = res?.filter((x) => !x.is_enable)?.length;
        setTotalDevices(total);
        setTotalDevicesActive(totalActive);
        setTotalDevicesDisabled(totalDisabled);
      }
    }, [itemCard]);

    useEffect(() => {
      setWidthCard(width || "100%");
    }, [width]);

    useEffect(() => {
      getActorsTableList();
    }, []);

    // return
    return (
      <div
        style={{
          minWidth: 220,
          width: widthCard,
        }}
        className={`bg-white p-4 rounded-primary`}
      >
        <div className="flex items-center gap-x-2">
          <div className="rounded-full bg-primary/50 p-2 center">
            <ApartmentOutlined className="text-lg" />
          </div>
          <Tooltip title={itemCard?.desc}>
            <span className=" font-bold line-clamp-1">{itemCard?.desc}</span>
          </Tooltip>
        </div>
        <Divider className="my-3" />
        <div>
          <div className="flex justify-between">
            <span>Tổng số thiết bị</span>
            <span>{totalDevices}</span>
          </div>
          <div className="mt-2 flex gap-x-3">
            <div className="flex gap-x-1 items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>{totalDevicesActive}</span>
            </div>
            <div className="flex gap-x-1 items-center">
              <div className="w-3 h-3 bg-red rounded-full"></div>
              <span>{totalDevicesDisabled}</span>
            </div>
          </div>
        </div>
        <Divider className="my-3" dashed />
        <div>
          <div className="flex justify-between">
            <span>Số lượng báo cảnh</span>
            <span>0</span>
          </div>
          <div className="mt-2 flex gap-x-3">
            <div className="flex gap-x-1 items-center">
              <div className="w-3 h-3 bg-red rounded-full"></div>
              <span>0</span>
            </div>
            <div className="flex gap-x-1 items-center">
              <div className="w-3 h-3 bg-orange rounded-full"></div>
              <span>0</span>
            </div>
          </div>
        </div>
        <Divider className="my-3" dashed />
        <div className="flex justify-between">
          <span>Số tuyến vượt băng thông</span>
          <span>0</span>
        </div>
        <Divider className="my-3" dashed />
        <div className="flex justify-between">
          <span>Số chủng loại</span>
          <span>0</span>
        </div>
      </div>
    );
  }
);

export default DataBaseITCard;
