import AccessDenied from "@app/components/AccessDenied";
import { useCategories } from "@app/contexts/CategoriesContext";
import { PermissionAction } from "@app/enums";
import { userStore } from "@app/store/user/user.store";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const PrivateRoute = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const location = useLocation();
  const { userInfo, isLoading } = userStore();
  const { endPoints } = useCategories();
  const [collection, setCollection] = useState('')
  useEffect(() => {
    const endpoint = endPoints?.find(x => x.key === location?.pathname);
    if (endpoint?.value) {
      setCollection(endpoint?.value)
    }
  }, [location.pathname])
  if (isLoading) {
    return <Skeleton />;
  } else {
    if (!collection) {
      return ''
    }
    // return userInfo?.permissions?.some(per => per.collection === collection && per?.action === PermissionAction.read) ? children : <AccessDenied />;
    return children
  }
};