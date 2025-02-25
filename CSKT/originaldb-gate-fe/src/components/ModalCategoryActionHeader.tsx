import { BUTTON_LABEL, MESSAGE_CONTENT } from "@app/constants/common.constant";
import { Action, PermissionAction } from "@app/enums"
import { Button, Flex, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import HasPermission from "./HasPermission";

type Props = {
    action: Action,
    name: string;
    hanldeFinish: () => void,
    handleDelete?: () => void,
}
export default function ModalCategoryActionHeader({ name, action, hanldeFinish, handleDelete }: Props) {
    const [title, setTitle] = useState('');
    const [btnSubmitText, setBtnSubmitText] = useState('');
    useEffect(() => {
        switch (action) {
            case Action.Create:
                setTitle('Thêm mới')
                setBtnSubmitText('Lưu thông tin')
                break;
            case Action.Update:
                setTitle('Cập nhật');
                setBtnSubmitText('Lưu thông tin')
                break;
            case Action.View:
                setTitle('Chi tiết');
                setBtnSubmitText('Sửa thông tin')
                break;
        }
    }, [action])

    return <>
        <p className="modal-title">{`${title} ${name}`}</p>
        <Flex gap={10}>
            <HasPermission action={PermissionAction.delete}>
                {
                    action !== Action.Create ? <Popconfirm
                        title={MESSAGE_CONTENT.DELETE}
                        onConfirm={handleDelete}
                        okText={BUTTON_LABEL.CORRECT}
                        cancelText={BUTTON_LABEL.NO}
                    >

                        <Button
                            htmlType="button"
                            className="text-red border-red"
                        >
                            Xóa
                        </Button>
                    </Popconfirm> : <></>
                }
            </HasPermission>
            <HasPermission action={PermissionAction.update}>
                <Button type="primary" onClick={hanldeFinish}>{btnSubmitText}</Button>
            </HasPermission>
        </Flex>

    </>
}