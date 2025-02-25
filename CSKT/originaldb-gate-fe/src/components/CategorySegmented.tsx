import { GenerateIconDM } from "@app/assets/svg";
import { useCategories } from "@app/contexts/CategoriesContext";
import { IEndPoint } from "@app/interfaces/common.interface";
import { globalStore } from "@app/store/global.store";
import { AutoCompleteProps, Menu, Select } from "antd";
import { MenuProps } from "antd/lib";
import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

export default function CategorySegmented() {
  const { endPoints } = useCategories();
  const { actorsDirectusRoles } = globalStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [segments, setSegment] = useState<IEndPoint[]>([]);
  const [activeItem, setActiveItem] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  useEffect(() => {
    const tables =
      actorsDirectusRoles?.reduce(
        (prev, curr) => [...prev].concat(curr?.actors_id?.tables || []),
        []
      ) || [];
    if (tables && tables?.length > 0) {
      const segs = endPoints.filter(
        (x) => tables?.findIndex((t) => t?.tables_id?.name === x.value) > -1
      );
      setOptions(
        segs.map((item: any) => ({
          label: item?.label,
          value: item?.key,
        }))
      );
      setSegment(segs);
      if (segs?.length > 0) {
        if (segs?.findIndex((x) => x.key === location.pathname) > -1) {
          const seg = segs?.filter((x) => x.key === location.pathname);
          navigate(location.pathname, {
            state: {
              title: seg[0].label,
            },
          });
          setActiveItem(seg[0].key);
        } else {
          navigate(segs[0]?.key, {
            state: {
              title: segs[0].label,
            },
          });
          setActiveItem(segs[0].key);
        }
      } else {
        navigate("/");
      }
    }
  }, [location.pathname, actorsDirectusRoles]);
  const onClick: MenuProps["onClick"] = (e: any) => {
    navigate(e.key as string, {
      state: {
        title: segments.find((_item) => _item.key === e.key)?.label,
      },
    });
  };
  return (
    <>
      {segments?.length > 1 ? (
        <section className="container border-r-[1px] pt-5">
          <div className="flex flex-row justify-between px-[5px] pb-[10px] -mt-2 items-center">
            {isSearch ? (
              <>
                <Select
                  options={options}
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onClear={() => setIsSearch(false)}
                  onSelect={(value: string) => {
                    setIsSearch(false);
                    navigate(value, {
                      state: {
                        title: options?.find((item: any) => item.key === value)
                          ?.label,
                      },
                    });
                  }}
                  size="small"
                  className="flex w-full"
                />
              </>
            ) : (
              <>
                <span className="text-[#4D5358] tex-[14px] font-normal leading-6">
                  Tổng số danh mục:{" "}
                  <span className="font-bold">{segments.length}</span>
                </span>
                {options?.length > 1 && (
                  <div
                    className="cursor-pointer bg-[#F5F5F6] rounded-[4px] p-[4px]"
                    onClick={() => {
                      setIsSearch(!isSearch);
                    }}
                  >
                    <BiSearch style={{ fontSize: 15 }} />
                  </div>
                )}
              </>
            )}
          </div>
          <Menu
            activeKey={activeItem}
            onClick={onClick}
            style={{ width: 256, fontSize: 14, border: 0 }}
            mode="vertical"
            items={[...segments].map((x) => ({
              label: x.label,
              key: x.key,
              value: x.key,
              icon: <img width={16} src={GenerateIconDM(x.key)} />,
            }))}
          />
        </section>
      ) : (
        <></>
      )}
    </>
  );
}
