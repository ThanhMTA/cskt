import { useCategories } from "@app/contexts/CategoriesContext";
import { PermissionAction } from "@app/enums"
import { globalStore } from "@app/store/global.store";
import { userStore } from "@app/store/user/user.store";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";

type Props = {
    action: PermissionAction,
    children: JSX.Element;
}
export default function HasPermission({ action, children }: Props) {
    const {currPath,currEndpoints} = globalStore()
    const { userInfo, isLoading } = userStore();
    const [collection, setCollection] = useState('')
    useEffect(() => {
      const endpoint = currEndpoints?.find(x => x.key === currPath);
      if(endpoint?.value){
        setCollection(endpoint?.value)
      }
    }, [currPath,currEndpoints])
    if (isLoading || !collection) {
      return <Skeleton />;
    } else {
      return userInfo?.permissions?.some(per => per.collection === collection && per?.action === action) ? children : '';
    }
}