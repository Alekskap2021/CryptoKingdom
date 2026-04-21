import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getAuth } from "./getAuth";

export const authMiddleware = createMiddleware().server(async ({ next, pathname, request }) => {
 const session = await getAuth().api.getSession({ headers: request.headers });
 if (!session) {
  throw redirect({ search: { redirect: pathname }, to: "/sign-in" });
 }

 return next();
});
