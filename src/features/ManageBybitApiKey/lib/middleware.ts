import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { listApiKeys } from "../api/api-keys.actions.ts";

export const apiKeyMiddleware = createMiddleware().server(async ({ next, pathname }) => {
 const apiKeysList = await listApiKeys();
 if (!apiKeysList.length)
  throw redirect({ search: { redirect: pathname }, to: "/dashboard/no-bybit-api-key" });

 return next();
});
