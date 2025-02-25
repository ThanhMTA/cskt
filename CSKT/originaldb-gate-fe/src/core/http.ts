import { authentication, createDirectus, rest } from "@directus/sdk";
const HTTP = createDirectus(import.meta.env.VITE_PUBLIC_API_URL)
  .with(rest())
  .with(
    authentication("json", {
      autoRefresh: false,
    })
  );
export default HTTP;
