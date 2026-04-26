import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { SELECTED_API_KEY_STORAGE_KEY } from "../config/const.ts";

export const apiKeyMiddleware = createMiddleware().server(async ({ next, pathname }) => {
 const selectedApiKeyId = getCookie(SELECTED_API_KEY_STORAGE_KEY);

 if (!selectedApiKeyId) throw redirect({ search: { redirect: pathname }, to: "/no-bybit-api-key" });

 return next();
});
