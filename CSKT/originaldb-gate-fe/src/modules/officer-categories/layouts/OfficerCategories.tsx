import { SPACE_PROP_DEFAULT } from "@app/configs/ant-component";
import { Col, Flex, Space } from "antd";
import PageName from "@app/components/PageName";
import CategorySegmented from "@app/components/CategorySegmented";
import CategoryTabs from "@app/components/CategoryTabs";
import { LayoutSpace } from "@app/enums";

export default function OfficerCategories() {
  return (
    <Space {...SPACE_PROP_DEFAULT}>
      <PageName title="DỮ LIỆU DÙNG CHUNG CÁN BỘ" />
      <div
        className={`bg-white w-full absolute z-100`}
        style={{
          height: `calc(100%)`,

          top: `${LayoutSpace.TabMargin}px`,
        }}
      ></div>
      <div className="flex items-center justify-center">
        <section className="relative">
          <div className="bg-white px-3 rounded-t-lg pb-0 ring-[12px] ring-white/30 border-solid border-gray-300 -mt-[45px]">
            <div className="flex flex-row gap-6 -mt-1">
              <div>
                <Flex gap="middle" vertical>
                  <CategorySegmented />
                </Flex>
              </div>
              <Col className="gutter-row pt-5 w-full">
                <CategoryTabs />
              </Col>
            </div>
          </div>
        </section>
      </div>
    </Space>
  );
}
