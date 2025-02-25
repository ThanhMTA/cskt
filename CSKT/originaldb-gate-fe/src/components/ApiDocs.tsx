import { useCategories } from "@app/contexts/CategoriesContext";
import { IEndPoint } from "@app/interfaces/common.interface";
import { useEffect, useState } from "react";
import { Params, useLocation, useParams } from "react-router-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const getEndPoint = (
  location: Location,
  params: Params,
  endPoints: IEndPoint[]
): IEndPoint | undefined => {
  const { pathname } = location;

  if (!Object.keys(params).length) {
    return endPoints?.find((x) => x.key === pathname); // we don't need to replace anything
  }

  let path = pathname;
  Object.entries(params).forEach(([paramName, paramValue]) => {
    if (paramValue) {
      path = path.replace(paramValue, `:${paramName}`);
    }
  });
  return endPoints?.find((x) => x.key === path);
};
const ApiDocs = () => {
  const { endPoints } = useCategories();
  const location = useLocation();
  const params = useParams();
  const endPoint = getEndPoint(location, params, endPoints);
  const [urlSwagger, setUrlSwagger] = useState<string | null>(null);
  useEffect(() => {
    if (endPoint?.value) {
      setUrlSwagger(
        `${import.meta.env.VITE_PUBLIC_API_URL}api/docs/collection/${
          endPoint?.value
        }`
      );
    }
  }, [endPoint]);
  console.log("endpoint", urlSwagger);
  return (
    urlSwagger && (
      <div className="overflow-auto mt-5 w-full" style={{ height: `60vh` }}>
        <SwaggerUI url={urlSwagger} />;
      </div>
    )
  );
};
export default ApiDocs;
