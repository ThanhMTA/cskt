import { RouterUrl } from "@app/enums/router.enum";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();
  
  return <Result
    title="Bạn không có quyền truy cập vào trang này"
    status="warning"
    extra={
      <Button type="primary" onClick={() => navigate(RouterUrl.Home)}>
        Về trang chủ
      </Button>
    }
  />
}