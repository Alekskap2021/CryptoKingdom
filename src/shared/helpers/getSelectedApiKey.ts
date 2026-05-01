import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { SELECTED_API_KEY_STORAGE_KEY } from "../config/const";
import { Cookie } from "../lib/Cookie.ts";

export const getSelectedApiKey = createIsomorphicFn()
 .client(() => {
  const selecetedKey = Cookie.get(SELECTED_API_KEY_STORAGE_KEY);
  return selecetedKey ?? undefined;
 })
 .server(() => {
  const selecetedKey = getCookie(SELECTED_API_KEY_STORAGE_KEY);
  return selecetedKey;
 });
