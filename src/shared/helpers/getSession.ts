import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { getAuth } from "../auth/server";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
 const headers = getRequestHeaders();
 const session = await getAuth().api.getSession({ headers });

 if (!session) {
  throw new Error("Unauthorized");
 }

 return session;
});
