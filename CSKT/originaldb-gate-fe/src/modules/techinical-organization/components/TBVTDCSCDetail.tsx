import { Divider, Table } from "antd";
import { useEffect, useState } from "react";
import { getTechnicalTBVTDetail } from "../stores/TechnicalOrganization.action";

type TBVTDCSCDetailViewType = {
    data: any;
    tree_path: any
};

const TBVTDCSCDetail = ({ data, tree_path }: TBVTDCSCDetailViewType) => {
    const { name, code } = data;
    const [dataSource, setDataSource] = useState<any[]>([])
    const columns = [
        {
            title: 'Tên VTKT',
            dataIndex: "name",
            render: () => name
        },
        {
            title: 'Số lượng',
            dataIndex: "amount",
            render: (value: any) => parseInt(value),
            width: '10%',
        },
        {
            title: 'Cấp chất lượng',
            dataIndex: "quality",
            width: '15%',
        },
        {
            title: 'Đơn vị quản lý',
            dataIndex: "technical_org_id",
            width: '15%',
            render: (value: any) => value?.name
        },
        {
            title: 'Mã định danh',
            dataIndex: "serial_number",
            width: '15%',
        },
    ]
    const fetchData = async () => {
        try {
            const res = await getTechnicalTBVTDetail({ limit: -1 }, {
                tbvt_categories_id: {
                    code: code
                },
                technical_org_id: {
                    org_manage_id: {
                        tree_path: { _contains: tree_path }
                    }
                }
            });
            setDataSource(res);
        } catch (error: any) {
            console.log('error: ', error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [data])
    return (
        <div className="rounded-lg h-[500px]">
            <Divider className="my-0" />
            <Table
                columns={columns}
                dataSource={dataSource}
            />
        </div>
    );
};

export default TBVTDCSCDetail;
