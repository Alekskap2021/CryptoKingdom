import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { Cookie } from "@/shared/lib/Cookie.ts";
import { SELECTED_API_KEY_STORAGE_KEY } from "../config/const";

export const getSelectedApiKey = createIsomorphicFn()
 .client(() => {
  const selecetedKey = Cookie.get(SELECTED_API_KEY_STORAGE_KEY);
  return selecetedKey ?? undefined;
 })
 .server(() => {
  const selecetedKey = getCookie(SELECTED_API_KEY_STORAGE_KEY);
  return selecetedKey;
 });
